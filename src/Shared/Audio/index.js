import React from 'react';

import {
  Button
} from 'react-bootstrap';

import WsContext from '../../Shared/WsContext';

import AudioHost from './AudioHost';
import AudioGuest from './AudioGuest';

const Audio = ({ isAudioStarted, isAudioHost, audioHost }) => {
  const { gameAction } = React.useContext(WsContext);

  if (!isAudioStarted) {
    return <Button onClick={() => gameAction('audioHost')}>
      Démarrer l'audio
    </Button>;
  }

  if (isAudioHost) {
    return <AudioHost />;
  } else {
    return <AudioGuest audioHost={audioHost} />;
  }
}

export default Audio;
