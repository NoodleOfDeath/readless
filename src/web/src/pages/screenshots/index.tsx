import React from 'react';

import { ScreenshotsCarousel } from '~/components';
import Layout from '~/components/Layout';

export default function ScreenshotsPage() {
  return (
    <Layout>
      <ScreenshotsCarousel iphone55 render />
    </Layout>
  );
}