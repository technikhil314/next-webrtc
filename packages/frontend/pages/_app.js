import Head from 'next/head';
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>{Component.title}</title>
        <meta charset="utf-8" />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta data-react-helmet="true" property="og:type" content={Component.title} />
        <meta data-react-helmet="true" name="description" content={Component.title} />
        <meta data-react-helmet="true" property="og:title" content={Component.title} />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
