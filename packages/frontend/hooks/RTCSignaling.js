import { useEffect, useState } from 'react';
import { iceConfig } from '../utils/constants';

let peers = [];

const useRTCSignaling = ({
    myUserId: currentUserId,
    socket,
    localStream,
}) => {
    const [peers, setPeers] = useState([]);
    useEffect(() => {
        if (socket && localStream && currentUserId) {
            socket.onmessage = async (event) => {
                const { rtcContent, by, ice, sdp } = JSON.parse(event.data);
                if (by === currentUserId) {
                    return;
                }
                const makeOffer = () => {
                    let currentPeerConnection = peers[by].connection;
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
                const setRemoteDescription = () => {
                    return new Promise((resolve, reject) => {
                        const currentPeerConnection = peers[by].connection;
                        currentPeerConnection.setRemoteDescription(
                            new RTCSessionDescription(sdp),
                            () => {
                                resolve();
                            },
                            reject
                        );
                    });
                };
                const sendAnswer = () => {
                    const currentPeerConnection = peers[by].connection;
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
                const addIceCandidate = () => {
                    const currentPeerConnection = peers[by].connection;
                    ice && currentPeerConnection.addIceCandidate(new RTCIceCandidate(ice));
                };

                const createNewPeerConnection = () => {
                    let sendChannel, receiveChannel;
                    const newPeerConnection = new RTCPeerConnection(iceConfig);
                    sendChannel = newPeerConnection.createDataChannel("sendChannel");
                    const channelCallback = (event) => {
                        receiveChannel = event.channel;
                        receiveChannel.onmessage = () => { };
                    };
                    newPeerConnection.ondatachannel = channelCallback;
                    newPeerConnection.addStream(localStream.current);
                    newPeerConnection.onicecandidate = (e) => {
                        socket.send(
                            JSON.stringify({
                                by: currentUserId,
                                to: by,
                                ice: e.candidate,
                                type: "message",
                                rtcContent: "ice",
                            })
                        );
                    };
                    newPeerConnection.onaddstream = (event) => {
                        peers[by].stream = event.stream;
                        setPeers([...peers])
                    };
                    newPeerConnection.onremovestream = () => {
                        peers[by].stream = null;
                    };
                    peers[by] = {
                        connection: newPeerConnection,
                        sendChannel,
                        receiveChannel
                    };
                    setPeers([...peers]);
                }
                if (!peers[by]) {
                    console.log("object");
                    createNewPeerConnection();
                }
                switch (rtcContent) {
                    case "newPeer":
                        makeOffer();
                        break;
                    case "peerOffer":
                        await setRemoteDescription();
                        sendAnswer(rest);
                        break;
                    case "peerAnswer":
                        await setRemoteDescription();
                        break;
                    case "ice":
                        addIceCandidate();
                }
            }
            return () => socket.onmessage = null;
        }
    }, [peers, socket, localStream, currentUserId]);
    return peers;
};

export default useRTCSignaling;
