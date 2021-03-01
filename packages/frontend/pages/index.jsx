import { useRef, useState } from "react";
import { LocalVideo } from "../components/localVideos";
import { RemoteStreams } from "../components/remoteStreams";
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
  return (
    <>
      <button onClick={startMeetingRoom}>{isStarted ? "Stop" : "Start"}</button>
      <LocalVideo ref={localStream} isStarted={isStarted}></LocalVideo>
      {isStarted && (
        <>
          {socket && localStream && (
            <RemoteStreams
              socket={socket}
              localStream={localStream}
              myUserId={myUserId}
            />
          )}
        </>
      )}
    </>
  );
}
