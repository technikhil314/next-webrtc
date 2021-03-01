import { forwardRef, useRef, useEffect } from "react";
import useLocalStream from "../hooks/localStream";
export const LocalVideo = forwardRef(({ isStarted }, ref) => {
  const localStream = useLocalStream();
  const localVideoElement = useRef();
  useEffect(() => {
    ref.current = localStream;
    if (isStarted) {
      localVideoElement.current.srcObject = localStream;
      localVideoElement.current.play();
    }
  }, [localStream, isStarted]);
  return isStarted ? <video ref={localVideoElement}></video> : null;
});
