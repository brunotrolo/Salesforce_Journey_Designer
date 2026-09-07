@echo off
REM Renderizador de prototipos — duplo clique abre no Google Chrome
REM Le specs/*/prototype, garante build, sobe preview e abre seletor + jornada no Chrome
setlocal
title Prototipos — Salesforce Journey Designer
pushd "%~dp0"
if errorlevel 1 (
  echo [ERRO] Nao consegui acessar "%~dp0"
  pause
  exit /b 1
)
where node >nul 2>nul
if errorlevel 1 (
  if exist "C:\Program Files\nodejs\node.exe" set "PATH=C:\Program Files\nodejs;%PATH%"
)
where node >nul 2>nul
if errorlevel 1 (
  echo [ERRO] Node.js nao encontrado. Instale Node 20+ em https://nodejs.org
  pause
  exit /b 1
)
echo [INFO] Iniciando renderizador de prototipos...
echo [INFO] Isso garante o build, sobe o preview e abre no Chrome.
echo.
node ".claude\skills\salesforce-ux\design-system-2-starter-kit\scripts\open-prototypes.mjs"
echo.
echo [INFO] Renderizador terminou com codigo %errorlevel%. Pressione qualquer tecla para fechar.
pause
