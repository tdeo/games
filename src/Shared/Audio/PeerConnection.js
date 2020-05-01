const EventEmitter = require('events');

const PC_CONFIG = {
  iceServers: [{
    urls: ['stun:stun.l.google.com:19302'],
  }],
};

const uuid = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

let myStream;

class PeerConnection extends EventEmitter {
  constructor({ socket, peer, peerUuid }) {
    super();

    this.socket = socket;
    this.peer = peer;
    this.peerUuid = peerUuid;
    this.pc = new RTCPeerConnection(PC_CONFIG);

    this.pc.onicecandidate = (e) => {
      this.socket.emit('audioAction', {
        action: 'icecandidate',
        candidate: e.candidate,
        to: this.peer,
        fromUuid: this.uuid,
        toUuid: this.peerUuid,
      });
    };

    this.streamIds = [];
    this.pc.ontrack = (e) => {
      this.streamIds.push(e.streams[0].id);
      this.emit('peerStream', e.streams[0]);
    };

    this.pc.onconnectionstatechange = e => {
      if (this.pc.connectionState === 'disconnected') {
        this.emit('disconnected', this.streamIds);
      }
    };

    this.uuid = uuid();

    this.socket.on('audioAction', ({ action, toUuid, ...data }) => {
      if (toUuid !== this.uuid) {
        return;
      }
      if (action === 'icecandidate') {
        this.onIceCandidate(data.candidate).catch(console.error);
      } else if (action === 'answer') {
        this.peerUuid = data.fromUuid;
        this.onAnswer(data.sdp).catch(console.error);
      }
    });
  }

  close() {
    this.pc.close();
  }

  async myStream() {
    if (!myStream) {
      myStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    }
    return myStream;
  }

  async onOffer(sdp) {
    const desc = new RTCSessionDescription(sdp);
    await this.pc.setRemoteDescription(desc);

    (await this.myStream()).getTracks().forEach(track => {
      this.pc.addTrack(track, myStream);
    });

    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);

    this.socket.emit('audioAction', {
      action: 'answer',
      sdp: this.pc.localDescription,
      to: this.peer,
      toUuid: this.peerUuid,
      fromUuid: this.uuid,
    });
  }

  async createOffer() {
    (await this.myStream()).getTracks().forEach(track => {
      this.pc.addTrack(track, myStream);
    });

    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);

    this.socket.emit('audioAction', {
      action: 'offer',
      sdp: this.pc.localDescription,
      to: this.peer,
      toUuid: this.peerUuid,
      fromUuid: this.uuid,
    });
  }

  async onAnswer(sdp) {
    const desc = new RTCSessionDescription(sdp);
    this.pc.setRemoteDescription(desc);
  }

  async onIceCandidate(candidate) {
    if (!candidate) {
      return;
    }
    const rtcCandidate = new RTCIceCandidate(candidate);
    this.pc.addIceCandidate(rtcCandidate);
  }
}

export default PeerConnection;
