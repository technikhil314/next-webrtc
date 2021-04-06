import Head from "next/head";
import { useRouter } from "next/router";
import { LocalVideo } from "../components/localVideos";
import { RemoteStreams } from "../components/remoteStreams";
import UserDetails from "../components/userDetails";
import { classNames } from "../helpers/classNames";
import useSocketConnection from "../hooks/socketConnection";
import { useRhinoState } from "../store/states";
import { capitalize } from "../utils/helpers";

export default function Main() {
  const [isStarted, setIsStarted] = useRhinoState("isStarted");
  const [userName] = useRhinoState("userName");
  const [localStream] = useRhinoState("localStream");
  const [shareScreen, setShareScreen] = useRhinoState("shareScreen");
  const [roomName] = useRhinoState("roomName");
  const { userId: myUserId, socket } = useSocketConnection(isStarted, userName);
  const router = useRouter();
  const stop = () => {
    router.push("/");
    setIsStarted(false);
  };
  const PageHead = () => (
    <Head>
      <title>{`${capitalize(roomName || "Your room")} | OpenRTC`}</title>
    </Head>
  );
  if (!isStarted) {
    return (
      <>
        <PageHead />
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
      </>
    );
  }
  return (
    <>
      <PageHead />
      <div className="w-full container mx-auto px-4 flex justify-center items-center">
        <button
          type="submit"
          className="bg-red-500 flex-grow-0 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
          onClick={stop}
        >
          Stop
        </button>
        <button
          type="submit"
          className={`${classNames({
            "flex-grow-0 text-white font-bold py-2 px-4 rounded transition": true,
            "bg-green-500 hover:bg-green-700": !shareScreen,
            "bg-red-500 hover:bg-red-700": shareScreen,
          })}`}
          onClick={() => setShareScreen(!shareScreen)}
        >
          {shareScreen ? "Stop share" : "Share screen"}
        </button>
      </div>
      <LocalVideo />
      {socket && localStream && (
        <RemoteStreams socket={socket} myUserId={myUserId} />
      )}
    </>
  );
}
