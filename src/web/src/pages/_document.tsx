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
            content="Using AI to cut through the bullsh💩t"
            name="Read Less – News without the noise" />
          <meta
            content="Read Less – News without the noise"
            property="og:title" />
          <meta
            content="Using AI to cut through the bullsh💩t"
            property="og:description" />
          <meta
            content="%PUBLIC_URL%/fb-og-image.png"
            property="og:image" />
          <meta
            property="og:url"
            content="https://readless.ai" />
          <meta
            property="og:site_name"
            content="Read Less – News without the noise" />
          <meta
            content="Read Less – News without the noise"
            property="twitter:title" />
          <meta
            content="Using AI to cut through the bullsh💩t"
            property="twitter:description" />
          <meta
            content="%PUBLIC_URL%/twitter-card.png"
            property="twitter:image" />
          <meta property="og:type" content="Article" />
          <meta content="summary" name="twitter:card" />
          <meta name="twitter:site" content="@readlessai" />
          <meta name="twitter:creator" content="@readlessai" />
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
