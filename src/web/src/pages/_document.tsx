import React from 'react';

import { ServerStyleSheets } from '@mui/styles';
import Document, {
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';

export default class ReadLessDocument extends Document {

  render() {
    return (
      <Html lang="en">
        <Head>
          <link key="favicon" rel="icon" href="/favicon.ico" />
          <link key="index.css" rel="stylesheet" href="/index.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }

}

ReadLessDocument.getInitialProps = async (ctx) => {

  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () => originalRenderPage({ enhanceApp: (App) => (props) => sheets.collect(<App { ...props } />) });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  };
};