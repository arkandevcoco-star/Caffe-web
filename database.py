import sqlite3

conn = sqlite3.connect("database.stock-cafe")

print("database berhasil terhubung")



conn.close()