import React from 'react';

import {
  Table,
  Button,
} from 'react-bootstrap';

import WsContext from '../Shared/WsContext';

import './index.css';

const ScoreTable = ({ players, me }) => {
  const { gameAction } = React.useContext(WsContext);

  const scoreFor = (player, cat) => {
    if ((me.uuid === player.uuid) && (me.actions.includes('score')) &&
      (cat in me.action_details.score)) {
      return <td key={player.uuid}>
        <Button
          className="py-0 score-button"
          variant="outline-secondary" size="sm"
          onClick={() => gameAction('score', { category: cat })}>
          {me.action_details.score[cat]}
        </Button>
      </td>;
    }
    return <td key={player.uuid}>
      {(player.scores[cat] || {}).value}
    </td>;
  };
  const computedScoreFor = (player, cat) => {
    return <td key={player.uuid}>
      {player.computedScores[cat] === 0 ? '' : player.computedScores[cat]}
    </td>;
  };

  return <Table striped bordered size="sm">
    <thead>
      <tr>
        <th />
        {players.map(({ name, uuid }) => <th
          key={uuid}
          style={{ width: 60 }}>
          {name}
        </th>)}
      </tr>
    </thead>

    <tbody>
      {['1', '2', '3', '4', '5', '6'].map(i => <tr key={i}>
        <td className="text-right">
          Total des <b>{i}</b>
        </td>
        {players.map(player => scoreFor(player, String(i)))}
      </tr>)}

      <tr>
        <td className="text-right">
          <b>Total</b>
        </td>
        {players.map(player => computedScoreFor(player, 'totalNombres'))}
      </tr>

      <tr>
        <td className="text-right">
          63+ points : Bonus (<b>35</b>)
        </td>
        {players.map(player => computedScoreFor(player, 'bonus'))}
      </tr>

      <tr>
        <td className="text-right">
          <b>Total avec Bonus</b>
        </td>
        {players.map(player => computedScoreFor(player, 'totalHaut'))}
      </tr>
    </tbody>

    <tbody>
      <tr>
        <td className="text-right">
          Brelan - <b>Total des 5 dés</b>
        </td>
        {players.map(player => scoreFor(player, 'brelan'))}
      </tr>
      <tr>
        <td className="text-right">
          Carré - <b>Total des 5 dés</b>
        </td>
        {players.map(player => scoreFor(player, 'carre'))}
      </tr>
      <tr>
        <td className="text-right">
          Full - <b>25</b>
        </td>
        {players.map(player => scoreFor(player, 'full'))}
      </tr>
      <tr>
        <td className="text-right">
          Petite suite - <b>30</b>
        </td>
        {players.map(player => scoreFor(player, 'petiteSuite'))}
      </tr>
      <tr>
        <td className="text-right">
          Grande suite - <b>40</b>
        </td>
        {players.map(player => scoreFor(player, 'grandeSuite'))}
      </tr>
      <tr>
        <td className="text-right">
          Yahtzee - <b>50</b>
        </td>
        {players.map(player => scoreFor(player, 'yahtzee'))}
      </tr>
      <tr>
        <td className="text-right">
          Chance - <b>Total des 5 dés</b>
        </td>
        {players.map(player => scoreFor(player, 'chance'))}
      </tr>

      <tr>
        <td className="text-right">
          <b>Total</b>
        </td>
        {players.map(player => computedScoreFor(player, 'totalBas'))}
      </tr>
    </tbody>

    <tbody>
      <tr>
        <td className="text-right">
          Prime Yahtzee - <b>100</b>
        </td>
        {players.map(player => scoreFor(player, 'primeYahtzee'))}
      </tr>
    </tbody>

    <tbody>
      <tr>
        <td className="text-right">
          <b>Total</b>
        </td>
        {players.map(player => computedScoreFor(player, 'totalFinal'))}
      </tr>
    </tbody>
  </Table>;
};

export default ScoreTable;
