#!/usr/bin/env node
/**
 * open-prototype.mjs — launcher de prototipo para validacao de negocio.
 *
 * Uso:
 *   node scripts/open-prototype.mjs [/rota]        # ex: /busca-cliente
 *   npm run open -- /busca-cliente                  # via package.json script
 *   ./abrir-prototipo.sh /busca-cliente             # wrapper Mac/Linux
 *   abrir-prototipo.cmd /busca-cliente              # wrapper Windows
 *
 * O que faz:
 *  - Se node_modules/ nao existir, roda npm install (com mensagem clara se falhar).
 *  - Lista rotas registradas em src/routes.config.js (referencia rapida).
 *  - Sobe o dev server (prebuild-icons + vite) em primeiro plano, herdando stdio.
 *  - Faz polling em http://localhost:3000/ ate responder (30s), so entao abre o
 *    navegador na rota pedida — nao tenta abrir antes do servidor estar pronto.
 *  - Abertura do navegador degrada com aviso (sem GUI) em vez de derrubar o processo.
 *
 * Sem dependencias novas — so Node built-ins (child_process, http, fs, os, path).
 */
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 3000;
const HOST = 'localhost';
const BASE_URL = `http://${HOST}:${PORT}`;
// Se 3000 estiver ocupada, Vite sobe em 3001/3002 — sondar em cascata.
const FALLBACK_PORTS = [3000, 3001, 3002];
const POLL_TIMEOUT_MS = 30_000;
const POLL_INTERVAL_MS = 400;

let rawRoute = process.argv[2] ?? '/';
// Git Bash (MSYS) converte "/busca-cliente" em "C:/Program Files/Git/busca-cliente"
// — detecta e recupera a rota original. Use MSYS_NO_PATHCONV=1 para evitar.
if (rawRoute.includes('busca-cliente')) rawRoute = '/busca-cliente';
else if (rawRoute.includes('/contacts')) rawRoute = rawRoute.slice(rawRoute.indexOf('/contacts'));
else if (/^[A-Za-z]:[\\/]/.test(rawRoute) && rawRoute.includes('/')) {
  const idx = rawRoute.lastIndexOf('/');
  if (idx !== -1) rawRoute = rawRoute.slice(idx);
}
const route = rawRoute.startsWith('/') ? rawRoute : `/${rawRoute}`;

function log(msg) {
  console.log(msg);
}

function fail(msg) {
  console.error(`[open-prototype] ERRO: ${msg}`);
  process.exit(1);
}

function printRoutes() {
  try {
    const cfgPath = path.join(KIT_ROOT, 'src/routes.config.js');
    const src = fs.readFileSync(cfgPath, 'utf8');
    const re = /path:\s*['"]([^'"]+)['"]/g;
    const routes = [];
    let m;
    while ((m = re.exec(src)) !== null) routes.push(m[1]);
    let appPrefixes = [];
    try {
      const appsSrc = fs.readFileSync(path.join(KIT_ROOT, 'src/apps.config.js'), 'utf8');
      const re2 = /pathPrefix:\s*['"]([^'"]+)['"]/g;
      let m2;
      while ((m2 = re2.exec(appsSrc)) !== null) appPrefixes.push(m2[1]);
      const re3 = /defaultPath:\s*['"]([^'"]+)['"]/g;
      while ((m2 = re3.exec(appsSrc)) !== null) if (!appPrefixes.includes(m2[1])) appPrefixes.push(m2[1]);
    } catch {}
    const valid = new Set([...routes, ...appPrefixes]);
    if (routes.length || appPrefixes.length) {
      log(`[open-prototype] Rotas registradas em src/routes.config.js: ${routes.join(', ')}`);
      if (appPrefixes.length) log(`[open-prototype] Apps (pathPrefix/defaultPath): ${appPrefixes.join(', ')}`);
      if (!valid.has(route)) {
        log(`[open-prototype] Aviso: rota "${route}" nao esta em routes.config.js nem como app prefix — o navegador ainda vai abrir, mas pode cair em 404/NotFound.`);
      }
    }
  } catch {}
}

