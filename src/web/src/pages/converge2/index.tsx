import React from 'react';

import { styled } from '@mui/material';

import Layout from '~/components/Layout';

type MediaEntry = {
  url: string;
  title?: string;
};

const media = JSON.parse(process.env.NEXT_PUBLIC_CONVERGE2_MEDIA || '{}') as MediaEntry[];

const StyledContainer = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const StyledEntry = styled('div')`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledEntryTitle = styled('h1')`
  
`;

export default function Converge2Page() {
  return (
    <Layout>
      <StyledContainer>
        {Object.values(media).map((entry, key) => (
          <StyledEntry key={ key }>
            {entry.title && (<StyledEntryTitle>{entry.title}</StyledEntryTitle>)}
            <video width="320" height="240" controls>
              <source src={ entry.url } type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </StyledEntry>
        ))}
      </StyledContainer>
    </Layout>
  );
}
