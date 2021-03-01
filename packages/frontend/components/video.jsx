import { useEffect, useRef } from "react";

export default function Video({ peer }) {
  const vRef = useRef();
  useEffect(() => {
    vRef.current.srcObject = peer.stream;
    vRef.current.play();
  }, []);
  return <video class="remote" ref={vRef}></video>;
}
