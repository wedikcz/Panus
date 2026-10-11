import React, { useMemo, useState } from "react";

import { LayoutShell } from "../components/layout";
import { taskGraphExecutor } from "../lib/task-graph";

const AGENTS = [
  { name: "Architect Agent", specialization: "Qwen3-Thinking", tone: "planner" },
  { name: "Developer Agent", specialization: "Qwen3-Coder", tone: "builder" },
  { name: "Audit Agent", specialization: "Phi-4 / Mistral-Small", tone: "guard" },
];

export function GodmodeAgentStudioPage(): JSX.Element {
  const [goal, setGoal] = useState("Local air-gapped app to monitor VFS and deploy secure AI workflows.");
  const [tasks, setTasks] = useState(taskGraphExecutor.getAllTasks());

  const taskSummary = useMemo(
    () => ({
      pending: tasks.filter((item) => item.status === "pending").length,
      running: tasks.filter((item) => item.status === "running").length,
      success: tasks.filter((item) => item.status === "success").length,
      failed: tasks.filter((item) => item.status === "failed").length,
    }),
    [tasks],
  );

  const submitTask = () => {
    const newTasks = taskGraphExecutor.enqueueGoal(goal);
    setTasks(taskGraphExecutor.getAllTasks());
    return newTasks;
  };

  return (
    <LayoutShell>
      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="gc-panel">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="gc-kicker">Godmode execution loop</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Agent Studio</h2>
            </div>
            <button className="gc-btn primary" type="button" onClick={submitTask}>
              Launch swarm
            </button>
          </div>

          <label className="block text-sm text-zinc-300">
            Mission objective
            <textarea
              className="mt-2 min-h-[120px] w-full rounded-xl border border-zinc-700 bg-zinc-950/60 p-3 text-sm text-zinc-100 outline-none ring-0"
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
            />
          </label>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">Pending</p>
              <p className="mt-2 text-2xl font-semibold text-white">{taskSummary.pending}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">Running</p>
              <p className="mt-2 text-2xl font-semibold text-white">{taskSummary.running}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">Success</p>
              <p className="mt-2 text-2xl font-semibold text-white">{taskSummary.success}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">Failed</p>
              <p className="mt-2 text-2xl font-semibold text-white">{taskSummary.failed}</p>
            </div>
          </div>
        </section>

        <aside className="gc-panel">
          <p className="gc-kicker">Swarm roster</p>
          <div className="mt-4 space-y-3">
            {AGENTS.map((agent) => (
              <div key={agent.name} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
                <div className="flex items-center justify-between">
                  <strong className="text-white">{agent.name}</strong>
                  <span className="gc-tag">{agent.tone}</span>
                </div>
                <p className="mt-2 text-sm text-zinc-300">{agent.specialization}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <section className="gc-panel mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Task graph</h3>
          <span className="gc-tag success">Plan-Execute-Observe-Correct</span>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
              <div>
                <p className="font-medium text-white">{task.title}</p>
                <p className="text-sm text-zinc-400">{task.description}</p>
              </div>
              <span className={`gc-tag ${task.status === "success" ? "success" : task.status === "failed" ? "danger" : task.status === "running" ? "warning" : ""}`}>
                {task.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </LayoutShell>
  );
}

export default GodmodeAgentStudioPage;
