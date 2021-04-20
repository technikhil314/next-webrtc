import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { useRhinoState } from "../store/states";

export default function RoomDetails() {
  const [, setRoomName] = useRhinoState("roomName");
  const router = useRouter();
  const input = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const roomName = formData.get("roomName").toLowerCase().replace(/\s+/g, "-").trim();
    router.push(`/${roomName}`);
    setRoomName(roomName);
  };
  useEffect(() => {
    input.current.focus();
  });
  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-center w-full mx-auto text-center lg:w-1/2">
      <input
        ref={input}
        autoFocus
        type="text"
        id="roomName"
        name="roomName"
        className="w-full px-3 py-2 mb-4 border border-gray-500 rounded-md shadow-sm"
        placeholder="Enter room name"
        required
      />
      <button
        type="submit"
        className="flex-grow-0 px-4 py-2 font-bold text-white transition bg-blue-500 rounded hover:bg-blue-700"
      >
        Get room
      </button>
    </form>
  );
}
