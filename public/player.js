
const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const gameCode = urlParams.get('gameCode').toString();
const spelerNaam = urlParams.get('speler') || "Speler";
const teamNaam = urlParams.get('team') || "geen team";

// Meld je aan bij de juiste game-room
socket.emit('joinGame', gameCode);

// Elementen ophalen
const buzzerButton = document.getElementById('buzzerButton');
const statusText = document.getElementById('statusText');
const buzzSound = new Audio('buzz.mp3');

// Zet naam en team op het scherm
document.getElementById('spelerNaam').innerText = spelerNaam;
document.getElementById('teamNaam').innerText = teamNaam;

// Buzzers aan
socket.on('buzzersOn', () => {
    console.log("Buzzers zijn AAN");  // Voeg deze log toe
    buzzerButton.disabled = false;
    buzzerButton.style.background = "red";
    buzzerButton.innerText = "BUZZ";
    statusText.innerText = "BUZZER ACTIEF!";
    statusText.style.background = "green";
});


// Buzzers uit
socket.on('buzzersOff', () => {
    buzzerButton.disabled = true;
    buzzerButton.style.background = "grey";
    buzzerButton.innerText = "READY";
    statusText.innerText = "Wacht op host...";
    statusText.style.background = "red";
});

// Klik op buzzer
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

    setTimeout(() => {
        buzzerButton.classList.remove('buzzed');
    }, 300);
};
