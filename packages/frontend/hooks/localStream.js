import { useEffect, useState } from "react";
import { userMediaConstraints } from "../utils/constants";

export default function useLocalStream() {
    const [localStream, setLocalStream] = useState();
    useEffect(() => {
        (async () => {
            const stream = await navigator.mediaDevices.getUserMedia(
                userMediaConstraints
            );
            setLocalStream(stream);
        })();
    }, [])
    return localStream;
}