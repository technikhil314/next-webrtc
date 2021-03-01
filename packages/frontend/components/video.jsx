import { useEffect, useRef } from "react";

export default function Video({ stream }) {
  const vRef = useRef();
  useEffect(() => {
    vRef.current.srcObject = stream;
    vRef.current.play();
  }, []);
  return <video class="remote" ref={vRef}></video>;
}
