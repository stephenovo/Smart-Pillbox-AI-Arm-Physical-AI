#ifndef CARELOOP_EDGE_H
#define CARELOOP_EDGE_H

#include <stddef.h>
#include <stdint.h>

typedef struct {
  int8_t timing_delta;
  int8_t no_open_window;
  int8_t slot_mismatch;
  int8_t repeat_open;
  int8_t routine_deviation;
  int8_t connectivity_loss;
} careloop_features_t;

typedef struct {
  uint8_t expected_routine;
  uint8_t missed_window;
  uint8_t selection_error;
  uint8_t duplicate_risk;
} careloop_scores_t;

careloop_scores_t careloop_infer_int8(careloop_features_t input);
careloop_scores_t careloop_infer_fp32(careloop_features_t input);
void careloop_init(void);
const char *careloop_action(careloop_scores_t scores);

#endif
