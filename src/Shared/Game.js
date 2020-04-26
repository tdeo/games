import React from 'react';

import io from 'socket.io-client';

import { toast } from 'react-toastify';

import {
  Row,
  Col,
  Button,
} from 'react-bootstrap';

import GameIndex from './GameIndex';
import Audio from './Audio/index';
import Chat from './Chat';
import Events from './Events';
import WsContext from './WsContext';

const WS_URL = (window.location.hostname === 'localhost')
  ? 'ws://localhost:3090'
  : `wss://jeux-de-titi.herokuapp.com`;

export const GameLayout = ({ messages, events, children, me, players }) => {
  return <Row className="mb-3">
    <Col xs={12} md={6} lg={3} className="mb-3">
      <Chat messages={messages} me={me} players={players} />
    </Col>

    <Col xs={12} md={6} lg={3} className="mb-3">
      <Events events={events} />
    </Col>

    <Col xs={12} lg={6}>
      {children}
    </Col>
  </Row>;
}

const GameNotStarted = ({ messages, events, me, players }) => {
  const { gameAction } = React.useContext(WsContext);

  return <GameLayout messages={messages} events={events} me={me}
    players={players}>
    <Row className="mb-3">
      <Col xs={12}>
        Joueurs connectés : {players.map(p => p.name).join(', ')}
        <br />
        En attente que {players.find(p => p.actions.includes('startGame')).name} lance la partie
      </Col>
    </Row>

    {me.actions.includes('startGame') &&
      <Row className="mb-3">
        <Col xs={12}>
          <Button
            onClick={() => gameAction('startGame')}>
            Lancer la partie
          </Button>
        </Col>
      </Row>}
  </GameLayout>;
}

const Game = ({ game }) => {
  const [state, setState] = React.useState();
  const action = React.useRef();

  React.useEffect(() => {
    setState(null);
  }, [game]);

  React.useEffect(() => {
    const socket = io(`${WS_URL}/${game.wsNamespace}`);
    socket.on('state', (data) => {
      // console.debug('Received state', data)
      setState(data);
    });
    socket.on('game_error', (message) => {
      toast.error(message);
    });
    action.current = {
      mainAction: (action, payload) => {
        socket.emit('mainAction', { ...payload, action });
      },
      gameAction: (action, payload) => {
        socket.emit('gameAction', { ...payload, action });
      },
      id: socket.id,
      socket: socket,
    }
    socket.on('close', window.location.reload);
    return () => socket.disconnect();
  }, [game.wsNamespace])

  return <>
    <h1>{game.title}</h1>

    {!state
      ? <div>Connection en cours...</div>
      : <WsContext.Provider value={action.current}>
          {state.connected
            ? <>
                <Audio {...state} />
                {state.started
                  ? <game.Component {...state} />
                  : <GameNotStarted {...state} />
                }
              </>
            : <GameIndex {...state} />}
        </WsContext.Provider>}
  </>;
}

export default Game;
