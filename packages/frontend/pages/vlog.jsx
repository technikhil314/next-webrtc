import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { classNames } from "../helpers/classNames";
import usePageVisibility from "../hooks/pageVisibility";
import {
  userMediaConstraints,
  vlogRecordingVideoCodecType,
} from "../utils/constants";
import { capitalize } from "../utils/helpers";

export default function Vlog() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState();
  const [recorderState, setRecorderState] = useState();
  const isPageVisible = usePageVisibility();
  const localVideoElement = useRef();
  useEffect(() => {
    let stream, normalLocalStream;
    (async () => {
      if (isRecording) {
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        normalLocalStream = await navigator.mediaDevices.getUserMedia(
          userMediaConstraints
        );
        stream.addTrack(normalLocalStream.getAudioTracks()[0]);
        setMediaRecorder(
          new MediaRecorder(stream, vlogRecordingVideoCodecType)
        );
        localVideoElement.current.srcObject = normalLocalStream;
        localVideoElement.current.play();
        localVideoElement.current.onloadedmetadata = async () => {
          !document.pictureInPictureElement &&
            localVideoElement.current.requestPictureInPicture();
        };
      }
    })();
    return async () => {
      if (isRecording) {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        }
        stream && stream.getTracks().forEach((x) => x.stop());
        normalLocalStream &&
          normalLocalStream.getTracks().forEach((x) => x.stop());
      }
    };
  }, [isRecording]);
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
          a.download = "test.webm";
          a.click();
          window.URL.revokeObjectURL(url);
          setIsRecording(false);
          setMediaRecorder(null);
          setRecorderState("");
        }
      };
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
  const pageTitle = mediaRecorder && recorderState;
  return (
    <>
      <Head>
        <title>{`${pageTitle || "Vlog"} | OpenRTC`}</title>
      </Head>
      <section className="w-full container mx-auto px-4 flex flex-wrap items-center justify-center h-full">
        <div className="w-full text-center">
          <button
            type="submit"
            className={`${classNames({
              "flex-grow-0 text-white font-bold py-2 px-4 rounded transition w-full md:w-1/4 lg:w-1/6 mb-5": true,
              "bg-green-500 hover:bg-green-700": !isRecording,
              "bg-red-500 hover:bg-red-700": isRecording,
            })}`}
            onClick={() => {
              if (isRecording) {
                mediaRecorder.state !== "inactive" && mediaRecorder.stop();
              }
              setIsRecording(!isRecording);
            }}
          >
            {`${pageTitle || "Start recording"}...`}
          </button>
          <ul className="text-sm w-full text-center">
            <li>
              The recording will automatically pause when you focus on this
              window
            </li>
            <li>
              The recording will start/resume when you focus on other windows.
            </li>
            <li>Click on the button above anytime to download the recording</li>
          </ul>
        </div>
        <video
          muted
          playsinline
          className="hidden"
          ref={localVideoElement}
        ></video>
      </section>
    </>
  );
}
