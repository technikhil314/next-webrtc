import { browserRegexes } from "./constants";

export function capitalize(s) {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export async function loadBodyPix() {
  const options = {
    multiplier: 0.75,
    stride: 8,
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
