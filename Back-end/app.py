from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
    
app = Flask(__name__)
CORS(app)
DB_FILE = 'stock-cafe.db'

def query(sql, params=(), one=False):
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.execute(sql, params)
        return cursor.fetchone() if one else cursor.fetchall()

def execute(sql, params=()):
    with sqlite3.connect(DB_FILE) as conn:
        conn.execute(sql, params)
        conn.commit()

@app.route('/api/stock', methods=['GET'])
def get_stock():
    rows = query("SELECT id, name, quantity, price FROM stock_data")
    return jsonify({"stock": [{"id": r[0], "name": r[1], "quantity": r[2], "price": r[3]} for r in rows]})

@app.route('/api/stock/tambah', methods=['POST'])
def add_stock():
    data = request.get_json() or {}
    if not data.get('name') or not isinstance(data.get('quantity'), int) or not isinstance(data.get('price'), (int, float)):
        return jsonify({"error": "Invalid input data"}), 400
    execute("INSERT INTO stock_data (name, quantity, price) VALUES (?, ?, ?)", (data['name'], data['quantity'], data['price']))
    return jsonify({"message": "Stock added successfully"}), 201

@app.route('/api/stock/hapus/<int:id>', methods=['DELETE'])
def delete_stock(id):
    execute("DELETE FROM stock_data WHERE id=?", (id,))
    return jsonify({"message": "Stock deleted successfully"}), 200

@app.route('/api/stock/update-stok', methods=['POST'])
def update_stock_quantity():
    data = request.get_json() or {}
    id_barang = data.get('id')
    aksi = data.get('aksi')
    if id_barang is None or aksi not in ('tambah', 'kurang'):
        return jsonify({"error": "Data tidak lengkap"}), 400

    row = query("SELECT quantity FROM stock_data WHERE id = ?", (id_barang,), one=True)
    if not row:
        return jsonify({"error": "Barang tidak ditemukan"}), 404

    stok_baru = row[0] + (1 if aksi == 'tambah' else -1)
    if stok_baru < 0:
        stok_baru = 0
    execute("UPDATE stock_data SET quantity=? WHERE id=?", (stok_baru, id_barang))
    return jsonify({"message": "Stok berhasil diperbarui", "stok_baru": stok_baru}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
