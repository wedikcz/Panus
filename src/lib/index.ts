:root {
  --gc-bg: #050816;
  --gc-panel: rgba(15, 23, 42, 0.96);
  --gc-panel-border: rgba(148, 163, 184, 0.18);
  --gc-accent: hsl(188 95% 60%);
  --gc-accent-2: hsl(270 85% 65%);
  --gc-success: hsl(160 84% 60%);
  --gc-warning: hsl(38 92% 62%);
  --gc-danger: hsl(0 84% 64%);
  --gc-text: #e2e8f0;
  --gc-muted: #a0a4af;
  --gc-shadow: 0 18px 42px rgba(14, 116, 144, 0.2);
}

* {
  box-sizing: border-box;
}

html {
  color-scheme: dark;
  background: var(--gc-bg);
  font-family: "Inter", "SF Pro Display", "Segoe UI", sans-serif;
}

body {
  margin: 0;
  min-height: 100vh;
  background: var(--gc-bg);
  color: var(--gc-text);
}

button,
input,
textarea {
  font: inherit;
}

.gc-panel {
  border: 1px solid var(--gc-panel-border);
  background: rgba(15, 23, 42, 0.85);
  box-shadow: var(--gc-shadow);
  border-radius: 1.25rem;
  padding: 1.25rem;
}

.gc-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(15, 23, 42, 0.9);
  color: var(--gc-text);
  padding: 0.6rem 1rem;
  transition: 180ms ease;
  cursor: pointer;
}

.gc-btn:hover {
  transform: translateY(-1px);
  border-color: rgba(34, 211, 238, 0.35);
}

.gc-btn.primary {
  background: linear-gradient(135deg, var(--gc-accent), var(--gc-accent-2));
  color: #03111a;
  font-weight: 700;
  border: none;
}

.gc-btn.ghost {
  background: transparent;
}

.gc-kicker {
  margin: 0;
  color: var(--gc-accent);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.gc-tag {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.28rem 0.7rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
  color: var(--gc-text);
  background: rgba(15, 23, 42, 0.9);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.gc-tag.success {
  color: #d1fae5;
  background: rgba(16, 185, 129, 0.12);
  border-color: rgba(16, 185, 129, 0.35);
}

.gc-tag.warning {
  color: #fef3c7;
  background: rgba(245, 158, 11, 0.12);
  border-color: rgba(245, 158, 11, 0.35);
}

.gc-tag.danger {
  color: #fee2e2;
  background: rgba(239, 68, 68, 0.12);
  border-color: rgba(239, 68, 68, 0.4);
}

.font-mono {
  font-family: "JetBrains Mono", "SFMono-Regular", monospace;
}
