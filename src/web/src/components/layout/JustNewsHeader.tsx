import React from 'react';

import { Stack, Typography } from '@mui/material';
import ms from 'ms';

type Quip = {
  title: string;
  subtitle: string;
};

const QUIPS: Quip[] = [
  {
    subtitle: 'just news.',
    title: 'no clickbait.',
  },
  {
    subtitle: 'just news.',
    title: 'no ads.',
  },
  {
    subtitle: 'be more informed.',
    title: 'read less.',
  },
  {
    subtitle: 'focus on life.',
    title: 'fewer notifications.',
  },
];

export default function JustNewsHeader() {
  
  const [quipIndex, setQuipIndex] = React.useState(0);
  const [quip, setQuip] = React.useState(QUIPS[quipIndex]);
  
  const nextQuip = () => {
    setQuipIndex((prev) => (prev + 1) % QUIPS.length);
  };
  
  React.useEffect(() => setQuip(QUIPS[quipIndex]), [quipIndex]);
  
  React.useEffect(() => {
    const interval = setInterval(() => nextQuip(), ms('5s'));
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Stack>
      <Typography variant='h4' color='primary'>{quip.title}</Typography>
      <Typography variant="h4">{quip.subtitle}</Typography>
    </Stack>
  );
  
}