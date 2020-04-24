import React from 'react';

import io from 'socket.io-client';

import { toast } from 'react-toastify';

import GameIndex from '../Shared/GameIndex';
import Audio from '../Shared/Audio/index';

import WsContext from '../Shared/WsContext';

const WS_URL = (window.location.hostname === 'localhost')
  ? 'ws://localhost:3090'
  : `wss://jeux-de-titi.herokuapp.com`;

const Game = ({ game }) => {
  const [state, setState] = React.useState();
  const action = React.useRef();

  React.useEffect(() => {
    const socket = io(`${WS_URL}/${game.wsNamespace}`);
    socket.on('state', (data) => {
      console.debug('Received state', data)
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
                <game.Component {...state} />
              </>
            : <GameIndex {...state} />}
        </WsContext.Provider>}
  </>;
}

export default Game;
