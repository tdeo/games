'use strict';

import Game from './game';

export default class LasVegas extends Game {
  constructor() {
    super();

    this.deck = []
    for (let i = 0; i < 5; i++) {
      this.deck.push(60);
      this.deck.push(70);
      this.deck.push(80);
      this.deck.push(90);
    }
    for (let i = 0; i < 6; i++) {
      this.deck.push(10);
      this.deck.push(40);
      this.deck.push(50);
    }
    for (let i = 0; i < 8; i++) {
      this.deck.push(20);
      this.deck.push(30);
    }
    this.firstPlayerIdx = null;
    this.casinos = [];
    for (let i = 1; i <= 6; i++) {
      this.casinos.push({
        i: i,
        bills: [],
        dices: [],
      });
    }
  }

  emptyPlayer() {
    return {
      diceCount: 8,
      roll: null,
      canPlay: function() { return this.diceCount > 0 },
    };
  }

  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * i);
      let t = this.deck[i];
      this.deck[i] = this.deck[j];
      this.deck[j] = t;
    }
  }

  perform(playerId, payload) {
    const action = payload.action;

    const player = this.players.find(p => p.id === playerId);
    if (!player) {
      return;
    }
    if (player.actions.findIndex(e => e === action) === -1) {
      throw new Error('Vous ne pouvez pas jouer cette action pour l\'instant')
    }

    if (action === 'bet') {
      this.bet(payload)
    } else if (action === 'roll') {
      this.roll(playerId)
    } else if (action === 'startGame') {
      this.startGame();
    }
  }

  roll(playerId) {
    let player = this.players.find(e => e.id === playerId);

    player.roll = [];
    for(let i = 0; i < player.diceCount; i++) {
      player.roll.push(this.rollDice());
    }

    player.actions = ['bet'];
  }

  startGame() {
    this.started = true;
    this.shuffleDeck();

    for (let casino of this.casinos) {
      let value = 0;
      while (value < 50) {
        let v = this.deck.pop();
        casino.bills.push(v);
        value += v;
      }
      casino.bills.sort().reverse()
    }

    this.firstPlayerIdx = Math.floor(Math.random() * this.players.length);
    this.currentPlayerIdx = firstPlayerIdx;

    this.addEvent({ message: `${this.players[0].name} a lancé la partie, c'est au tour de ${this.currentPlayer().name}` })

    this.currentPlayer().actions = 'roll';
  }
}
