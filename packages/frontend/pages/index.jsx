import RoomDetails from "../components/roomDetails";

export default function Main() {
  return (
    <section className="w-full container mx-auto px-4 grid grid-cols-1 grid-rows-2 md:grid-rows-1 md:grid-cols-2 min-h-full">
      <div className="flex flex-col justify-around md:justify-center items-center">
        <h1 className="text-2xl font-bold text-center md:mb-8">
          An open source alternative to video conferencing
        </h1>
        <RoomDetails />
      </div>
      <article className="w-full md:w-2/3 text-center mx-auto flex flex-col justify-center min-h-full">
        <h1 className="text-2xl font-bold text-center md:mb-8">
          Hello, This is an attempt to respect your privacy.
        </h1>
      </article>
    </section>
  );
}
