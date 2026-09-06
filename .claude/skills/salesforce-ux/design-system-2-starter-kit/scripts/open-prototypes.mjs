#!/usr/bin/env node
// open-prototypes.mjs — seletor multi-capacidade (preview buildado)
// Le specs/*/prototype, garante dist, sobe vite preview e abre no Chrome.
// Uso: npm run open:all  (ou node scripts/open-prototypes.mjs)
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { openBrowser, waitForServer } from './browser-utils.mjs';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROJECT_ROOT = path.resolve(KIT_ROOT, '../../../..');
const DIST = path.join(KIT_ROOT, 'dist');
const PORT = 4173;
const HOST = 'localhost';
const BASE = `http://${HOST}:${PORT}`;

function log(m){ console.log(m); }

function scanSpecs(){
  const specsRoot = path.join(PROJECT_ROOT, 'specs');
  const out = [];
  if(!fs.existsSync(specsRoot)) return out;

  // Le rotas validas do kit para mapear dominio -> rota sem scrapear README
  const validRoutes = new Set();
  try{
    const routesSrc = fs.readFileSync(path.join(KIT_ROOT, 'src/routes.config.js'), 'utf8');
    const re = /path:\s*['"]([^'"]+)['"]/g;
    let m; while((m=re.exec(routesSrc))!==null) validRoutes.add(m[1]);
    const appsSrc = fs.readFileSync(path.join(KIT_ROOT, 'src/apps.config.js'), 'utf8');
    const re2 = /pathPrefix:\s*['"]([^'"]+)['"]/g;
    let m2; while((m2=re2.exec(appsSrc))!==null) validRoutes.add(m2[1]);
  }catch{}

  for(const domain of fs.readdirSync(specsRoot)){
    const domPath = path.join(specsRoot, domain);
    if(!fs.statSync(domPath).isDirectory() || domain.startsWith('.') || domain==='.git') continue;
    for(const cap of fs.readdirSync(domPath)){
      const capPath = path.join(domPath, cap);
      if(!fs.statSync(capPath).isDirectory()) continue;
      const proto = path.join(capPath, 'prototype');
      if(!fs.existsSync(proto)) continue;
      // Rota padrao e /<domain> (app prefix). Se o dominio tem rota valida, usa ela.
      let route = `/${domain}`;
      if(!validRoutes.has(route)){
        // Fallback: tenta ler prototype/README para rota custom, mas nao depende do formato de frase
        try{
          const readme = fs.readFileSync(path.join(proto, 'README.md'), 'utf8');
          const m = readme.match(/\/[a-z0-9-]+/i);
          if(m && validRoutes.has(m[0])) route = m[0];
        }catch{}
      }
      out.push({ domain, cap, route, title: `${domain}/${cap}` });
    }
  }
  return out;
}

function ensureBuild(){
  if(fs.existsSync(path.join(DIST, 'index.html'))){
    log('[open-prototypes] dist ja existe — pulando build.');
    return;
  }
  log('[open-prototypes] dist nao encontrado — rodando npm run build (30-40s)...');
  const r = spawnSync('npm', ['run','build'], { cwd: KIT_ROOT, stdio:'inherit', shell: process.platform==='win32' });
  if(r.status!==0){ console.error('[open-prototypes] Build falhou.'); process.exit(1); }
  log('[open-prototypes] Build OK.');
}

function generateSelector(specs){
  const rows = specs.map(s=>`
    <div style="border:1px solid #c9c9c9;border-radius:8px;padding:16px;margin:12px 0;background:#fff">
      <div style="font-weight:700">${s.domain} — ${s.cap}</div>
      <div style="color:#444;font-size:13px;margin:6px 0">rota <code>${s.route}</code> — spec <code>specs/${s.domain}/${s.cap}</code></div>
      <a href="${BASE}${s.route}" target="_blank" style="display:inline-block;background:#066afe;color:#fff;padding:8px 14px;border-radius:6px;text-decoration:none;margin-top:8px">Abrir no Chrome → ${s.route}</a>
    </div>
  `).join('');
  const html = `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Protótipos — Salesforce Journey Factory</title>
<style>body{font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:780px;margin:32px auto;padding:0 16px;background:#f3f3f3;color:#181818}code{background:#f3f3f3;padding:2px 6px;border-radius:4px}.card{background:#fff;border:1px solid #c9c9c9;border-radius:8px;padding:16px;margin:12px 0}</style>
<h1>Protótipos — Salesforce Journey Factory</h1>
<p>Seletor gerado a partir de <code>specs/*/prototype</code>. Preview em <code>${BASE}</code> — mantenha o terminal aberto.</p>
${rows || '<p style="color:#b60554">Nenhum prototype encontrado.</p>'}
<div class="card" style="font-size:13px;color:#444">Feche o terminal para parar o servidor. Criar nova capacidade com prototype faz ela aparecer aqui automaticamente.</div>
</html>`;
  const outPath = path.join(PROJECT_ROOT, 'prototipos.html');
  fs.writeFileSync(outPath, html, 'utf8');
  return outPath;
}

async function main(){
  const specs = scanSpecs();
  log(`[open-prototypes] Encontrados ${specs.length} prototipo(s): ${specs.map(s=>s.domain+'/'+s.cap).join(', ') || 'nenhum'}`);
  ensureBuild();
  const selectorPath = generateSelector(specs);
  const selectorUrl = 'file:///' + selectorPath.replace(/\\/g,'/');
  log(`[open-prototypes] Subindo preview em ${BASE} ...`);
  const preview = spawn('npm', ['run','preview','--','--host',HOST,'--port',String(PORT)], { cwd: KIT_ROOT, stdio:'inherit', shell: process.platform==='win32' });
  try{
    await waitForServer(`${BASE}/`, 30000);
    log(`[open-prototypes] Preview pronto em ${BASE}`);
  }catch(e){
    log(`[open-prototypes] Aviso: ${e.message} — abrindo mesmo assim.`);
  }
  log(`[open-prototypes] Abrindo Chrome: seletor ${selectorUrl}`);
  openBrowser(selectorUrl);
  log(`[open-prototypes] Pronto. Protótipos: ${specs.map(s=>BASE+s.route).join(', ') || BASE}`);
  preview.on('close', c=>{ log(`[open-prototypes] Preview saiu com codigo ${c}`); process.exit(c??0); });
  for(const sig of ['SIGINT','SIGTERM']) process.on(sig, ()=>{ try{ preview.kill(sig); }catch{} });
}
main().catch(e=>{ console.error(e); process.exit(1); });
