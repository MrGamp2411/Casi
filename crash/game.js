// Funzione per iniziare una nuova partita
function startGame() {
    var airplane = document.querySelector('.airplane img');
    var multiplier = document.getElementById('multiplier-value');
    var cashOutBtn = document.getElementById('cash-out-btn');
    var betAmountInput = document.getElementById('bet-amount');

    // Aggiungi un evento al pulsante "Scommetti"
    document.getElementById('place-bet-btn').addEventListener('click', function() {
        var betAmount = parseInt(betAmountInput.value);
        var balance = parseInt(document.getElementById('balance').textContent.substring(1)); // Rimuovi il simbolo '$' dal saldo
        var currentMultiplier = 1;

        // Funzione per aggiornare il moltiplicatore e far salire l'aereo
        function updateMultiplier() {
            currentMultiplier++;
            multiplier.textContent = currentMultiplier + 'x';
            airplane.style.height = currentMultiplier + 'px';
        }

        // Aggiungi un evento al pulsante "Incassa"
        cashOutBtn.addEventListener('click', function() {
            var winnings = betAmount * currentMultiplier;
            balance += winnings;
            document.getElementById('balance').textContent = '$' + balance;
            // Resetta il gioco
            airplane.style.height = '0px';
            currentMultiplier = 1;
            multiplier.textContent = '1x';
        });

        // Avvia il gioco
        var gameInterval = setInterval(function() {
            if (currentMultiplier < 100) {
                updateMultiplier();
            } else {
                // Se il moltiplicatore raggiunge 100, il gioco termina
                clearInterval(gameInterval); // Interrompi il ciclo di gioco
                alert('Aereo caduto! Hai perso la tua scommessa.');
                // Resetta il gioco
                airplane.style.height = '0px';
                currentMultiplier = 1;
                multiplier.textContent = '1x';
            }
        }, 1000);
    });
}

// Avvia il gioco quando la pagina è completamente caricata
window.addEventListener('load', startGame);
