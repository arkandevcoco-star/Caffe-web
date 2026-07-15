import sqlite3

conn = sqlite3.connect('stock-cafe.db')
cursor = conn.cursor()

cursor.execute('''CREATE TABLE IF NOT EXISTS stock_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL
)''')

menu_awal = [
    ("Expresso", 0, 15000.0),
    ("Americano", 0, 18000.0),
    ("Caffe Latte", 0, 25000.0),
    ("Cappuccino", 0, 20000.0),
    ("Latte", 0, 25000.0),
    ("Machiato", 0, 22000.0)
]
cursor.executemany("INSERT INTO stock_data (name, quantity, price) VALUES (?, ?, ?)", menu_awal)

conn.commit()
conn.close()
print("Database 'stock-cafe.db' berhasil dibuat dan diisi dengan data awal.")