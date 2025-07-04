@echo off
echo Testando backend DOM v1...
echo.

echo Ativando ambiente Anaconda domv1...
call "C:\ProgramData\Anaconda3\Scripts\activate.bat" domv1
echo Ambiente ativado!

echo.
echo Testando import do main.py...
python -c "import main; print('main.py importado com sucesso')"

echo.
echo Testando uvicorn...
python -c "import uvicorn; print('uvicorn disponível')"

echo.
echo Tentando iniciar o servidor...
uvicorn main:app --reload --host 0.0.0.0 --port 8000

pause 