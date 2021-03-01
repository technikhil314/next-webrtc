import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function useSocketConnetion(isStarted) {
    const [state, setState] = useState({});
    const router = useRouter();
    useEffect(() => {
        if (isStarted) {
            const socket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL);
            socket.onopen = function () {
                const initialData = { type: "connect" };
                if (router.query && router.query.roomId) {
                    initialData.roomId = router.query.roomId;
                }
                socket.send(JSON.stringify(initialData));
            };
            socket.onmessage = async function (event) {
                const { rtcContent, type, ...rest } = JSON.parse(event.data);
                switch (rtcContent) {
                    case "connectSuccess": {
                        const { roomId, userId } = rest;
                        if (!router.query || !router.query.roomId) {
                            window.history.pushState(
                                {
                                    roomId,
                                },
                                "WebRTC demo",
                                `?roomId=${roomId}`
                            );
                        }
                        setState({
                            roomId,
                            userId,
                            socket
                        })
                        break;
                    }
                }
            };
        }
    }, [isStarted])
    return state;
};
