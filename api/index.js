'use strict;';

import path from 'path';

import express from 'express';

import HouseKeeper from './houseKeeper';

import LasVegas from './games/lasVegas';
import Perudo from './games/perudo';
import Yahtzee from './games/yahtzee';

export const app = express();
export const http = require('http').createServer(app);

export const io = require('socket.io')(http);

const LOBBY = 'lobby';

export const uuid = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

const setupGame = (namespace, Klass) => {
  let games = [];
  const houseKeeper = new HouseKeeper(namespace, Klass);

  houseKeeper.loadGames().then(res => {
    games = res;
  });

  const ioNamespace = io.of(namespace);

  const playerFor = (socket) => {
    if (!socket.game) {
      return null;
    }
    return (socket.game.players || []).find(p => p.socketId === socket.id);
  };

  const emit = (socket) => {
    const player = playerFor(socket);

    if (player) {
      socket.emit('state', {
        ...socket.game.stateFor(socket.id),
        audioMembers: socket.game.audioMembers,
        messages: socket.game.messages,
        events: socket.game.events,
        started: socket.game.started,
        connected: true,
      });
    } else {
      socket.emit('state', {
        connected: false,
        games: games.sort((a, b) => b.createdAt - a.createdAt).map(g => ({
          uuid: g.uuid,
          name: g.name,
          players: (g.players || []).map(p => ({
            name: p.name,
            idx: p.idx,
            connected: !!p.socketId,
          })),
        })),
      });
    }
  };

  const gameBroadcast = (game) => {
    if (game.uuid !== LOBBY) {
      houseKeeper.saveGame(game);
    }
    for (const k in ioNamespace.in(game.uuid).sockets) {
      emit(ioNamespace.in(game.uuid).sockets[k]);
    }
  };

  const lobbyBroadcast = () => {
    gameBroadcast({ uuid: LOBBY });
  };

  ioNamespace.on('connection', (socket) => {
    socket.join(LOBBY);

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
        player.socketId = null;
        gameBroadcast(socket.game);
        if (socket.game.results &&
          socket.game.players.every(p => !p.socketId)) {
          games = games.filter(g => g.uuid !== socket.game.uuid);
        }
        socket.game = null;
      }
    });

    socket.on('mainAction', ({ action, ...data }) => {
      if (action === 'selectPlayer') {
        const game = games.find(g => g.uuid === data.gameUuid) || {};
        const player = (game.players || [])[data.idx];
        if (!player || player.socketId) {
          return socket.emit('game_error',
            'Ce joueur est déjà dans la partie',
          );
        }
        game.addEvent({
          event: 'playerJoined',
          name: player.name,
        });
        socket.game = game;
        player.socketId = socket.id;
        socket.join(game.uuid);
        socket.leave(LOBBY);
        gameBroadcast(game);
        lobbyBroadcast();
      } else if (action === 'newPlayer') {
        const name = data.name.trim();
        if (name === '') {
          return socket.emit('game_error', 'Il faut choisir un nom !');
        }
        const game = games.find(g => g.uuid === data.gameUuid) || {};
        if (game.started) {
          socket.emit('game_error', 'Trop tard, la partie a déjà démarrée');
        } else {
          game.addEvent({
            event: 'newPlayer',
            name: name,
          });
          game.addPlayer(socket.id, name);
          socket.game = game;
          socket.leave(LOBBY);
          socket.join(game.uuid);
          gameBroadcast(game);
          lobbyBroadcast();
        }
      } else if (action === 'newGame') {
        const name = data.name.trim();
        if (name === '') {
          return socket.emit('game_error', 'Il faut choisir un nom !');
        }

        const game = new Klass();
        game.uuid = uuid();
        game.name = name;
        game.ts = Date.now();
        games.push(game);
        lobbyBroadcast();
      }
    });

    socket.on('audioAction', ({ action, candidate, sdp, to, fromUuid, toUuid }) => {
      ioNamespace.sockets[to].emit('audioAction', {
        action,
        sdp,
        candidate,
        from: socket.id,
        fromUuid: fromUuid,
        toUuid: toUuid,
      });
    });

    socket.on('gameAction', (data) => {
      const player = playerFor(socket);
      if (!player) {
        return socket.emit('game_error', 'Vous n\'êtes pas dans cette partie');
      }

      if (data.action === 'sendMessage') {
        socket.game.addMessage({
          name: player.name,
          uuid: player.uuid,
          message: data.message,
        });
      } else if (data.action === 'joinAudio') {
        socket.game.addAudioMember(socket.id);
      } else if (data.action === 'leaveAudio') {
        socket.game.removeAudioMember(socket.id);
      } else {
        try {
          socket.game.perform(socket.id, data);
          socket.game.lastAction = Date.now();
        } catch (error) {
          console.log(socket.game); /* eslint-disable-line no-console */
          console.error(error);
          socket.emit('game_error', error.message);
        }
      }
      gameBroadcast(socket.game);
    });
  });
};

setupGame('lasvegas', LasVegas);
setupGame('perudo', Perudo);
setupGame('yahtzee', Yahtzee);

app.use(express.static(path.join(__dirname, '..', 'build')));

const port = process.env.PORT || 3090;
http.listen(port, () => {});
