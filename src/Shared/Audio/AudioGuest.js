import React from 'react';

import {
  Button,
} from 'react-bootstrap';

import WsContext from '../../Shared/WsContext';

import PeerConnection from './PeerConnection';

const AudioGuest = ({ audioHost }) => {
  const peerRef = React.useRef();
  const selfRef = React.useRef();
  const audioJoined = React.useRef();

  const { socket } = React.useContext(WsContext);

  const joinAudio = () => {
    audioJoined.current = true;
    const pc = new PeerConnection({
      socket: socket,
      peer: audioHost,
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
    pc.createOffer().catch(console.err);
  }

  return <>
    {!audioJoined.current && <Button onClick={joinAudio}>
      Rejoindre l'audio
    </Button>}
    <audio ref={peerRef} controls autoPlay />
    <audio ref={selfRef} controls autoPlay muted />
  </>;
}

export default AudioGuest;
