import { useEffect, useState } from "react";
import { userMediaConstraints } from "../utils/constants";

export default function useLocalStream() {
  const [localStream, setLocalStream] = useState();
  useEffect(() => {
    let stream;
    (async () => {
      stream = await navigator.mediaDevices.getUserMedia(userMediaConstraints);
      setLocalStream(stream);
    })();
    return () => {
      stream.getTracks().forEach((x) => x.stop());
    };
  }, []);
  return localStream;
}
