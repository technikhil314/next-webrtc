import { useRef, useState } from "react";
import { LocalVideo } from "../components/localVideos";
import Video from "../components/video";
import useRTCSignaling from "../hooks/RTCSignaling";
import useSocketConnection from "../hooks/socketConnection";

export default function Main(params) {
  const [isStarted, setIsStarted] = useState(false);
  const localStream = useRef();
  const startMeetingRoom = () => {
    setIsStarted(!isStarted);
  };
  const { userId: myUserId, socket } = useSocketConnection(isStarted);
  const peers = useRTCSignaling({
    myUserId,
    socket,
    localStream,
  });
  console.log(peers, "index");
  return (
    <>
      <button onClick={startMeetingRoom}>{isStarted ? "Stop" : "Start"}</button>
      {isStarted && (
        <>
          <LocalVideo ref={localStream}></LocalVideo>
          {peers.map((x) => x && x.stream && <Video peer={x} />)}
        </>
      )}
    </>
  );
}
