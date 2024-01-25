import React from 'react';

import { styled } from '@mui/material';

import Layout from '~/components/Layout';

type MediaFormat = {
  url: string;
  type: string;
}

type MediaEntry = {
  formats: MediaFormat[];
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

const StyledCaption = styled('p')`
  text-align: center;
  margin: auto;
`;

export default function Converge2Page() {
  return (
    <Layout>
      <StyledContainer>
        {Object.entries(media).map(([key, entry]) => (
          <StyledEntry key={ key }>
            {entry.title && (<StyledEntryTitle>{entry.title}</StyledEntryTitle>)}
            <video 
              width="320" 
              height="240"
              style={ { margin: 'auto' } }
              controls
              autoplay>
              {entry.formats.map((f) => (
                <source key={ f.type } src={ f.url } type={ f.type } />
              ))}
              Your browser does not support the video tag.
            </video>
            <StyledCaption>
              If the video does not load please <a href={ entry.url }>click here</a>
            </StyledCaption>
          </StyledEntry>
        ))}
      </StyledContainer>
    </Layout>
  );
}
