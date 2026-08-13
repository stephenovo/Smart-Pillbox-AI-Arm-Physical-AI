#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BUILD_DIR="${PROJECT_DIR}/edge/build"
mkdir -p "${BUILD_DIR}"

case "$(uname -m)" in
  arm64|aarch64) ;;
  *) echo "This evidence run requires an Arm64 host (Apple Silicon, Raspberry Pi 4/5, or Arm Linux)." >&2; exit 2 ;;
esac

cc -O3 -DNDEBUG -Wall -Wextra \
  "${PROJECT_DIR}/edge/model/careloop_edge.c" \
  "${PROJECT_DIR}/edge/benchmark/benchmark.c" \
  -o "${BUILD_DIR}/careloop-benchmark"
"${BUILD_DIR}/careloop-benchmark" "${1:-1000000}"
