#!/usr/bin/env node
/**
 * restore-prototype.mjs — overlay temporário de um prototype/ no kit.
 *
 * REGRA DO PROJETO: 100% dos arquivos de uma jornada vivem em
 * specs/<dominio>/<cap>/prototype/ (fonte única). O kit vendorizado NUNCA
 * guarda arquivo de jornada fora de um overlay temporário de validação.
 *
 * Uso:
 *   node scripts/restore-prototype.mjs <dominio>/<cap>   # copia + fia
 *   node scripts/restore-prototype.mjs --clean <dominio>/<cap>  # reverte tudo
 *
 * O restore:
 *  1. copia prototype/{page,data,ui}/ → src/modules/{page,data,ui}/
 *  2. aplica a fiação de prototype/README.md (routes/apps/app.js) com
 *     marcadores, de forma idempotente (rodar 2x não duplica)
 * O clean:
 *  1. apaga do kit só os diretórios copiados deste prototype
 *  2. remove os blocos de fiação marcados
 *  3. ao final, `git status` deve estar limpo de arquivos da jornada
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROJECT_ROOT = path.resolve(KIT_ROOT, '../../../..');

const MARK_START = '// >>> PROTOTYPE-OVERLAY-START';
const MARK_END = '// <<< PROTOTYPE-OVERLAY-END';

function fail(msg) {
  console.error(`[restore-prototype] ERRO: ${msg}`);
  process.exit(1);
}

function protoDir(spec) {
  return path.join(PROJECT_ROOT, 'specs', ...spec.split('/'), 'prototype');
}

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function rmDir(p) {
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}

// Lê os blocos de fiação do prototype/README.md (blocos ```js com SECTION:).
// Formato esperado no README:
// ```js
// // SECTION: routes
// {...}
// ```
// ```js
// // SECTION: apps
// {...}
// ```
// ```js
// // SECTION: appjs-import
// import X from '...';
// // SECTION: appjs-route
// 'tag': Ctor,
function parseWiring(readme) {
  const sections = {};
  const re = /```js\n([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(readme)) !== null) {
    const block = m[1];
    const sm = block.match(/\/\/ SECTION: (\S+)/);
    if (sm) sections[sm[1]] = block.trim();
  }
  return sections;
}

function stripOverlay(content) {
  // Consome a quebra de linha ANTES do marcador (a injeção adiciona
  // `\n${MARK_START}...${MARK_END}` após a âncora), restaurando byte a byte.
  const re = new RegExp(`\\r?\\n^${MARK_START}$.*?^${MARK_END}$`, 'gms');
  return content.replace(re, '');
}

function injectOverlay(file, anchorRe, block) {
  let content = fs.readFileSync(file, 'utf8');
  content = stripOverlay(content); // idempotente
  const marked = `${MARK_START}\n${block}\n${MARK_END}`;
  if (!anchorRe.test(content)) {
    fail(`Âncora não encontrada em ${path.relative(KIT_ROOT, file)} para injetar overlay.`);
  }
  content = content.replace(anchorRe, (a) => `${a}\n${marked}`);
  fs.writeFileSync(file, content, 'utf8');
}

function restore(spec) {
  const proto = protoDir(spec);
  if (!fs.existsSync(proto)) fail(`prototype/ não encontrado: ${proto}`);
  const copied = [];
  for (const ns of ['page', 'data', 'ui']) {
    const srcNs = path.join(proto, ns);
    if (!fs.existsSync(srcNs)) continue;
    for (const comp of fs.readdirSync(srcNs)) {
      const s = path.join(srcNs, comp);
      if (!fs.statSync(s).isDirectory()) continue;
      const d = path.join(KIT_ROOT, 'src/modules', ns, comp);
      copyDir(s, d);
      copied.push(`src/modules/${ns}/${comp}/`);
    }
  }
  if (!copied.length) fail(`Nenhum componente em ${proto}/ — esperado page/, data/ ou ui/.`);

  const readmePath = path.join(proto, 'README.md');
  if (!fs.existsSync(readmePath)) fail(`prototype/README.md ausente em ${proto} — a fiação deve estar documentada lá.`);
  const sections = parseWiring(fs.readFileSync(readmePath, 'utf8'));
  for (const s of ['routes', 'apps', 'appjs-import', 'appjs-route']) {
    if (!sections[s]) fail(`prototype/README.md sem bloco "// SECTION: ${s}".`);
  }

  injectOverlay(
    path.join(KIT_ROOT, 'src/routes.config.js'),
    /export const routes = \[/,
    sections.routes
  );
  injectOverlay(
    path.join(KIT_ROOT, 'src/apps.config.js'),
    /export const apps = \[/,
    sections.apps
  );
  const appjs = path.join(KIT_ROOT, 'src/modules/shell/app/app.js');
  injectOverlay(appjs, /import NotFound from 'page\/notFound';/, sections['appjs-import']);
  injectOverlay(appjs, /'page-builder': Builder,/, sections['appjs-route']);

  console.log(`[restore-prototype] Overlay aplicado de specs/${spec}/prototype/:`);
  for (const c of copied) console.log(`  + ${c}`);
  console.log('  + fiação marcada em routes.config.js, apps.config.js, shell/app/app.js');
  console.log('[restore-prototype] Valide com: npm run build && npm run open -- /<rota>');
  console.log('[restore-prototype] Depois reverta com: node scripts/restore-prototype.mjs --clean ' + spec);
}

function clean(spec) {
  const proto = protoDir(spec);
  if (!fs.existsSync(proto)) fail(`prototype/ não encontrado: ${proto}`);
  const removed = [];
  for (const ns of ['page', 'data', 'ui']) {
    const srcNs = path.join(proto, ns);
    if (!fs.existsSync(srcNs)) continue;
    for (const comp of fs.readdirSync(srcNs)) {
      const d = path.join(KIT_ROOT, 'src/modules', ns, comp);
      if (fs.existsSync(d)) {
        rmDir(d);
        removed.push(`src/modules/${ns}/${comp}/`);
      }
    }
  }
  for (const f of [
    path.join(KIT_ROOT, 'src/routes.config.js'),
    path.join(KIT_ROOT, 'src/apps.config.js'),
    path.join(KIT_ROOT, 'src/modules/shell/app/app.js'),
  ]) {
    if (!fs.existsSync(f)) continue;
    const before = fs.readFileSync(f, 'utf8');
    const after = stripOverlay(before);
    if (after !== before) {
      fs.writeFileSync(f, after, 'utf8');
      removed.push(path.relative(KIT_ROOT, f) + ' (bloco overlay removido)');
    }
  }
  if (!removed.length) console.log('[restore-prototype] Nada a limpar — kit já sem overlay desta jornada.');
  else {
    console.log('[restore-prototype] Removido:');
    for (const r of removed) console.log(`  - ${r}`);
  }
  console.log('[restore-prototype] Confira: git status deve estar limpo de arquivos da jornada.');
}

const args = process.argv.slice(2);
if (args[0] === '--clean' && args[1]) clean(args[1]);
else if (args[0] && !args[0].startsWith('--')) restore(args[0]);
else {
  console.error('Uso: node scripts/restore-prototype.mjs <dominio>/<cap> | --clean <dominio>/<cap>');
  process.exit(1);
}
