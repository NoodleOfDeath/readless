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
import { useRouter } from '@/next/router';

import API, {
  AuthError,
  PartialLoginRequest,
  PartialRegistrationRequest,
  ThirdParty,
  headers,
} from '@/api';
import { SessionContext } from '@/contexts';

export type LoginFormProps = {
  action?: 'logIn' | 'signUp';
};

const StyledStack = styled(Stack)(() => ({ alignItems: 'center' }));

const StyledIcon = styled(Icon)(({ theme }) => ({ marginRight: theme.spacing(1) }));

export default function LoginForm({ action = 'logIn' }: LoginFormProps = {}) {
  const router = useRouter();
  const {
    register, handleSubmit, formState: { errors }, 
  } = useForm();
  const { userData, setUserData } = React.useContext(SessionContext);

  const [error, setError] = React.useState<AuthError | undefined>(undefined);
  const [needsToVerifyAlias, setNeedsToVerifyAlias] = React.useState(false);

  const handleLogIn = React.useCallback(
    async (values: PartialLoginRequest) => {
      try {
        const { data, error } = await API.login(values, { headers: headers({ token: userData?.tokenString }) });
        if (error) {
          setError(error);
          return;
        }
        setUserData({
          isLoggedIn: true,
          ...data,
        }, { updateCookie: true });
        router.push('/search');
      } catch (error) {
        console.log(error);
      }
    },
    [router, setUserData, userData]
  );

  const handleSignUp = React.useCallback(async (values: PartialRegistrationRequest) => {
    try {
      const { data, error } = await API.register(values, { headers: headers({ token: userData?.tokenString }) });
      if (error) {
        setError(error);
        return;
      }
      if (data.token) {
        setUserData({ 
          isLoggedIn: true,
          ...data,
        }, { updateCookie: true });
        router.push('/');
      } else {
        setNeedsToVerifyAlias(true);
      }
    } catch (error) {
      console.log(error);
    }
  }, [router, setUserData, userData]);

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
            {action === 'logIn' ? (
              <Link onClick={ () => router.push('/forgot') }>
                Forgot your password?
              </Link>
            ): (
              <Typography variant='body2'>
                By signing up, you agree to our
                {' '}
                <Link href='/terms'>Terms of Service</Link>
                {' '}
                and
                {' '}
                <Link href='/privacy'>Privacy Policy</Link>
              </Typography>
            )}
          </StyledStack>
        </form>
      ) : (
        <StyledStack spacing={ 1 }>
          <Typography variant='body2'>Please check your inbox to verify your email.</Typography>
          {' '}
          <Button variant="contained" onClick={ () => router.push('/login') }>Log In Here</Button>
        </StyledStack>
      )}
    </StyledStack>
  );
}
