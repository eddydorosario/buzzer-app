const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const gameCode = urlParams.get('gameCode');
const spelerNaam = urlParams.get('naam') || "Speler";
const teamNaam = urlParams.get('team') || "geen team";

// Meld je aan bij de juiste game
socket.emit('joinGame', gameCode);

// Koppel aan HTML
document.getElementById('spelerNaam').innerText = spelerNaam;
document.getElementById('teamNaam').innerText = teamNaam;

const buzzerButton = document.getElementById('buzzerButton');
const statusText = document.getElementById('statusText');
const buzzSound = new Audio('buzz.mp3');

// Ontvang buzzersOn
socket.on('buzzersOn', () => {
    buzzerButton.disabled = false;
    buzzerButton.style.background = "red";
    buzzerButton.innerText = "BUZZ";
    statusText.innerText = "BUZZER ACTIEF!";
    statusText.style.background = "green";
});

// Ontvang buzzersOff
socket.on('buzzersOff', () => {
    buzzerButton.disabled = true;
    buzzerButton.style.background = "grey";
    buzzerButton.innerText = "READY";
    statusText.innerText = "Wacht op host...";
    statusText.style.background = "red";
});

// Druk op de buzzer
buzzerButton.onclick = () => {
    buzzerButton.disabled = true;
    statusText.innerText = "Je hebt gebuzzed!";
    buzzerButton.classList.add('buzzed');
    buzzSound.play();

    socket.emit('buzz', { 
        gameCode: gameCode, 
        naam: spelerNaam, 
        team: teamNaam 
    });

    // Reset animatie
    setTimeout(() => {
        buzzerButton.classList.remove('buzzed');
    }, 300);
};
