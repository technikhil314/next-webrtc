import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Modal from "../components/modal";
import { classNames } from "../helpers/classNames";
import usePageVisibility from "../hooks/pageVisibility";
import { text, userMediaConstraints } from "../utils/constants";
import { capitalize } from "../utils/helpers";

let done = false;
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
  const localVideoElement = useRef();
  const isPiPSupported = useRef(true);
  const canvasRef = useRef();
  const displayVideoElement = useRef();
  let stream = useRef(),
    normalLocalStream = useRef();
  const resetState = () => {
    setIsRecording(false);
    setMediaRecorder(null);
    setRecorderState("");
    setIsInitialized(false);
  };
  const onModalClose = () => {
    setShowError(false);
  };
  const loadBodyPix = async () => {
    const options = {
      multiplier: 0.75,
      stride: 32,
      quantBytes: 4,
    };
    const net = await bodyPix.load(options);
    return net;
  };

  const blurVideo = async ({
    backgroundBlurAmount,
    edgeBlurAmount,
    flipHorizontal,
    net,
  }) => {
    const segmentation = await net.segmentPerson(localVideoElement.current);
    bodyPix.drawBokehEffect(
      canvasRef.current,
      localVideoElement.current,
      segmentation,
      backgroundBlurAmount,
      edgeBlurAmount,
      flipHorizontal
    );
    if (!done) {
      displayVideoElement.current.srcObject = canvasRef.current.captureStream(
        60
      );
      displayVideoElement.current.addEventListener("loadedmetadata", () => {
        displayVideoElement.current.play();
        displayVideoElement.current.requestPictureInPicture();
      });
      done = true;
    }
    requestAnimationFrame(() =>
      blurVideo({
        backgroundBlurAmount,
        edgeBlurAmount,
        flipHorizontal,
        net,
      })
    );
  };

  useEffect(async () => {
    const backgroundBlurAmount = 6;
    const edgeBlurAmount = 2;
    const flipHorizontal = true;
    if (isRecording) {
      const net = await loadBodyPix();
      requestAnimationFrame(async () => {
        blurVideo({
          backgroundBlurAmount,
          edgeBlurAmount,
          flipHorizontal,
          net,
        });
      });
    }
  }, [isRecording]);
  const initialize = async () => {
    if (!isInitialized) {
      try {
        stream.current = await navigator.mediaDevices.getDisplayMedia({
          video: {
            width: 1920,
            height: 1080,
            displaySurface: {
              exact: "monitor",
            },
          },
        });
        normalLocalStream.current = await navigator.mediaDevices.getUserMedia({
          ...userMediaConstraints,
          video: true,
        });
        localVideoElement.current.srcObject = normalLocalStream.current;
        localVideoElement.current.play();
        setIsInitialized(true);
      } catch (err) {
        stream.current = normalLocalStream.current = null;
        resetState();
      }
    }
  };
  const handleRecording = async () => {
    if (isInitialized && !isRecording) {
      // if (isPiPSupported.current) {
      //   await localVideoElement.current.requestPictureInPicture();
      // }
      stream.current.addTrack(normalLocalStream.current.getAudioTracks()[0]);
      const mediaRec = new MediaRecorder(stream.current);
      setMediaRecorder(mediaRec);
      setIsRecording(true);
    } else if (isRecording && isInitialized) {
      stream.current && stream.current.getTracks().forEach((x) => x.stop());
      normalLocalStream.current &&
        normalLocalStream.current.getTracks().forEach((x) => x.stop());
      if (mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      } else {
        resetState();
      }
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      }
    }
  };
  useEffect(() => {
    if (!document.pictureInPictureEnabled) {
      setShowError(true);
      isPiPSupported.current = false;
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
            <p>
              Opps.... Your browser does not support required features to record
              vlog. <br />{" "}
              <h3 className="text-lg font-bold">
                But don{`'`}t worry all you need to do is put the video in
                picture in picture mode.
              </h3>
            </p>
          </Modal>
        )}
        <div className="w-full text-center">
          <canvas ref={canvasRef} className="hidden"></canvas>
          <h1 className="text-lg font-bold">
            An in browser video recording software for developers to create live
            coding videos and share their knowledge
          </h1>
          <div className="w-full text-left md:text-center">
            <h3 className="mb-1 text-lg font-semibold">
              What all can you do here?
            </h3>
            <ul className="flex flex-col w-11/12 gap-1 mx-auto mb-5 text-left text-md md:text-center md:w-10/12 lg:w-9/12">
              <li>
                You can record your screen along with you in the screen and
                store the recording <br /> To record click button below.
              </li>
            </ul>
          </div>
          <h3 className="mb-3 font-semibold text-md">
            Read this before clicking on the button below
          </h3>
          <ul className="text-md mx-auto w-10/12 text-left list-outside list-decimal md:list-inside md:text-center md:w-8/12 lg:w-5/12 flex flex-col gap-1.5">
            <li>
              This works all on your device locally. No data is sent to any
              server.
            </li>
            <li>
              The recording will automatically pause when you focus on this
              window.
            </li>
            <li>The title of this browser window will tell you the status.</li>
            <li>
              The recording will start/resume when you focus on other windows.
            </li>
            <li>
              Click on the button below anytime to stop and download the
              recording.
            </li>
          </ul>
          <button
            type="submit"
            className={`${classNames({
              "bg-green-500 hover:bg-green-700 flex-grow-0 text-white font-bold py-2 px-4 rounded transition w-full md:w-1/4 lg:w-1/6 mt-8": true,
              hidden: isInitialized,
            })}`}
            onClick={initialize}
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
        </div>
        <video
          muted
          playsInline
          controls
          height={150}
          width={200}
          className="hidden"
          ref={localVideoElement}
        ></video>
        <video
          muted
          playsInline
          controls
          width={200}
          className={classNames({
            "transform -scale-x-1": recorderState,
            "opacity-0": isPiPSupported.current,
            hidden: true,
          })}
          ref={displayVideoElement}
        ></video>
      </section>
    </>
  );
}
