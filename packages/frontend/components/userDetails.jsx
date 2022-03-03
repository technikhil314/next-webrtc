import { useEffect, useRef } from "react";
import { useSetRhinoState } from "react-rhino";
import { useRouter } from "next/router";

export default function UserDetails() {
  const setIsStarted = useSetRhinoState("isStarted");
  const setUserName = useSetRhinoState("userName");
  const setRoomName = useSetRhinoState("roomName");
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
    <form onSubmit={handleSubmit} className="flex flex-col justify-center w-full mx-auto text-center lg:w-1/2">
      <input
        ref={input}
        autoFocus
        type="text"
        name="userName"
        className="w-full px-3 py-2 mb-4 border border-gray-500 rounded-md shadow-sm"
        placeholder="Enter your name"
        required
      />
      <button
        type="submit"
        className="flex-grow-0 px-4 py-2 font-bold text-white transition bg-blue-500 rounded hover:bg-blue-700"
      >
        Start
      </button>
    </form>
  );
}
