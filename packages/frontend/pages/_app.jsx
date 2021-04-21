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
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="google-site-verification" content="y76XmjuKHC8FEC0Mzf7SbK1235K4KzHHAHOVZfvLXwk" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-5LL2N68');`,
          }}
        ></script>
        {/* For discord */}
        <meta
          name="og:image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_URL}/brand-430x495.png`}
          key={`${process.env.NEXT_PUBLIC_URL}/brand-430x495.png`}
        />
        {/* For browser */}
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" sizes="57x57" href="/57x57.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/180x180.png" />
        <meta name="og:type" property="og:type" content="website" />
        <meta name="description" content={text.seoTagLine} />
        <meta name="og:description" property="og:description" content={text.seoTagLine} />
        <meta name="twitter:description" content={text.seoTagLine} />
        <meta name="og:url" property="og:url" content={process.env.NEXT_PUBLIC_URL} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@technikhil314" />
        <meta property="og:title" name="og:title" content={`${text.appName} | ${text.titleDesc}`} />
        <meta name="twitter:title" content={`${text.appName} | ${text.titleDesc}`} />
        {/* For telegram */}
        <meta
          property="og:image"
          name="og:image"
          content={`${process.env.NEXT_PUBLIC_URL}/128x128.png`}
          key={`${process.env.NEXT_PUBLIC_URL}/128x128.png`}
        />
        <meta
          property="og:image"
          name="og:image"
          content={`${process.env.NEXT_PUBLIC_URL}/brand-192x192.png`}
          key={`${process.env.NEXT_PUBLIC_URL}/brand-192x192.png`}
        />
        {/* for facebook */}
        <meta
          property="og:image"
          name="og:image"
          content={`${process.env.NEXT_PUBLIC_URL}/brand-200x200.png`}
          key={`${process.env.NEXT_PUBLIC_URL}/brand-200x200.png`}
        />
        {/* for whatsapp */}
        <meta
          property="og:image"
          name="og:image"
          content={`${process.env.NEXT_PUBLIC_URL}/brand-512x512.png`}
          key={`${process.env.NEXT_PUBLIC_URL}/brand-512x512.png`}
        />
        {/* for linkedin 800x800 ideal is 1200x695 */}
        <meta
          property="og:image"
          name="og:image"
          content={`${process.env.NEXT_PUBLIC_URL}/brand-800x800.png`}
          key={`${process.env.NEXT_PUBLIC_URL}/brand-800x800.png`}
        />
        <meta name="image" property="og:image" content={`${process.env.NEXT_PUBLIC_URL}/brand-1200x600.png`}></meta>
        <meta property="og:image:alt" name="og:image:alt" content={text.titleDesc} />
        {/* for twitter */}
        <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_URL}/128x128.png`} />
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
          className="my-4 mb-6"
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
