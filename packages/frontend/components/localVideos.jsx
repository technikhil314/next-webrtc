import { forwardRef, useRef, useEffect } from "react";
import useLocalStream from "../hooks/localStream";
export const LocalVideo = forwardRef((props, ref) => {
  const localStream = useLocalStream();
  const localVideoElement = useRef();
  useEffect(() => {
    ref.current = localStream;
    localVideoElement.current.srcObject = localStream;
    localVideoElement.current.play();
  }, [localStream]);
  return <video ref={localVideoElement}></video>;
});
