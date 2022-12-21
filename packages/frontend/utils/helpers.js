/* eslint-disable-next-line */
import * as tf from "@tensorflow/tfjs";
import { browserRegexes } from "./constants";
import * as bodyPix from "@tensorflow-models/body-pix";

export function capitalize(s) {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export async function loadBodyPix() {
  const options = {
    architecture: "ResNet50",
    multiplier: 1,
    stride: 16,
    quantBytes: 4,
  };
  const net = await bodyPix.load(options);
  return net;
}
export function classNames(classNameMap) {
  let classNameString = "";
  for (const className in classNameMap) {
    const condition = classNameMap[className];
    if (condition) {
      classNameString += ` ${className}`;
    }
  }
  return classNameString.trim();
}

export function readAsObjectURL(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const blob = new Blob([e.target.result]);
      const url = URL.createObjectURL(blob);
      res(url);
    };
    reader.onerror = (e) => rej(e);
    reader.readAsArrayBuffer(file);
  });
}

export function getBrowserName(uaString) {
  const browserMatch = Object.entries(browserRegexes).find(([, regex]) => regex.test(uaString));

  if (!browserMatch) {
    return null;
  }

  const [browserName] = browserMatch;
  return browserName;
}

export function rgb2hsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  var min = Math.min(r, g, b);
  var max = Math.max(r, g, b);
  var delta = max - min;
  var h, s, l;

  if (max === min) {
    h = 0;
  } else if (r === max) {
    h = (g - b) / delta;
  } else if (g === max) {
    h = 2 + (b - r) / delta;
  } else if (b === max) {
    h = 4 + (r - g) / delta;
  }

  h = Math.min(h * 60, 360);

  if (h < 0) {
    h += 360;
  }

  l = (min + max) / 2;

  if (max === min) {
    s = 0;
  } else if (l <= 0.5) {
    s = delta / (max + min);
  } else {
    s = delta / (2 - max - min);
  }

  return [h, s * 100, l * 100];
}

export function debug(...msg) {
  if (process.env.NEXT_PUBLIC_DEBUG) {
    console.debug(msg);
  }
}
