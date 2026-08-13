# Devpost submission draft

## CareLoop Edge: medication safety that never leaves home

CareLoop Edge is a privacy-first Physical AI upgrade for Smart Pillbox AI. It
keeps the existing ESP32-S3 as a reliable sensor and connectivity controller,
then adds an Arm64 edge guardian that classifies medication-adherence risk and
produces bounded physical actions locally—even without internet access.

## What it does

The demo replays five realistic sensor scenarios: an on-time opening, an elapsed
window with no opening, a wrong compartment, a repeat opening, and a network
outage. A compact INT8 model scores each event on nearby Arm compute. A separate
safety policy converts the result into a confirmation light, targeted reminder,
hold-and-confirm flow, offline queue, or caregiver escalation.

CareLoop does not claim that a medicine was swallowed. It detects compartment
interactions and risk patterns, and it never changes dosage guidance.

## Arm optimization

- post-training INT8 quantization reduces the weight artifact
- an Arm NEON path vectorizes the inference hot loop
- activation and requantization are fused to reduce memory traffic
- a scalar path remains available for portability and comparison
- an agreement harness checks that optimization preserves the safety decision

The included benchmark script runs only on an Arm64 host and prints raw JSON.
The repository labels the frozen website dataset and the lack of physical
hardware explicitly so judges can distinguish illustrative evidence from their
own reproducible results.

## Why it should win

Medication support is a strong fit for edge AI: the data is intimate, latency
matters, homes lose connectivity, and the device must remain affordable. The
project demonstrates an honest heterogeneous architecture instead of relabeling
ESP32-S3 as Arm. It also provides reusable event fixtures, a portable C kernel,
an Arm-only benchmark gate, safety boundaries, and a judge-friendly interactive
demo that works without special hardware.

## Build and validate

1. Use an Apple Silicon Mac, Raspberry Pi 4/5, or another Arm64 Linux machine.
2. Run `npm install && npm run dev` for the interactive experience.
3. Run `npm run benchmark:arm` for raw on-host inference timing.
4. Inspect `evidence/benchmark.arm64.sample.json` for methodology and disclosure.

## Three-minute video outline

- 0:00–0:20: the missed-dose problem and privacy promise
- 0:20–0:50: honest ESP32-S3 + Arm64 architecture
- 0:50–1:35: live missed, wrong-slot, and offline scenarios
- 1:35–2:10: FP32 versus INT8 benchmark view
- 2:10–2:35: source, benchmark command, and evidence disclosure
- 2:35–2:55: human impact and explicit safety boundary
