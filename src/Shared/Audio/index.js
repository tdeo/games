import React from 'react';

import {
  Row,
  Col,
  Button,
} from 'react-bootstrap';

import WsContext from '../../Shared/WsContext';

import PeerConnection from './PeerConnection';

const Audio = ({ audioMembers }) => {
  // return null;

  const { gameAction } = React.useContext(WsContext);
  const { socket } = React.useContext(WsContext);

  const [streams, setStreams] = React.useState([]);
  const [connections, setConnections] = React.useState([]);

  const newPc = React.useCallback(() => {
    const pc = new PeerConnection({
      socket: socket,
    });
    pc.on('peerStream', (stream) => {
      setStreams(s => [...s, stream]);
    });
    setConnections(c => [...c, pc]);
    pc.on('disconnected', streamIds => {
      setStreams(s => s.filter(stream =>
        !streamIds.includes(stream.id)
      ));
      setConnections(conns => conns.filter(
        conn => conn.uuid !== pc.uuid
      ));
    })
    return pc;
  }, [socket]);

  React.useEffect(() => {
    socket.on('audioAction', ({ action, ...data }) => {
      if (action === 'offer') {
        let pc = newPc();
        pc.peer = data.from;
        pc.peer_uuid = data.from_uuid;
        pc.onOffer(data.sdp).catch(console.err);
      }
    })
  }, [socket, newPc])

  const joined = audioMembers.includes(socket.id)

  const joinAudio = () => {
    for (let member of audioMembers) {
      let pc = newPc();
      pc.peer = member;
      pc.createOffer().catch(console.err);
    }
    gameAction('joinAudio')
  }

  const stopAudio = () => {
    for (let pc of connections) {
      pc.close();
    }
    setStreams([]);
    setConnections([]);
    gameAction('leaveAudio')
  }

  return <Row className="mb-3">
    <Col xs={12}>
      {!joined && <Button onClick={joinAudio}>
        Rejoindre l'audio
      </Button>}
      {joined && <Button onClick={stopAudio}>
        Arrêter l'audio ({connections.length} connectés)
      </Button>}
      {streams.map(s => <HtmlAudio srcObject={s} key={s.id} />)}
    </Col>
  </Row>;
}

const HtmlAudio = ({ srcObject }) => {
  const ref = React.useRef();

  React.useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = srcObject;
    }
  }, [ref, srcObject]);

  return <audio autoPlay ref={ref} />;
}

export default Audio;
