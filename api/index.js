'use strict;'

import express from 'express';
import path from 'path';

export const app = express();
export const http = require('http').createServer(app);
export const io = require('socket.io')(http);

import Perudo from './perudo';

const perudo = io.of('perudo');

const uuid = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

const broadcast = () => {
  for (let socketKey in perudo.sockets) {
    let socket = perudo.sockets[socketKey]
    const player = game.players.find(p => p.id === socket.id);
    if (player) {
      perudo.sockets[socketKey].emit(
        'state',
        {
          ...game.stateFor(socket.id),
          connected: true,
        }
      );
    } else {
      perudo.sockets[socketKey].emit(
        'state',
        {
          connected: false,
          players: game.players.map(p => ({
            name: p.name,
            idx: p.idx,
            connected: !!p.id,
          }))
        }
      )
    }
  }
}

let game;
perudo.on('connection', (socket) => {
  if (!game) {
    game = new Perudo();
  }

  broadcast();
  const id = socket.id;

  socket.on('disconnect', () => {
    const player = game.players.find(p => p.id === id)
    if (player) {
      game.addEvent(`${player.name} s'est déconnecté`)
      player.id = null;
    }
    broadcast();
  })

  socket.on('selectPlayer', (data) => {
    console.log('selectPlayer', data)
    let player = game.players[data.idx];
    if (!player.id) {
      game.addEvent(`${player.name} s'est reconnecté`)
      player.id = id;
    }
    broadcast();
  })

  socket.on('newPlayer', (data) => {
    console.log('newPlayer', data)
    game.addEvent(`${data.name} a rejoint la partie`)
    game.addPlayer(id, data.name)
    broadcast();
  })

  socket.on('resetGame', (data) => {
    game = new Perudo();
    broadcast();
  })

  socket.on('action', (data) => {
    try {
      game.perform(id, data)
    } catch(error) {
      console.error(error);
      socket.emit('game_error', error.message)
    }
    broadcast();
  })
});

app.use(express.static(path.join(__dirname, '..', 'build')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const port = process.env.PORT || 3090
http.listen(port, () => {
});

