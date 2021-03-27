import { useRhinoState } from "../store/states";

export default function RoomDetails() {
  const [, setIsStarted] = useRhinoState("isStarted");
  const [, setRoomName] = useRhinoState("roomName");
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setRoomName(formData.get("roomName"));
    setIsStarted(true);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full lg:w-1/2 text-center mx-auto flex flex-col justify-center"
    >
      <input
        type="text"
        name="roomName"
        className="w-full px-3 py-2 border border-gray-500 rounded-md mb-4"
        placeholder="Enter room name"
      />
      <button className="bg-blue-500 flex-grow-0 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Start
      </button>
    </form>
  );
}
