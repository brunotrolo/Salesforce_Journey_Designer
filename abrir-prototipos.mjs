#!/usr/bin/env node
// Renderizador de prototipos — 1 clique, abre no Google Chrome
// - Le specs/*/prototype e lista jornadas existentes
// - Garante build do kit (dist) — faz npm run build so na primeira vez
// - Sobe vite preview em http://localhost:4173 (build ja bundlado, sem 404 de dev)
// - Gera prototipos.html (seletor) e abre no Chrome com links para cada jornada
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.join(ROOT, '.claude/skills/salesforce-ux/design-system-2-starter-kit');
const DIST = path.join(KIT, 'dist');
const PORT = 4173;
const HOST = 'localhost';
const BASE = `http://${HOST}:${PORT}`;

function log(m){ console.log(m); }
function warn(m){ console.warn(m); }

function scanSpecs(){
  const specsRoot = path.join(ROOT, 'specs');
  const out = [];
  if(!fs.existsSync(specsRoot)) return out;
  for(const domain of fs.readdirSync(specsRoot)){
    const domPath = path.join(specsRoot, domain);
    if(!fs.statSync(domPath).isDirectory()) continue;
    if(domain.startsWith('.')) continue;
    for(const cap of fs.readdirSync(domPath)){
      const capPath = path.join(domPath, cap);
      if(!fs.statSync(capPath).isDirectory()) continue;
      const proto = path.join(capPath, 'prototype');
      if(!fs.existsSync(proto)) continue;
      let route = `/${domain}`;
      let title = cap;
      try{
        const readme = fs.readFileSync(path.join(proto, 'README.md'), 'utf8');
        const m = readme.match(/npm run open -- ([^\s`]+)/);
        if(m) route = m[1].trim();
        const t = readme.match(/^# Prot[^\n]*—\s*`([^`]+)`/m);
        if(t) title = t[1];
      }catch{}
      out.push({ domain, cap, route, title, proto });
    }
  }
  return out;
}

function ensureBuild(){
  if(fs.existsSync(path.join(DIST, 'index.html'))){
    log('[renderizador] dist ja existe — pulando build.');
    return;
  }
  log('[renderizador] dist nao encontrado — rodando npm run build (30-40s, so na primeira vez)...');
  const r = spawnSync('npm', ['run','build'], { cwd: KIT, stdio:'inherit', shell: os.platform()==='win32' });
  if(r.status!==0){
    console.error('[renderizador] Build falhou. Veja o log acima.');
    process.exit(1);
  }
  log('[renderizador] Build OK.');
}

function waitFor(url, timeout=30000){
  const deadline = Date.now()+timeout;
  return new Promise((resolve,reject)=>{
    const tryOnce=()=>{
      const req = http.get(url, res=>{
        res.resume();
        if(res.statusCode>=200 && res.statusCode<400) resolve();
        else if(Date.now()>=deadline) reject(new Error(`HTTP ${res.statusCode} em ${url}`));
        else setTimeout(tryOnce, 500);
      });
      req.on('error',()=>{
        if(Date.now()>=deadline) reject(new Error(`Servidor nao respondeu em ${url}`));
        else setTimeout(tryOnce, 500);
      });
      req.setTimeout(1500, ()=>{ req.destroy(); if(Date.now()>=deadline) reject(new Error('timeout')); else setTimeout(tryOnce, 500); });
    };
    tryOnce();
  });
}

function openChrome(url){
  const plat = os.platform();
  const trySpawn = (cmd, args)=>{
    try{ const c=spawn(cmd, args, {stdio:'ignore', detached:true}); c.unref(); return true; }catch{ return false; }
  };
  if(plat==='win32'){
    if(trySpawn('cmd', ['/c','start','""','chrome', url])) return;
    if(trySpawn('cmd', ['/c','start','chrome', url])) return;
    trySpawn('cmd', ['/c','start','""', url]);
    return;
  }
  if(plat==='darwin'){
    if(trySpawn('open',['-a','Google Chrome', url])) return;
    trySpawn('open',[url]); return;
  }
  trySpawn('xdg-open',[url]);
}

function generateSelector(specs){
  const rows = specs.map(s=>`
    <div style="border:1px solid #c9c9c9;border-radius:8px;padding:16px;margin:12px 0;background:#fff">
      <div style="font-weight:700">${s.domain} — ${s.cap}</div>
      <div style="color:#444;font-size:13px;margin:6px 0">${s.title} — rota <code>${s.route}</code></div>
      <a href="${BASE}${s.route}" target="_blank" style="display:inline-block;background:#066afe;color:#fff;padding:8px 14px;border-radius:6px;text-decoration:none;margin-top:8px">Abrir no Chrome → ${s.route}</a>
      <span style="margin-left:10px;color:#666;font-size:12px">spec: <code>specs/${s.domain}/${s.cap}</code></span>
    </div>
  `).join('');
  const html = `<!doctype html>
<html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Protótipos — Salesforce Journey Factory</title>
<style>body{font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:780px;margin:32px auto;padding:0 16px;background:#f3f3f3;color:#181818}h1{margin:0 0 8px}code{background:#f3f3f3;padding:2px 6px;border-radius:4px}.card{background:#fff;border:1px solid #c9c9c9;border-radius:8px;padding:16px;margin:12px 0}</style>
<h1>Protótipos — Salesforce Journey Factory</h1>
<p>Seletor gerado automaticamente a partir de <code>specs/*/prototype</code>. O servidor de preview está em <code>${BASE}</code> — mantenha o terminal aberto enquanto usa.</p>
<div class="card" style="background:#eef4ff;border-color:#066afe">
  <strong>Dica:</strong> Se o Chrome não abrir sozinho, copie e cole no Chrome: <code>${BASE}/busca-cliente</code>
</div>
${rows || '<p style="color:#b60554">Nenhum prototype encontrado em specs/*/prototype — crie uma capacidade com prototype primeiro.</p>'}
<div class="card" style="font-size:13px;color:#444">
  <strong>Como funciona:</strong> Este arquivo foi gerado por <code>abrir-prototipos.mjs</code> que garante <code>dist</code> (build), sobe <code>vite preview</code> em ${BASE} e abre este seletor no Chrome. Feche o terminal para parar o servidor.
</div>
</html>`;
  const outPath = path.join(ROOT, 'prototipos.html');
  fs.writeFileSync(outPath, html, 'utf8');
  return outPath;
}

async function main(){
  const specs = scanSpecs();
  log(`[renderizador] Encontrados ${specs.length} prototipo(s): ${specs.map(s=>s.domain+'/'+s.cap).join(', ') || 'nenhum'}`);
  ensureBuild();
  const selectorPath = generateSelector(specs);
  const selectorUrl = 'file:///' + selectorPath.replace(/\\/g,'/');
  log(`[renderizador] Subindo preview em ${BASE} ...`);
  const preview = spawn('npm', ['run','preview','--','--host',HOST,'--port',String(PORT)], { cwd: KIT, stdio:'inherit', shell: os.platform()==='win32' });
  try{
    await waitFor(`${BASE}/`, 30000);
    log(`[renderizador] Preview pronto em ${BASE}`);
  }catch(e){
    warn(`[renderizador] Aviso: ${e.message} — tentando abrir mesmo assim.`);
  }
  const firstRoute = specs[0]?.route || '/busca-cliente';
  const firstUrl = `${BASE}${firstRoute}`;
  log(`[renderizador] Abrindo Chrome: seletor ${selectorUrl}`);
  openChrome(selectorUrl);
  setTimeout(()=>{ log(`[renderizador] Abrindo Chrome: ${firstUrl}`); openChrome(firstUrl); }, 800);
  log(`[renderizador] Pronto. Mantenha este terminal aberto. Feche ou Ctrl+C para parar.`);
  preview.on('close', code=>{
    log(`[renderizador] Preview saiu com codigo ${code}`);
    process.exit(code ?? 0);
  });
  for(const sig of ['SIGINT','SIGTERM']){
    process.on(sig, ()=>{ try{ preview.kill(sig); }catch{} });
  }
}

main().catch(e=>{ console.error(e); process.exit(1); });
