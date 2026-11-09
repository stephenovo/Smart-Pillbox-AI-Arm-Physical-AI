# Smart Pillbox AI — Devpost Submission Pack

Copy the values below into the matching Devpost fields. Submit all public-facing
material in English.

## Project name

Smart Pillbox AI

## Elevator pitch

Smart Pillbox AI turns pillbox sensor events into private, offline safety actions using an INT8 Arm64/NEON inference kernel—34× faster with 75% less model memory.

## Track

Physical AI

## Built with

- Arm64
- Arm NEON
- C
- INT8
- Physical AI
- Edge AI
- ESP32-S3
- React
- TypeScript
- Next.js
- Vite
- Node.js
- Cloudflare Workers
- Wrangler
- GitHub

## Try it out links

1. Live Smart Pillbox AI Demo
   https://smart-pillbox-ai-arm-physical-ai.stephenovo.workers.dev
2. GitHub Source and Setup Instructions
   https://github.com/stephenovo/Smart-Pillbox-AI-Arm-Physical-AI
3. Arm64 Benchmark Evidence
   https://github.com/stephenovo/Smart-Pillbox-AI-Arm-Physical-AI/blob/main/evidence/benchmark.arm64.latest.json
4. Architecture and Hardware Disclosure
   https://github.com/stephenovo/Smart-Pillbox-AI-Arm-Physical-AI/blob/main/docs/ARCHITECTURE.md

## About the project

## Inspiration

Medication routines look simple until something unusual happens: a dose window
passes without an opening, the wrong compartment is selected, the same
compartment is opened twice, or the internet goes down when a reminder matters
most.

These moments are also deeply private. A medication-support device should not
need to stream every interaction to the cloud before it can provide a useful
response.

Smart Pillbox AI began as a broader medication-care product. For the Arm Create:
AI Optimization Challenge, we built a new standalone Physical AI edition around
a focused question:

> Can privacy-sensitive pillbox events become fast, local and bounded safety
> actions on Arm64, even when internet connectivity is unavailable?

## What it does

Smart Pillbox AI converts pillbox interaction events into
medication-adherence risk signals and clear, bounded actions.

The interactive judge experience replays five production-shaped sensor
scenarios:

1. An on-time compartment opening
2. A scheduled dose window with no opening
3. A wrong-compartment selection
4. A repeated opening shortly after a previous event
5. A network outage requiring an offline response

These scenarios use the same semantic boundary intended for a future physical
pillbox: timing, compartment, repeat-opening, routine-deviation and connectivity
signals.

A compact 32 × 64 × 32 × 4 representative MLP inference kernel produces four
risk scores on Arm64: expected routine, missed window, selection error and
duplicate risk.

A deterministic safety policy then maps those scores to bounded actions such as
a green confirmation light, an amber reminder, a red compartment light, a
confirmation hold, an offline queue or a caregiver alert.

Smart Pillbox AI does not claim that medication was swallowed. It does not
change dosage guidance or diagnose a condition. It observes compartment
interactions and schedule-risk patterns, then helps a person or caregiver
decide whether follow-up may be useful.

## How we built it

The architecture deliberately separates sensing, intelligence and human
action:

```text
Pillbox interaction or simulated sensor fixture
                    ↓
ESP32-S3 sensor and connectivity controller
               (Xtensa LX7)
                    ↓
Signed semantic event envelope
                    ↓
Arm64 local inference module
         INT8 + Arm NEON kernel
                    ↓
Deterministic safety policy
                    ↓
Light · reminder · local queue · caregiver alert
```

The ESP32-S3 is not an Arm processor. It remains the low-level sensing and
connectivity controller. The AI inference tier runs on nearby Arm64 compute.

Because physical pillbox hardware was not available during this competition
build, the browser uses clearly labelled simulated sensor fixtures. The native
optimization evidence was measured separately on an Apple Silicon Arm64
machine. A physical device can later replace the fixtures without changing the
event-to-inference interface.

The native inference kernel is written in portable C. It includes an INT8
weight and activation path, AArch64 Arm NEON intrinsics for vector
multiply-accumulate, fixed-point activation and requantization, a deliberately
scalar FP32 reference path, a scalar fallback for non-NEON compilation and an
Arm64-gated benchmark harness.

The product experience was built with React, TypeScript and Next.js-compatible
server rendering, then deployed independently on Cloudflare Workers.

## Arm optimization and measurable results

This project is not only an application running on an Arm computer. It includes
a directly inspectable Arm-specific inference optimization.

The optimized path uses INT8 weights and activations together with Arm NEON
vector operations. The reference path uses FP32 data and is deliberately kept
scalar so the effect of the optimized data path is reproducible and visible.

On the recorded Apple Silicon Arm64 development host:

