import sqlite3

conn = sqlite3.connect("database/stock-cafe.db")

cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS menu (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    harga INTEGER NOT NULL
)
""")
conn.commit()

conn.close()

print("database berhasil di buat")