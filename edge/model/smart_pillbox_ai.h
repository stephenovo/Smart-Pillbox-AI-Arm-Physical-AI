#ifndef SMART_PILLBOX_AI_H
#define SMART_PILLBOX_AI_H

#include <stddef.h>
#include <stdint.h>

typedef struct {
  int8_t timing_delta;
  int8_t no_open_window;
  int8_t slot_mismatch;
  int8_t repeat_open;
  int8_t routine_deviation;
  int8_t connectivity_loss;
} smart_pillbox_features_t;

typedef struct {
  uint8_t expected_routine;
  uint8_t missed_window;
  uint8_t selection_error;
  uint8_t duplicate_risk;
} smart_pillbox_scores_t;

smart_pillbox_scores_t smart_pillbox_infer_int8(smart_pillbox_features_t input);
smart_pillbox_scores_t smart_pillbox_infer_fp32(smart_pillbox_features_t input);
void smart_pillbox_init(void);
const char *smart_pillbox_action(smart_pillbox_scores_t scores);

#endif
