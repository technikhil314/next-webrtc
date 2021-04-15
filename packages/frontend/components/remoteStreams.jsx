import { useLayoutEffect, useState } from "react";
import { useRhinoState } from "../store/states";
import { iceConfig } from "../utils/constants";
import RemoteVideos from "./remoteVideos";
export const RemoteStreams = ({ myUserId, socket }) => {
  const [peers, setPeers] = useState({});
  const [userNames, setUserNames] = useState([]);
  const [localStream] = useRhinoState("localStream");
  const [userName] = useRhinoState("userName");
  const getPeerConnection = (peerId) => {
    const peer = peers[peerId];
    let sendChannel, receiveChannel;
    if (!peer) {
      const newPeerConnection = new RTCPeerConnection(iceConfig);
      const channelCallback = (event) => {
        receiveChannel = event.channel;
        receiveChannel.onmessage = (event) => {
          setUserNames((userNames) => {
            userNames[peerId] = JSON.parse(event.data).userName;
            return [...userNames];
          });
        };
      };
      sendChannel = newPeerConnection.createDataChannel("sendChannel");
      sendChannel.onopen = () => {
        sendChannel.send(
          JSON.stringify({
            userName,
          })
        );
      };
      newPeerConnection.ondatachannel = channelCallback;
      let camVideoTrack = localStream.getVideoTracks()[0];
      let camAudioTrack = localStream.getAudioTracks()[0];
      newPeerConnection.addTrack(camVideoTrack, localStream);
      newPeerConnection.addTrack(camAudioTrack, localStream);
      const setNewPeers = (stream) => {
        setPeers((peers) => {
          if (!peers[peerId] || stream) {
            peers[peerId] = {
              connection: newPeerConnection,
              sendChannel: sendChannel,
              receiveChannel: receiveChannel,
              stream,
            };
            return {
              ...peers,
            };
          }
          return peers;
        });
      };
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
        setNewPeers();
      };
      newPeerConnection.onaddstream = (event) => {
        setNewPeers(event.stream);
      };
      newPeerConnection.onremovestream = (event) => {
        setPeers((peers) => {
          peers[peerId].stream = null;
          return {
            ...peers,
          };
        });
      };
      setNewPeers();
      peers[peerId] = {
        connection: newPeerConnection,
        sendChannel: sendChannel,
        receiveChannel: receiveChannel,
      };
    }
    return peers[peerId];
  };
  const makeOffer = ({ by }) => {
    if (by === myUserId) {
      return;
    }
    let currentPeerConnection = getPeerConnection(by).connection;
    currentPeerConnection.createOffer(
      (sdp) => {
        currentPeerConnection.setLocalDescription(sdp);
        socket.send(
          JSON.stringify({
            by: myUserId,
            to: by,
            sdp: sdp,
            type: "message",
            rtcContent: "peerOffer",
          })
        );
      },
      (error) => {
        console.error(error, "createOffer");
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
          console.error(error, "setRemoteDescription");
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
        console.error(e, "setLocalDescription");
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
  useLayoutEffect(() => {
    for (let prop in peers) {
      const peerConnection = peers[prop].connection;
      let videoSender = peerConnection
        .getSenders()
        .find((x) => x.track.kind === "video");
      if (localStream) {
        let newVideoTrack = localStream.getVideoTracks()[0];
        videoSender.replaceTrack(newVideoTrack);
      }
    }
  }, [localStream]);
  return (
    <section className="container grid grid-cols-1 gap-3 mx-auto auto-rows-350px md:grid-cols-2 lg:grid-cols-3">
      <RemoteVideos peers={peers} userNames={userNames} />
    </section>
  );
};
