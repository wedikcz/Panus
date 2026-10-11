import React from "react";

import { LayoutShell } from "../components/layout";
import { MODEL_CATALOG } from "../lib/webllm";

export function ModelsPage(): JSX.Element {
  return (
    <LayoutShell>
      <section className="gc-panel">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="gc-kicker">Model manager</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">WebLLM catalog</h2>
          </div>
          <span className="gc-tag success">5 active models</span>
        </div>

        <div className="space-y-4">
          {MODEL_CATALOG.map((model) => (
            <div key={model.id} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{model.name}</h3>
                  <p className="text-sm text-zinc-400">{model.description}</p>
                </div>
                <span className="gc-tag">{model.tier}</span>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-zinc-300">
                <span>{model.preferredFor}</span>
                <span>{model.vramaHint}</span>
              </div>

              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-emerald-400"
                  style={{ width: model.tier === "tiny" ? "68%" : model.tier === "balanced" ? "84%" : "96%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </LayoutShell>
  );
}

export default ModelsPage;
