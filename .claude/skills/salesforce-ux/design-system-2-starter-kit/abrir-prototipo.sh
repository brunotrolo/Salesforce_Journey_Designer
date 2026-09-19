#!/usr/bin/env bash
# Wrapper de duplo-clique (Mac/Linux) — abre o prototipo no navegador.
# Uso: ./abrir-prototipo.sh /demo
set -e
cd "$(dirname "$0")"
npm run open -- "$@"
