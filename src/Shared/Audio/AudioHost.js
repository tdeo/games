import React from 'react';

import WsContext from '../../Shared/WsContext';

import PeerConnection from './PeerConnection';

const AudioHost = () => {
  const peerRef = React.useRef();
  const selfRef = React.useRef();

  const { socket } = React.useContext(WsContext);

  React.useEffect(() => {
    socket.on('audioAction', ({ action, ...data }) => {
      if (action === 'offer') {
        const pc = new PeerConnection({
          socket: socket,
          peer: data.from,
        });
        pc.on('peerStream', (stream) => {
          if (peerRef.current) {
            peerRef.current.srcObject = stream;
          }
        });
        pc.on('selfStream', (stream) => {
          if (selfRef.current) {
            selfRef.current.srcObject = stream;
          }
        });
        pc.onOffer(data.sdp).catch(console.error);
      }
    });
  }, [socket]);

  return <>
    <audio ref={peerRef} controls autoPlay />
    <audio ref={selfRef} controls autoPlay muted />
  </>;
};

export default AudioHost;
