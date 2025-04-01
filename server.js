

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

io.on('connection', socket => {

    // Speler joint een specifieke game room
    socket.on('joinGame', (gameCode) => {
    socket.join(gameCode.toString()); // Zet gameCode om naar string
    console.log(`Speler aangesloten op game ${gameCode}`);
});

    // Buzzers AAN
socket.on('buzzersOn', (gameCode) => {
    io.to(gameCode.toString()).emit('buzzersOn'); // Zorg ervoor dat gameCode als string wordt verzonden
});

socket.on('buzzersOff', (gameCode) => {
    io.to(gameCode.toString()).emit('buzzersOff'); // Zorg ervoor dat gameCode als string wordt verzonden
});

    // Speler drukt op de buzzer
    socket.on('buzz', (data) => {
        io.to(data.gameCode).emit('iemandHeeftGebuzzerd', { naam: data.naam, team: data.team });
    });

});

server.listen(process.env.PORT || 3000, () => {
    console.log('Server actief op http://localhost:3000 of op je Render/Heroku URL');
});
