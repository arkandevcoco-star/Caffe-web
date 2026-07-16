from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return "Halo, selamat datang di website saya"
@app.route("/profile")
def profile():
    return "this is profile page"

@app.route("/kontak")
def kontak():
    return "hubungi saya"

app.run(debug=True)