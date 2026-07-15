from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, 'stock-cafe.db')

def db_action(sql, params=(), fetch=False, one=False):
    with sqlite3.connect(DB_FILE) as conn:
        res = conn.execute(sql, params)
        if fetch: return res.fetchone() if one else res.fetchall()
        conn.commit()

# 1. Mengambil data stok untuk ditampilkan di tabel kanan & isi dropdown kiri
@app.route('/api/stock', methods=['GET'])
def get_stock():
    rows = db_action("SELECT id, name, quantity, price FROM stock_data", fetch=True)
    return jsonify({"stock": [{"id": r[0], "name": r[1], "quantity": r[2], "price": r[3]} for r in rows]})

# 2. Fungsi Restock: Menambah angka stok dari menu yang dipilih (Bukan bikin menu baru!)
@app.route('/api/stock/tambah', methods=['POST'])
def add_stock():
    d = request.get_json() or {}
    idx, jumlah_tambah = d.get('id'), d.get('quantity')
    
    # Validasi input: ID harus ada, dan jumlah tambah harus berupa angka integer positif
    if idx is None or type(jumlah_tambah) is not int or jumlah_tambah <= 0:
        return jsonify({"error": "Data input tidak valid"}), 400
        
    # Ambil stok lama
    row = db_action("SELECT quantity FROM stock_data WHERE id = ?", (idx,), fetch=True, one=True)
    if not row: 
        return jsonify({"error": "Barang tidak ditemukan"}), 404
        
    # Akumulasikan stok lama + jumlah yang dipasok dari form
    stok_baru = row[0] + jumlah_tambah
    db_action("UPDATE stock_data SET quantity=? WHERE id=?", (stok_baru, idx))
    
    return jsonify({"message": "Stok berhasil ditambahkan!", "stok_baru": stok_baru}), 200

@app.route('/api/stock/order', methods=['POST'])
def reduce_stock():
    d = request.get_json() or {}
    idx, jumlah_kurang = d.get('id'), d.get('quantity')
    
    # Validasi input: ID harus ada, dan jumlah kurang harus berupa angka integer positif
    if idx is None or type(jumlah_kurang) is not int or jumlah_kurang <= 0:
        return jsonify({"error": "Data input tidak valid"}), 400
        
    # Ambil stok lama
    row = db_action("SELECT quantity FROM stock_data WHERE id = ?", (idx,), fetch=True, one=True)
    if not row: 
        return jsonify({"error": "Barang tidak ditemukan"}), 404
        
    # Kurangi stok lama dengan jumlah yang dipesan dari form
    stok_baru = row[0] - jumlah_kurang
    if stok_baru < 0:
        return jsonify({"error": "Stok tidak cukup!"}), 400
    
    db_action("UPDATE stock_data SET quantity=? WHERE id=?", (stok_baru, idx))
    
    return jsonify({"message": "Stok berhasil dikurangi!", "stok_baru": stok_baru}), 200
if __name__ == '__main__':
    app.run(debug=True, port=5000)