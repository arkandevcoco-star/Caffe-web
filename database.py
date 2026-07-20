import sqlite3

conn = sqlite3.connect("database/stock-cafe.db")

cursor = conn.cursor()

cursor.execute("SELECT * FROM menu")

hasil = cursor.fetchall()

print(hasil)



conn.close()