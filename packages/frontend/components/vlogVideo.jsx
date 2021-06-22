import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { classNames } from "../utils/classNames";
import { userMediaConstraints } from "../utils/constants";
import { loadBodyPix, readAsObjectURL, rgb2hsl } from "../utils/helpers";
let backgroundBlurAmount = 6;
let edgeBlurAmount = 0;
let enableMirrorEffect = false;
let enableVirtualBackground = false;
let removeBackground = false;
let enableBlur = false;
let backgroundImage = null;
let backgroundColor = "#FFFFFF";
let enableGreenScreen = false;
function VlogVideo({ isRecording, config }, ref) {
  const localVideoElement = useRef();
  const canvasRef = useRef();
  const displayVideoElement = useRef();
  const [customBackgroundImage, setCustomBackgroundImage] = useState();
  const isWithoutVideo = config.withoutVideo === "on";
  let displayStream = useRef(),
    normalLocalStream = useRef();

  const cleanUp = () => {
    displayStream.current && displayStream.current.getTracks().forEach((x) => x.stop());
    normalLocalStream.current && normalLocalStream.current.getTracks().forEach((x) => x.stop());
    displayStream.current = normalLocalStream.current = null;
  };

  const blurVideoBg = (segmentation) => {
    let _backgroundBlurAmount = enableBlur ? backgroundBlurAmount : 0;
    bodyPix.drawBokehEffect(
      canvasRef.current,
      localVideoElement.current,
      segmentation,
      _backgroundBlurAmount,
      edgeBlurAmount
    );
  };

  async function removeBg(segmentation) {
    const foregroundColor = { r: 0, g: 0, b: 0, a: 255 };
    const backgroundColor = { r: 0, g: 0, b: 0, a: 0 };
    const backgroundDarkeningMask = bodyPix.toMask(segmentation, foregroundColor, backgroundColor);
    const ctx = canvasRef.current.getContext("2d");
    ctx.putImageData(backgroundDarkeningMask, 0, 0);
    ctx.globalCompositeOperation = "source-in";
    ctx.drawImage(localVideoElement.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
  }
  function addVirtualBg() {
    const ctx = canvasRef.current.getContext("2d");
    ctx.globalCompositeOperation = "destination-atop";
    ctx.drawImage(backgroundImage, 0, 0, canvasRef.current.width, canvasRef.current.height);
  }

  function addSolidBg() {
    const ctx = canvasRef.current.getContext("2d");
    ctx.globalCompositeOperation = "destination-atop";
    ctx.beginPath();
    ctx.rect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = backgroundColor;
    ctx.fill();
  }

  const replaceGreenScreen = (e) => {
    const ctx = canvasRef.current.getContext("2d");
    let frame = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    let data = frame.data;
    let len = data.length;
    for (let i = 0, j = 0; j < len; i++, j += 4) {
      let hsl = rgb2hsl(data[j], data[j + 1], data[j + 2]);
      let h = hsl[0],
        s = hsl[1],
        l = hsl[2];
      if (h >= 90 && h <= 160 && s >= 25 && s <= 90 && l >= 20 && l <= 75) {
        data[j + 3] = 0;
      }
    }
    ctx.putImageData(frame, 0, 0);
  };

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
      addSolidBg();
    } else if (enableBlur) {
      blurVideoBg(segmentation);
    } else {
      const ctx = canvasRef.current.getContext("2d");
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(localVideoElement.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    if (enableGreenScreen) {
      replaceGreenScreen();
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
    let objectUrl;
    if (customBackgroundImage) {
      (async () => {
        objectUrl = await readAsObjectURL(customBackgroundImage);
        const img = new Image();
        img.src = objectUrl;
        img.onload = () => {
          backgroundImage = img;
        };
      })();
    }
    return () => {
      objectUrl && URL.revokeObjectURL(objectUrl);
    };
  }, [customBackgroundImage]);
  useEffect(() => {
    const img = new Image();
    img.src = "/virtual-bgs/1.jpg";
    img.onload = () => {
      backgroundImage = img;
    };
  }, []);
  useEffect(() => {
    if (isRecording && !isWithoutVideo) {
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
            width: globalThis.screen.width,
            height: globalThis.screen.height,
            displaySurface: {
              exact: "monitor",
            },
          },
        });
        let finalMediaConstraints = {
          ...userMediaConstraints,
          audio: {
            ...userMediaConstraints.audio,
            deviceId: { exact: config.audioDevice },
          },
          video: {
            ...userMediaConstraints.video,
            deviceId: { exact: config.videoDevice },
          },
        };
        if (isWithoutVideo) {
          delete finalMediaConstraints.video;
        }
        normalLocalStream.current = await navigator.mediaDevices.getUserMedia(finalMediaConstraints);
        if (!isWithoutVideo) {
          localVideoElement.current.srcObject = normalLocalStream.current;
          localVideoElement.current.play();
          localVideoElement.current.addEventListener("loadeddata", async () => {
            const net = await loadBodyPix();
            processVideo(net);
          });
        }
      } catch (err) {
        cleanUp();
      }
    })();
    return cleanUp;
  }, []);
  if (isWithoutVideo) {
    return null;
  }
  return (
    <section className="flex flex-col gap-4 mt-5">
      <div className="flex items-center justify-center gap-4">
        <div className="inline-flex items-center justify-center">
          <label className="ml-2 mr-2 text-gray-700" htmlFor="enableGreenScreen">
            Enable green screen
          </label>
          <input
            id="enableGreenScreen"
            type="checkbox"
            className="w-5 h-5 text-orange-600"
            defaultChecked={enableGreenScreen}
            onChange={() => (enableGreenScreen = !enableGreenScreen)}
          />
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <div className="inline-flex items-center justify-center">
          <label className="ml-2 mr-2 text-gray-700" htmlFor="enableVirtualBackground">
            Enable virtual background
          </label>
          <input
            id="enableVirtualBackground"
            type="checkbox"
            className="w-5 h-5 text-orange-600"
            defaultChecked={enableVirtualBackground}
            onChange={() => (enableVirtualBackground = !enableVirtualBackground)}
          />
        </div>
        <div className="relative inline-flex items-center justify-center">
          <label className="ml-2 mr-2 text-gray-700" htmlFor="customVirtualBackground">
            Custom Image
          </label>
          <div>
            <input
              id="customVirtualBackground"
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full text-orange-600 opacity-0"
              onChange={(e) => setCustomBackgroundImage(e.target.files[0])}
            />
            <button className="flex-grow-0 px-4 py-2 text-sm font-bold text-white transition bg-green-500 rounded pointer-events-none hover:bg-green-700">
              Choose file
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <div className="inline-flex items-center">
          <label className="ml-2 mr-2 text-gray-700" htmlFor="removeBackground">
            Remove background
          </label>
          <input
            id="removeBackground"
            type="checkbox"
            className="w-5 h-5 text-orange-600"
            min={2}
            max={10}
            defaultChecked={removeBackground}
            onChange={() => (removeBackground = !removeBackground)}
          />
        </div>
        <div className="inline-flex items-center">
          <label className="ml-2 mr-2 text-gray-700" htmlFor="backgroundColor">
            Background color
          </label>
          <input
            type="color"
            id="backgroundColor"
            defaultValue={backgroundColor}
            onChange={(e) => {
              backgroundColor = e.target.value;
            }}
            className="w-8 h-8"
          />
        </div>
      </div>
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
            "border border-1 rounded-md shadow-md w-full md:w-8/12 transform": true,
            "-scale-x-1": enableMirrorEffect,
          })}
        ></canvas>
        <video
          muted
          playsInline
          controls
          height={300}
          width={400}
          className={classNames({
            hidden: true,
            "-scale-x-1": enableMirrorEffect,
          })}
          ref={localVideoElement}
        ></video>
        <video
          muted
          playsInline
          controls
          width={200}
          className={classNames({
            "transform rounded-md shadow-md w-1 h-1": true,
            hidden: !isRecording,
            "-scale-x-1": enableMirrorEffect,
          })}
          ref={displayVideoElement}
          allowFullScreen
        ></video>
      </div>
    </section>
  );
}

export default forwardRef(VlogVideo);
