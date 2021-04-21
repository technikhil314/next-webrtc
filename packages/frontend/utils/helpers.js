export function capitalize(s) {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export async function loadBodyPix() {
  const options = {
    multiplier: 0.75,
    stride: 16,
    quantBytes: 2,
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
