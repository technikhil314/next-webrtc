import { tw } from "twind";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Video from "../components/video";
import { iceConfig, userMediaConstraints } from "../utils/constants";
let currentUserId;
let peers = {};
let localStream = null;
let socket;

export default function Main() {
  const selfStream = useRef();
  const router = useRouter();
  const [sendValue, setSendValue] = useState();
  const [peerStreams, setPeerStreams] = useState([]);
  const getPeerConnection = (peerId) => {
    const peer = peers[peerId];
    let sendChannel, receiveChannel;
    if (!peer) {
      const channelCallback = (event) => {
        receiveChannel = event.channel;
        receiveChannel.onmessage = (event) => console.log(event.data);
      };
      const newPeerConnection = new RTCPeerConnection(iceConfig);
      sendChannel = newPeerConnection.createDataChannel("sendChannel");
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
        setPeerStreams((peerStreams) => {
          const newPeerStreams = [...peerStreams];
          newPeerStreams.push(event.stream);
          return newPeerStreams;
        });
      };
      newPeerConnection.onremovestream = (event) => {};
      peers[peerId] = {
        connection: newPeerConnection,
        sendChannel: sendChannel,
        receiveChannel: receiveChannel,
      };
    }
    return peers[peerId];
  };
  const sendMessage = (e) => {
    Object.values(peers)
      .map((peer) => peer.sendChannel)
      .forEach((sendChannel) => sendChannel.send(sendValue));
  };
  const getAndShowVideoAudioStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia(
      userMediaConstraints
    );
    localStream = stream;
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
            if (!router.query || !router.query.roomId) {
              history.pushState(
                {
                  roomId,
                },
                "WebRTC demo",
                `?roomId=${roomId}`
              );
            }
            resolve();
            break;
        }
      };
    });
  };
  const makeOffer = ({ peerId }) => {
    if (peerId === currentUserId) {
      return;
    }
    let currentPeerConnection = getPeerConnection(peerId).connection;
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
      (error) => {},
      { mandatory: { offerToReceiveVideo: true, offerToReceiveAudio: true } }
    );
  };
  const setRemoteDescription = ({ by, to, sdp }) => {
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
  const sendAnswer = ({ by, to, sdp }) => {
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
      (e) => {}
    );
  };
  const addIceCandidate = ({ by, to, ice }) => {
    const currentPeerConnection = getPeerConnection(by).connection;
    ice && currentPeerConnection.addIceCandidate(new RTCIceCandidate(ice));
  };
  const addSocketMessageHandlers = () => {
    socket.onmessage = async function (event) {
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
  return (
    <>
      <div>
        <button onClick={handleStart}>Start</button>
        <input
          type="text"
          onChange={(e) => setSendValue(e.target.value)}
          defaultValue={sendValue}
        />
        <button type="button" onClick={sendMessage}>
          Send
        </button>
        <video ref={selfStream} className={tw`bg-black border-2	`}></video>
        {peerStreams.map((stream) => (
          <Video stream={stream}></Video>
        ))}
      </div>
    </>
  );
}
Main.title = "A webrtc demo built with nextjs";
