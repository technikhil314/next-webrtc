import Head from "next/head";
import RoomDetails from "../components/roomDetails";
import { text } from "../utils/constants";
const pageTitle = `${text.appName} | ${text.titleDesc}`;
export async function getStaticProps() {
  return {
    props: {},
  };
}
export default function Main() {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <meta property="twitter:title" content={pageTitle} />
      </Head>
      <section className="flex flex-col justify-center h-full">
        <h1 className="mb-24 text-3xl font-bold text-center">An open source alternative to video conferencing</h1>
        <div className="container grid w-full grid-cols-1 grid-rows-2 px-4 mx-auto md:grid-rows-1 md:grid-cols-2">
          <div className="flex flex-col items-center justify-around md:justify-center">
            <div className="w-full text-left md:text-center">
              <h3 className="mb-1 text-lg font-semibold">What all can you do here?</h3>
              <ul className="flex flex-col w-11/12 gap-1 mx-auto mb-5 text-left text-md md:text-center md:w-10/12 lg:w-9/12">
                <li>You can create conference room and invite others to join</li>
              </ul>
            </div>
            <RoomDetails />
          </div>
          <article className="flex flex-col justify-center w-full min-h-full mx-auto text-center md:w-2/3">
            <h1 className="text-2xl font-bold text-center md:mb-8">
              Hello, This is an attempt to respect your privacy.
            </h1>
          </article>
        </div>
      </section>
    </>
  );
}
