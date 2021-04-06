import { useRef, useState, useEffect } from "react";
import { classNames } from "../helpers/classNames";
import { userMediaConstraints } from "../utils/constants";

export default function Vlog() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState();
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
        let options = { mimeType: "video/webm; codecs=vp9" };
        setMediaRecorder(new MediaRecorder(stream, options));
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
      mediaRecorder.start();
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
        }
      };
    }
  }, [mediaRecorder]);
  return (
    <section className="w-full container mx-auto px-4 flex items-center justify-center h-full">
      <button
        type="submit"
        className={`${classNames({
          "flex-grow-0 text-white font-bold py-2 px-4 rounded transition w-full md:w-1/4 lg:w-1/6": true,
          "bg-green-500 hover:bg-green-700": !isRecording,
          "bg-red-500 hover:bg-red-700": isRecording,
        })}`}
        onClick={() => {
          if (isRecording) {
            mediaRecorder.stop();
          }
          setIsRecording(!isRecording);
        }}
      >
        {isRecording ? "Stop recording" : "Start recording"}
      </button>
      <video className="hidden" ref={localVideoElement}></video>
    </section>
  );
}
