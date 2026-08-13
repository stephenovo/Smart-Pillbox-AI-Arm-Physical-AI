# Smart Pillbox AI architecture

```text
physical compartment switches / simulated fixtures
                     │
             ESP32-S3 sensor node
        (Xtensa; deterministic acquisition)
                     │ signed event envelope
                     ▼
             Arm64 AI Module
        INT8 risk model + deterministic policy
                     │
       light / buzzer / local queue / caregiver alert
```

The ESP32-S3 is deliberately not described as Arm. It remains useful as the
low-level controller. Arm is the nearby compute tier that runs local inference.

## No-hardware validation

The browser simulator and fixtures use the same semantic events as firmware:
`lid_open`, `schedule_elapsed`, `slot_mismatch`, `duplicate`, and
`cloud_unreachable`. The competition explicitly permits simulated sensor data
for Physical AI. A real pillbox can later replace the fixture without changing
the model boundary.

## Safety

Model scores never directly change medication instructions. A deterministic
policy maps scores to bounded actions. The system observes openings—not
ingestion—and always describes its output as adherence risk, never medical fact.
