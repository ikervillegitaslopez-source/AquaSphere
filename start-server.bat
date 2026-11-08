@echo off
title AquaSphere Shopify Dropshipping Server
cd /d "%~dp0"
echo ========================================================
echo   Launching AquaSphere Dropshipping Store on Localhost
echo ========================================================
echo Opening browser...
start http://localhost:3000
node server.js
pause
