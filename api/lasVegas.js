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
        dices: {},
      });
    }
    this.colors = [
      'red', 'blue', 'purple', 'green', 'black', 'orange',
    ];
  }

  stateFor(playerId) {
    const me = this.players.find(p => p.id === playerId);
    return {
      results: this.results,
      players: this.players,
      casinos: this.casinos,
      me: me,
      currentPlayer: {
        color: (this.currentPlayer() || {}).color,
        roll: (this.currentPlayer() || {}).roll,
        name: (this.currentPlayer() || {}).name,
      },
    };
  }


  emptyPlayer() {
    return {
      diceCount: 8,
      earnings: [],
      roll: null,
      color: this.colors.shift(),
      canPlay: function() { return this.diceCount > 0 },
    };
  }

  moveToNextPlayer() {
    try {
      this.currentPlayerIdx = this.nextPlayer().idx;
    } catch {
    }
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
      this.bet(payload.value)
    } else if (action === 'roll') {
      this.roll()
    } else if (action === 'startGame') {
      this.startGame();
    } else if (action === 'distribute') {
      this.distribute();
    }
  }

  roll() {
    this.currentPlayer().roll = [];
    for(let i = 0; i < this.currentPlayer().diceCount; i++) {
      this.currentPlayer().roll.push(this.rollDice());
    }

    this.currentPlayer().roll.sort();

    this.currentPlayer().actions = ['bet'];
  }

  bet(val) {
    let h = [0, 0, 0, 0, 0, 0, 0];
    for (let dice of this.currentPlayer().roll) {
      h[dice] += 1;
    }

    if (h[val] === 0) {
      throw new Error(`Tu n'as pas de ${val} à miser !`);
    }

    this.currentPlayer().diceCount -= h[val];
    let casino = this.casinos.find(c => c.i === val);
    if (!(this.currentPlayer().idx in casino.dices)) {
      casino.dices[this.currentPlayer().idx] = 0
    }
    casino.dices[this.currentPlayer().idx] += h[val];

    this.currentPlayer().actions = [];
    this.currentPlayer().roll = null;

    this.moveToNextPlayer();
    if (this.players.every(p => !p.canPlay())) {
      this.currentPlayer().actions = ['distribute'];
    } else {
      this.currentPlayer().actions = ['roll']
    }
  }

  distribute() {
    for (let casino of this.casinos) {
      let byCount = {};
      for (let playerIdx in casino.dices) {
        let c = casino.dices[playerIdx];
        if (!(c in byCount)) {
          byCount[c] = 0;
        }
        byCount[c] += 1;
      }

      let winners = [];
      for(let playerIdx in casino.dices) {
        if (byCount[casino.dices[playerIdx]] === 1) {
          winners.push({
            playerIdx,
            count: casino.dices[playerIdx],
          });
        }
      }
      winners.sort((a, b) => b.count - a.count);
      console.log(byCount, winners, casino)

      for (let winner of winners) {
        if (casino.bills.length === 0) { break; }

        let bill = casino.bills.shift();
        this.players[winner.playerIdx].earnings.push(bill);
      }
    }

    if (this.currentRound < 4) {
      this.currentRound += 1;
      this.firstPlayerIdx = (1 + this.firstPlayerIdx) % this.players.length;
      this.currentPlayerIdx = this.firstPlayerIdx;

      for (let player of this.players) {
        player.diceCount = 8;
        player.actions = [];
      }

      for (let casino of this.casinos) {
        casino.dices = {};
        casino.bills = []
      }
      this.deal();
      this.currentPlayer().actions = ['roll'];
    } else {
      this.results = []
      for (let player of this.players) {
        this.results.push({
          name: player.name,
          total: player.earnings.reduce((acc, i) => acc + i, 0),
        });
      }
      this.results.sort((a, b) => b.total - a.total);
    }
  }

  deal() {
    for (let casino of this.casinos) {
      let value = 0;
      casino.bills = [];
      while (value < 50) {
        let v = this.deck.pop();
        casino.bills.push(v);
        value += v;
      }
      casino.bills.sort().reverse()
    }
  }

  startGame() {
    this.started = true;
    this.shuffleDeck();

    this.deal();

    this.firstPlayerIdx = Math.floor(Math.random() * this.players.length);
    this.currentPlayerIdx = this.firstPlayerIdx;

    this.addEvent({ message: `${this.players[0].name} a lancé la partie, c'est au tour de ${this.currentPlayer().name}` })

    for (let player of this.players) {
      player.actions = [];
    }

    this.currentPlayer().actions = ['roll'];
    this.currentRound = 1;
  }
}
