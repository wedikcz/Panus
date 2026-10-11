import React from "react";

import { LayoutShell } from "../components/layout";

const auditEntries = [
  { action: "model_switch", actor: "admin", intent: "optimizer", summary: "Switched to Qwen3-Thinking for deeper planning.", time: "12:04" },
  { action: "vfs_write", actor: "developer", intent: "patch", summary: "Saved patch to /workspace/agent-output.txt.", time: "12:11" },
  { action: "approval_gate", actor: "operator", intent: "sandbox", summary: "Approved destructive action pending human sign-off.", time: "12:18" },
  { action: "safety_scan", actor: "audit", intent: "risk_review", summary: "Checked outbound network status and marked local-only sync as compliant.", time: "12:33" },
];

export function AuditLogPage(): JSX.Element {
  return (
    <LayoutShell>
      <section className="gc-panel">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="gc-kicker">Audit trail</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Immutable local ledger</h2>
          </div>
          <span className="gc-tag success">RBAC enforced</span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-800">
          <table className="min-w-full text-left text-sm text-zinc-200">
            <thead className="bg-zinc-900/80 text-zinc-300">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Intent</th>
                <th className="px-4 py-3">Summary</th>
              </tr>
            </thead>
            <tbody>
              {auditEntries.map((entry) => (
                <tr key={`${entry.action}-${entry.time}`} className="border-t border-zinc-800 bg-zinc-950/40">
                  <td className="px-4 py-3 text-zinc-400">{entry.time}</td>
                  <td className="px-4 py-3">{entry.action}</td>
                  <td className="px-4 py-3">{entry.actor}</td>
                  <td className="px-4 py-3">{entry.intent}</td>
                  <td className="px-4 py-3 text-zinc-300">{entry.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </LayoutShell>
  );
}

export default AuditLogPage;
