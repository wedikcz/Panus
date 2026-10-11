import React, { useState } from "react";

import { LayoutShell } from "../components/layout";
import { vfs } from "../lib/vfs";

export function VfsExplorerPage(): JSX.Element {
  const [path, setPath] = useState("/");
  const [content, setContent] = useState("// VFS ready");
  const [entries, setEntries] = useState(vfs.listDirectory(path));

  const refreshDirectory = (nextPath: string) => {
    setPath(nextPath);
    setEntries(vfs.listDirectory(nextPath));
  };

  const handleSave = () => {
    const filePath = `${path === "/" ? "" : path}/agent-output.txt`;
    vfs.writeFile(filePath, content, "text/plain");
    refreshDirectory(path);
  };

  return (
    <LayoutShell>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="gc-panel">
          <p className="gc-kicker">Virtual files</p>
          <div className="mt-4 flex items-center gap-2">
            <button className="gc-btn" type="button" onClick={() => refreshDirectory("/")}>
              Root
            </button>
            <button className="gc-btn" type="button" onClick={() => refreshDirectory("/workspace")}>
              /workspace
            </button>
          </div>

          <div className="mt-5 space-y-2">
            {entries.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className="flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 text-left text-sm text-zinc-200 transition hover:border-zinc-700"
                onClick={() => refreshDirectory(entry.path)}
              >
                <span>{entry.path.split("/").at(-1) ?? entry.path}</span>
                <span className="gc-tag">{entry.kind}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="gc-panel">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="gc-kicker">Editor</p>
              <h2 className="mt-2 text-xl font-semibold text-white">{path || "/"}</h2>
            </div>
            <button className="gc-btn primary" type="button" onClick={handleSave}>
              Save file
            </button>
          </div>

          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="min-h-[320px] w-full rounded-xl border border-zinc-700 bg-zinc-950/50 p-3 font-mono text-sm text-zinc-100 outline-none"
          />
        </section>
      </div>
    </LayoutShell>
  );
}

export default VfsExplorerPage;
