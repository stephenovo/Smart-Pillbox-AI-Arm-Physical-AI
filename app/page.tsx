import type { Metadata } from "next";
import EdgeConsole from "./EdgeConsole";

export const metadata: Metadata = {
  title: "CareLoop Edge — Arm Physical AI",
  description:
    "A privacy-first medication safety system that turns simulated pillbox sensor events into local Arm64 decisions and physical interventions.",
};

export default function Home() {
  return <EdgeConsole />;
}
