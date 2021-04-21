import Head from "next/head";
import { useRouter } from "next/router";
import { LocalVideo } from "../components/localVideos";
import { RemoteStreams } from "../components/remoteStreams";
import UserDetails from "../components/userDetails";
import { classNames } from "../utils/classNames";
import useSocketConnection from "../hooks/socketConnection";
import { useRhinoState } from "../store/states";
import { text } from "../utils/constants";
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
  const copyToClipboard = () => {
    const el = document.createElement("textarea");
    el.value = `${process.env.NEXT_PUBLIC_URL}/${roomName}`;
    el.classList.add("opacity-0", "h-1", "w-1", "absolute", "top-0", "-z-1");
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };
  const PageHead = () => (
    <Head>
      <title>{`${capitalize(roomName || "Your room")} | ${text.appName}`}</title>
    </Head>
  );
  if (!isStarted) {
    return (
      <>
        <PageHead />
        <section className="flex flex-col justify-center h-full">
          <h1 className="mb-20 text-3xl font-bold text-center">An open source alternative to video conferencing</h1>
          <div className="container grid w-full grid-cols-1 grid-rows-2 px-4 mx-auto md:grid-rows-1 md:grid-cols-2">
            <div className="flex flex-col items-center justify-around md:justify-center">
              <UserDetails />
              <button
                className="flex-grow-0 p-2 mt-5 text-sm font-bold text-white transition bg-green-500 rounded hover:bg-green-700"
                onClick={copyToClipboard}
              >
                Copy invite link
              </button>
            </div>
            <article className="flex flex-col justify-center w-full min-h-full mx-auto text-center md:w-2/3">
              <h1 className="text-2xl font-bold text-center md:mb-8">
                Hello, This is an attempt to respect your privacy.
              </h1>
            </article>
          </div>
        </section>
      </>
    );
  }
  return (
    <>
      <PageHead />
      <div className="container flex items-center justify-center w-full px-4 mx-auto mb-4">
        <button
          type="submit"
          className="flex-grow-0 px-4 py-2 font-bold text-white transition bg-red-500 rounded hover:bg-red-700"
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
      {socket && localStream && <RemoteStreams socket={socket} myUserId={myUserId} />}
    </>
  );
}
