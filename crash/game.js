// Funzione per iniziare una nuova partita
function startGame() {
    var airplane = document.querySelector('.airplane img');
    var multiplier = document.getElementById('multiplier-value');
    var cashOutBtn = document.getElementById('cash-out-btn');
    var betAmountInput = document.getElementById('bet-amount');
    var placeBetBtn = document.getElementById('place-bet-btn');
    var balanceDisplay = document.getElementById('balance');
    var gameInterval; // Variabile per memorizzare l'intervallo del gioco
    var gameInProgress = false; // Flag per indicare se il gioco è in corso

    // Probabilità di ottenere un determinato moltiplicatore
    var probabilities = {
        '1.00x': 0.98,
        '2.00x': 0.49,
        '3.00x': 0.3267,
        '4.00x': 0.245,
        '5.00x': 0.196,
        '10.00x': 0.098,
        '20.00x': 0.049,
        '40.00x': 0.0245
    };

    // Inizializza il moltiplicatore a 0
    multiplier.textContent = '0.00x';

    // Aggiungi un evento al pulsante "Scommetti"
    placeBetBtn.addEventListener('click', function() {
        // Verifica se il gioco è già in corso
        if (gameInProgress) {
            alert('Devi attendere che il gioco attuale termini prima di fare un\'altra scommessa.');
            return;
        }

        var betAmount = parseFloat(betAmountInput.value);

        // Verifica se la scommessa è un numero valido
        if (isNaN(betAmount) || betAmount <= 0) {
            alert('Inserisci una scommessa valida.');
            return;
        }

        // Verifica se il saldo è sufficiente per la scommessa
        var balance = parseFloat(balanceDisplay.textContent.substring(1)); // Rimuovi il simbolo '$' dal saldo e converti in numero
        if (balance < betAmount) {
            alert('Saldo insufficiente. Effettua una ricarica per continuare a giocare.');
            return;
        }

        // Sottrai la scommessa dal saldo del giocatore
        balance -= betAmount;
        balanceDisplay.textContent = '$' + balance.toFixed(2); // Aggiorna il saldo e converti in stringa con due decimali

        // Disabilita il pulsante "Scommetti" durante il gioco
        placeBetBtn.disabled = true;
        gameInProgress = true; // Imposta il flag del gioco in corso a true

        // Funzione per aggiornare il moltiplicatore e far salire l'aereo
        function updateMultiplier() {
            var currentMultiplier = parseFloat(multiplier.textContent); // Ottieni il moltiplicatore attuale come numero
            currentMultiplier += 0.01; // Incrementa il moltiplicatore di 0.01
            multiplier.textContent = currentMultiplier.toFixed(2) + 'x'; // Aggiorna il moltiplicatore con due decimali
            airplane.style.height = currentMultiplier + '%'; // Imposta l'altezza dell'aereo come percentuale
            // Verifica se il moltiplicatore corrente ha una probabilità di fermarsi
            if (Math.random() > probabilities[currentMultiplier.toFixed(2) + 'x']) {
                stopGame(); // Ferma il gioco
            }
        }

        // Aggiungi un evento al pulsante "Incassa"
        cashOutBtn.addEventListener('click', function() {
            // Verifica se il gioco è in corso
            if (gameInProgress) {
                stopGame();
            }
        });

        // Funzione per fermare il gioco e mostrare il messaggio di crash
        function stopGame() {
            clearInterval(gameInterval); // Interrompi il ciclo di gioco
            // Riabilita il pulsante "Scommetti"
            placeBetBtn.disabled = false;
            gameInProgress = false; // Imposta il flag del gioco in corso a false
            // Verifica se il moltiplicatore corrente è maggiore o uguale a 100
            if (parseFloat(multiplier.textContent) >= 100) {
                document.getElementById('crash-message').style.display = 'block'; // Mostra il messaggio di crash
                alert('Aereo caduto! Hai perso la tua scommessa.');
            }
            // Resetta il gioco
            airplane.style.height = '0%';
            multiplier.textContent = '0.00x';
        }

        // Avvia il gioco
        gameInterval = setInterval(updateMultiplier, 100); // Intervallo di 100 millisecondi per aggiornare il moltiplicatore
    });
}

// Avvia il gioco quando la pagina è completamente caricata
window.addEventListener('load', startGame);
