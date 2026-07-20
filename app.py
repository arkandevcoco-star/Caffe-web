from flask import Flask, render_template

app = Flask(__name__)

nama = "Arkan"

menu = [
    {"name": "Latte", "price": 15000},
    {"name": "Cappuccino", "price": 12000},
    {"name": "Espresso", "price": 10000},
    {"name": "Americano", "price": 13000},
    {"name": "Mocha", "price": 16000},
    {"name": "Raffa", "price": 2000}
]

@app.route('/')
def index():
    return render_template('index.html', nama=nama, menu=menu)

app.run(debug=True)