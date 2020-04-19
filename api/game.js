'use strict';

export default class Game {
  constructor() {
    this.players = [];
    this.events = [];
    this.messages = [];
    this.started = false;
  }

  addPlayer(id, name) {
    if (this.started) {
      return;
    }

    this.players.push({
      ...this.emptyPlayer(),
      id: id,
      idx: this.players.length,
      name: name,
      actions: (this.players.length === 0) ? ['startGame'] : [],
    });
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
}
