#include "smart_pillbox_ai.h"

#if defined(__aarch64__) || defined(__ARM_NEON)
#include <arm_neon.h>
#endif

enum { INPUTS = 32, HIDDEN_A = 64, HIDDEN_B = 32, OUTPUTS = 4 };
static int initialized;
static int8_t w1[HIDDEN_A][INPUTS], w2[HIDDEN_B][HIDDEN_A], w3[OUTPUTS][HIDDEN_B];
static float fw1[HIDDEN_A][INPUTS], fw2[HIDDEN_B][HIDDEN_A], fw3[OUTPUTS][HIDDEN_B];

void smart_pillbox_init(void) {
  if (initialized) return;
  for (size_t r=0;r<HIDDEN_A;r++) for(size_t c=0;c<INPUTS;c++) {
    w1[r][c]=(int8_t)(((r*7+c*11+3)%15)-7); fw1[r][c]=(float)w1[r][c];
  }
  for (size_t r=0;r<HIDDEN_B;r++) for(size_t c=0;c<HIDDEN_A;c++) {
    w2[r][c]=(int8_t)(((r*13+c*5+1)%11)-5); fw2[r][c]=(float)w2[r][c];
  }
  for (size_t r=0;r<OUTPUTS;r++) for(size_t c=0;c<HIDDEN_B;c++) {
    w3[r][c]=(int8_t)(((r*17+c*3+2)%9)-4); fw3[r][c]=(float)w3[r][c];
  }
  initialized=1;
}

static void expand(smart_pillbox_features_t input, int8_t x[INPUTS]) {
  int8_t seed[8]={input.timing_delta,input.no_open_window,input.slot_mismatch,
    input.repeat_open,input.routine_deviation,input.connectivity_loss,16,8};
  for(size_t i=0;i<INPUTS;i++) x[i]=(int8_t)((seed[i%8]+(int8_t)(i*3))>>1);
}

static int32_t dot_int8(const int8_t *a,const int8_t *b,size_t count) {
  int32_t sum=0;
#if defined(__aarch64__) || defined(__ARM_NEON)
  for(size_t i=0;i<count;i+=8) sum += vaddvq_s16(vmull_s8(vld1_s8(a+i),vld1_s8(b+i)));
#else
  for(size_t i=0;i<count;i++) sum += a[i]*b[i];
#endif
  return sum;
}

static int8_t relu_q(int32_t value) {
  value >>= 7;
  if(value<0) return 0;
  if(value>127) return 127;
  return (int8_t)value;
}

static uint8_t score(int32_t value) {
  value=(value>>7)+50;
  if(value<0)return 0;if(value>100)return 100;return(uint8_t)value;
}

smart_pillbox_scores_t smart_pillbox_infer_int8(smart_pillbox_features_t input) {
  smart_pillbox_init();
  int8_t x[INPUTS],a[HIDDEN_A],b[HIDDEN_B];
  expand(input,x);
  for(size_t r=0;r<HIDDEN_A;r++) a[r]=relu_q(dot_int8(x,w1[r],INPUTS));
  for(size_t r=0;r<HIDDEN_B;r++) b[r]=relu_q(dot_int8(a,w2[r],HIDDEN_A));
  int32_t out[OUTPUTS];
  for(size_t r=0;r<OUTPUTS;r++) out[r]=dot_int8(b,w3[r],HIDDEN_B);
  smart_pillbox_scores_t result={score(out[0]),score(out[1]),score(out[2]),score(out[3])};
  return result;
}

#if defined(__clang__)
__attribute__((optnone))
#elif defined(__GNUC__)
__attribute__((optimize("no-tree-vectorize")))
#endif
smart_pillbox_scores_t smart_pillbox_infer_fp32(smart_pillbox_features_t input) {
  smart_pillbox_init();
  int8_t qx[INPUTS]; float x[INPUTS],a[HIDDEN_A],b[HIDDEN_B],out[OUTPUTS]={0};
  expand(input,qx); for(size_t i=0;i<INPUTS;i++)x[i]=(float)qx[i];
  for(size_t r=0;r<HIDDEN_A;r++){float sum=0;for(size_t c=0;c<INPUTS;c++)sum+=x[c]*fw1[r][c];a[r]=sum>0?sum/128.0f:0;}
  for(size_t r=0;r<HIDDEN_B;r++){float sum=0;for(size_t c=0;c<HIDDEN_A;c++)sum+=a[c]*fw2[r][c];b[r]=sum>0?sum/128.0f:0;}
  for(size_t r=0;r<OUTPUTS;r++)for(size_t c=0;c<HIDDEN_B;c++)out[r]+=b[c]*fw3[r][c];
  smart_pillbox_scores_t result={score((int32_t)out[0]),score((int32_t)out[1]),score((int32_t)out[2]),score((int32_t)out[3])};
  return result;
}

const char *smart_pillbox_action(smart_pillbox_scores_t score_value) {
  if(score_value.selection_error>=65)return "lock_reminder:red_slot_light";
  if(score_value.duplicate_risk>=65)return "hold_alert:confirm_with_user";
  if(score_value.missed_window>=65)return "pulse_amber:caregiver_alert";
  return "green_confirmation";
}
