"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Scenario = "on-time" | "missed" | "wrong-slot" | "duplicate" | "offline";
type Runtime = "int8" | "fp32";

type ScenarioData = {
  label: string;
  short: string;
  slot: string;
  event: string;
  risk: number;
  confidence: number;
  decision: string;
  action: string;
  tone: "safe" | "watch" | "alert";
  signals: number[];
};

const scenarios: Record<Scenario, ScenarioData> = {
  "on-time": {
    label: "On-time dose",
    short: "Routine",
    slot: "A1 · Morning",
    event: "lid_open · 08:02:14",
    risk: 7,
    confidence: 98.4,
    decision: "Expected routine",
    action: "Green confirmation light",
    tone: "safe",
    signals: [82, 16, 90, 10, 42, 7],
  },
  missed: {
    label: "Missed dose",
    short: "No opening",
    slot: "B2 · Blood pressure",
    event: "schedule_elapsed · +31m",
    risk: 91,
    confidence: 96.8,
    decision: "Likely missed window",
    action: "Pulse amber + caregiver alert",
    tone: "alert",
    signals: [18, 91, 30, 72, 84, 94],
  },
  "wrong-slot": {
    label: "Wrong compartment",
    short: "Mismatch",
    slot: "C3 opened · A1 due",
    event: "slot_mismatch · 08:04:51",
    risk: 84,
    confidence: 95.2,
    decision: "Possible selection error",
    action: "Lock reminder + red slot light",
    tone: "alert",
    signals: [71, 82, 95, 34, 70, 87],
  },
  duplicate: {
    label: "Repeat opening",
    short: "7 min apart",
    slot: "A1 · Morning",
    event: "lid_open · duplicate",
    risk: 68,
    confidence: 92.9,
    decision: "Possible duplicate dose",
    action: "Hold alert + ask to confirm",
    tone: "watch",
    signals: [75, 64, 28, 94, 56, 76],
  },
  offline: {
    label: "Network outage",
    short: "Edge-only",
    slot: "D4 · Evening",
    event: "cloud_unreachable · local queue",
    risk: 22,
    confidence: 94.7,
    decision: "Continue local protection",
    action: "Run offline + sync later",
    tone: "safe",
    signals: [62, 22, 88, 15, 96, 18],
  },
};

const featureNames = ["Timing", "No-open", "Slot ID", "Repeat", "Routine", "Risk"];
const scenarioOrder: Scenario[] = ["on-time", "missed", "wrong-slot", "duplicate", "offline"];

