import React from 'react';

import Script from 'next/script';

const MEASUREMENT_ID = process.env.NEXT_GOOGLE_MEASUREMENT_ID || 'G-ZJF8C6F8Z9';

export function GoogleAnalytics() {
  return (
    <React.Fragment>
      <Script strategy='afterInteractive' src={ `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}` } />
      <Script
        strategy='afterInteractive'
        dangerouslySetInnerHTML={ {
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){ dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', '${MEASUREMENT_ID}');
          `,
        } } />
    </React.Fragment>
  );
}