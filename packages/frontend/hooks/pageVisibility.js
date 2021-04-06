import { useEffect, useState } from "react";

export default function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    let hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") {
      // Opera 12.10 and Firefox 18 and later support
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }
    const handleVisibilityChange = (e) => {
      e.stopPropagation();
      if (document[hidden]) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };
    document.addEventListener(visibilityChange, handleVisibilityChange, true);
    return () => {
      document.removeEventListener(visibilityChange, handleVisibilityChange);
    };
  }, []);
  return isVisible;
}
