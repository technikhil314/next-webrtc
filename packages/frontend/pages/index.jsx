import RoomDetails from "../components/roomDetails";
import Head from "next/head";
import { text } from "../utils/constants";
import Link from "next/link";
const pageTitle = `${text.appName} | ${text.titleDesc}`;
export default function Main() {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <meta property="twitter:title" content={pageTitle} />
      </Head>
      <section className="w-full container mx-auto px-4 grid grid-cols-1 grid-rows-2 md:grid-rows-1 md:grid-cols-2 min-h-full">
        <div className="flex flex-col justify-around md:justify-center items-center">
          <h1 className="text-2xl font-bold text-center md:mb-8">
            An open source alternative to video conferencing
          </h1>
          <div className="w-full text-left md:text-center">
            <h3 className="text-md font-semibold mb-1">
              What all can you do here?
            </h3>
            <ul className="text-md mx-auto w-11/12 text-left list-outside list-decimal md:list-inside md:text-center md:w-10/12 lg:w-9/12 flex flex-col gap-1 mb-5">
              <li>You can create conference room and invite others to join</li>
              <li>
                You can record your screen along with you in the screen and
                store the recording <br /> To record click{" "}
                <Link href="/vlog" passHref>
                  <a href="/" className="text-blue-500 underline">
                    Record vlog
                  </a>
                </Link>{" "}
                button above.
              </li>
            </ul>
          </div>
          <RoomDetails />
        </div>
        <article className="w-full md:w-2/3 text-center mx-auto flex flex-col justify-center min-h-full">
          <h1 className="text-2xl font-bold text-center md:mb-8">
            Hello, This is an attempt to respect your privacy.
          </h1>
        </article>
      </section>
    </>
  );
}
