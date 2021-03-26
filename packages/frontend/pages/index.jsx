import { useRef, useState } from "react";
import { LocalVideo } from "../components/localVideos";
import { RemoteStreams } from "../components/remoteStreams";
import useSocketConnection from "../hooks/socketConnection";

export default function Main(params) {
  const [isStarted, setIsStarted] = useState(false);
  const localStream = useRef();
  const startMeetingRoom = () => {
    setIsStarted(!isStarted);
  };
  const { userId: myUserId, socket } = useSocketConnection(isStarted);
  return (
    <section className="container mx-4 md:mx-auto">
      <button
        onClick={startMeetingRoom}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {isStarted ? "Stop" : "Start"}
      </button>
      {isStarted && (
        <>
          <LocalVideo ref={localStream} isStarted={isStarted}></LocalVideo>
          {socket && localStream && (
            <RemoteStreams
              socket={socket}
              localStream={localStream}
              myUserId={myUserId}
            />
          )}
        </>
      )}
    </section>
  );
}
