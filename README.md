# CareLoop Edge

Arm-optimized Physical AI for private, offline medication-safety inference.
This is a competition-specific sibling of Smart Pillbox AI; the original
project remains untouched.

## Quick start

```bash
npm install
npm run dev
```

## Reproduce the Arm benchmark

Run on Apple Silicon, Raspberry Pi 4/5, or another Arm64 Linux host:

```bash
npm run benchmark:arm
```

The command refuses non-Arm hosts, compiles the portable C/Arm NEON kernel, and
prints machine-readable JSON. See `evidence/benchmark.arm64.sample.json` for the
display dataset, full disclosure, and test method.

## Project surfaces

- `app/EdgeConsole.tsx`: interactive judge-facing Physical AI demo
- `edge/model`: portable INT8 inference kernel with Arm NEON fast path
- `edge/benchmark`: reproducible native timing harness
- `docs/ARCHITECTURE.md`: hardware and no-hardware validation design
- `docs/DEVPOST_SUBMISSION.md`: submission copy and video outline

## Hardware truth

ESP32-S3 uses Xtensa LX7, not Arm. In this architecture it is the sensor and
connectivity controller. An Arm64 edge node performs the local AI inference.
The interactive demo uses simulated sensor data, as permitted by the Physical
AI track, because physical hardware was not available during this build.

## License

MIT
