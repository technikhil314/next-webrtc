import Head from "next/head";
import Navbar from "../components/navbar";
import "../styles/globals.scss";
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>{Component.title}</title>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta property="og:type" content={Component.title} />
        <meta name="description" content={Component.title} />
        <meta property="og:title" content={Component.title} />
      </Head>
      <Navbar />
      <main
        className="my-8"
        onDrop={(event) => {
          var data = event.dataTransfer.getData("text/plain").split(",");
          let dm = document.getElementById(data[0]);
          dm.style.left = event.clientX + parseInt(data[1], 10) + "px";
          dm.style.top = event.clientY + parseInt(data[2], 10) + "px";
        }}
        onDragOver={(event) => {
          event.preventDefault();
          return false;
        }}
      >
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
