import { useEffect, useState } from "react";

export default function useGetDevices() {
  let defaultDevices = {
    audio: [],
    video: [],
  };
  const [devices, setDevices] = useState(defaultDevices);
  useEffect(() => {
    (async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        return;
      }
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        defaultDevices = devices.reduce((acc, device) => {
          if (device.kind === "videoinput") {
            acc.video.push(device);
          }
          if (device.kind === "audioinput") {
            acc.audio.push(device);
          }
          return acc;
        }, defaultDevices);
        setDevices({ ...defaultDevices });
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);
  return devices;
}
