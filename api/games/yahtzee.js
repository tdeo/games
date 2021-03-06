'use strict';

import Game from './game';

export default class Yahtzee extends Game {
  constructor() {
    super();
    this.currentPlayerIdx = null;
    this.currentRoll = null;
  }

  stateFor(socketId) {
    const me = this.players.find(p => p.socketId === socketId);
    return {
      results: this.results,
      players: this.players,
      currentRoll: this.currentRoll,
      me: me,
      currentPlayer: this.currentPlayer(),
    };
  }

  moveToNextPlayer() {
    try {
      this.currentPlayerIdx = this.nextPlayer().idx;
    } catch {
      // silence exception to be able to play single-player
    }
  }

  emptyPlayer() {
    return {
      scores: {},
      computedScores: {},
      lastScore: null,
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

    if (action === 'toggleLock') {
      this.toggleLock(payload.diceIdx);
    } else if (action === 'rollDices') {
      this.rollDices();
    } else if (action === 'score') {
      this.score(payload.category);
    } else if (action === 'startGame') {
      this.startGame();
    }
  }

  scoreFor(category) {
    const roll = this.currentRoll[this.currentRoll.length - 1].map(d => d.value);

    const sum = roll.reduce((acc, i) => acc + i, 0);

    const h = [0, 0, 0, 0, 0, 0, 0];
    for (const val of roll) {
      h[val] += 1;
    }

    switch (category) {
      case 'primeYahtzee':
        return h.includes(5) ? 100 : 0;
      case 'chance':
        return sum;
      case 'yahtzee':
        return h.includes(5) ? 50 : 0;
      case 'grandeSuite':
        return (h.join(',') === '0,0,1,1,1,1,1') ? 40 : 0;
      case 'petiteSuite':
        return (h.join(',') === '0,1,1,1,1,1,0') ? 30 : 0;
      case 'full':
        return (h.includes(5) || (h.includes(2) && h.includes(3))) ? 25 : 0;
      case 'carre':
        return (h.includes(4) || h.includes(5)) ? sum : 0;
      case 'brelan':
        return (h.includes(3) || h.includes(4) || h.includes(5)) ? sum : 0;
      default:
        return h[parseInt(category)] * parseInt(category);
    }
  }

  computeTotals(player) {
    const scores = player.scores;
    const res = player.computedScores;

    res.totalNombres = 0;
    for (const k of ['1', '2', '3', '4', '5', '6']) {
      if (k in scores) {
        res.totalNombres += scores[k].value;
      }
    }

    res.bonus = (res.totalNombres >= 63) ? 35 : 0;
    res.totalHaut = res.bonus + res.totalNombres;

    res.totalBas = 0;
    for (const k of ['brelan', 'carre', 'full', 'petiteSuite', 'grandeSuite',
      'yahtzee', 'chance']) {
      if (k in scores) {
        res.totalBas += scores[k].value;
      }
    }

    res.totalFinal = res.totalBas + res.totalHaut + ((scores.primeYahtzee || {}).value || 0);
  }

  categories() {
    const played = Object.keys(this.currentPlayer().scores).length;

    if (played > 13) {
      return [];
    } else if (played === 13) {
      return ['primeYahtzee'];
    } else {
      return ['1', '2', '3', '4', '5', '6', 'brelan', 'carre', 'full', 'petiteSuite', 'grandeSuite', 'yahtzee', 'chance'].filter(e => !(e in this.currentPlayer().scores));
    }
  }

  startGame() {
    this.started = true;
    this.addEvent({ message: `${this.players[0].name} a lancé la partie` });
    this.currentPlayerIdx = 0;
    this.currentPlayer().actions = ['rollDices'];
  }

  toggleLock(idx) {
    const dice = this.currentRoll[this.currentRoll.length - 1][idx];
    if (!dice) {
      throw new Error('Numéro du dé invalide');
    }
    dice.locked = !dice.locked;
  }

  rollDices() {
    if (!this.currentRoll) {
      this.currentRoll = [];
      const newRoll = [];
      for (let i = 0; i < 5; i++) {
        newRoll.push({
          value: this.rollDice(),
          locked: false,
        });
      }
      this.currentRoll.push(newRoll);
    } else {
      const roll = this.currentRoll[this.currentRoll.length - 1];
      const newRoll = [];
      for (const dice of roll) {
        if (dice.locked) {
          newRoll.push({
            value: dice.value,
            locked: true,
          });
        } else {
          newRoll.push({
            value: this.rollDice(),
            locked: false,
          });
        }
      }
      this.currentRoll.push(newRoll);
    }
    this.currentPlayer().actions = ['score'];
    this.currentPlayer().action_details = { score: {} };
    for (const cat of this.categories()) {
      this.currentPlayer().action_details.score[cat] = this.scoreFor(cat);
    }
    if (this.currentRoll.length < 3) {
      this.currentPlayer().actions.push('rollDices', 'toggleLock');
    }
  }

  score(cat) {
    if (!this.categories().includes(cat)) {
      throw new Error('Cette catégorie de score n\'est pas valide');
    }

    this.currentPlayer().lastScore = cat;
    this.currentPlayer().scores[cat] = {
      value: this.scoreFor(cat),
      roll: this.currentRoll,
    };

    this.computeTotals(this.currentPlayer());

    for (const player of this.players) {
      player.actions = [];
    }

    this.currentRoll = null;
    this.moveToNextPlayer();
    if (this.categories().length === 0) {
      this.results = [];
      for (const player of this.players) {
        this.results.push({
          name: player.name,
          total: player.computedScores.totalFinal,
        });
      }
      this.results.sort((a, b) => b.total - a.total);
      this.addEvent({ message: 'La partie est finie' });
    } else {
      this.currentPlayer().actions = ['rollDices'];
    }
  }
}
