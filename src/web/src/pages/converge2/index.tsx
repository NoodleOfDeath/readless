import React from 'react';

import { styled, useMediaQuery } from '@mui/material';
import ReactMarkdown from 'react-markdown';

import { SystemLogLevel } from '~/api';
import Layout from '~/components/Layout';
import { StorageContext } from '~/contexts';
import ABOUT from '~/documents/about';
import BIO from '~/documents/bio';

type Props = {
  direction?: 'column' | 'row';
};

const StyledContainer = styled('div')<Props>`
  display: flex;
  flex-direction: ${({ direction = 'row' }) => direction };
  gap: 1rem;
`;

const StyledEntry = styled('div')`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledEntryTitle = styled('h1')`
  text-align: center;
  margin: auto;
`;

const StyledVideo = styled('video')`
  margin: auto;
  width: 100%;
`;

const StyledCaption = styled('p')`
  text-align: center;
  margin: auto;
`;

const StyledMedia = styled('div')<Props>`
  flex: 1;
  flex-direction: ${({ direction = 'row' }) => direction };
`;

const StyledBio = styled('div')`
  flex: 1;
`;

export default function Converge2Page() {
  
  const direction = useMediaQuery('(max-width: 800px)') ? 'column' : 'row';
  
  const { api: { logSystemEvent } } = React.useContext(StorageContext);
  
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    if (mounted) {
      return;
    }
    setMounted(true);
    logSystemEvent({
      level: SystemLogLevel.Info,
      message: 'Someone checked out converge2!',
      notify: {
        email: 'thom@noodleofdeath.com',
        subject: 'Converge 2 was viewed',
      },
    });
  }, [mounted, logSystemEvent]);
  
  return (
    <Layout>
      <StyledContainer direction={ direction }>
        <StyledMedia style={ { flex: direction === 'column' ? 0 : 1 } }>
          <StyledEntryTitle>Converge 2 Pitch</StyledEntryTitle>
          <StyledVideo controls autoPlay>
            <source src='https://noodleofdeath.com/downloads/converge.mp4' type='video/mp4' />
            <source src='https://noodleofdeath.com/downloads/converge.ogg' type='video/ogg' />
            Your browser does not support the video tag.
          </StyledVideo>
          <StyledCaption>
            If the video does not load please 
            {' '}
            <a href='https://noodleofdeath.com/downloads/converge.mp4'>click here</a>
          </StyledCaption>
          {direction === 'row' && (
            <StyledEntry>
              <ReactMarkdown>
                {ABOUT}
              </ReactMarkdown>
            </StyledEntry>
          )}
        </StyledMedia>
        <StyledBio>
          <StyledEntry>
            <ReactMarkdown>
              {BIO}
            </ReactMarkdown>
          </StyledEntry>
          {direction === 'column' && (
            <StyledEntry>
              <ReactMarkdown>
                {ABOUT}
              </ReactMarkdown>
            </StyledEntry>
          )}
        </StyledBio>
      </StyledContainer>
    </Layout>
  );
}
