import type { Metadata } from "next";
import EdgeConsole from "./EdgeConsole";

export const metadata: Metadata = {
  title: "Arm Physical AI Competition Edition",
  description:
    "A productized smart pillbox demo that turns simulated sensor events into private Arm64 decisions and bounded safety actions.",
};

export default function Home() {
  return <EdgeConsole />;
}
