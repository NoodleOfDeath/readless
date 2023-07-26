import React from 'react';

import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';

import { GoogleAnalytics } from '~/components';

class MyDocument extends Document {

  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body className="app">
          <GoogleAnalytics />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }

}

export default MyDocument;
