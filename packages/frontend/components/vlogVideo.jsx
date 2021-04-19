import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { classNames } from "../helpers/classNames";
import { userMediaConstraints } from "../utils/constants";
const backgroundBlurAmount = 6;
const edgeBlurAmount = 0;
const flipHorizontal = true;
function VlogVideo({ isRecording }, ref) {
  const isBlurRef = useRef(true);
  const localVideoElement = useRef();
  const canvasRef = useRef();
  const displayVideoElement = useRef();
  let displayStream = useRef(),
    normalLocalStream = useRef();

  const cleanUp = () => {
    displayStream.current && displayStream.current.getTracks().forEach((x) => x.stop());
    normalLocalStream.current && normalLocalStream.current.getTracks().forEach((x) => x.stop());
    displayStream.current = normalLocalStream.current = null;
  };

  const loadBodyPix = async () => {
    const options = {
      multiplier: 0.75,
      stride: 32,
      quantBytes: 4,
    };
    const net = await bodyPix.load(options);
    return net;
  };

  const blurVideo = async (net) => {
    const segmentation = await net.segmentPerson(localVideoElement.current);
    let _backgroundBlurAmount = isBlurRef.current ? backgroundBlurAmount : 0;
    bodyPix.drawBokehEffect(
      canvasRef.current,
      localVideoElement.current,
      segmentation,
      _backgroundBlurAmount,
      edgeBlurAmount,
      flipHorizontal
    );
    requestAnimationFrame(() => {
      blurVideo(net);
    });
  };
  useImperativeHandle(
    ref,
    () => ({
      getStream: () => {
        return new MediaStream([
          displayStream.current.getVideoTracks()[0],
          normalLocalStream.current.getAudioTracks()[0],
        ]);
      },
    }),
    [displayStream.current, normalLocalStream.current]
  );
  useEffect(() => {
    if (isRecording) {
      displayVideoElement.current.srcObject = canvasRef.current.captureStream(60);
      displayVideoElement.current.play();
      if (document.pictureInPictureEnabled) {
        displayVideoElement.current.addEventListener("loadedmetadata", () => {
          displayVideoElement.current.requestPictureInPicture();
        });
      }
    }
    return async () => {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      }
    };
  }, [isRecording]);
  useEffect(() => {
    (async () => {
      try {
        displayStream.current = await navigator.mediaDevices.getDisplayMedia({
          video: {
            width: 1920,
            height: 1080,
            displaySurface: {
              exact: "monitor",
            },
          },
        });
        normalLocalStream.current = await navigator.mediaDevices.getUserMedia({
          ...userMediaConstraints,
          video: true,
        });
        localVideoElement.current.srcObject = normalLocalStream.current;
        localVideoElement.current.play();
        localVideoElement.current.addEventListener("loadeddata", async () => {
          const net = await loadBodyPix();
          requestAnimationFrame(async () => {
            blurVideo(net);
          });
        });
      } catch (err) {
        cleanUp();
      }
    })();
    return cleanUp;
  }, []);
  return (
    <section className="flex flex-col gap-4 mt-5">
      <div className="controls">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="w-5 h-5 text-orange-600"
            defaultChecked={true}
            onClick={() => (isBlurRef.current = !isBlurRef.current)}
          />
          <span className="ml-2 text-gray-700">Background blur</span>
        </label>
      </div>
      <div className="flex flex-col items-center justify-center">
        <h4 className="text-lg fond-bold">
          This is how you will appear in video at bottom right corner <br /> but once recording starts you can drag and
          drop yourself anywhere in the screen and resize yourself too
        </h4>
        <canvas
          ref={canvasRef}
          height={300}
          width={400}
          className={classNames({
            "border border-1 rounded-md shadow-md w-full md:w-1/3": true,
          })}
        ></canvas>
        <video muted playsInline controls height={300} width={400} className="hidden" ref={localVideoElement}></video>
        <video
          muted
          playsInline
          controls
          width={200}
          className={classNames({
            "transform -scale-x-1 rounded-md shadow-md w-1 h-1": true,
            hidden: !isRecording,
          })}
          ref={displayVideoElement}
          allowFullScreen
        ></video>
      </div>
    </section>
  );
}

export default forwardRef(VlogVideo);
