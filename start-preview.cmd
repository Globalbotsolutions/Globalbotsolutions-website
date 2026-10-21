@echo off
title Global Bot Solutions - local preview
cd /d "%~dp0"
echo.
echo  Global Bot Solutions - local preview (nothing is deployed)
echo.
where node >nul 2>nul
if %errorlevel%==0 (
  node build.mjs
  echo.
  echo  Open this in your browser:  http://localhost:8788
  echo  Spanish version:            http://localhost:8788/es/
  echo  Close this window to stop the preview.
  echo.
  start "" http://localhost:8788
  set DEV_FAKE_EMAIL=1
  node scripts\dev-server.mjs
  goto :end
)
where python >nul 2>nul
if %errorlevel%==0 (
  echo  Node.js not found - using Python instead. The quote form will not send in this mode.
  echo  Open this in your browser:  http://localhost:8788
  echo.
  start "" http://localhost:8788
  python -m http.server 8788 --bind 127.0.0.1 --directory dist
  goto :end
)
echo  Node.js is not installed. Download the LTS version from https://nodejs.org , install it,
echo  then double-click start-preview.cmd again.
:end
pause
