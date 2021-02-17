import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Video from '../components/video';
import { iceConfig, userMediaConstraints } from "../utils/constants";
let currentUserId;
let peers = {};
let localStream = null
let socket;

export default function Main() {
  const selfStream = useRef();
  const router = useRouter();
  const [peerStreams, setPeerStreams] = useState([]);
  const getPeerConnection = (peerId) => {
    const peer = peers[peerId];
    if (!peer) {
      const newPeerConnection = new RTCPeerConnection(iceConfig);
      console.log(localStream, newPeerConnection);
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
        console.log("object add stream");
        setPeerStreams((peerStreams) => {
          const newPeerStreams = [...peerStreams];
          newPeerStreams.push(event.stream);
          return newPeerStreams;
        });
      };
      newPeerConnection.onremovestream = (event) => {
        console.log("removed stream");
      };
      peers[peerId] = newPeerConnection;
    }
    return peers[peerId];
  };
  const getAndShowVideoAudioStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia(
      userMediaConstraints
    );
    localStream = stream;
    console.log(localStream, stream);
    selfStream.current.srcObject = stream;
    selfStream.current.play();
  };
  const createSocketConnection = () => {
    return new Promise((resolve, reject) => {
      socket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL);
      socket.onopen = function () {
        const initialData = { type: "connect" };
        if (router.query && router.query.roomId) {
          initialData.roomId = router.query.roomId;
        }
        socket.send(JSON.stringify(initialData));
      };
      socket.onmessage = async function (event) {
        const { rtcContent, type, ...rest } = JSON.parse(event.data);
        switch (rtcContent) {
          case "connectSuccess":
            const { roomId, userId } = rest;
            currentUserId = userId;
            console.log('object', rest);
            if (!router.query || !router.query.roomId) {
              history.pushState(
                {
                  roomId,
                },
                "WebRTC demo",
                `?roomId=${roomId}`
              );
            }
            resolve()
            break;
        }
      };
    })
  }
  const makeOffer = ({ peerId }) => {
    console.log(currentUserId, peerId);
    if (peerId === currentUserId) {
      return;
    }
    let currentPeerConnection = getPeerConnection(peerId);
    currentPeerConnection.createOffer(
      (sdp) => {
        currentPeerConnection.setLocalDescription(sdp);
        socket.send(
          JSON.stringify({
            by: currentUserId,
            to: peerId,
            sdp: sdp,
            type: "message",
            rtcContent: "peerOffer",
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
    console.log("object remote");
    return new Promise((resolve, reject) => {
      const currentPeerConnection = getPeerConnection(by);
      currentPeerConnection.setRemoteDescription(
        new RTCSessionDescription(sdp),
        () => {
          console.log("resolved");
          resolve();
        },
        reject
      );
    });
  };
  const sendAnswer = ({ by, to, sdp }) => {
    const currentPeerConnection = getPeerConnection(by);
    console.log("sending answer", currentPeerConnection);
    currentPeerConnection.createAnswer((sdp) => {
      console.log("sending answer");
      currentPeerConnection.setLocalDescription(sdp);
      socket.send(JSON.stringify({
        by: currentUserId,
        to: by,
        sdp: sdp,
        type: "message",
        rtcContent: "peerAnswer",
      }));
    }, (e) => { console.log(e); });
  };
  const addIceCandidate = ({ by, to, ice }) => {
    const currentPeerConnection = getPeerConnection(by);
    ice && currentPeerConnection.addIceCandidate(new RTCIceCandidate(ice));
  };
  const addSocketMessageHandlers = () => {
    socket.onmessage = async function (event) {
      console.log(event);
      const { rtcContent, type, ...rest } = JSON.parse(event.data);
      switch (rtcContent) {
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
  const handleStart = async () => {
    await getAndShowVideoAudioStream();
    await createSocketConnection();
    addSocketMessageHandlers();
  };
  console.log(peerStreams, "render", peers);
  return (
    <>

      <div>
        <button onClick={handleStart}>Start</button>
        <video ref={selfStream}></video>
        {
          peerStreams.map(stream => (
            <Video stream={stream}></Video>
          ))
        }
      </div>
    </>
  );
}
Main.title = "A webrtc demo built with nextjs"