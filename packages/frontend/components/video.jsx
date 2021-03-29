import { useEffect, useRef } from "react";

export default function Video({ peer }) {
  const vRef = useRef();
  useEffect(() => {
    if (vRef.current) {
      vRef.current.srcObject = peer.stream;
      vRef.current.play();
    }
  }, [peer]);
  return peer && peer.stream ? (
    <video
      className="w-full rounded-lg"
      ref={vRef}
      data-userName={peer.connection.userName}
      controls
    ></video>
  ) : null;
}