export default function EdgeConsole() {
  const [scenario, setScenario] = useState<Scenario>("missed");
  const [runtime, setRuntime] = useState<Runtime>("int8");
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(true);
  const [events, setEvents] = useState(1842);
  const [view, setView] = useState<"demo" | "evidence">("demo");
  const inferenceTimer = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const data = scenarios[scenario];

  const metrics = useMemo(
    () =>
      runtime === "int8"
        ? { latency: "0.14 µs", memory: "128 B", model: "4.25 KB", energy: "—", label: "INT8 · NEON" }
        : { latency: "4.75 µs", memory: "512 B", model: "17 KB", energy: "—", label: "FP32 scalar" },
    [runtime],
  );

  const runInference = useCallback((nextScenario: Scenario = scenario) => {
    if (inferenceTimer.current) window.clearTimeout(inferenceTimer.current);
    setScenario(nextScenario);
    setRunning(true);
    setComplete(false);
    inferenceTimer.current = window.setTimeout(() => {
      setRunning(false);
      setComplete(true);
      setEvents((value) => value + 1);
      inferenceTimer.current = null;
    }, runtime === "int8" ? 620 : 1050);
  }, [runtime, scenario]);

  const showConsole = useCallback((nextView: "demo" | "evidence") => {
    setView(nextView);
    window.requestAnimationFrame(() => document.getElementById("console")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const index = Number(event.key) - 1;
      if (index >= 0 && index < scenarioOrder.length && !event.metaKey && !event.ctrlKey && !event.altKey) runInference(scenarioOrder[index]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [runInference]);

  useEffect(() => () => {
    if (inferenceTimer.current) window.clearTimeout(inferenceTimer.current);
  }, []);

  return (
    <main>
      <nav className="nav shell" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Smart Pillbox AI home">
          <Image src="/brand-icon.png" alt="" aria-hidden="true" width={32} height={32} priority />
          <span>Smart Pillbox <strong>AI</strong></span>
        </a>
        <div className="navLinks">
          <a href="#product">Product</a>
          <a href="#how-it-works">How it works</a>
          <button className={view === "demo" ? "active" : ""} onClick={() => showConsole("demo")}>Try demo</button>
          <button className={view === "evidence" ? "active" : ""} onClick={() => showConsole("evidence")}>Arm proof</button>
          <a className="repoLink" href="https://github.com/stephenovo/Smart-Pillbox-AI-Arm-Physical-AI" target="_blank" rel="noreferrer">Source ↗</a>
        </div>
      </nav>

      <section id="top" className="hero shell">
        <div className="heroCopy">
          <div className="eyebrow"><span className="pulse" /> ARM CREATE · PHYSICAL AI TRACK</div>
          <h1>A smarter routine.<br /><em>More peace of mind.</em></h1>
          <p className="lede">Smart Pillbox AI pairs a calm medication companion with private Arm64 intelligence—spotting missed, repeated, or wrong-compartment events while the routine is still close to home.</p>
          <div className="heroActions">
            <button className="primary" onClick={() => showConsole("demo")}>Try the live product demo <span>→</span></button>
            <a className="secondary" href="#product">Explore the product</a>
          </div>
          <div className="trustRow">
            <span><b>Private</b> by architecture</span>
            <span><b>Offline</b> safety loop</span>
            <span><b>Arm64</b> optimized</span>
          </div>
        </div>

        <div className="heroVisual" aria-label="Smart Pillbox AI physical product preview">
          <div className="visualGlow" />
          <div className="pillbox">
            <div className="pillboxTop"><span>SMART PILLBOX AI</span><i className={running ? "blink" : ""} /></div>
            <div className="slots">
              {["M", "T", "W", "T", "F", "S", "S", "+"].map((day, index) => <div key={`${day}-${index}`} className={index === 1 ? data.tone : ""}><span>{day}</span><b>{index + 1}</b></div>)}
            </div>
          </div>
          <div className="signalLine lineOne"><span /></div>
          <div className="edgeChip">
            <small>LOCAL EDGE</small>
            <strong>Arm64</strong>
            <span>{running ? "SIMULATING" : "REFERENCE · INT8"}</span>
          </div>
          <div className="signalLine lineTwo"><span /></div>
          <div className={`decisionBadge ${data.tone}`}>
            <small>PHYSICAL ACTION</small>
            <strong>{complete ? data.action : "Reading sensor vector…"}</strong>
          </div>
          <div className="privacyTag">↯ offline architecture</div>
        </div>
      </section>

      <section className="proofRail shell" aria-label="Product system">
        <div><span className="proofIcon simulated">P</span><p><strong>Smart pillbox</strong><small>Gentle reminders + compartment sensing</small></p></div>
        <i>→</i>
        <div><span className="proofIcon verified">A</span><p><strong>Private intelligence</strong><small>Nearby Arm64 risk inference</small></p></div>
        <i>→</i>
        <div><span className="proofIcon open">H</span><p><strong>Human action</strong><small>Clear light, prompt, or caregiver alert</small></p></div>
      </section>

      <section id="product" className="productStory shell">
        <div className="productCopy">
          <span className="kicker">DESIGNED FOR DAILY LIFE</span>
          <h2>Familiar enough for every day.<br />Smart enough to notice.</h2>
          <p>The pillbox stays simple: the right compartment lights at the right time, an opening becomes a quiet event, and the system raises only the next useful action. No camera. No constant check-in. No medical guesswork.</p>
          <ul>
            <li><span>01</span><div><strong>Gentle guidance</strong><small>Light and reminder cues keep the routine easy to follow.</small></div></li>
            <li><span>02</span><div><strong>Automatic awareness</strong><small>Timing, slot and repeat-opening patterns become meaningful signals.</small></div></li>
            <li><span>03</span><div><strong>Calm escalation</strong><small>Only unusual moments become a prompt or caregiver alert.</small></div></li>
          </ul>
        </div>
        <div className="productVisual">
          <div className="productHalo" />
          <Image src="/smart-pillbox-product.png" alt="Smart Pillbox AI eight-compartment product concept" width={1448} height={1086} sizes="(max-width: 900px) calc(100vw - 30px), 650px" />
          <span>8-compartment product concept</span>
        </div>
      </section>

      <section id="how-it-works" className="howSection">
        <div className="shell">
          <div className="howHeading"><span className="kicker">ONE SIMPLE LOOP</span><h2>From reminder to reassurance.</h2><p>Physical AI is useful only when sensing, intelligence and action feel like one calm product experience.</p></div>
          <div className="howGrid">
            <ProductStep number="01" icon="◌" title="The pillbox notices" copy="A schedule or compartment event is captured at the moment it happens." />
            <ProductStep number="02" icon="✣" title="Arm intelligence checks" copy="A compact local model scores timing, mismatch and repeat-opening risk." />
            <ProductStep number="03" icon="✓" title="The next action stays clear" copy="A deterministic policy chooses a light, confirmation prompt, local queue or alert." />
          </div>
        </div>
      </section>

      <section className="familySection" aria-label="Smart Pillbox AI for families">
        <Image src="/smart-pillbox-family.jpg" alt="An older couple enjoying time at home with a family caregiver" fill sizes="100vw" />
        <div className="familyShade" />
        <div className="familyCopy shell">
          <span className="kicker">FOR INDEPENDENCE · FOR REASSURANCE</span>
          <h2>A little more freedom for them.<br />A lot more peace of mind for you.</h2>
          <p>Smart Pillbox AI keeps the medication routine visible without turning every day into a check-in. The person at home keeps their rhythm; family sees only the moments that may need attention.</p>
          <div><span>No cameras</span><span>No constant calls</span><span>Clear human follow-up</span></div>
        </div>
      </section>

      <section id="console" className="consoleSection shell">
        <header className="sectionHeader">
          <div>
            <span className="kicker">TRY SMART PILLBOX AI</span>
            <h2>{view === "demo" ? "See an unusual medication moment unfold." : "Inspect the Arm64 optimization behind it."}</h2>
          </div>
          <div className="segmented" role="group" aria-label="Console view">
            <button aria-pressed={view === "demo"} onClick={() => setView("demo")} className={view === "demo" ? "selected" : ""}>Sensor simulation</button>
            <button aria-pressed={view === "evidence"} onClick={() => setView("evidence")} className={view === "evidence" ? "selected" : ""}>Arm64 evidence</button>
          </div>
        </header>

        {view === "demo" ? (
          <div className="demoGrid">
            <aside className="scenarioPanel">
              <div className="panelLabel">SIMULATED SENSOR INPUT <span>keys 1–5</span></div>
              {scenarioOrder.map((key, index) => (
                <button key={key} aria-pressed={scenario === key} onClick={() => runInference(key)} className={scenario === key ? "scenarioActive" : ""}>
                  <span className="number">0{index + 1}</span>
                  <span><strong>{scenarios[key].label}</strong><small>{scenarios[key].short}</small></span>
                  <i>→</i>
                </button>
              ))}
              <div className="hardwareNote"><span>SIM</span><p><strong>Peripheral hardware simulated</strong>The browser replays the semantic events an ESP32-S3 sensor controller would emit.</p></div>
            </aside>

            <div className="inferencePanel">
              <div className="panelTop">
                <div><span className={`statusDot ${running ? "working" : ""}`} /> {running ? "Replaying event fixture" : "Simulation console ready"}</div>
                <div className="runtimeSwitch">
                  <button aria-pressed={runtime === "fp32"} onClick={() => setRuntime("fp32")} className={runtime === "fp32" ? "active" : ""}>FP32 ref</button>
                  <button aria-pressed={runtime === "int8"} onClick={() => setRuntime("int8")} className={runtime === "int8" ? "active" : ""}>INT8 NEON</button>
                </div>
              </div>
              <div className="eventStrip">
                <div><small>SENSOR EVENT</small><strong>{data.event}</strong></div>
                <div><small>COMPARTMENT</small><strong>{data.slot}</strong></div>
                <div><small>EVENTS PROCESSED</small><strong>{events.toLocaleString()}</strong></div>
              </div>
              <div className="signalChart">
                <div className="chartHeader"><span>FEATURE VECTOR</span><span>32 → 64 → 32 → 4</span></div>
                <div className={`bars ${running ? "computing" : ""}`}>
                  {data.signals.map((signal, index) => (
                    <div className="barWrap" key={featureNames[index]}><div className="barTrack"><div style={{ height: `${complete ? signal : 15}%` }} /></div><span>{featureNames[index]}</span></div>
                  ))}
                </div>
              </div>
              <div className={`resultCard ${data.tone}`} role="status" aria-live="polite">
                <div className="riskGauge" style={{ "--risk": `${data.risk * 3.6}deg` } as React.CSSProperties}><div><strong>{complete ? data.risk : "—"}</strong><span>risk</span></div></div>
                <div className="resultCopy"><small>SIMULATED POLICY OUTPUT · FIXTURE {data.confidence}%</small><h3>{complete ? data.decision : "Replaying event pattern…"}</h3><p>{complete ? data.action : "Preparing the reference edge response."}</p></div>
                <div className="latency"><small>ARM64 MEDIAN</small><strong>{metrics.latency}</strong><span>{metrics.label}</span></div>
              </div>
              <button className="runButton" onClick={() => runInference()} disabled={running}>{running ? <><span className="spinner" /> Replaying sensor event…</> : <>Replay selected scenario <span>↻</span></>}</button>
            </div>
          </div>
        ) : (
          <EvidencePanel runtime={runtime} setRuntime={setRuntime} metrics={metrics} />
        )}
      </section>

      <section className="metricBand">
        <div className="shell metricGrid">
          <Metric value="34.0×" label="reference microbenchmark" note="4.75 → 0.14 µs · this host" />
          <Metric value="75%" label="smaller model weights" note="17 → 4.25 KB" />
          <Metric value="75%" label="less activation memory" note="512 → 128 B" />
          <Metric value="7 runs" label="median reported" note="100k iterations each" />
        </div>
      </section>

      <section id="architecture" className="architecture shell">
        <div className="archCopy"><span className="kicker">HETEROGENEOUS BY DESIGN</span><h2>Keep the pillbox.<br />Move intelligence to Arm.</h2><p>ESP32-S3 remains the deterministic sensor and connectivity controller. A nearby Arm64 node owns privacy-sensitive inference and safety actions—even when the internet disappears.</p><ul><li><span>01</span> Physical sensing stays simple and reliable</li><li><span>02</span> Arm NEON accelerates quantized local inference</li><li><span>03</span> Safety policy gates every physical intervention</li></ul></div>
        <div className="archFlow">
          <ArchNode tag="PHYSICAL" title="ESP32-S3" sub="Xtensa · sensors + Wi-Fi" icon="◎" />
          <div className="archArrow"><span>signed events</span>→</div>
          <ArchNode tag="INTELLIGENCE" title="Arm64 AI" sub="INT8 MLP · NEON kernels" icon="✣" featured />
          <div className="archArrow"><span>bounded action</span>→</div>
          <ArchNode tag="CARE" title="Human loop" sub="lights · buzzer · alert" icon="◒" />
        </div>
      </section>

      <section className="safety shell">
        <div><span className="kicker">SAFETY BOUNDARY</span><h2>Useful AI. Honest claims.</h2></div>
        <p>Smart Pillbox AI detects compartment interactions and schedule risk. It never claims a medicine was swallowed, never changes a dose, and never replaces a clinician. Deterministic guardrails can always override the model.</p>
        <div className="safetyStamp"><span>✓</span><strong>RULES<br />BEFORE AI</strong></div>
      </section>

      <footer className="shell">
        <div className="brand"><Image src="/brand-icon.png" alt="" aria-hidden="true" width={32} height={32} /><span>Smart Pillbox <strong>AI</strong></span></div>
        <p>Smart Pillbox AI · Arm Physical AI Competition Edition</p>
        <span>Open source · MIT</span>
      </footer>
    </main>
  );
}

function EvidencePanel({ runtime, setRuntime, metrics }: { runtime: Runtime; setRuntime: (value: Runtime) => void; metrics: { latency: string; memory: string; model: string; energy: string; label: string } }) {
  const values = runtime === "int8" ? [.14, 128, 4.25] : [4.75, 512, 17];
  return (
    <div className="evidenceGrid">
      <div className="benchmarkCard">
        <div className="panelTop"><div><span className="statusDot" /> Recorded on Apple Silicon · arm64</div><div className="runtimeSwitch"><button aria-pressed={runtime === "fp32"} onClick={() => setRuntime("fp32")} className={runtime === "fp32" ? "active" : ""}>FP32 scalar</button><button aria-pressed={runtime === "int8"} onClick={() => setRuntime("int8")} className={runtime === "int8" ? "active" : ""}>INT8 NEON</button></div></div>
        <div className="comparisonTitle"><div><small>SELECTED RUNTIME</small><h3>{metrics.label}</h3></div><span className={runtime === "int8" ? "optimized" : "baseline"}>{runtime === "int8" ? "OPTIMIZED" : "BASELINE"}</span></div>
        <div className="benchmarkRows">
          {[{ name: "Median latency", unit: "µs", value: values[0], base: 4.75 }, { name: "Activation workspace", unit: "B", value: values[1], base: 512 }, { name: "Model weights", unit: "KB", value: values[2], base: 17 }].map((row) => <div className="benchmarkRow" key={row.name}><span>{row.name}</span><div className="horizontalTrack"><i style={{ width: `${(row.value / row.base) * 100}%` }} /></div><strong>{row.value} <small>{row.unit}</small></strong></div>)}
        </div>
        <div className="method"><span>⌁</span><p><strong>Reproducible reference run</strong>10 warm-ups + 100,000 inferences per sample · median of 7 runs on the available Apple Silicon Arm64 host. Use <code>./scripts/benchmark.sh</code> on Arm64 to verify on your machine.</p></div>
      </div>
      <aside className="proofPanel">
        <div className="panelLabel">WHAT CHANGED</div>
        <ol><li><span>01</span><div><strong>INT8 weight representation</strong><p>4× smaller weights with fixed-range features.</p></div></li><li><span>02</span><div><strong>Arm NEON dot-product kernel</strong><p>Vectorized hot path with portable scalar fallback.</p></div></li><li><span>03</span><div><strong>Fused activation + requantization</strong><p>Fewer memory passes and temporary buffers.</p></div></li><li><span>04</span><div><strong>Judge-verifiable harness</strong><p>Arm-only gate, raw JSON, seven-run median.</p></div></li></ol>
        <div className="proofFooter"><a href="https://github.com/stephenovo/Smart-Pillbox-AI-Arm-Physical-AI/blob/main/evidence/benchmark.arm64.latest.json" target="_blank" rel="noreferrer">Raw benchmark JSON ↗</a><a href="https://github.com/stephenovo/Smart-Pillbox-AI-Arm-Physical-AI/blob/main/scripts/benchmark.sh" target="_blank" rel="noreferrer">Arm run script ↗</a><a href="https://github.com/stephenovo/Smart-Pillbox-AI-Arm-Physical-AI/blob/main/docs/ARCHITECTURE.md" target="_blank" rel="noreferrer">Architecture notes ↗</a></div>
      </aside>
    </div>
  );
}

function Metric({ value, label, note }: { value: string; label: string; note: string }) {
  return <div className="metric"><strong>{value}</strong><span>{label}</span><small>{note}</small></div>;
}

function ProductStep({ number, icon, title, copy }: { number: string; icon: string; title: string; copy: string }) {
  return <article className="productStep"><div><span>{number}</span><i>{icon}</i></div><h3>{title}</h3><p>{copy}</p></article>;
}

function ArchNode({ tag, title, sub, icon, featured = false }: { tag: string; title: string; sub: string; icon: string; featured?: boolean }) {
  return <div className={`archNode ${featured ? "featured" : ""}`}><span className="archIcon">{icon}</span><small>{tag}</small><strong>{title}</strong><p>{sub}</p></div>;
}
