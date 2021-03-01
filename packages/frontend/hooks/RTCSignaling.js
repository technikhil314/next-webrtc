import { useEffect, useState } from 'react';
import { iceConfig } from '../utils/constants';

let peers = [];

const getPeerConnection = (peerId) => {
    return peers[peerId];
};

const makeOffer = ({ by, currentUserId, socket }) => {
    if (by === currentUserId) {
        return;
    }
    let currentPeerConnection = getPeerConnection(by).connection;
    currentPeerConnection.createOffer(
        (sdp) => {
            currentPeerConnection.setLocalDescription(sdp);
            socket.send(
                JSON.stringify({
                    by: currentUserId,
                    to: by,
                    sdp: sdp,
                    type: "message",
                    rtcContent: "peerOffer",
                })
            );
        },
        (error) => { },
        { mandatory: { offerToReceiveVideo: true, offerToReceiveAudio: true } }
    );
};
const setRemoteDescription = ({ currentUserId, by, to, sdp, socket }) => {
    return new Promise((resolve, reject) => {
        const currentPeerConnection = getPeerConnection(by).connection;
        currentPeerConnection.setRemoteDescription(
            new RTCSessionDescription(sdp),
            () => {
                resolve();
            },
            reject
        );
    });
};
const sendAnswer = ({ currentUserId, by, to, sdp, socket }) => {
    const currentPeerConnection = getPeerConnection(by).connection;
    currentPeerConnection.createAnswer(
        (sdp) => {
            currentPeerConnection.setLocalDescription(sdp);
            socket.send(
                JSON.stringify({
                    by: currentUserId,
                    to: by,
                    sdp: sdp,
                    type: "message",
                    rtcContent: "peerAnswer",
                })
            );
        },
        (e) => { }
    );
};
const addIceCandidate = ({ by, to, ice, socket }) => {
    const currentPeerConnection = getPeerConnection(by).connection;
    ice && currentPeerConnection.addIceCandidate(new RTCIceCandidate(ice));
};

const createNewPeerConnection = ({ peerId, setPeers, localStream, currentUserId, socket }) => {
    let sendChannel, receiveChannel;
    const newPeerConnection = new RTCPeerConnection(iceConfig);
    sendChannel = newPeerConnection.createDataChannel("sendChannel");
    const channelCallback = (event) => {
        receiveChannel = event.channel;
        receiveChannel.onmessage = () => { };
    };
    newPeerConnection.ondatachannel = channelCallback;
    newPeerConnection.addStream(localStream);
    newPeerConnection.onicecandidate = (e) => {
        socket.send(
            JSON.stringify({
                by: currentUserId,
                to: peerId,
                ice: e.candidate,
                type: "message",
                rtcContent: "ice",
            })
        );
    };
    newPeerConnection.onaddstream = (event) => {
        peers[peerId].stream = event.stream;
        setPeers([...peers])
    };
    newPeerConnection.onremovestream = () => {
        peers[peerId].stream = null;
    };
    peers[peerId] = {
        connection: newPeerConnection,
        sendChannel,
        receiveChannel
    };
    setPeers([...peers]);
}
export default function useRTCSignaling({
    myUserId,
    socket,
    localStream,
}) {
    const [peers, setPeers] = useState([]);
    useEffect(() => {
        if (socket && localStream && myUserId) {
            socket.onmessage = async (event) => {
                const { rtcContent, type, ...rest } = JSON.parse(event.data);
                if (rest.by === myUserId) {
                    return;
                }
                if (!peers[rest.by]) {
                    createNewPeerConnection({ peerId: rest.by, localStream: localStream.current, currentUserId: myUserId, setPeers, socket });
                    setPeers([...peers])
                }
                switch (rtcContent) {
                    case "newPeer":
                        makeOffer({ ...rest, currentUserId: myUserId, socket });
                        break;
                    case "peerOffer":
                        await setRemoteDescription({ ...rest, currentUserId: myUserId, socket });
                        sendAnswer(rest);
                        break;
                    case "peerAnswer":
                        await setRemoteDescription({ ...rest, currentUserId: myUserId, socket });
                        break;
                    case "ice":
                        addIceCandidate({ ...rest, currentUserId: myUserId, socket });
                }
            }
            return () => socket.onmessage = null;
        }
    }, [peers, socket, localStream, myUserId]);
    return peers;
};
