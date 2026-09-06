@echo off
REM Wrapper de duplo-clique (Windows) — abre o prototipo no navegador.
REM Uso: duplo-clique, ou: abrir-prototipo.cmd /demo
cd /d "%~dp0"
call npm run open -- %*
if errorlevel 1 pause
