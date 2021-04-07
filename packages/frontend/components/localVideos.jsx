import { useEffect, useRef } from "react";
import { useRhinoState } from "../store/states";
import { userMediaConstraints } from "../utils/constants";
export const LocalVideo = ({ isVlog }) => {
  const localVideoElement = useRef();
  const [localStream, setLocalStream] = useRhinoState("localStream");
  const [shareScreen, setShareScreen] = useRhinoState("shareScreen");
  const [isStarted] = useRhinoState("isStarted");

  useEffect(() => {
    let stream = {},
      normalLocalStream;
    (async () => {
      let videoTrack, audioTrack;
      let normalLocalStream = await navigator.mediaDevices.getUserMedia(
        userMediaConstraints
      );
      if (shareScreen) {
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        stream.oninactive = () => {
          setShareScreen(false);
        };
        videoTrack = stream.getVideoTracks()[0];
      } else {
        videoTrack = normalLocalStream.getVideoTracks()[0];
      }
      audioTrack = normalLocalStream.getAudioTracks()[0];
      setLocalStream(new MediaStream([audioTrack, videoTrack]));
    })();
    return () => {
      normalLocalStream &&
        normalLocalStream.getTracks().forEach((x) => x.stop());
    };
  }, [shareScreen, isStarted, isVlog]);
  useEffect(() => {
    if (isStarted) {
      localVideoElement.current.srcObject = localStream;
      localVideoElement.current.play();
    }
    return async () => {
      localStream && localStream.getTracks().forEach((x) => x.stop());
    };
  }, [localStream]);
  return isStarted ? (
    <article
      className="z-10 absolute cursor-move right-2 bottom-2 md:right-10 md:bottom-10 rounded w-1/4 md:w-1/5 lg:w-1/6 local-video"
      id="localVideo"
      data-username="you"
      draggable
      onDragStart={(event) => {
        var style = getComputedStyle(event.target, null);
        event.dataTransfer.setData(
          "text/plain",
          `localVideo,${
            parseInt(style.getPropertyValue("left"), 10) - event.clientX
          },${parseInt(style.getPropertyValue("top"), 10) - event.clientY}`
        );
      }}
    >
      <video
        className="absolute right-0 bottom-0 rounded w-full"
        width={200}
        height={100}
        muted
        controls
        playsInline
        ref={localVideoElement}
      ></video>
    </article>
  ) : null;
};

LocalVideo.displayName = "LocalVideo";
