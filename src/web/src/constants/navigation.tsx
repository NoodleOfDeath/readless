export const headerNavigation = [
  {
    title: 'Download',
    url: '/#download',
  },
  {
    external: false,
    title: 'Terms & Conditions',
    url: '/terms',
  },
  {
    external: false,
    title: 'Privacy Policy',
    url: '/privacy',
  },
  {
    title: 'Help',
    url: `mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`,
  },
];

export const socialNavigation = [
  {
    external: true,
    icon: 'instagram',
    title: 'Instagram',
    url: 'https://instagram.com/readless.ai',
  },
  {
    external: true,
    icon: 'threads',
    title: 'Threads',
    url: 'https://www.threads.net/@readless.ai',
  },
  {
    external: true,
    icon: 'tiktok',
    title: 'TikTok',
    url: 'https://www.tiktok.com/@readless.ai',
  },
  {
    external: true,
    icon: 'twitter',
    title: 'Twitter',
    url: 'https://twitter.com/readlessai',
  },
];

export const footerNavigation = [
  {
    menu: [
      {
        external: false,
        title: 'Features',
        url: '/',
      },
      {
        external: false,
        title: 'Download',
        url: '/#download',
      },
    ],
    title: 'Product',
    value: 'product',
  },
  {
    menu: socialNavigation,
    title: 'Community',
    value: 'community',
  },
];
