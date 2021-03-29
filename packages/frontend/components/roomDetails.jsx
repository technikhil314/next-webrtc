import { useRouter } from "next/router";
import { useRhinoState } from "../store/states";

export default function RoomDetails() {
  const [, setRoomName] = useRhinoState("roomName");
  const router = useRouter();
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const roomName = formData.get("roomName");
    router.push(`/${roomName}`);
    setRoomName(roomName);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full lg:w-1/2 text-center mx-auto flex flex-col justify-center"
    >
      <input
        type="text"
        name="roomName"
        className="w-full px-3 py-2 border border-gray-500 rounded-md mb-4 shadow-sm"
        placeholder="Enter room name"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 flex-grow-0 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Get room
      </button>
    </form>
  );
}