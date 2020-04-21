const EventEmitter = require('events');

const PC_CONFIG = { iceServers: [{
  urls: ['stun:stun.l.google.com:19302']
}] };

class PeerConnection extends EventEmitter {
  constructor({ socket, peer }) {
    super();

    this.socket = socket;
    this.peer = peer;
    this.pc = new RTCPeerConnection(PC_CONFIG);

    this.pc.onicecandidate = (e) => {
      this.socket.emit('audioAction', {
        action: 'icecandidate',
        candidate: e.candidate,
        to: this.peer,
      });
    }
    this.pc.ontrack = (e) => {
      this.emit('peerStream', e.streams[0]);
    }

    this.socket.on('audioAction', ({ action, ...data }) => {
      if (action === 'icecandidate') {
        this.onIceCandidate(data.candidate).catch(console.err);
      } else if (action === 'answer') {
        this.onAnswer(data.sdp).catch(console.err);
      }
    })
  }

  async onOffer(sdp) {
    let desc = new RTCSessionDescription(sdp);
    await this.pc.setRemoteDescription(desc);

    let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => {
      this.pc.addTrack(track, stream);
    });
    this.emit('selfStream', stream);

    let answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);

    this.socket.emit('audioAction', {
      action: 'answer',
      sdp: this.pc.localDescription,
      to: this.peer,
    });
  }

  async createOffer() {
    let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => {
      this.pc.addTrack(track, stream);
    });
    this.emit('selfStream', stream);

    let offer = await this.pc.createOffer()
    await this.pc.setLocalDescription(offer);

    this.socket.emit('audioAction', {
      action: 'offer',
      sdp: this.pc.localDescription,
      to: this.peer,
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
