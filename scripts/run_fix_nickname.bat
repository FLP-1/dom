@echo off
echo Executando correcao da coluna nickname...
echo.

REM Execute o script SQL diretamente no PostgreSQL
REM Substitua "123456" pela sua senha real
psql -h localhost -p 5432 -U postgres -d dom -f scripts/fix_nickname_psql.sql

echo.
echo Correcao concluida!
pause 