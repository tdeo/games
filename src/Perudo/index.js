import React from 'react';

import io from 'socket.io-client';

import { toast } from 'react-toastify';

import Connection from './Connection';
import Game from './Game';

import WsContext from '../wsContext';

const WS_URL = (window.location.hostname === 'localhost')
  ? 'ws://localhost:3090'
  : 'wss://yahtzeee.herokuapp.com';

const Perudo = () => {
  const [state, setState] = React.useState();

  const action = React.useRef();

  React.useEffect(() => {
    const socket = io(`${WS_URL}/perudo`);
    socket.on('state', (data) => {
      setState(data);
    });
    socket.on('game_error', (message) => {
      toast.error(message);
    });
    action.current = (action, payload) => {
      if (action !== 'newPlayer' &&
          action !== 'selectPlayer' &&
          action !== 'resetGame') {
        if (!payload) {
          payload = {};
        }
        payload.action = action;
        action = 'action';
      }
      socket.emit(action, payload);
    }
    socket.on('close', window.location.reload);
    return socket.disconnect;
  }, [])

  return <>
    <h1>Perudo</h1>

    {!state
      ? <div>Connection en cours...</div>
      : <WsContext.Provider value={action.current}>
          {state.connected
            ? <Game {...state} />
            : <Connection action={action.current} {...state} />}
        </WsContext.Provider>}
  </>;
}

export default Perudo;
