import React from 'react';

import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';

class MyDocument extends Document {

  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta
            content="Production-ready landing page template for SaaS and startups"
            name="Paradox – Premium SaaS landing page kit" />
          <meta
            content="Paradox – Premium SaaS landing page kit"
            property="og:title" />
          <meta
            content="Production-ready landing page template for SaaS and startups"
            property="og:description" />
          <meta
            content="%PUBLIC_URL%/fb-og-image.png"
            property="og:image" />
          <meta
            property="og:url"
            content="https://ui8.net/ui8/products/paradox" />
          <meta
            property="og:site_name"
            content="Paradox – Premium SaaS landing page kit" />
          <meta
            content="Paradox – Premium SaaS landing page kit"
            property="twitter:title" />
          <meta
            content="Production-ready landing page template for SaaS and startups"
            property="twitter:description" />
          <meta
            content="%PUBLIC_URL%/twitter-card.png"
            property="twitter:image" />
          <meta property="og:type" content="Article" />
          <meta content="summary" name="twitter:card" />
          <meta name="twitter:site" content="@ui8" />
          <meta name="twitter:creator" content="@ui8" />
          <meta property="fb:admins" content="132951670226590" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <body className="app">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }

}

export default MyDocument;
