#!/usr/bin/env node
// open-prototypes.mjs — seletor multi-capacidade (preview buildado)
// Le specs/*/prototype, garante dist, sobe vite preview e abre no Chrome.
// Uso: npm run open:all  (ou node scripts/open-prototypes.mjs)
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { openBrowser, waitForServer } from './browser-utils.mjs';
import { parseWiring } from './restore-prototype.mjs';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROJECT_ROOT = path.resolve(KIT_ROOT, '../../../..');
const DIST = path.join(KIT_ROOT, 'dist');
const PORT = 4173;
const HOST = 'localhost';
const BASE = `http://${HOST}:${PORT}`;

function log(m){ console.log(m); }

// EXCEÇÃO DOCUMENTADA à regra "kit sem overlay": o seletor multi-jornada
// precisa de TODAS as capacidades fiadas ao mesmo tempo para buildar e servir.
// Por isso este launcher restaura todas e NÃO limpa — o overlay aqui é o modo
// de operação, não sujeira esquecida. Validação de UMA capacidade continua
// exigindo restore + --clean (ver fsc-html-prototyper.md passo 6).
function restoreAll(specs){
  for(const s of specs){
    const spec = `${s.domain}/${s.cap}`;
    log(`[open-prototypes] restore ${spec} ...`);
    const r = spawnSync('node', ['scripts/restore-prototype.mjs', spec], { cwd: KIT_ROOT, stdio:'inherit', shell: process.platform==='win32' });
    if(r.status!==0){ console.error(`[open-prototypes] restore falhou para ${spec}.`); process.exit(1); }
  }
}

function field(src, name){
  const m = src.match(new RegExp(name + ':\\s*[\'"]([^\'"]+)[\'"]'));
  return m ? m[1] : null;
}

function scanSpecs(){
  const specsRoot = path.join(PROJECT_ROOT, 'specs');
  const out = [];
  if(!fs.existsSync(specsRoot)) return out;
  for(const domain of fs.readdirSync(specsRoot)){
    const domPath = path.join(specsRoot, domain);
    if(!fs.statSync(domPath).isDirectory() || domain.startsWith('.') || domain==='.git') continue;
    for(const cap of fs.readdirSync(domPath)){
      const capPath = path.join(domPath, cap);
      if(!fs.statSync(capPath).isDirectory()) continue;
      const proto = path.join(capPath, 'prototype');
      const readmePath = path.join(proto, 'README.md');
      if(!fs.existsSync(proto) || !fs.existsSync(readmePath)) continue;
      // Rota e título vêm dos blocos // SECTION: do prototype/README.md —
      // a mesma fonte que o restore usa (sem scrapear frase, sem depender do kit).
      let route = `/${domain}`;
      let title = `${domain}/${cap}`;
      try{
        const sections = parseWiring(fs.readFileSync(readmePath, 'utf8'));
        const appsBlock = sections.apps || '';
        const routesBlock = sections.routes || '';
        route = field(appsBlock, 'defaultPath') || field(appsBlock, 'pathPrefix') || route;
        title = field(routesBlock, 'title') || title;
      }catch{}
      out.push({ domain, cap, route, title });
    }
  }
  return out;
}

function newestMtime(dir){
  let newest = 0;
  const walk = (d)=>{
    for(const e of fs.readdirSync(d, { withFileTypes: true })){
      if(e.name==='node_modules' || e.name==='.git') continue;
      const p = path.join(d, e.name);
      try{
        if(e.isDirectory()) walk(p);
        else {
          const t = fs.statSync(p).mtimeMs;
          if(t > newest) newest = t;
        }
      }catch{}
    }
  };
  try{ walk(dir); }catch{}
  return newest;
}

function ensureBuild(specs){
  const distIndex = path.join(DIST, 'index.html');
  let stale = !fs.existsSync(distIndex);
  let reason = 'dist nao encontrado';
  if(!stale){
    const distTime = fs.statSync(distIndex).mtimeMs;
    // Rebuild se qualquer prototype/ ou fiação do kit for mais novo que o dist.
    const watched = [path.join(PROJECT_ROOT, 'specs')];
    for(const f of ['src/routes.config.js', 'src/apps.config.js', 'src/modules/shell/app/app.js']) {
      watched.push(path.join(KIT_ROOT, f));
    }
    for(const w of watched){
      if(fs.existsSync(w) && newestMtime(w) > distTime){
        stale = true;
        reason = `${path.relative(PROJECT_ROOT, w)} mais novo que dist/`;
        break;
      }
    }
    // specs/ inteiro pode ser pesado; limita à varredura acima (ok para este repo).
  }
  if(!stale){
    log('[open-prototypes] dist atualizado — pulando build.');
    return;
  }
  log(`[open-prototypes] rebuild necessário (${reason}) — rodando npm run build...`);
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
<title>Protótipos — Salesforce Journey Designer</title>
<style>body{font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:780px;margin:32px auto;padding:0 16px;background:#f3f3f3;color:#181818}code{background:#f3f3f3;padding:2px 6px;border-radius:4px}.card{background:#fff;border:1px solid #c9c9c9;border-radius:8px;padding:16px;margin:12px 0}</style>
<h1>Protótipos — Salesforce Journey Designer</h1>
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
  if(specs.length) restoreAll(specs);
  ensureBuild(specs);
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
