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
    const socket = perudo.sockets[socketKey]

    const game = socket.game || {};
    const player = (game.players || []).find(p => p.id === socket.id);

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
          games: games.perudo.map(g => ({
            ...g,
            players: (g.players || []).map(p => ({
              name: p.name,
              idx: p.idx,
              connected: !!p.id,
            }))
          }))
        }
      )
    }
  }
}

let games = {};
perudo.on('connection', (socket) => {
  if (!games.perudo) {
    games.perudo = [];
  }

  broadcast();
  const id = socket.id;

  socket.on('disconnect', () => {
    const game = socket.game || {};
    const player = (game.players || []).find(p => p.id === id)
    if (player) {
      game.addEvent({
        event: 'playerDisconnect',
        name: player.name,
      })
      player.id = null;
      socket.game = null;
    }
    broadcast();
  })

  socket.on('mainAction', ({ action, ...data }) => {
    if (action === 'selectPlayer') {
      let game = games.perudo.find(g => g.uuid = data.gameUuid)
      let player = game.players[data.idx];
      if (!player.id) {
        game.addEvent({
          event: 'playerJoined',
          name: player.name,
        });
        player.id = id;
      } else {
        socket.emit('game_error', 'Ce joueur est déjà dans la partie.')
      }
      socket.game = game;
    } else if (action === 'newPlayer') {
      let game = games.perudo.find(g => g.uuid = data.gameUuid)
      if (game.started) {
        socket.emit('game_error', 'Trop tard, la partie a déjà démarré')
      } else {
        game.addEvent({
          event: 'newPlayer',
          name: data.name,
        });
        game.addPlayer(id, data.name);
        socket.game = games.perudo.find(g => g.uuid = data.gameUuid);
      }
    } else if (action === 'newGame') {
      let game = new Perudo();
      game.uuid = uuid();
      game.name = data.name;
      game.ts = Date.now();
      games.perudo.push(game);
    }
    broadcast();
  })

  socket.on('gameAction', (data) => {
    console.log('action', data.action, data);

    let game = socket.game || {};
    let player = (game.players || []).find(p => p.id === id);

    if (!player) {
      socket.send('game_error', 'Vous n\'avez pas rejoint de partie')
    }

    try {
      game.perform(id, data)
    } catch(error) {
      console.error(error);
      socket.emit('game_error', error.message)
    }
    broadcast();
  });
});

app.use(express.static(path.join(__dirname, '..', 'build')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const port = process.env.PORT || 3090
http.listen(port, () => {
});

