import Head from "next/head";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { RhinoProvider } from "../store/states";
import "../styles/globals.scss";
import { text } from "../utils/constants";
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-5LL2N68');`,
          }}
        ></script>
        <meta property="og:type" content="website" />
        <meta name="description" content={text.seoTagLine} />
        <meta name="og:description" content={text.seoTagLine} />
        <meta name="twitter:description" content={text.seoTagLine} />
        <meta name="og:url" content={process.env.NEXT_PUBLIC_URL} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@technikhil314" />
      </Head>
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-5LL2N68"
          height="0"
          width="0"
          style="display:none;visibility:hidden"
        ></iframe>`,
        }}
      ></noscript>
      <RhinoProvider>
        <Navbar />
        <main
          className="my-8 mb-6"
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
        <Footer />
      </RhinoProvider>
    </>
  );
}

export default MyApp;
