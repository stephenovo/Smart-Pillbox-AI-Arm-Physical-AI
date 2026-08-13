#include "../model/smart_pillbox_ai.h"
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

static uint64_t ns(void) {
  struct timespec t;
  clock_gettime(CLOCK_MONOTONIC, &t);
  return (uint64_t)t.tv_sec * 1000000000ULL + (uint64_t)t.tv_nsec;
}

static int compare_double(const void *left, const void *right) {
  const double a=*(const double *)left,b=*(const double *)right;
  return (a>b)-(a<b);
}

int main(int argc, char **argv) {
  const size_t iterations = argc > 1 ? strtoull(argv[1], NULL, 10) : 1000000;
  volatile uint64_t checksum = 0;
  smart_pillbox_features_t sample = {18,91,30,72,84,5};
  smart_pillbox_init();
  double int8_runs[7],fp32_runs[7];
  for (size_t i=0;i<10;i++) {checksum+=smart_pillbox_infer_int8(sample).missed_window;checksum+=smart_pillbox_infer_fp32(sample).missed_window;}
  for(size_t run=0;run<7;run++) {
    uint64_t start=ns();
    for(size_t i=0;i<iterations;i++)checksum+=smart_pillbox_infer_int8(sample).missed_window;
    int8_runs[run]=(double)(ns()-start)/(double)iterations;
    start=ns();
    for(size_t i=0;i<iterations;i++)checksum+=smart_pillbox_infer_fp32(sample).missed_window;
    fp32_runs[run]=(double)(ns()-start)/(double)iterations;
  }
  qsort(int8_runs,7,sizeof(double),compare_double);qsort(fp32_runs,7,sizeof(double),compare_double);
  double int8_ns=int8_runs[3],fp32_ns=fp32_runs[3];
  printf("{\n  \"architecture\": \"arm64\",\n  \"network\": \"32x64x32x4\",\n  \"iterations_per_run\": %zu,\n  \"runs\": 7,\n  \"statistic\": \"median\",\n  \"int8_ns\": %.2f,\n  \"fp32_ns\": %.2f,\n  \"speedup\": %.3f,\n  \"int8_weight_bytes\": 4352,\n  \"fp32_weight_bytes\": 17408,\n  \"int8_activation_bytes\": 128,\n  \"fp32_activation_bytes\": 512,\n  \"checksum\": %llu\n}\n",iterations,int8_ns,fp32_ns,fp32_ns/int8_ns,(unsigned long long)checksum);
  return 0;
}
