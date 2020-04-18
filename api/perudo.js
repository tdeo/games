'use strict';

export default class Perudo {
  constructor() {
    this.players = [];
    this.currentPlayerIdx = null;
    this.previousBet = null;
    this.events = []
    this.started = false;
  }

  stateFor(playerId) {
    const me = this.players.find(p => p.id === playerId);
    return {
      players: this.players.map(p => ({
        ...p,
        roll: null,
      })),
      me: me,
      events: this.events,
      previousBet: this.previousBet,
      started: this.started,
    };
  }

  addEvent(message) {
    this.events.push({
      ts: Date.now(),
      message,
    })
  }

  addPlayer(id, name) {
    if (this.started) {
      return;
    }

    this.players.push({
      id: id,
      idx: this.players.length,
      name: name,
      diceCount: 5,
      history: [],
      roll: null,
      actions: (this.players.length === 0) ? ['startGame'] : [],
      ready: function() { return this.diceCount > 0 && this.roll !== null },
    });
  }

  previousPlayer() {
    let i = this.currentPlayerIdx;
    while (true) {
      i = (i - 1 + this.players.length) % this.players.length
      if (i === this.currentPlayerIdx) {
        throw new Error('Pas de joueur précédent')
      }
      if (this.players[i].diceCount > 0) {
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
      if (this.players[i].diceCount > 0) {
        return this.players[i];
      }
    }
  }

  currentPlayer() {
    return this.players[this.currentPlayerIdx];
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

    if (action === 'accuse') {
      this.accuse()
    } else if (action === 'bet') {
      this.bet(payload)
    } else if (action === 'shake') {
      this.shake(playerId)
    } else if (action === 'startGame') {
      this.startGame();
    }
  }

  accuse() {
    let message = `${this.currentPlayer().name} accuse ${this.previousPlayer().name} d'avoir menti.`;

    let diceCount = 0;
    for (let player of this.players) {
      for (let dice of player.roll) {
        if ((!this.palifico && dice === 1) ||
          (dice === this.previousBet.value)) {
          diceCount += 1;
        }
      }
    }

    message += ` Il y a ${diceCount} ${this.previousBet.value} en tout.`

    let looser;
    if (diceCount < this.previousBet.count) {
      looser = this.previousPlayer();
    } else {
      looser = this.currentPlayer();
    }

    this.currentPlayerIdx = looser.idx;

    this.palifico = false;
    if (looser.diceCount === 1) {
      this.currentPlayerIdx = this.nextPlayer().idx;
      message += ` ${looser.name} perd son dernier dé, bye-bye.`
    } else if (looser.diceCount === 2) {
      this.palifico = true;
      message += ` ${looser.name} perd un dé, il est palifico.`
    } else {
      message += ` ${looser.name} perd un dé.`
    }

    this.addEvent(message)
    looser.diceCount -= 1;
    this.previousBet = null;

    let remaining = [];

    for (let player of this.players) {
      player.history << player.roll;
      player.roll = null;
      if (player.diceCount > 0) {
        remaining.push(player)
        player.actions = ['shake'];
      }
    }

    if (remaining.length === 1) {
      for (let player of this.players) {
        player.actions = [];
      }
      this.addEvent(`${remaining[0].name} a gagné la partie`)
    }
  }

  startGame() {
    this.started = true;
    this.addEvent(`${this.players[0].name} a lancé la partie`)
    this.currentPlayerIdx = 0;
    for (let player of this.players) {
      player.actions = ['shake'];
    }
  }

  isValid(bet) {
    const previous = this.previousBet;

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

    this.addEvent(`${this.currentPlayer().name} annonce ${payload.count} ${payload.value}, c'est au tour de ${this.nextPlayer().name}`)

    this.currentPlayer().actions = [];
    this.currentPlayerIdx = this.nextPlayer().idx;
    this.previousBet = payload;
    this.currentPlayer().actions = ['bet', 'accuse']
  }

  shake(playerId) {
    let player = this.players.find(e => e.id === playerId);

    if (player.diceCount <= 0) {
      return;
    }
    if (player.roll !== null) {
      return;
    }

    player.actions = player.actions.filter(a => a !== 'shake')

    player.roll = []
    for (let i = 0; i < player.diceCount; i++) {
      player.roll.push(Math.floor(Math.random() * 6) + 1);
    }
    player.roll.sort();

    if (this.players.every(p => p.ready())) {
      this.addEvent(`Tous les joueurs ont lancé, c'est à ${this.currentPlayer().name} de jouer`)
      this.currentPlayer().actions.push('bet')
    }
  }
}
