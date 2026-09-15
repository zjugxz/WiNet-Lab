@echo off
setlocal
cd /d "%~dp0"
set "WINET_NODE=%~dp0.tools\node-v24.21.0-win-x64\node.exe"
if not exist "%WINET_NODE%" set "WINET_NODE=node"
if not exist "node_modules\astro\bin\astro.mjs" (
  echo Dependencies are missing. See README.md for setup instructions.
  pause
  exit /b 1
)
echo Winet Group local preview: http://127.0.0.1:4321/
echo Keep this window open. Press Ctrl+C to stop the preview.
"%WINET_NODE%" node_modules\astro\bin\astro.mjs dev --host 127.0.0.1 --port 4321
pause
