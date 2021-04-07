import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { classNames } from "../helpers/classNames";
import usePageVisibility from "../hooks/pageVisibility";
import {
  text,
  userMediaConstraints,
  vlogRecordingVideoCodecType,
} from "../utils/constants";
import { capitalize } from "../utils/helpers";
import { useRouter } from "next/router";
import Modal from "../components/modal";
export default function Vlog() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [showError, setShowError] = useState();
  const [mediaRecorder, setMediaRecorder] = useState();
  const [recorderState, setRecorderState] = useState();
  const isPageVisible = usePageVisibility();
  const localVideoElement = useRef();
  let stream = useRef(),
    normalLocalStream = useRef();
  useEffect(() => {
    if (!document.pictureInPictureEnabled) {
      setShowError(true);
    }
  }, []);

  const handleRecording = async () => {
    if (!isRecording) {
      try {
        stream.current = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        normalLocalStream.current = await navigator.mediaDevices.getUserMedia(
          userMediaConstraints
        );
        stream.current.addTrack(normalLocalStream.current.getAudioTracks()[0]);
        setMediaRecorder(
          new MediaRecorder(stream.current, vlogRecordingVideoCodecType)
        );
        localVideoElement.current.srcObject = normalLocalStream.current;
        localVideoElement.current.play();
        localVideoElement.current.onloadedmetadata = async () => {
          !document.pictureInPictureElement &&
            localVideoElement.current.requestPictureInPicture();
        };
        setIsRecording(true);
      } catch (err) {
        stream.current = normalLocalStream.current = null;
        setIsRecording(false);
      }
    } else {
      mediaRecorder.state !== "inactive" && mediaRecorder.stop();
      setIsRecording(!isRecording);
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      }
      stream.current && stream.current.getTracks().forEach((x) => x.stop());
      normalLocalStream.current &&
        normalLocalStream.current.getTracks().forEach((x) => x.stop());
    }
  };
  useEffect(() => {
    if (mediaRecorder) {
      let recordedChunks = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
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
          setIsRecording(false);
          setMediaRecorder(null);
          setRecorderState("");
        }
      };
      setRecorderState(capitalize(mediaRecorder.state));
    }
  }, [mediaRecorder]);
  useEffect(() => {
    if (mediaRecorder) {
      if (!isPageVisible && mediaRecorder.state === "inactive") {
        mediaRecorder.start();
      } else if (mediaRecorder.state === "recording") {
        mediaRecorder.pause();
      } else if (mediaRecorder.state === "paused") {
        mediaRecorder.resume();
      }
      setRecorderState(capitalize(mediaRecorder.state));
    }
  }, [isPageVisible]);
  const onModalClose = () => {
    router.push("/");
  };
  const pageTitle = mediaRecorder && recorderState;
  return (
    <>
      <Head>
        <title>{`${pageTitle || "Vlog"} | ${text.appName}`}</title>
      </Head>
      <section className="w-full container mx-auto px-4 flex flex-wrap items-center justify-center h-full">
        {showError && (
          <Modal title="Oops..." onClose={onModalClose}>
            <p>
              Opps.... You browser does not support required features to record
              vlog. We recommend using latest version of chrome.
            </p>
          </Modal>
        )}
        <div className="w-full text-center">
          <button
            type="submit"
            className={`${classNames({
              "flex-grow-0 text-white font-bold py-2 px-4 rounded transition w-full md:w-1/4 lg:w-1/6 mb-8": true,
              "bg-green-500 hover:bg-green-700": !isRecording,
              "bg-red-500 hover:bg-red-700": isRecording,
            })}`}
            onClick={handleRecording}
          >
            {`${pageTitle || "Start recording"}...`}
          </button>
          <h3 className="text-lg font-semibold mb-5">
            Read this before clicking on the button above
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
              Click on the button above anytime to stop and download the
              recording.
            </li>
          </ul>
        </div>
        <video
          muted
          playsInline
          className="hidden"
          ref={localVideoElement}
        ></video>
      </section>
    </>
  );
}
