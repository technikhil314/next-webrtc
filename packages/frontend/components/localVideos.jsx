import { forwardRef, useEffect, useRef } from "react";
import useLocalStream from "../hooks/localStream";
import { useRhinoState } from "../store/states";
export const LocalVideo = forwardRef((data, ref) => {
  const [isStarted] = useRhinoState("isStarted");
  const localStream = useLocalStream();
  const localVideoElement = useRef();
  useEffect(() => {
    ref.current = localStream;
    if (isStarted) {
      localVideoElement.current.srcObject = localStream;
      localVideoElement.current.play();
    }
  }, [localStream, isStarted]);
  return isStarted ? (
    <video
      id="localVideo"
      className="absolute cursor-move right-10 bottom-10 rounded"
      width={200}
      height={100}
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
      ref={localVideoElement}
    ></video>
  ) : null;
});

LocalVideo.displayName = "LocalVideo";
