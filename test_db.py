import psycopg2

try:
    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        dbname="db_dom",
        user="postgres",
        password="FLP*2025"
    )
    print("Conexão OK")
    conn.close()
except Exception as e:
    print("Erro ao conectar:", e) 