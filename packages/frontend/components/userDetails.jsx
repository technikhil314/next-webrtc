import { useEffect, useRef } from "react";
import { useRhinoState } from "../store/states";
import { useRouter } from "next/router";

export default function UserDetails() {
  const [, setIsStarted] = useRhinoState("isStarted");
  const [, setUserName] = useRhinoState("userName");
  const [, setRoomName] = useRhinoState("roomName");
  const router = useRouter();
  const input = useRef();
  useEffect(() => {
    input.current.focus();
    setRoomName(router.query.roomName);
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userName = formData.get("userName");
    setUserName(userName);
    setIsStarted(true);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full lg:w-1/2 text-center mx-auto flex flex-col justify-center"
    >
      <input
        ref={input}
        autoFocus
        type="text"
        name="userName"
        className="w-full px-3 py-2 border border-gray-500 rounded-md mb-4 shadow-sm"
        placeholder="Enter your name"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 flex-grow-0 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
      >
        Start
      </button>
    </form>
  );
}
