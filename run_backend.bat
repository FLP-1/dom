@echo off
echo Ativando ambiente Anaconda domv1...
call "C:\ProgramData\Anaconda3\Scripts\activate.bat" domv1
echo Ambiente ativado!
echo Iniciando backend FastAPI...
cd /d C:\dom-v1
uvicorn main:app --reload --host 0.0.0.0 --port 8000
pause 