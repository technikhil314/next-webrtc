import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import ErrorModal from "../components/errorModal";
import VlogVideo from "../components/vlogVideo";
import usePageVisibility from "../hooks/pageVisibility";
import { classNames } from "../utils/classNames";
import { text } from "../utils/constants";
import { capitalize, getBrowserName } from "../utils/helpers";
import useGetDevices from "../utils/hooks";
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
  const devices = useGetDevices();
  const streamRef = useRef();
  const defaultAudioDevice = devices.audio.find((x) => x.deviceId === "default") || {};
  const defaultVideoDevice = devices.video.find((x) => x.deviceId === "default") || {};
  const resetState = () => {
    setIsRecording(false);
    setMediaRecorder(null);
    setRecorderState("");
    setIsInitialized(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let json = {
      audioDevice: defaultAudioDevice.deviceId,
      videoDevice: defaultVideoDevice.deviceId,
    };
    formData.forEach((value, key) => {
      json[key] = value;
    });
    setIsInitialized(json);
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
    const browserName = getBrowserName(navigator.userAgent);
    if (!document.pictureInPictureEnabled || (browserName !== "chrome" && browserName !== "firefox")) {
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
        <script src="https://unpkg.com/@tensorflow/tfjs@3.4.0"></script>
        <script src="https://unpkg.com/@tensorflow-models/body-pix@2.1"></script>
      </Head>
      <section className="container flex flex-wrap items-center content-center justify-center w-full h-full px-4 mx-auto">
        {showError && <ErrorModal />}
        <h1 className="w-11/12 mb-10 text-3xl font-bold text-center lg:w-8/12">
          Simple in browser <wbr /> video recording for developers <wbr /> to create live coding videos.
        </h1>
        <div
          className={classNames({
            "w-1/2": isInitialized,
            "w-full": !isInitialized,
            "text-center": true,
          })}
        >
          <div className="w-full text-center">
            <h3 className="text-lg font-semibold">What all can you do here?</h3>
            <ul
              className={classNames({
                "flex flex-col w-11/12 gap-1 mx-auto mb-5 text-left text-lg": true,
                "md:text-center md:w-10/12 lg:w-9/12": !isInitialized,
              })}
            >
              <li>
                You can record your screen along with you in the video and store the recording <wbr /> To record click
                button below.
              </li>
            </ul>
          </div>
          <form className="w-full mx-auto md:w-1/4" onSubmit={handleFormSubmit}>
            {!isInitialized && (
              <>
                {devices.audio.length && (
                  <div className="flex flex-col">
                    <label className="w-full font-semibold" htmlFor="audioDevice">
                      Select audio input
                    </label>
                    <div className="relative inline-flex items-center mb-2">
                      <svg
                        className="absolute top-0 right-0 w-2 h-2 m-4 pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 412 232"
                      >
                        <path
                          d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
                          fill="#648299"
                          fillRule="nonzero"
                        />
                      </svg>
                      <select
                        name="audioDevice"
                        id="audioDevice"
                        defaultValue={defaultAudioDevice.deviceId}
                        className="w-full h-10 pl-5 pr-10 text-gray-600 bg-white border border-gray-300 rounded-full appearance-none hover:border-gray-400 focus:outline-none"
                      >
                        {devices.audio.map((audioDevice) => (
                          <option key={audioDevice.deviceId} value={audioDevice.deviceId}>
                            {audioDevice.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                {devices.video.length && (
                  <div className="flex flex-col">
                    <label className="w-full font-semibold" htmlFor="videoDevice">
                      Select video input
                    </label>
                    <div className="relative inline-flex items-center">
                      <svg
                        className="absolute top-0 right-0 w-2 h-2 m-4 pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 412 232"
                      >
                        <path
                          d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
                          fill="#648299"
                          fillRule="nonzero"
                        />
                      </svg>
                      <select
                        name="videoDevice"
                        id="videoDevice"
                        defaultValue={defaultVideoDevice.deviceId}
                        className="w-full h-10 pl-5 pr-10 text-gray-600 bg-white border border-gray-300 rounded-full appearance-none hover:border-gray-400 focus:outline-none"
                      >
                        {devices.video.map((videoDevice) => (
                          <option key={videoDevice.deviceId} value={videoDevice.deviceId}>
                            {videoDevice.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  className="flex-grow-0 w-full px-4 py-2 mt-5 font-bold text-white transition bg-green-500 rounded hover:bg-green-700"
                  id="initialize"
                >
                  Initialize
                </button>
              </>
            )}
          </form>
          {isInitialized && (
            <>
              <h3 className="mb-3 font-semibold text-md">Read this before clicking on the button below</h3>
              <ul
                className={classNames({
                  "text-md mx-auto w-10/12 text-left list-outside list-decimal flex flex-col gap-1.5": true,
                  "md:list-inside md:text-center md:w-8/12 lg:w-5/12": !isInitialized,
                })}
              >
                <li>This works all on your device locally. No data is sent to any server.</li>
                <li>The recording will automatically pause when you focus on this window.</li>
                <li>The title of this browser window will tell you the status.</li>
                <li>The recording will start/resume when you focus on other windows.</li>
                <li>Click on the button below anytime to stop and download the recording.</li>
              </ul>
            </>
          )}
          <button
            type="submit"
            className={`${classNames({
              "flex-grow-0 text-white font-bold py-2 px-4 rounded transition w-full mt-8": true,
              "md:w-1/2 lg:w-1/3": isInitialized,
              "bg-green-500 hover:bg-green-700": !isRecording,
              "bg-red-500 hover:bg-red-700": isRecording,
              hidden: !isInitialized,
            })}`}
            id="startRecording"
            onClick={handleRecording}
          >
            {`${pageTitle || "Start recording"}...`}
          </button>
        </div>
        {isInitialized && (
          <div className="w-1/2 text-center">
            <VlogVideo devices={isInitialized} isRecording={isRecording} ref={streamRef} />
          </div>
        )}
      </section>
    </>
  );
}
