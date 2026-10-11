import React from "react";

import { LayoutShell } from "../components/layout";

export function DashboardPage(): JSX.Element {
  const stats = [
    { label: "Active swarms", value: "3" },
    { label: "Local models", value: "5" },
    { label: "Audit events", value: "128" },
    { label: "Tasks completed", value: "91%" },
  ];

  return (
    <LayoutShell>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <section key={stat.label} className="gc-panel">
            <p className="gc-kicker">{stat.label}</p>
            <h3 className="mt-2 text-3xl font-semibold text-white">{stat.value}</h3>
          </section>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <section className="gc-panel">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Mission overview</h2>
            <span className="gc-tag success">Stable</span>
          </div>
          <p className="text-sm leading-7 text-zinc-300">
            GODCORE OS is operating in fully local mode with WebGPU inference, encrypted local VFS,
            and an autonomous planning loop. All critical operations remain behind human approval gates.
          </p>
        </section>

        <section className="gc-panel">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Operator status</h2>
            <span className="gc-tag">Admin</span>
          </div>
          <ul className="space-y-2 text-sm text-zinc-300">
            <li>• Local inference enabled</li>
            <li>• Convex sync online</li>
            <li>• Audit ledger secure</li>
            <li>• Human approval required for destructive actions</li>
          </ul>
        </section>
      </div>
    </LayoutShell>
  );
}

export default DashboardPage;
