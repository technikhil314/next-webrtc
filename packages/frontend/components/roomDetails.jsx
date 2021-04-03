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
    const roomName = formData
      .get("roomName")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .trim();
    router.push(`/${roomName}`);
    setRoomName(roomName);
  };
  useEffect(() => {
    input.current.focus();
  });
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full lg:w-1/2 text-center mx-auto flex flex-col justify-center"
    >
      <input
        ref={input}
        autoFocus
        type="text"
        id="roomName"
        name="roomName"
        className="w-full px-3 py-2 border border-gray-500 rounded-md mb-4 shadow-sm"
        placeholder="Enter room name"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 flex-grow-0 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
      >
        Get room
      </button>
    </form>
  );
}
