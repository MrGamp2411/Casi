const gridSize = 5; // Dimensione della griglia
let bet = 0; // Importo scommesso
let accountBalance = 100; // Saldo del conto
let correctCellsClicked = 0; // Numero di caselle corrette cliccate
let totalMines = 0; // Numero totale di mine sul campo

document.getElementById("start-button").addEventListener("click", startGame);
document.getElementById("finish-button").addEventListener("click", finishGame);

// Nascondi il pulsante "Termina gioco" all'inizio
document.getElementById("finish-button").style.display = "none";

function startGame() {
    // Resetta il numero di caselle corrette cliccate
    correctCellsClicked = 0;

    // Verifica se il pulsante "Termina gioco" deve essere nascosto
    if (correctCellsClicked === 0) {
        document.getElementById("finish-button").style.display = "none";
    }

    // Ottieni l'importo della scommessa inserito dall'utente
    bet = parseInt(document.getElementById("bet-input").value);

    // Verifica se l'importo della scommessa è un numero valido
    if (isNaN(bet) || bet <= 0) {
        alert("Per favore, inserisci un importo di scommessa valido.");
        return;
    }

    // Verifica se l'importo della scommessa supera il saldo del conto
    if (bet > accountBalance) {
        alert("Non hai abbastanza crediti per effettuare questa scommessa.");
        return;
    }

    // Imposta il saldo del conto e l'importo della scommessa
    accountBalance -= bet;
    document.getElementById("account-balance").textContent = accountBalance.toFixed(2);

    // Ottieni il numero di mine selezionato dall'utente
    let mines = parseInt(document.getElementById("mines-input").value);

    // Verifica se il numero di mine è superiore a 24
    if (mines > 24 || mines < 1) {
        alert("Il numero di mine deve essere compreso tra 1 e 24. Per favore, seleziona un numero valido.");
        return;
    }

    totalMines = mines; // Salva il numero totale di mine

    // Inizializza la griglia
    let grid = document.getElementById("grid-container");
    grid.innerHTML = "";
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener("click", revealCell);
            grid.appendChild(cell);
        }
    }

    // Posiziona le mine casualmente
    let minePositions = [];
    while (minePositions.length < mines) {
        let randomPosition = Math.floor(Math.random() * gridSize * gridSize);
        if (!minePositions.includes(randomPosition)) {
            minePositions.push(randomPosition);
        }
    }
    minePositions.forEach(position => {
        let row = Math.floor(position / gridSize);
        let col = position % gridSize;
        let mineCell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
        mineCell.dataset.hasMine = "true"; // Segna la cella come contenente una mina (non visibile)
    });

    // Nascondi il pulsante "Inizia gioco" e mostra il pulsante "Termina gioco"
    document.getElementById("start-button").style.display = "none";
    document.getElementById("finish-button").style.display = "inline-block";
}

function finishGame() {
    // Calcola il premio basato sul numero di mine sul campo e sulle caselle corrette cliccate
    let probability = 1;
    for (let i = 0; i < correctCellsClicked; i++) {
        probability *= (gridSize * gridSize - totalMines - i) / (gridSize * gridSize - i);
    }
    let prize = Math.round(97 * bet / probability) / 100; // Arrotonda a due cifre decimali

    // Aggiungi il premio al saldo del conto solo se il giocatore ha evitato almeno una mina
    if (correctCellsClicked > 0) {
        let roundedPrize = Number(prize.toFixed(2)); // Arrotonda il premio a due cifre decimali
        accountBalance += roundedPrize;
        // Mostra un messaggio con il risultato finale e il premio vinto
        alert(`Hai vinto ${roundedPrize.toFixed(2)} crediti! Il tuo saldo attuale è ${accountBalance.toFixed(2)} crediti.`);
    }

    // Resetta le variabili per un nuovo gioco
    bet = 0;
    correctCellsClicked = 0;
    totalMines = 0;

    // Nascondi il pulsante "Termina gioco"
    document.getElementById("finish-button").style.display = "none";
    // Mostra di nuovo il pulsante "Inizia gioco"
    document.getElementById("start-button").style.display = "inline-block";
}

function revealCell(event) {
    let cell = event.target;
    if (cell.dataset.hasMine === "true") {
        cell.textContent = "X";
        cell.style.backgroundColor = "red";
        alert("Boom! Hai colpito una mina. Gioco finito!");
        revealAllCells(); // Mostra tutte le caselle al giocatore
        // Nascondi il pulsante "Termina gioco" solo se il giocatore ha cliccato su una casella corretta
        if (correctCellsClicked > 0) {
            document.getElementById("finish-button").style.display = "none";
        }
        // Mostra di nuovo il pulsante "Inizia gioco"
        document.getElementById("start-button").style.display = "inline-block";
        return;
    } else {
        cell.textContent = ""; // Rimuove il testo dalla cella
        cell.classList.add("clicked"); // Aggiunge la classe "clicked" alla cella
        cell.removeEventListener("click", revealCell); // Rimuove l'event listener per evitare ulteriori clic
        correctCellsClicked++; // Incrementa il contatore delle caselle corrette cliccate
        // Verifica se il giocatore ha cliccato su almeno una casella corretta
        if (correctCellsClicked === 1) {
            // Attiva il pulsante "Termina gioco" solo se il giocatore ha cliccato su una casella corretta
            document.getElementById("finish-button").disabled = false;
        }
        let row = parseInt(cell.dataset.row);
        let col = parseInt(cell.dataset.col);
        // Aggiungi qui le azioni per rivelare la cella e gestire il gioco
    }
}

function revealAllCells() {
    let cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        if (cell.dataset.hasMine === "true") {
            cell.textContent = "X"; // Mostra le mine
            cell.style.backgroundColor = "red";
        } else {
            cell.classList.add("clicked"); // Aggiunge la classe "clicked" alle caselle vuote
        }
        cell.removeEventListener("click", revealCell); // Rimuove l'event listener per evitare ulteriori clic
    });
}
