import { useLayoutEffect, useState } from "react";
import { iceConfig } from "../utils/constants";
import Video from "./video";
export const RemoteStreams = ({ myUserId, localStream, socket }) => {
  const [peers, setPeers] = useState({});
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
      console.log(localStream, "adding localStream");
      newPeerConnection.addStream(localStream.current);
      newPeerConnection.onicecandidate = (e) => {
        socket.send(
          JSON.stringify({
            by: myUserId,
            to: peerId,
            ice: e.candidate,
            type: "message",
            rtcContent: "ice",
          })
        );
        setPeers((peers) => {
          return {
            ...peers,
          };
        });
      };
      newPeerConnection.onaddstream = (event) => {
        peers[peerId].stream = event.stream;
        setPeers((peers) => {
          return {
            ...peers,
          };
        });
      };
      newPeerConnection.onremovestream = (event) => {
        console.log("object removestream");
        peers[peerId].stream = null;
        setPeers((peers) => {
          return {
            ...peers,
          };
        });
      };
      peers[peerId] = {
        connection: newPeerConnection,
        sendChannel: sendChannel,
        receiveChannel: receiveChannel,
      };
      setPeers((peers) => {
        return {
          ...peers,
        };
      });
    }
    return peers[peerId];
  };
  const makeOffer = ({ peerId }) => {
    if (peerId === myUserId) {
      return;
    }
    let currentPeerConnection = getPeerConnection(peerId).connection;
    currentPeerConnection.createOffer(
      (sdp) => {
        currentPeerConnection.setLocalDescription(sdp);
        socket.send(
          JSON.stringify({
            by: myUserId,
            to: peerId,
            sdp: sdp,
            type: "message",
            rtcContent: "peerOffer",
          })
        );
      },
      (error) => {
        console.log(error, "createOffer");
      },
      { mandatory: { offerToReceiveVideo: true, offerToReceiveAudio: true } }
    );
  };
  const setRemoteDescription = ({ by, sdp }) => {
    return new Promise((resolve, reject) => {
      const currentPeerConnection = getPeerConnection(by).connection;
      currentPeerConnection.setRemoteDescription(
        new RTCSessionDescription(sdp),
        () => {
          resolve();
        },
        (error) => {
          console.log(error, "setRemoteDescription");
          reject();
        }
      );
    });
  };
  const sendAnswer = ({ by }) => {
    const currentPeerConnection = getPeerConnection(by).connection;
    currentPeerConnection.createAnswer(
      (sdp) => {
        currentPeerConnection.setLocalDescription(sdp);
        socket.send(
          JSON.stringify({
            by: myUserId,
            to: by,
            sdp: sdp,
            type: "message",
            rtcContent: "peerAnswer",
          })
        );
      },
      (e) => {
        console.log(e, "setLocalDescription");
      }
    );
  };
  const addIceCandidate = ({ by, ice }) => {
    const currentPeerConnection = getPeerConnection(by).connection;
    ice && currentPeerConnection.addIceCandidate(new RTCIceCandidate(ice));
  };
  const deletePeer = ({ peerId }) => {
    setPeers((peers) => {
      delete peers[peerId];
      return {
        ...peers,
      };
    });
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
          break;
        case "deletedPeer":
          deletePeer(rest);
          break;
      }
    };
  };
  useLayoutEffect(() => {
    addSocketMessageHandlers();
  }, []);
  console.log(peers, "peers");
  return Object.values(peers).map((peer) => (
    <Video peer={peer} key={peer.stream ? peer.stream.id : Date.now()} />
  ));
};
