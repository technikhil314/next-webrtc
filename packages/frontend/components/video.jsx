import { useEffect, useRef } from "react";

export default function Video({ peer, userName }) {
  const vRef = useRef();
  useEffect(() => {
    if (vRef.current) {
      vRef.current.srcObject = peer.stream;
      vRef.current.play();
    }
  }, [peer]);
  return peer && peer.stream ? (
    <article
      className="remote-video w-full rounded-lg shadow-md h-full bg-black"
      data-userName={userName}
    >
      <video
        className="w-full rounded-lg shadow-md h-full bg-black"
        playsInline
        ref={vRef}
        controls
      ></video>
    </article>
  ) : null;
}
