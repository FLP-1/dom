@echo off
echo ========================================
echo    Configurando Novo Banco DOM v1
echo ========================================
echo.

echo 🔄 Ativando ambiente conda...
call activate_anaconda.bat

echo.
echo 🚀 Executando configuração do novo banco...
python scripts/setup_new_database.py

echo.
echo ✅ Configuração concluída!
echo.
echo 📋 Para testar o sistema:
echo    python main.py
echo.
pause 