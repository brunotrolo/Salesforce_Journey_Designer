import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const FALLBACK_PORTS = [3000, 3001, 3002];
export const POLL_INTERVAL_MS = 400;
export const POLL_TIMEOUT_MS = 30_000;

export function openBrowser(url) {
  const trySpawn = (cmd, args) => {
    try {
      const child = spawn(cmd, args, { stdio: 'ignore', detached: true });
      child.unref();
      return true;
    } catch {
      return false;
    }
  };
  const plat = os.platform();
  if (plat === 'win32') {
    if (trySpawn('cmd', ['/c', 'start', '""', 'chrome', url])) return true;
    if (trySpawn('cmd', ['/c', 'start', 'chrome', url])) return true;
    trySpawn('cmd', ['/c', 'start', '""', url]);
    return true;
  }
  if (plat === 'darwin') {
    if (trySpawn('open', ['-a', 'Google Chrome', url])) return true;
    return trySpawn('open', [url]);
  }
  return trySpawn('xdg-open', [url]);
}

export function waitForServer(url, timeoutMs, intervalMs = POLL_INTERVAL_MS) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const tryOnce = () => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve();
      });
      req.on('error', () => {
        if (Date.now() >= deadline) reject(new Error(`Servidor nao respondeu em ${timeoutMs / 1000}s em ${url}`));
        else setTimeout(tryOnce, intervalMs);
      });
      req.setTimeout(1500, () => {
        req.destroy();
        if (Date.now() >= deadline) reject(new Error(`Servidor nao respondeu em ${timeoutMs / 1000}s em ${url}`));
        else setTimeout(tryOnce, intervalMs);
      });
    };
    tryOnce();
  });
}

export async function waitForAnyPort(host, ports, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    for (const p of ports) {
      try {
        await waitForServer(`http://${host}:${p}/`, 1200);
        return { base: `http://${host}:${p}`, port: p };
      } catch {}
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
  throw new Error(`Servidor nao respondeu em ${timeoutMs / 1000}s (tentado portas ${ports.join(', ')})`);
}

// Prefixos de app lidos do próprio kit (src/apps.config.js) — nenhuma rota
// de jornada é hardcoded aqui, então novas capacidades funcionam sem tocar
// neste arquivo.
function knownAppPrefixes() {
  try {
    const kitRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
    const src = fs.readFileSync(path.join(kitRoot, 'src/apps.config.js'), 'utf8');
    const out = new Set(['/']);
    const re = /(?:pathPrefix|defaultPath):\s*['"]([^'"]+)['"]/g;
    let m;
    while ((m = re.exec(src)) !== null) out.add(m[1]);
    return [...out];
  } catch {
    return ['/'];
  }
}

// Normaliza rota vinda do shell, lidando com conversao MSYS/Git Bash:
// "/minha-rota" -> "C:/Program Files/Git/minha-rota" -> "/minha-rota"
export function normalizeRoute(rawRoute) {
  let r = rawRoute ?? '/';
  // Se MSYS converteu, o original continha "/" e agora tem "C:/.../rota".
  // Tenta casar um prefixo de app real do kit; senão, usa o último segmento.
  if (/^[A-Za-z]:[\\/]/.test(r) && r.includes('/')) {
    for (const a of knownAppPrefixes()) {
      if (a !== '/' && r.includes(a)) return a;
    }
    const idx = r.lastIndexOf('/');
    if (idx !== -1) r = r.slice(idx);
  }
  return r.startsWith('/') ? r : `/${r}`;
}
