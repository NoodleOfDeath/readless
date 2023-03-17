import React from 'react';

import {
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  styled,
} from '@mui/material';
import { FieldValues, useForm } from 'react-hook-form'; 
import { useNavigate } from 'react-router-dom';

import API from '@/api';
import Page from '@/components/layout/Page';
import { SessionContext } from '@/contexts';

const StyledStack = styled(Stack)(() => ({
  alignContent: 'center',
  alignItems: 'center',
}));

export default function HomePage() {
  const navigate = useNavigate();
  const { pathIsEnabled } = React.useContext(SessionContext);
  
  const { handleSubmit, register } = useForm();
  const [success, setSuccess] = React.useState(false);
  
  const onSubmit = React.useCallback(async (values: FieldValues) => {
    const newsletters = ['public_debut'];
    if (values.dev) {
      newsletters.push('progress_updates');
    }
    if (values.beta) {
      newsletters.push('beta_testers');
    }
    for (const newsletterName of newsletters) {
      try { 
        await API.subscribeToNewsletter({
          alias: values.email,
          aliasType: 'email',
          newsletterName,
        });
        setSuccess(true);
      } catch(e) {
        console.error(e);
      }
    }
  }, []);

  React.useEffect(() => {
    if (pathIsEnabled('/search')) {
      navigate('/search');
    }
  }, [navigate, pathIsEnabled]);

  return (
    <Page center title="theSkoop">
      <h1>theSkoop is currently in alpha test phase!</h1>
      {!success ? (
        <React.Fragment>
          <p>If you would like to be notified when this service is released to the public you may submit your email address below!</p>
          <form onSubmit={ handleSubmit(onSubmit) }>
            <StyledStack spacing={ 2 }>
              <TextField
                type="email"
                required
                placeholder="Email"
                { ...register('email', { 
                  pattern: {
                    message: 'please enter a valid email address',
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  },
                  required: true,
                }) } />
              <FormControlLabel control={ <Checkbox { ...register('dev') } /> } label="Send me development progress updates!" />
              <FormControlLabel control={ <Checkbox { ...register('beta') } /> } label="Also add me as a beta tester!" />
              <Button onClick={ handleSubmit(onSubmit) }>Join Newsletter</Button>
            </StyledStack>
          </form>
        </React.Fragment>
      ) : (
        <React.Fragment>You&apos; been added to the newsletter!</React.Fragment>
      )}
    </Page>
  );
}
