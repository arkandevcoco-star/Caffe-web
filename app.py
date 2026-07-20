from flask import Flask, render_template

app = Flask(__name__)

nama = "Arkan"



@app.route('/')
def index():
    return render_template('index.html', nama=nama,)

app.run(debug=True)