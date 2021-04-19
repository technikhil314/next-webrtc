import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Modal from "../components/modal";
import VlogVideo from "../components/vlogVideo";
import { classNames } from "../helpers/classNames";
import usePageVisibility from "../hooks/pageVisibility";
import { text } from "../utils/constants";
import { capitalize } from "../utils/helpers";
export async function getStaticProps() {
  return {
    props: {},
  };
}
export default function Vlog() {
  const [isRecording, setIsRecording] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showError, setShowError] = useState();
  const [mediaRecorder, setMediaRecorder] = useState();
  const [recorderState, setRecorderState] = useState();
  const isPageVisible = usePageVisibility();
  const streamRef = useRef();
  const router = useRouter();
  const resetState = () => {
    setIsRecording(false);
    setMediaRecorder(null);
    setRecorderState("");
    setIsInitialized(false);
  };
  const onModalClose = () => {
    router.push("/meetings");
  };

  const handleRecording = async () => {
    if (isInitialized && !isRecording) {
      const mediaRec = new MediaRecorder(streamRef.current.getStream());
      setMediaRecorder(mediaRec);
      setIsRecording(true);
    } else if (isRecording && isInitialized) {
      if (mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      } else {
        resetState();
      }
    }
  };
  useEffect(() => {
    if (!document.pictureInPictureEnabled) {
      setShowError(true);
    }
  }, []);
  useEffect(() => {
    if (mediaRecorder) {
      let recordedChunks = [];
      mediaRecorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      });
      mediaRecorder.addEventListener("stop", () => {
        let blob = new Blob(recordedChunks, {
          type: "video/webm",
        });
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = `${new Date().toISOString()}.webm`;
        a.click();
        window.URL.revokeObjectURL(url);
        resetState();
      });
      setRecorderState(capitalize(mediaRecorder.state));
    }
  }, [mediaRecorder]);
  useEffect(() => {
    if (mediaRecorder) {
      if (!isPageVisible && mediaRecorder.state === "inactive") {
        mediaRecorder.start();
      } else if (mediaRecorder.state === "recording") {
        mediaRecorder.pause && mediaRecorder.pause();
      } else if (mediaRecorder.state === "paused") {
        mediaRecorder.resume && mediaRecorder.resume();
      }
      setRecorderState(capitalize(mediaRecorder.state));
    }
  }, [isPageVisible]);

  const pageTitle = mediaRecorder && recorderState;
  return (
    <>
      <Head>
        <title>{`${pageTitle || "Vlog"} | ${text.appName}`}</title>
        <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.2"></script>
        <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/body-pix@2.0"></script>
      </Head>
      <section className="container flex flex-wrap items-center justify-center w-full h-full px-4 mx-auto">
        {showError && (
          <Modal title="Oops..." onClose={onModalClose}>
            <p>Opps.... Your browser does not support required features to record vlog.</p>
          </Modal>
        )}
        <div className="w-full text-center">
          <h1 className="text-lg font-bold">
            An in browser video recording software for developers to create live coding videos and share their knowledge
          </h1>
          <div className="w-full text-left md:text-center">
            <h3 className="mb-1 text-lg font-semibold">What all can you do here?</h3>
            <ul className="flex flex-col w-11/12 gap-1 mx-auto mb-5 text-left text-md md:text-center md:w-10/12 lg:w-9/12">
              <li>
                You can record your screen along with you in the screen and store the recording <br /> To record click
                button below.
              </li>
            </ul>
          </div>
          <h3 className="mb-3 font-semibold text-md">Read this before clicking on the button below</h3>
          <ul className="text-md mx-auto w-10/12 text-left list-outside list-decimal md:list-inside md:text-center md:w-8/12 lg:w-5/12 flex flex-col gap-1.5">
            <li>This works all on your device locally. No data is sent to any server.</li>
            <li>The recording will automatically pause when you focus on this window.</li>
            <li>The title of this browser window will tell you the status.</li>
            <li>The recording will start/resume when you focus on other windows.</li>
            <li>Click on the button below anytime to stop and download the recording.</li>
          </ul>
          <button
            type="submit"
            className={`${classNames({
              "bg-green-500 hover:bg-green-700 flex-grow-0 text-white font-bold py-2 px-4 rounded transition w-full md:w-1/4 lg:w-1/6 mt-8": true,
              hidden: isInitialized,
            })}`}
            onClick={() => setIsInitialized(!isInitialized)}
          >
            Initialize
          </button>
          <button
            type="submit"
            className={`${classNames({
              "flex-grow-0 text-white font-bold py-2 px-4 rounded transition w-full md:w-1/4 lg:w-1/6 mt-8": true,
              "bg-green-500 hover:bg-green-700": !isRecording,
              "bg-red-500 hover:bg-red-700": isRecording,
              hidden: !isInitialized,
            })}`}
            onClick={handleRecording}
          >
            {`${pageTitle || "Start recording"}...`}
          </button>
          {isInitialized && <VlogVideo isRecording={isRecording} ref={streamRef} />}
        </div>
      </section>
    </>
  );
}
