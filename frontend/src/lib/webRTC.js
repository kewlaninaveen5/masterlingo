let peerConnection;
let localStream;

const iceConfig = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
}

export const initWebRTC = async ()=> {
    peerConnection = new RTCPeerConnection(iceConfig)

    localStream= await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
    })
}

