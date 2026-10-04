#!/usr/bin/env node
// verify-prototype.mjs — hook PostToolUse deste repo.
// ---------------------------------------------------------------------------
// `fsc-html-prototyper.md` (passo 6) já documenta a cadeia de verificação do
// protótipo — build real, SLDS linter e confirmação de que o componente da
// jornada está mesmo embarcado no bundle — mas até aqui era um passo manual
// do agente. Este hook dispara automaticamente depois de qualquer Edit/Write
// sob o `src/` do kit vendorizado (overlay de validação aplicado por
// `scripts/restore-prototype.mjs`) ou sob `prototype/` de uma capacidade,
// para que a cadeia rode a cada edição em vez de depender do agente lembrar.
//
// Honesto sobre o limite: isto é verificação técnica (compila? lint limpo?
// componente no bundle?), não o scorecard de acessibilidade completo nem o
// gate de validação com o usuário — esses continuam no processo descrito em
// fsc-html-prototyper.md. Nunca toca em nada fora do kit/prototype, nunca
// escreve metadata real (.claude/rules/journey-designer.md).
// ---------------------------------------------------------------------------

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const KIT_DIR = '.claude/skills/salesforce-ux/design-system-2-starter-kit';

function isPrototypeSource(filePath) {
  if (!filePath) return false;
  const p = String(filePath).replace(/\\/g, '/');
  return (
    /design-system-2-starter-kit\/src\//.test(p) ||
    /\/prototype\/(page|ui|data)\//.test(p)
  );
}

function run(cmd, cwd) {
  try {
    const out = execSync(cmd, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { ok: true, out };
  } catch (err) {
    return { ok: false, out: (err.stdout || '') + (err.stderr || err.message || '') };
  }
}

function finish(blocking, reason) {
  if (blocking) {
    process.stderr.write(reason + '\n');
    process.exit(2); // exit 2: blocking, feeds stderr back to Claude as context.
  }
  if (reason) process.stdout.write(reason + '\n');
  process.exit(0);
}

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => (raw += chunk));
process.stdin.on('end', () => {
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return finish(false, '');
  }

  const toolName = payload?.tool_name;
  if (toolName !== 'Write' && toolName !== 'Edit') return finish(false, '');

  const filePath = payload?.tool_input?.file_path || payload?.tool_input?.path;
  if (!isPrototypeSource(filePath)) return finish(false, '');

  if (!existsSync(KIT_DIR)) {
    return finish(
      false,
      `verify-prototype: ${KIT_DIR} não encontrado — pulando cadeia de verificação (edição fora do overlay aplicado?).`
    );
  }

  const problems = [];

  // 1) Build real (step 6 do fsc-html-prototyper.md).
  const build = run('npm run build', KIT_DIR);
  if (!build.ok) {
    problems.push(`npm run build falhou:\n${build.out.slice(-2000)}`);
  }

  // 2) SLDS linter sobre o arquivo tocado (apenas .html/.css).
  if (/\.(html|css)$/.test(filePath)) {
    const lint = run(`npx @salesforce-ux/slds-linter@latest lint "${filePath}"`, process.cwd());
    if (!lint.ok) {
      problems.push(`slds-linter encontrou problemas em ${filePath}:\n${lint.out.slice(-2000)}`);
    }
  }

  // 3) Bundle-check: o build só prova "compilou", não que o componente da
  // jornada ficou embarcado (wiring incompleto gera exit 0 com bundle vazio).
  if (build.ok) {
    const base = path.basename(filePath, path.extname(filePath));
    const kebab = base.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    const distDir = path.join(KIT_DIR, 'dist');
    if (existsSync(distDir)) {
      const grep = run(`grep -rl "${kebab}" dist/`, KIT_DIR);
      if (!grep.ok) {
        problems.push(
          `grep não encontrou a tag "${kebab}" em ${distDir} — confirme manualmente se o wiring (routes/apps/app.js) está completo antes de considerar o protótipo validado.`
        );
      }
    }
  }

  if (problems.length > 0) {
    return finish(
      true,
      [
        'verify-prototype: cadeia de verificação (fsc-html-prototyper.md, passo 6) encontrou pendências após este Edit/Write:',
        ...problems,
      ].join('\n\n')
    );
  }

  return finish(
    false,
    'verify-prototype: build + SLDS linter + bundle-check OK para este arquivo.'
  );
});
