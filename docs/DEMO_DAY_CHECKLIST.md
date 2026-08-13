# Demo day checklist

The official deadline is **August 14, 2026 at 4:00 PM PDT**, which is
**August 15, 2026 at 7:00 AM in Hong Kong**. Treat 6:30 AM HKT as the internal
deadline so the final Devpost save and submission are not racing the clock.

## 1. Freeze the submission build

Do not redesign the product on submission morning. Confirm that these two URLs
open in a signed-out/private browser window:

- Live experience: <https://careloop-edge-arm-ai.stephenovo.workers.dev>
- Public source: <https://github.com/stephenovo/Careloop-Edge-Arm-AI>

Then capture the exact Git commit used in the video:

```bash
cd /path/to/careloop-edge-arm-ai
git pull --ff-only
git rev-parse --short HEAD
```

## 2. Record fresh Arm64 evidence

On the Apple Silicon Mac, show the machine architecture first, then run the
checked-in benchmark harness:

```bash
uname -m
sysctl -n machdep.cpu.brand_string
npm install
npm test
npm run benchmark:arm -- 100000
```

The expected architecture is `arm64`. Keep the terminal output visible long
enough for the recording to show the FP32 baseline, INT8 + NEON result, seven-run
median, and agreement check. Do not describe the browser sensor fixtures as a
physical-device run.

## 3. Rehearse the website path

Use this exact judge flow:

1. Read the one-sentence product promise in the hero.
2. Point to the evidence rail: simulated sensor layer, native Arm64 compute,
   open evidence.
3. Select **Missed dose**, then **Wrong compartment**, then **Network outage**.
4. Explain that the output is a bounded adherence-risk action, not medication
   advice or proof that a pill was swallowed.
5. Open **Arm64 evidence** and switch between FP32 scalar and INT8 NEON.
6. Open the raw JSON and benchmark script from the evidence panel.
7. Scroll to the architecture and explain ESP32-S3 (Xtensa sensor controller)
   versus Arm64 (local AI compute).

## 4. Record the three-minute video

Target 2:40–2:55 so there is room under the limit.

- 0:00–0:20 — problem, user, and privacy promise
- 0:20–0:45 — honest ESP32-S3 + Arm64 architecture
- 0:45–1:35 — three interactive sensor scenarios
- 1:35–2:10 — FP32 versus INT8 NEON evidence
- 2:10–2:35 — terminal benchmark and public source
- 2:35–2:55 — safety boundary and impact

Record at 1080p, enlarge the browser to 110–125%, hide notifications, and use a
clean browser profile. Upload the result as a **publicly visible** YouTube,
Vimeo, or Youku video and verify it while signed out.

## 5. Complete Devpost

Submit the following package:

- project title and concise tagline
- Physical AI track selection
- written description from `docs/DEVPOST_SUBMISSION.md`
- live Cloudflare URL
- public GitHub repository URL
- publicly visible YouTube, Vimeo, or Youku video URL
- screenshots of the hero, simulation console, Arm64 evidence, and architecture
- technologies: Arm64, NEON, C, Next.js/React, Cloudflare Workers, ESP32-S3

Before the final button, verify every link in a private window, confirm the
video audio, save a copy of the Devpost text locally, and take a screenshot of
the submitted confirmation page.
