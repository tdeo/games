'use strict';

import { uuid } from './index';

export default class Game {
  constructor() {
    this.players = [];
    this.events = [];
    this.messages = [];
    this.started = false;
    this.audioMembers = [];

    this.colors = [
      'red', 'blue', 'purple', 'green', 'black', 'orange',
    ];

    for (let i = this.colors.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * i);
      let t = this.colors[i];
      this.colors[i] = this.colors[j];
      this.colors[j] = t;
    }
  }

  addPlayer(id, name) {
    if (this.started) {
      return;
    }

    this.players.push({
      canPlay: () => true,
      ...this.emptyPlayer(),
      id: id,
      uuid: uuid(),
      idx: this.players.length,
      name: name,
      actions: (this.players.length === 0) ? ['startGame'] : [],
      color: this.colors.shift(),
    });
  }

  addAudioMember(id) {
    this.audioMembers.push(id);
  }

  removeAudioMember(id) {
    this.audioMembers = this.audioMembers.filter(e => e !== id);
  }

  addEvent(payload) {
    this.events.push({
      ts: Date.now(),
      ...payload,
    })
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
      i = (i - 1 + this.players.length) % this.players.length
      if (i === this.currentPlayerIdx) {
        throw new Error('Pas de joueur précédent')
      }
      if (this.players[i].canPlay()) {
        return this.players[i];
      }
    }
  }

  nextPlayer() {
    let i = this.currentPlayerIdx;
    while (true) {
      i = (i + 1) % this.players.length
      if (i === this.currentPlayerIdx) {
        throw new Error('Pas de joueur suivant')
      }
      if (this.players[i].canPlay()) {
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
