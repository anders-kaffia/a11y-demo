// Starts `vite preview`, runs axe + Lighthouse, then shuts the server down.
import { spawn } from 'node:child_process';
import { runAxe } from './axe-check.mjs';
import { runLighthouse } from './lighthouse-check.mjs';

const server = spawn('npx vite preview --port 4173 --strictPort', {
  shell: true,
  stdio: 'ignore',
});

async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Server did not start at ${url}`);
}

let exitCode = 1;
try {
  await waitForServer('http://localhost:4173/');
  const violations = await runAxe();
  const score = await runLighthouse();
  console.log(`\nSUMMARY: axe violations = ${violations}, Lighthouse accessibility = ${score}`);
  exitCode = violations === 0 && score === 100 ? 0 : 1;
} finally {
  if (process.platform === 'win32') spawn('taskkill', ['/pid', String(server.pid), '/T', '/F']);
  else server.kill();
}
process.exitCode = exitCode;