function ensureInstalled() {
  const nm = path.join(KIT_ROOT, 'node_modules');
  if (fs.existsSync(nm)) return;
  log('[open-prototype] node_modules/ nao encontrado — rodando npm install (precisa internet, pode levar 1-2 min)...');
  const res = spawnSync('npm', ['install'], {
    cwd: KIT_ROOT,
    stdio: 'inherit',
    shell: os.platform() === 'win32',
  });
  if (res.status !== 0) {
    fail('npm install falhou (sem rede ou Node < 20?). Corrija e rode novamente: npm run open -- ' + route);
  }
  log('[open-prototype] Dependencias instaladas.');
}

function openBrowser(url) {
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
    if (trySpawn('cmd', ['/c', 'start', '""', 'chrome', url])) return;
    if (trySpawn('cmd', ['/c', 'start', 'chrome', url])) return;
    trySpawn('cmd', ['/c', 'start', '""', url]);
    log(`[open-prototype] Se abriu no VS Code Simple Browser, copie e cole no Chrome: ${url}`);
    return;
  }
  if (plat === 'darwin') {
    if (trySpawn('open', ['-a', 'Google Chrome', url])) return;
    trySpawn('open', [url]);
    return;
  }
  trySpawn('xdg-open', [url]);
}

function waitForServer(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const tryOnce = () => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve();
      });
      req.on('error', () => {
        if (Date.now() >= deadline) {
          reject(new Error(`Servidor nao respondeu em ${timeoutMs / 1000}s em ${url}`));
          return;
        }
        setTimeout(tryOnce, POLL_INTERVAL_MS);
      });
      req.setTimeout(1500, () => {
        req.destroy();
        if (Date.now() >= deadline) {
          reject(new Error(`Servidor nao respondeu em ${timeoutMs / 1000}s em ${url}`));
          return;
        }
        setTimeout(tryOnce, POLL_INTERVAL_MS);
      });
    };
    tryOnce();
  });
}

async function waitForAnyPort(route, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    for (const p of FALLBACK_PORTS) {
      const base = `http://${HOST}:${p}`;
      try {
        await waitForServer(base + '/', 1200);
        return { base, port: p };
      } catch {}
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
  throw new Error(`Servidor nao respondeu em ${timeoutMs / 1000}s em ${BASE_URL}/ (tentado portas ${FALLBACK_PORTS.join(', ')})`);
}

async function main() {
  const nodeMajor = parseInt(process.versions.node.split('.')[0], 10);
  if (nodeMajor < 20) {
    fail(`Node.js ${process.versions.node} detectado — este kit exige Node >= 20 (ver .nvmrc / package.json engines). Atualize o Node e tente novamente.`);
  }
  ensureInstalled();
  printRoutes();
  let actualBase = BASE_URL;
  let actualTarget = `${actualBase}${route}`;
  log(`[open-prototype] Subindo dev server em ${BASE_URL} e aguardando ficar pronto (ate ${POLL_TIMEOUT_MS / 1000}s) para abrir ${actualTarget} ...`);
  if (FALLBACK_PORTS.length > 1) log(`[open-prototype] Se ${PORT} estiver ocupada, tenta ${FALLBACK_PORTS.slice(1).join(', ')} automaticamente.`);
  log(`[open-prototype] Dica: feche este terminal ou Ctrl+C para parar o servidor.`);
  const dev = spawn('npm', ['run', 'dev'], {
    cwd: KIT_ROOT,
    stdio: 'inherit',
    shell: os.platform() === 'win32',
  });
  let opened = false;
  const openOnceReady = async () => {
    try {
      const found = await waitForAnyPort(route, POLL_TIMEOUT_MS);
      if (opened) return;
      opened = true;
      actualBase = found.base;
      actualTarget = `${actualBase}${route}`;
      log(`[open-prototype] Servidor pronto em ${actualBase} — abrindo ${actualTarget}`);
      openBrowser(actualTarget);
    } catch (e) {
      if (!opened) {
        log(`[open-prototype] Aviso: ${e.message}. O servidor pode ainda estar subindo — tente abrir manualmente: ${actualTarget}`);
      }
    }
  };
  openOnceReady();
  dev.on('close', (code) => {
    if (code !== null && code !== 0) {
      log(`[open-prototype] Dev server saiu com codigo ${code}. Verifique o log acima.`);
      process.exit(code);
    }
    process.exit(0);
  });
  dev.on('error', (err) => {
    fail(`Falha ao iniciar dev server: ${err.message}`);
  });
  for (const sig of ['SIGINT', 'SIGTERM']) {
    process.on(sig, () => {
      if (!dev.killed) dev.kill(sig);
    });
  }
}

main();
