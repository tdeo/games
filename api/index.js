'use strict;'

import express from 'express';
import path from 'path';

export const app = express();
export const http = require('http').createServer(app);
export const io = require('socket.io')(http);

import Perudo from './perudo';

const uuid = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

const setupGame = (namespace, klass) => {
  let games = []
  let ioNamespace = io.of(namespace);

  const playerFor = (socket) => {
    if (!socket.game) {
      return null;
    }
    return (socket.game.players || []).find(p => p.id === socket.id);
  }

  const emit = (socket) => {
    const player = playerFor(socket);

    if (player) {
      socket.emit('state', {
        ...socket.game.stateFor(socket.id),
        audioMembers: socket.game.audioMembers,
        isAudioHost: socket.game.audioHost === socket.id,
        connected: true,
      });
    } else {
      socket.emit('state', {
        connected: false,
        games: games.map(g => ({
          uuid: g.uuid,
          name: g.name,
          players: (g.players || []).map(p => ({
            name: p.name,
            idx: p.idx,
            connected: !!p.id,
          })),
        })),
      });
    }
  }

  const gameBroadcast = (game) => {
    for (let k in ioNamespace.in(game.uuid).sockets) {
      emit(ioNamespace.in(game.uuid).sockets[k])
    }
  }

  const lobbyBroadcast = () => {
    gameBroadcast({ uuid: 'lobby '});
  }

  ioNamespace.on('connection', (socket) => {
    socket.join('lobby');

    emit(socket);

    socket.on('disconnect', () => {
      const player = playerFor(socket);

      if (socket.game) {
        socket.game.removeAudioMember(socket.id);
      }

      if (player) {
        socket.game.addEvent({
          event: 'playerDisconnect',
          name: player.name,
        });
        player.id = null;
        gameBroadcast(socket.game);
        socket.game = null;
      }
    });

    socket.on('mainAction', ({ action, ...data }) => {
      if (action === 'selectPlayer') {
        let game = games.find(g => g.uuid === data.gameUuid) || {};
        let player = (game.players || [])[data.idx];
        if (!player || player.id) {
          return socket.emit('game_error',
            'Ce joueur est déjà dans la partie',
          );
        }
        game.addEvent({
          event: 'playerJoined',
          name: player.name,
        });
        socket.game = game;
        player.id = socket.id;
        socket.join(game.uuid);
        socket.leave('lobby');
        gameBroadcast(game);
        lobbyBroadcast();
      } else if (action === 'newPlayer') {
        let name = data.name.trim();
        if (name === '') {
          return socket.emit('game_error', 'Il faut choisir un nom !');
        }
        let game = games.find(g => g.uuid === data.gameUuid) || {};
        if (game.started) {
          socket.emit('game_error', 'Trop tard, la partie a déjà démarrée')
        } else {
          game.addEvent({
            event: 'newPlayer',
            name: name,
          });
          game.addPlayer(socket.id, name);
          socket.game = game;
          socket.leave('lobby');
          socket.join(game.uuid);
          gameBroadcast(game);
          lobbyBroadcast();
        }
      } else if (action === 'newGame') {
        let name = data.name.trim();
        if (name === '') {
          return socket.emit('game_error', 'Il faut choisir un nom !');
        }

        let game = new klass();
        game.uuid = uuid();
        game.name = name;
        game.ts = Date.now();
        games.push(game);
        lobbyBroadcast();
      }
    });

    socket.on('audioAction', ({ action, candidate, sdp, to, from_uuid, to_uuid }) => {
      if (action !== 'icecandidate') {
        console.log(action, to, from_uuid, to_uuid)
      }
      ioNamespace.sockets[to].emit('audioAction', {
        action,
        sdp,
        candidate,
        from: socket.id,
        from_uuid: from_uuid,
        to_uuid: to_uuid,
      });
    })

    socket.on('gameAction', (data) => {
      let player = playerFor(socket);
      if (!player) {
        return socket.emit('game_error', 'Vous n\'êtes pas dans cette partie');
      }

      if (data.action === 'sendMessage') {
        socket.game.addMessage({
          name: player.name,
          message: data.message,
        });
      } else if (data.action === 'joinAudio') {
        socket.game.addAudioMember(socket.id)
      } else if (data.action === 'leaveAudio') {
        socket.game.removeAudioMember(socket.id);
      } else {
        try {
          socket.game.perform(socket.id, data);
        } catch(error) {
          socket.emit('game_error', error.message);
        }
      }
      gameBroadcast(socket.game);
    });
  });
}

setupGame('perudo', Perudo);

app.use(express.static(path.join(__dirname, '..', 'build')));

const port = process.env.PORT || 3090
http.listen(port, () => {});

