import { useRef } from "react";
import { LocalVideo } from "../components/localVideos";
import { RemoteStreams } from "../components/remoteStreams";
import UserDetails from "../components/userDetails";
import useSocketConnection from "../hooks/socketConnection";
import { useRhinoState } from "../store/states";

export default function Main() {
  const [isStarted] = useRhinoState("isStarted");
  const [userName] = useRhinoState("userName");
  const localStream = useRef();
  const { userId: myUserId, socket } = useSocketConnection(isStarted, userName);
  if (!isStarted) {
    return (
      <section className="w-full container mx-auto px-4 grid grid-cols-1 grid-rows-2 md:grid-rows-1 md:grid-cols-2 min-h-full">
        <div className="flex flex-col justify-around md:justify-center items-center">
          <h1 className="text-2xl font-bold text-center md:mb-8">
            An open source alternative to video conferencing
          </h1>
          <UserDetails />
        </div>
        <article className="w-full md:w-2/3 text-center mx-auto flex flex-col justify-center min-h-full">
          <h1 className="text-2xl font-bold text-center md:mb-8">
            Hello, This is an attempt to respect your privacy.
          </h1>
        </article>
      </section>
    );
  }
  return (
    <>
      <LocalVideo ref={localStream}></LocalVideo>
      {socket && localStream && (
        <RemoteStreams
          socket={socket}
          localStream={localStream}
          myUserId={myUserId}
        />
      )}
    </>
  );
}

Main.title = "OpenRTC | An open source alternative to video conferencing.";
Main.description =
  "OpenRTC is an attempt to bring privacy first video conferencing to the world.";
