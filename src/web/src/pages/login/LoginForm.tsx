import React from 'react';

import { mdiEmail, mdiLock } from '@mdi/js';
import Icon from '@mdi/react';
import {
  Button,
  Link,
  Stack,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import API, {
  AuthError,
  PartialLoginRequest,
  PartialRegistrationRequest,
  ThirdParty,
} from '@/api';
import { SessionContext } from '@/contexts';

export type LoginFormProps = {
  action?: 'logIn' | 'signUp';
}

const StyledStack = styled(Stack)(() => ({ alignItems: 'center' }));

const StyledIcon = styled(Icon)(({ theme }) => ({ marginRight:  theme.spacing(1) }));

export default function LoginPage({ action = 'logIn' }: LoginFormProps = {}) {
  const navigate = useNavigate();
  const {
    register, handleSubmit, formState: { errors }, 
  } = useForm();
  const { setUserData } = React.useContext(SessionContext);

  const [error, setError] = React.useState<AuthError | undefined>(undefined);
  const [needsToVerifyAlias, setNeedsToVerifyAlias] = React.useState(false);

  const handleLogIn = React.useCallback(
    async (data: PartialLoginRequest) => {
      try {
        const { data: userData, error } = await API.login(data);
        if (error) {
          setError(error);
          return;
        }
        setUserData(userData);
        navigate('/');
      } catch (error) {
        console.log(error);
      }
    },
    [navigate, setUserData]
  );

  const handleSignUp = React.useCallback(async (data: PartialRegistrationRequest) => {
    try {
      const { data: userData, error } = await API.register(data);
      if (error) {
        setError(error);
        return;
      }
      if (userData.jwt) {
        setUserData({ 
          jwt: userData.jwt,
          userId: userData.userId,
        });
        navigate('/');
      } else {
        setNeedsToVerifyAlias(true);
      }
    } catch (error) {
      console.log(error);
    }
  }, [navigate, setUserData]);

  React.useEffect(() => {
    setError(undefined);
    setNeedsToVerifyAlias(false); 
  }, [action]);

  return (
    <StyledStack spacing={ 2 }>
      {!needsToVerifyAlias ? (
        <form onSubmit={ handleSubmit(action === 'logIn' ? handleLogIn : handleSignUp) }>
          <StyledStack spacing={ 2 }>
            <GoogleLogin
              onSuccess={ (credentialResponse) => {
                action === 'logIn' ? handleLogIn({
                  thirdParty: {
                    credential: credentialResponse.credential,
                    name: ThirdParty.Google,
                  },
                }) : handleSignUp({
                  thirdParty: {
                    credential: credentialResponse.credential,
                    name: ThirdParty.Google,
                  },
                });
              } }
              onError={ () => {
                console.log('Login Failed');
              } }
              useOneTap />
            <Typography variant='body2'>or</Typography>
            <TextField
              label='Email'
              placeholder='Email'
              InputProps={ { startAdornment: <StyledIcon path={ mdiEmail } size={ 1 } /> } }
              required
              { ...register('email', {
                pattern: {
                  message: 'invalid email address',
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                },
                required: true,
              }) } />
            <TextField
              type='password'
              label='Password'
              placeholder='Password'
              InputProps={ { startAdornment: <StyledIcon path={ mdiLock } size={ 1 } /> } }
              required
              { ...register('password', {
                required: true,
                validate: (value) => value.length >= 8 || 'Password must be at least 8 characters',
              }) } />
            {action === 'signUp' && (
              <TextField
                type='password'
                label='Confirm Password'
                placeholder='Confirm Password'
                InputProps={ { startAdornment: <StyledIcon path={ mdiLock } size={ 1 } /> } }
                required
                { ...register('confirmPassword', {
                  required: true,
                  validate: (value, formState) => value === formState.password || 'Passwords do not match',
                }) } />
            )}
            {error && (
              <Typography variant='body2' color='error'>
                {error.message}
              </Typography>
            )}
            {errors && Object.entries(errors).map(([field, error]) => (
              <Typography key={ field } variant='body2' color='error'>
                {typeof error?.message === 'string' ? error.message : ''}
              </Typography>
            ))}
            <Button type='submit' variant="contained">
              {action === 'logIn' ? 'Log In' : 'Sign Up'}
            </Button>
            {action === 'logIn' && (
              <Link onClick={ () => navigate('/forgot') }>
                Forgot your password?
              </Link>
            )}
          </StyledStack>
        </form>
      ) : (
        <StyledStack spacing={ 1 }>
          <Typography variant='body2'>Please check your inbox to verify your email.</Typography>
          {' '}
          <Button variant="contained" onClick={ () => navigate('/login') }>Log In Here</Button>
        </StyledStack>
      )}
    </StyledStack>
  );
}
