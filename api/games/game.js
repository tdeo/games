'use strict';

import { uuid } from '../index';

export default class Game {
  constructor() {
    this.players = [];
    this.events = [];
    this.messages = [];
    this.started = false;
    this.audioMembers = [];
    this.uuid = uuid();

    this.colors = [
      'red', 'blue', 'purple', 'green', 'black', 'orange', 'aqua',
    ];

    for (let i = this.colors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const t = this.colors[i];
      this.colors[i] = this.colors[j];
      this.colors[j] = t;
    }
  }

  deserialize(str) {
    const parsed = JSON.parse(str);

    for (const k in parsed) {
      this[k] = parsed[k];
    }
  }

  serialize() {
    return JSON.stringify({
      ...this,
      players: this.players.map(p => ({
        ...p,
        socketId: undefined,
      })),
    });
  }

  canPlay(player) {
    return true;
  }

  addPlayer(socketId, name) {
    if (this.started) {
      return;
    }

    this.players.push({
      ...this.emptyPlayer(),
      socketId: socketId,
      uuid: uuid(),
      idx: this.players.length,
      name: name,
      actions: (this.players.length === 0) ? ['startGame'] : [],
      color: this.colors.shift(),
    });
  }

  addAudioMember(socketId) {
    this.audioMembers.push(socketId);
  }

  removeAudioMember(socketId) {
    this.audioMembers = this.audioMembers.filter(e => e !== socketId);
  }

  addEvent(payload) {
    this.events.push({
      ts: Date.now(),
      ...payload,
    });
  }

  addMessage(payload) {
    this.messages.push({
      ts: Date.now(),
      ...payload,
    });
  }

  moveToNextPlayer() {
    this.currentPlayerIdx = this.nextPlayer().idx;
  }

  previousPlayer() {
    let i = this.currentPlayerIdx;
    while (true) {
      i = (i - 1 + this.players.length) % this.players.length;
      if (i === this.currentPlayerIdx) {
        throw new Error('Pas de joueur précédent');
      }
      if (this.canPlay(this.players[i])) {
        return this.players[i];
      }
    }
  }

  nextPlayer() {
    let i = this.currentPlayerIdx;
    while (true) {
      i = (i + 1) % this.players.length;
      if (i === this.currentPlayerIdx) {
        throw new Error('Pas de joueur suivant');
      }
      if (this.canPlay(this.players[i])) {
        return this.players[i];
      }
    }
  }

  currentPlayer() {
    return this.players[this.currentPlayerIdx];
  }

  rollDice() {
    return Math.floor(Math.random() * 6) + 1;
  }
}
