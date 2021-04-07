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