| Measurement | FP32 scalar reference | INT8 Arm NEON | Improvement |
| --- | ---: | ---: | ---: |
| Median inference latency | 4.751 µs | 0.140 µs | 34.02× faster |
| Weight storage | 17,408 bytes | 4,352 bytes | 75% smaller |
| Activation workspace | 512 bytes | 128 bytes | 75% smaller |

The benchmark uses an Arm64 architecture check, native `-O3` compilation, 10
warm-up iterations, 100,000 inference iterations per run, seven measured runs
and the median result.

These are host-specific kernel measurements, not universal device-performance
claims or end-to-end clinical results. The raw JSON, source code and benchmark
command are included so judges can reproduce the result on Apple Silicon,
Raspberry Pi 4/5 or another Arm64 Linux machine.

## Significant competition-period upgrades

Smart Pillbox AI existed before the challenge, but this submission is a new
standalone competition sibling rather than a rename of the original product.

During the competition period we added:

- a standalone public competition repository
- a native Arm64 C inference kernel
- an INT8 Arm NEON fast path
- a scalar FP32 comparison path
- a reproducible Arm64-only benchmark harness
- checked-in raw performance evidence
- an explicit ESP32-S3 versus Arm64 architecture
- five simulated Physical AI sensor scenarios
- deterministic medication-safety action boundaries
- a judge-facing interactive product experience
- independent Cloudflare deployment
- competition-specific documentation and testing instructions

The original Smart Pillbox AI repository and production deployment remain
separate and unchanged.

## Challenges we ran into

### ESP32-S3 is not Arm

The original hardware concept used an ESP32-S3, whose CPU is Xtensa LX7.
Calling that an Arm inference platform would have been technically incorrect.

We solved this by treating ESP32-S3 as the deterministic sensor controller and
introducing a real Arm64 inference tier. This produced a more honest and
reusable heterogeneous edge architecture.

### Demonstrating Physical AI without physical hardware

We did not have access to the pillbox or an Arm single-board computer during
the competition build. Instead of pretending the browser was physical
hardware, we separated the evidence into two layers: simulated,
production-shaped sensor fixtures for the product interaction, and native
measurements collected on an actual Arm64 host for the inference optimization.

Every simulated element is labelled in the interface and documentation.

### Safety boundaries

Medication software must not turn a model score directly into medical advice.
We therefore placed a deterministic policy after inference. The model can
identify an unusual interaction pattern, but only bounded reminder and
confirmation actions are allowed.

## Accomplishments that we are proud of

- Built a public demo that judges can use without hardware, login credentials
  or installation
- Produced a native, reproducible Arm64 optimization artifact instead of only
  displaying simulated metrics
- Reduced kernel weight and activation memory by 75%
- Measured a 34.02× latency improvement over the scalar FP32 reference on the
  recorded Arm64 host
- Kept the ESP32-S3 and Arm64 roles technically accurate
- Created an offline-capable sense–decide–act loop with explicit human safety
  boundaries
- Packaged the architecture, benchmark, evidence and product story into a
  reusable open-source reference

## What we learned

The most important lesson was that running an AI application on an Arm device
is not the same as optimizing it for Arm.

A strong optimization story needs a visible baseline, an inspectable technical
change, measurable results, reproducible instructions and honest limitations.

We also learned that Physical AI does not require pretending that every
prototype is already finished hardware. A well-defined simulated sensor
boundary can support rapid development, provided the simulation and native
evidence are clearly separated.

## What's next for Smart Pillbox AI

The next phase is to connect the semantic event interface to real ESP32-S3
firmware and an Arm Linux edge module such as a Raspberry Pi.

We also plan to train and calibrate the risk model with consented
medication-routine data, add automated FP32/INT8 output-agreement and
safety-policy tests, measure end-to-end latency and power consumption on
Raspberry Pi, sign and authenticate events between the sensor controller and
Arm module, test offline caregiver synchronization and evaluate Arm embedded
deployment targets for a smaller production device.

## Build and validation

Run the interactive experience:

```bash
git clone https://github.com/stephenovo/Smart-Pillbox-AI-Arm-Physical-AI.git
cd Smart-Pillbox-AI-Arm-Physical-AI
npm install
npm test
npm run dev
```

Then open `http://localhost:3000`.

Reproduce the native benchmark on Apple Silicon, Raspberry Pi 4/5 or another
Arm64 Linux machine with a C compiler:

```bash
uname -m
npm run benchmark:arm -- 100000
```

The script refuses to report an Arm benchmark on a non-Arm64 host.

## Why it should win

Smart Pillbox AI combines a relatable real-world problem, an immediately usable
product experience and a measurable Arm-specific optimization.

It is honest about what is simulated, reproducible where performance is
claimed, careful about medication-safety boundaries and structured so other
developers can reuse the Arm64 inference kernel, benchmark harness and
heterogeneous Physical AI architecture.

## Video URL

Add the public YouTube, Vimeo or Youku URL here after recording.

