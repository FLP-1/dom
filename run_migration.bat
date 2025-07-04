@echo off
echo Ativando ambiente Anaconda domv1...
call "C:\ProgramData\Anaconda3\Scripts\activate.bat" domv1
echo Ambiente ativado!
echo Executando migração...
set DB_PASSWORD=FLP*2025
python scripts/add_nickname_column.py
pause 