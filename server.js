// JavaScript Document

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Gebruik 'public' map voor HTML-bestanden
app.use(express.static('public'));

let buzzerOn = true; // standaard zijn buzzers 'aan'

io.on('connection', socket => {

    // Stuur direct de huidige buzzer-status naar nieuwe speler
    socket.emit(buzzerOn ? 'buzzersOn' : 'buzzersOff');

    socket.on('buzz', data => {
        io.emit('iemandHeeftGebuzzerd', data);
    });

    socket.on('buzzersOff', () => {
        buzzerOn = false;
        io.emit('buzzersOff');
    });

    socket.on('buzzersOn', () => {
        buzzerOn = true;
        io.emit('buzzersOn');
    });

    socket.on('resetBuzzers', () => {
        io.emit('reset');
    });

});


server.listen(process.env.PORT || 3000, () => {
     console.log('Server actief');
 });
