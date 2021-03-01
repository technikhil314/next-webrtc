import Head from 'next/head';
import '../styles/globals.css'
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>{Component.title}</title>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta property="og:type" content={Component.title} />
        <meta name="description" content={Component.title} />
        <meta property="og:title" content={Component.title} />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
