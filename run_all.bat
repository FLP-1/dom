@echo off
echo Iniciando DOM v1 - Backend e Frontend
echo.

echo Ativando ambiente Anaconda domv1...
call "C:\ProgramData\Anaconda3\Scripts\activate.bat" domv1
echo Ambiente ativado!

echo.
echo Iniciando backend em uma nova janela...
start "Backend DOM v1" cmd /k "cd /d C:\dom-v1 && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo.
echo Aguardando 5 segundos para o backend inicializar...
timeout /t 5 /nobreak > nul

echo.
echo Iniciando frontend...
cd frontend
npm run dev

pause 