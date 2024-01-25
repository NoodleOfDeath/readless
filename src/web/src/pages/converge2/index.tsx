import React from 'react';

import { styled } from '@mui/material';

import Layout from '~/components/Layout';

type MediaEntry = {
  url: string;
  title?: string;
};

const media = JSON.parse(process.env.NEXT_PUBLIC_CONVERGE2_MEDIA || '[]') as MediaEntry[];

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
  margin: auto;
`;

const StyledEntryTitle = styled('h1')`
  text-align: center;
  margin: auto;
`;

const StyledVideo = styled('video')`
  margin: auto;
`;

export default function Converge2Page() {
  return (
    <Layout>
      <StyledContainer>
        {Object.entries(media).map(([key, entry]) => (
          <StyledEntry key={ key }>
            {entry.title && (<StyledEntryTitle>{entry.title}</StyledEntryTitle>)}
            <StyledVideo width="320" height="240" controls>
              <source src={ entry.url } type="video/mp4" />
              Your browser does not support the video tag.
            </StyledVideo>
          </StyledEntry>
        ))}
      </StyledContainer>
    </Layout>
  );
}
