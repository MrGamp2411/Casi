from flask import Flask, render_template
import random

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/gioca')
def gioca():
    dado1 = random.randint(1, 6)
    dado2 = random.randint(1, 6)
    somma_dadi = dado1 + dado2
    risultato = "Hai vinto!" if somma_dadi == 7 or somma_dadi == 11 else "Hai perso!"
    return render_template('gioca.html', dado1=dado1, dado2=dado2, somma_dadi=somma_dadi, risultato=risultato)

if __name__ == '__main__':
    app.run(debug=True)
