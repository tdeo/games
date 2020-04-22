const EventEmitter = require('events');

const PC_CONFIG = { iceServers: [{
  urls: ['stun:stun.l.google.com:19302']
}] };

const uuid = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

let myStream;

class PeerConnection extends EventEmitter {
  constructor({ socket, peer, peer_uuid }) {
    super();

    this.socket = socket;
    this.peer = peer;
    this.peer_uuid = peer_uuid;
    this.pc = new RTCPeerConnection(PC_CONFIG);

    this.pc.onicecandidate = (e) => {
      this.socket.emit('audioAction', {
        action: 'icecandidate',
        candidate: e.candidate,
        to: this.peer,
        from_uuid: this.uuid,
        to_uuid: this.peer_uuid,
      });
    }

    this.streamIds = []
    this.pc.ontrack = (e) => {
      this.streamIds.push(e.streams[0].id);
      this.emit('peerStream', e.streams[0]);
    }

    this.pc.onconnectionstatechange = e => {
      if (this.pc.connectionState === 'disconnected') {
        this.emit('disconnected', this.streamIds);
      }
    }

    this.uuid = uuid();

    this.socket.on('audioAction', ({ action, to_uuid, ...data }) => {
      if (to_uuid !== this.uuid) {
        return;
      }
      if (action === 'icecandidate') {
        this.onIceCandidate(data.candidate).catch(console.err);
      } else if (action === 'answer') {
        this.peer_uuid = data.from_uuid;
        this.onAnswer(data.sdp).catch(console.err);
      }
    })
  }

  close() {
    this.pc.close();
  }

  async myStream() {
    if (!myStream) {
      myStream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
    }
    return myStream;
  }

  async onOffer(sdp) {
    let desc = new RTCSessionDescription(sdp);
    await this.pc.setRemoteDescription(desc);

    (await this.myStream()).getTracks().forEach(track => {
      this.pc.addTrack(track, myStream);
    });

    let answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);

    this.socket.emit('audioAction', {
      action: 'answer',
      sdp: this.pc.localDescription,
      to: this.peer,
      to_uuid: this.peer_uuid,
      from_uuid: this.uuid,
    });
  }

  async createOffer() {
    (await this.myStream()).getTracks().forEach(track => {
      this.pc.addTrack(track, myStream);
    });

    let offer = await this.pc.createOffer()
    await this.pc.setLocalDescription(offer);

    this.socket.emit('audioAction', {
      action: 'offer',
      sdp: this.pc.localDescription,
      to: this.peer,
      to_uuid: this.peer_uuid,
      from_uuid: this.uuid,
    });
  }

  async onAnswer(sdp) {
    let desc = new RTCSessionDescription(sdp)
    this.pc.setRemoteDescription(desc);
  }

  async onIceCandidate(candidate) {
    if (!candidate) {
      return;
    }
    let rtcCandidate = new RTCIceCandidate(candidate);
    this.pc.addIceCandidate(rtcCandidate)
  }
}

export default PeerConnection;
