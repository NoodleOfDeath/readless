import React from 'react';

import { ServerStyleSheets } from '@mui/styles';
import Document, {
  Html,
  Main,
  NextScript,
} from 'next/document';

export default class SkoopDocument extends Document {

  render() {
    return (
      <Html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="/index.css" />
        </head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }

}

SkoopDocument.getInitialProps = async (ctx) => {

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