import sqlite3

conn= sqlite3.connect("database/stock-cafe.db")
cursor = conn.cursor()

menu = [
    {"name": "Latte", "price": 15000, "stock": 10},
    {"name": "Cappuccino", "price": 12000, "stock": 10},
    {"name": "Espresso", "price": 10000, "stock": 10},
    {"name": "Americano", "price": 13000, "stock": 10},
    {"name": "Mocha", "price": 16000, "stock": 10},
    {"name": "Raffa", "price": 2000, "stock": 10}
]

cursor.executemany(
    """
    INSERT INTO menu (name, price, stock)
    VALUES (?, ?, ?)
    """,
    [(item["name"], item["price"], 10) for item in menu]
)
conn.commit()