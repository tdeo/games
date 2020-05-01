'use strict';

import Game from './game';

export default class Perudo extends Game {
  constructor() {
    super();
    this.currentPlayerIdx = null;
    this.previousBet = null;
    this.previousTurn = null;
  }

  stateFor(socketId) {
    const me = this.players.find(p => p.socketId === socketId);
    return {
      players: this.players.map(p => ({
        ...p,
        roll: null,
      })),
      me: me,
      previousTurn: this.previousTurn,
      previousBet: this.previousBet,
    };
  }

  playerReady(player) {
    return player.diceCount === 0 || player.roll !== null;
  }

  canPlay(player) {
    return player.diceCount > 0;
  }

  emptyPlayer() {
    return {
      diceCount: 5,
      history: [],
      roll: null,
    };
  }

  perform(socketId, payload) {
    const action = payload.action;

    const player = this.players.find(p => p.socketId === socketId);
    if (!player) {
      return;
    }
    if (player.actions.findIndex(e => e === action) === -1) {
      throw new Error('Vous ne pouvez pas jouer cette action pour l\'instant');
    }

    if (action === 'accuse') {
      this.accuse();
    } else if (action === 'bet') {
      this.bet(payload);
    } else if (action === 'shake') {
      this.shake(socketId);
    } else if (action === 'startGame') {
      this.startGame();
    }
  }

  accuse() {
    let message = `${this.currentPlayer().name} accuse ${this.previousPlayer().name} d'avoir menti.`;

    let diceCount = 0;
    for (const player of (this.players)) {
      for (const dice of player.roll || []) {
        if ((!this.palifico && dice === 1) ||
          (dice === this.previousBet.value)) {
          diceCount += 1;
        }
      }
    }

    message += ` Il y a ${diceCount} ${this.previousBet.value} en tout.`;

    let looser;
    if (diceCount < this.previousBet.count) {
      looser = this.previousPlayer();
    } else {
      looser = this.currentPlayer();
    }

    this.previousTurn = {
      accuser: this.currentPlayer().name,
      previousPlayer: this.previousPlayer().name,
      betCount: this.previousBet.count,
      betValue: this.previousBet.value,
      realCount: diceCount,
    };

    this.currentPlayerIdx = looser.idx;

    this.palifico = false;
    if (looser.diceCount === 1) {
      this.currentPlayerIdx = this.nextPlayer().idx;
      message += ` ${looser.name} perd son dernier dé, bye-bye.`;
    } else if (looser.diceCount === 2) {
      this.palifico = true;
      message += ` ${looser.name} perd un dé, il est palifico.`;
    } else {
      message += ` ${looser.name} perd un dé.`;
    }

    this.addEvent({ message });
    looser.diceCount -= 1;
    this.previousBet = null;

    const remaining = [];

    for (const player of this.players) {
      player.history.push(player.roll);
      player.roll = null;
      if (player.diceCount > 0) {
        remaining.push(player);
        player.actions = ['shake'];
      }
    }

    if (remaining.length === 1) {
      for (const player of this.players) {
        player.actions = [];
      }
      this.addEvent({ message: `${remaining[0].name} a gagné la partie` });
    }
  }

  startGame() {
    this.started = true;
    this.addEvent({ message: `${this.players[0].name} a lancé la partie` });
    this.currentPlayerIdx = 0;
    for (const player of this.players) {
      player.actions = ['shake'];
    }
  }

  isValid(bet) {
    const previous = this.previousBet;

    if (!bet.count || !bet.value) {
      return false;
    }

    if (bet.value > 6 || bet.value < 1) {
      return false;
    }

    if (this.palifico) {
      if (!previous) {
        return true;
      }
      return (previous.value === bet.value && bet.count > previous.count);
    }

    if (!previous) {
      return (bet.value !== 1);
    }
    if (previous.value === bet.value) {
      return (bet.count > previous.count);
    }
    if (previous.value === 1) {
      return (bet.count > 2 * previous.count);
    }
    if (bet.value === 1) {
      return (bet.count * 2 >= previous.count);
    }
    if (bet.value < previous.value) {
      return false;
    }
    return (bet.count === previous.count);
  }

  bet(payload) {
    if (!this.isValid(payload)) {
      throw new Error('Cette annonce n\'est pas valide');
    }

    this.addEvent({ message: `${this.currentPlayer().name} annonce ${payload.count} ${payload.value}, c'est au tour de ${this.nextPlayer().name}` });

    this.currentPlayer().actions = [];
    this.moveToNextPlayer();
    this.previousBet = payload;
    this.currentPlayer().actions = ['bet', 'accuse'];
  }

  shake(socketId) {
    const player = this.players.find(e => e.socketId === socketId);

    if (player.diceCount <= 0) {
      return;
    }
    if (player.roll !== null) {
      return;
    }

    player.actions = player.actions.filter(a => a !== 'shake');

    player.roll = [];
    for (let i = 0; i < player.diceCount; i++) {
      player.roll.push(this.rollDice());
    }
    player.roll.sort();

    if (this.players.filter(p => this.canPlay(p)).every(p => this.playerReady(p))) {
      this.addEvent({ message: `Tous les joueurs ont lancé, c'est à ${this.currentPlayer().name} de jouer` });
      this.currentPlayer().actions.push('bet');
    }
  }
}
