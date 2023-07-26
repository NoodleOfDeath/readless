
import React from 'react';

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID || 'G-ZJF8C6F8Z9';

export function GoogleAnalytics() {
  return (
    <React.Fragment>
      <script src={ `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}` } />
      <script dangerouslySetInnerHTML={ {
        __html: 
          `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${MEASUREMENT_ID}');`,
      } } />
    </React.Fragment>
  );
}