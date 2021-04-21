import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { classNames } from "../helpers/classNames";
import { userMediaConstraints } from "../utils/constants";
let backgroundBlurAmount = 6;
let edgeBlurAmount = 0;
let enableMirrorEffect = false;
let enableVirtualBackground = false;
let removeBackground = false;
let enableBlur = false;
let backgroundImage = null;
function VlogVideo({ isRecording }, ref) {
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
      stride: 16,
      quantBytes: 2,
    };
    const net = await bodyPix.load(options);
    return net;
  };

  const blurVideoBg = (segmentation) => {
    let _backgroundBlurAmount = enableBlur ? backgroundBlurAmount : 0;
    bodyPix.drawBokehEffect(
      canvasRef.current,
      localVideoElement.current,
      segmentation,
      _backgroundBlurAmount,
      edgeBlurAmount,
      enableMirrorEffect
    );
  };

  async function removeBg(segmentation) {
    const foregroundColor = { r: 0, g: 0, b: 0, a: 255 };
    const backgroundColor = { r: 0, g: 0, b: 0, a: 0 };
    const backgroundDarkeningMask = bodyPix.toMask(segmentation, foregroundColor, backgroundColor, false);
    const ctx = canvasRef.current.getContext("2d");
    ctx.globalCompositeOperation = "source-over";
    ctx.putImageData(backgroundDarkeningMask, 0, 0);
    ctx.globalCompositeOperation = "source-in";
    ctx.drawImage(localVideoElement.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
  }
  async function addVirtualBg() {
    const ctx = canvasRef.current.getContext("2d");
    ctx.globalCompositeOperation = "destination-atop";
    ctx.drawImage(backgroundImage, 0, 0, canvasRef.current.width, canvasRef.current.height);
  }

  const processVideo = async (net) => {
    const segmentation = await net.segmentPerson(localVideoElement.current, {
      flipHorizontal: false,
      internalResolution: "medium",
      segmentationThreshold: 0.5,
    });
    if (enableVirtualBackground) {
      removeBg(segmentation);
      addVirtualBg();
    } else if (removeBackground) {
      removeBg(segmentation);
    } else if (enableBlur) {
      blurVideoBg(segmentation);
    } else {
      const ctx = canvasRef.current.getContext("2d");
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(localVideoElement.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    requestAnimationFrame(() => {
      processVideo(net);
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
    const img = new Image();
    img.src = "/virtual-bgs/1.jpg";
    img.onload = () => {
      backgroundImage = img;
    };
  }, []);
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
          processVideo(net);
        });
      } catch (err) {
        cleanUp();
      }
    })();
    return cleanUp;
  }, []);
  return (
    <section className="flex flex-col gap-4 mt-5">
      <div className="flex justify-center gap-4">
        <div className="inline-flex items-center">
          <label className="ml-2 mr-2 text-gray-700" htmlFor="toggleBlur">
            Toggle blur
          </label>
          <input
            id="toggleBlur"
            type="checkbox"
            className="w-5 h-5 text-orange-600"
            defaultChecked={enableBlur}
            onClick={() => (enableBlur = !enableBlur)}
          />
        </div>
        <div className="inline-flex items-center">
          <label className="ml-2 mr-2 text-gray-700" htmlFor="blurAmount">
            Blur Amount
          </label>
          <input
            id="blurAmount"
            type="range"
            className="blurAmount"
            min={2}
            max={10}
            defaultValue={backgroundBlurAmount}
            onChange={(e) => (backgroundBlurAmount = e.target.value)}
          />
        </div>
      </div>
      <div className="inline-flex items-center justify-center">
        <input
          id="enableVirtualBackground"
          type="checkbox"
          className="w-5 h-5 text-orange-600"
          min={2}
          max={10}
          defaultChecked={enableVirtualBackground}
          onChange={() => (enableVirtualBackground = !enableVirtualBackground)}
        />
        <label className="ml-2 mr-2 text-gray-700" htmlFor="enableVirtualBackground">
          Enable virtual background
        </label>
      </div>
      <div className="inline-flex items-center justify-center">
        <input
          id="removeBackground"
          type="checkbox"
          className="w-5 h-5 text-orange-600"
          min={2}
          max={10}
          defaultChecked={removeBackground}
          onChange={() => (removeBackground = !removeBackground)}
        />
        <label className="ml-2 mr-2 text-gray-700" htmlFor="enableVirtualBackground">
          Remove background
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
            "border border-1 rounded-md shadow-md w-full md:w-8/12 transform -scale-x-1": true,
          })}
        ></canvas>
        <video
          muted
          playsInline
          controls
          height={300}
          width={400}
          className="hidden transform -scale-x-1"
          ref={localVideoElement}
        ></video>
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
