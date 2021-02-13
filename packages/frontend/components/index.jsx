import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { iceConfig, userMediaConstraints } from "../utils/constants";

export default function Main() {
  let socket = useRef();
  const selfStream = useRef();
  const router = useRouter();
  const currentUserId = useRef();
  const currentRoomId = useRef();
  const [peerStreams, setPeerStreams] = useState([]);
  const [peers, setPeers] = useState({});
  const peersRef = useRef();
  const localStream = useRef();
  const getPeerConnection = (peerId) => {
    console.log(peers, peerId);
    const peer = peers[peerId];
    if (!peer) {
      const newPeerConnection = new RTCPeerConnection(iceConfig);
      newPeerConnection.addStream(localStream.current);
      //   newPeerConnection.addTrack(localStream.getVideoTracks[0]);
      //   newPeerConnection.addTrack(localStream.getAudioTracks[0]);
      newPeerConnection.onicecandidate = (e) => {
        socket.current(
          JSON.stringify({
            by: currentUserId,
            to: peerId,
            ice: e.candidate,
            type: "ice",
          })
        );
      };
      newPeerConnection.onaddstream = (event) => {
        setPeerStreams((peerStreams) => {
          const newPeerStreams = [...peerStreams];
          newPeerStreams.push(event.stream);
          return newPeerStreams;
        });
      };
      setPeers((peers) => {
        const newPeers = {
          ...peers,
          [peerId]: newPeerConnection,
        };
        peersRef.current = newPeers;
        return newPeers;
      });
      return peersRef.current[peerId];
    }
  };
  const getAndShowVideoAudioStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia(
      userMediaConstraints
    );
    localStream.current = stream;
    selfStream.current.srcObject = stream;
    selfStream.current.play();
  };
  const createSocketConnection = () => {
    console.log(process.env.NEXT_PUBLIC_WEBSOCKET_URL);
    socket.current = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL);
  };
  const makeOffer = ({ peerId }) => {
    let currentPeerConnection = getPeerConnection(peerId);
    currentPeerConnection.createOffer(
      (sdp) => {
        currentPeerConnection.setLocalDescription(sdp);
        socket.current.send(
          "message",
          JSON.stringify({
            by: currentUserId,
            to: peerId,
            sdp: sdp,
            type: "peerOffer",
          })
        );
      },
      (error) => {
        console.log(error);
      },
      { mandatory: { offerToReceiveVideo: true, offerToReceiveAudio: true } }
    );
  };
  const setRemoteDescription = ({ by, to, sdp }) => {
    return new Promise((resolve, reject) => {
      const currentPeerConnection = getPeerConnection(by);
      currentPeerConnection.setRemoteDescription(
        new RTCSessionDescription(sdp),
        () => {
          resolve();
        },
        reject
      );
    });
  };
  const sendAnswer = ({ by, to, sdp }) => {
    const currentPeerConnection = getPeerConnection(by);
    currentPeerConnection.createAnswer((sdp) => {
      pc.setLocalDescription(sdp);
      socket.current.send({
        by: currentUserId,
        to: by,
        sdp: sdp,
        type: "peerAnswer",
      });
    });
  };
  const addIceCandidate = ({ by, to, ice }) => {
    const currentPeerConnection = getPeerConnection(by);
    currentPeerConnection.addIceCandidate(new RTCIceCandidate(ice));
  };
  const addSocketMessageHandlers = () => {
    socket.current.onopen = function () {
      const initialData = { type: "connect" };
      if (router.query && router.query.roomId) {
        initialData.roomId = router.query.roomId;
      }
      socket.current.send(JSON.stringify(initialData));
    };
    socket.current.onmessage = async function (event) {
      console.log(event.data);
      const { type, ...rest } = JSON.parse(event.data);
      switch (type) {
        case "connectSuccess":
          const { roomId, userId } = rest;
          currentRoomId.current = roomId;
          currentUserId.current = userId;
          if (!router.query || !router.query.roomId) {
            history.pushState(
              {
                roomId,
              },
              "WebRTC demo",
              `?roomId=${roomId}`
            );
          }
          console.log(currentUserId);
          break;
        case "newPeer":
          makeOffer(rest);
          break;
        case "peerOffer":
          await setRemoteDescription(rest);
          sendAnswer(rest);
          break;
        case "peerAnswer":
          await setRemoteDescription(rest);
          break;
        case "ice":
          addIceCandidate(rest);
      }
    };
  };
  const handleStart = () => {
    if (!localStream.current) {
      getAndShowVideoAudioStream();
      createSocketConnection();
      addSocketMessageHandlers();
    }
    console.log(localStream, currentUserId, peers);
  };
  return (
    <div>
      <button onClick={handleStart}>Start</button>
      <video ref={selfStream}></video>
    </div>
  );
}
