import React from 'react';

import { mdiEmail, mdiLock } from '@mdi/js';
import Icon from '@mdi/react';
import {
  Button,
  Stack,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import {
  InternalError,
  PartialLoginRequest,
  PartialRegistrationRequest,
  ThirdParty,
} from '~/api';
import ForgotPasswordForm from '~/components/login/ForgotPasswordForm';
import { useLoginClient, useRouter } from '~/hooks';

export type LoginFormProps = {
  defaultAction?: 'logIn' | 'signUp' | 'forgotPassword';
  onSuccess?: () => void;
  deferredAction?: () => void;
};

const StyledStack = styled(Stack)(() => ({ alignItems: 'center' }));

const StyledIcon = styled(Icon)(({ theme }) => ({ marginRight: theme.spacing(1) }));

export default function LoginForm({
  defaultAction = 'logIn', onSuccess, deferredAction, 
}: LoginFormProps = {}) {
  const router = useRouter();
  const {
    register, handleSubmit, formState: { errors }, 
  } = useForm();
  const { logIn, register: signUp } = useLoginClient();

  const [action, setAction] = React.useState(defaultAction);
  const [error, setError] = React.useState<InternalError|string>();
  const [success, setSuccess] = React.useState(false);

  const handleLogIn = React.useCallback(
    async (values: PartialLoginRequest) => {
      const { error } = await logIn(values);
      if (error) {
        setError(error);
        return;
      }
      if (onSuccess) {
        onSuccess();
        deferredAction?.();
      } else {
        router.push('/');
      }
    },
    [deferredAction, logIn, onSuccess, router]
  );

  const handleSignUp = React.useCallback(async (values: PartialRegistrationRequest) => {
    const { data, error } = await signUp(values);
    if (error) {
      setError(error);
      return;
    }
    if (data?.token) {
      if (onSuccess) {
        onSuccess();
        deferredAction?.();
      } else {
        router.push('/');
      }
    } else {
      setSuccess(true);
    }
  }, [deferredAction, onSuccess, signUp, router]);

  const logInSignUpForm = React.useMemo(() => {
    return (
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
              {typeof error === 'string' ? error : error.message}
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
            <StyledStack spacing={ 1 }>
              <Button size="small" onClick={ () => setAction('forgotPassword') }>
                Forgot your password?
              </Button>
              Don&apos;t have an account? 
              <Button size="small" variant="contained" onClick={ () => setAction('signUp') }>
                Sign up here.
              </Button>
            </StyledStack>
          ) : (
            <StyledStack spacing={ 1 }>
              <Typography variant='body2'>
                By signing up, you agree to our
                {' '}
                <Link href='/terms'>Terms of Service</Link>
                {' '}
                and
                {' '}
                <Link href='/privacy'>Privacy Policy</Link>
              </Typography>
              Already have an account? 
              <Button size="small" variant="contained" onClick={ () => setAction('logIn') }>
                Log in here.
              </Button>
            </StyledStack>
          )}
        </StyledStack>
      </form>
    );
  }, [action, errors, error, handleLogIn, handleSignUp, handleSubmit, register]);

  React.useEffect(() => {
    setError(undefined);
    setSuccess(false); 
  }, [action]);

  return (
    <StyledStack spacing={ 2 }>
      {!success ? (action === 'forgotPassword' ? (
        <ForgotPasswordForm 
          onSuccess={ () => setSuccess(true) }
          backToLogin={ () => setAction('logIn') } />
      ) : logInSignUpForm) :
        action === 'forgotPassword' ? (
          <StyledStack spacing={ 2 }>
            <Typography variant='body2'>
              If an account with that email exists, you should receive an email shortly with a link to reset your password.
            </Typography>
            <Button onClick={ () => setAction('logIn') }>Back to Login</Button>
          </StyledStack>
        ) : (
          <StyledStack spacing={ 1 }>
            <Typography variant='body2'>Please check your inbox to verify your email.</Typography>
            {' '}
            <Button variant="contained" onClick={ () => setAction('logIn') }>Log In Here</Button>
          </StyledStack>
        )}
    </StyledStack>
  );
}
