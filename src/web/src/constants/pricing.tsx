export const tabs = [
  {
    title: 'Pay monthly',
    value: 'pay-monthly',
  },
  {
    mark: true,
    title: 'Pay anually',
    value: 'pay-anually',
  },
];

export const images = [
  {
    alt: 'Smile',
    height: 121,
    src: '/images/join/image-3.png',
    width: 121,
  },
  {
    alt: 'Smile',
    height: 112,
    src: '/images/join/image-4.png',
    width: 112,
  },
];

export const plans = [
  {
    counter: '3 projects & 1 editor',
    details: 'For simple personal projects',
    options: [
      { title: 'Instant publish' },
      { title: 'Banner' },
      { title: 'Design canvas' },
      { title: 'Prototying' },
      { title: 'Modeling' },
      { title: '1 editor' },
      { title: '3 projects' },
      { title: 'Auto save' },
      { title: 'Remove logo from URLs' },
      { title: 'Remove logo from CodeExport' },
    ],
    price: 0,
    title: 'Free',
  },
  {
    counter: '100 projects & 2 editor',
    details: 'For small team and propessional',
    options: [
      { title: 'Instant publish' },
      { title: 'No ad banner' },
      { title: 'Design canvas' },
      { title: 'Prototying' },
      {
        addon: true,
        title: 'Material pack',
      },
      { title: 'Team library' },
      { title: '100 projects' },
      { title: 'Auto save' },
      { title: 'Remove logo from URLs' },
      { title: 'Remove logo from CodeExport' },
    ],
    price: 19,
    recommended: true,
    title: 'Pro',
  },
  {
    counter: 'Unlimited project & editors',
    details: 'For large agency and business.',
    options: [
      { title: 'Instant publish' },
      { title: 'No ad banner' },
      { title: 'Design canvas' },
      { title: 'Prototying' },
      {
        addon: true,
        title: 'Material pack',
      },
      { title: 'Team library' },
      { title: 'Unlimited projects' },
      { title: 'Auto save' },
      { title: 'Remove logo from URLs' },
      { title: 'Remove logo from CodeExport' },
    ],
    price: 49,
    title: 'Premium',
  },
];
