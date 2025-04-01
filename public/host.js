

const socket = io();
const buzzerButton = document.getElementById('toggleBuzzer');
const resetButton = document.getElementById('resetBuzzer');
const timerButton = document.getElementById('startTimer');
const stopTimerBtn = document.getElementById('stopTimer');
const resetTimerBtn = document.getElementById('resetTimer');
const fullResetButton = document.getElementById('fullReset');
const geefPuntenButton = document.getElementById('geefPunten');
const timerDisplay = document.getElementById('timerDisplay');
const statusText = document.getElementById('buzzerStatus');
const qrCanvas = document.getElementById('qrcode');
const gameCode = Math.floor(1000 + Math.random() * 9000);
socket.emit('joinGame', gameCode.toString()); // Zorg ervoor dat de gameCode als string wordt verzonden

document.getElementById('gameCode').innerText = gameCode;

let buzzerOn = false;
let timerInterval;
let timeLeft = 30;

// QR-code genereren
QRCode.toCanvas(qrCanvas, `${window.location.origin}/join.html?gameCode=${gameCode}`);

// BUZZER CONTROL
// Buzzers AAN
buzzerButton.onclick = () => {
    console.log("Buzzers worden AAN gezet voor game:", gameCode);  // Voeg deze log toe
    buzzerOn = !buzzerOn;
    socket.emit(buzzerOn ? 'buzzersOn' : 'buzzersOff', gameCode.toString());
    statusText.innerText = buzzerOn ? 'ON' : 'OFF';
    statusText.style.background = buzzerOn ? 'green' : 'red';
    buzzerButton.innerText = buzzerOn ? 'Buzzers UIT' : 'Buzzers AAN';
};


resetButton.onclick = () => {
    socket.emit('buzzersOff', gameCode);
    statusText.innerText = 'OFF';
    statusText.style.background = 'red';
    buzzerButton.innerText = 'Buzzers AAN';
    document.querySelector('#results tbody').innerHTML = '';
};

// TIMER CONTROL
timerButton.onclick = () => {
    clearInterval(timerInterval);
    timeLeft = 30;
    timerDisplay.innerText = `Timer: ${timeLeft} sec`;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `Timer: ${timeLeft} sec`;
        if(timeLeft <= 0) clearInterval(timerInterval);
    }, 1000);
};

stopTimerBtn.onclick = () => {
    clearInterval(timerInterval);
    timerDisplay.innerText = `Timer gestopt op ${timeLeft} sec`;
};

resetTimerBtn.onclick = () => {
    clearInterval(timerInterval);
    timerDisplay.innerText = "Nog geen timer gestart";
};

// BUZZ EVENTS
socket.on('iemandHeeftGebuzzerd', ({ naam, team }) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${document.querySelectorAll('#results tbody tr').length + 1}</td><td>${naam}</td><td>${team}</td><td contenteditable="true">0</td>`;

    tr.classList.add(`team-${team.toLowerCase()}`);

    document.querySelector('#results tbody').appendChild(tr);
});

// SCORE SYSTEEM
function sorteerTeams() {
    const tbody = document.querySelector('#teamScores tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    rows.sort((a, b) => parseInt(b.querySelector('.score').innerText) - parseInt(a.querySelector('.score').innerText));
    rows.forEach(row => tbody.appendChild(row));
}

function voegPuntenToe(team, punten) {
    let teamRow = document.querySelector(`#team-${team}`);
    if (!teamRow) {
        const tr = document.createElement('tr');
        tr.id = `team-${team}`;
        tr.innerHTML = `<td>${team}</td><td class="score">0</td>`;
        document.querySelector('#teamScores tbody').appendChild(tr);
        teamRow = tr;
    }
    const scoreCell = teamRow.querySelector('.score');
    scoreCell.innerText = parseInt(scoreCell.innerText) + punten;
    sorteerTeams();
}

geefPuntenButton.onclick = () => {
    const rows = document.querySelectorAll('#results tbody tr');
    rows.forEach((row, index) => {
        const team = row.children[2].innerText.trim();
        const punten = [20, 15, 10, 5][index] || 0;
        if (team) voegPuntenToe(team, punten);
    });
    alert("Punten automatisch toegekend!");
};

// RESET FULL
fullResetButton.onclick = () => {
    document.querySelector('#results tbody').innerHTML = '';
    document.querySelector('#teamScores tbody').innerHTML = '';
    clearInterval(timerInterval);
    timerDisplay.innerText = "Nog geen timer gestart";
    socket.emit('buzzersOff', gameCode);
    statusText.innerText = 'OFF';
    statusText.style.background = 'red';
    buzzerButton.innerText = 'Buzzers AAN';
    alert("Volledige reset uitgevoerd");
};
