import React from 'react';

import LoginPage from './login/LoginPage';

import AboutPage from '@/pages/about/AboutPage';
import ContemplatingPage from '@/pages/contemplating/ContemplatingPage';
import Error404NotFoundPage from '@/pages/errors/Error404NotFoundPage';
import ErrorPage from '@/pages/errors/ErrorPage';
import HomePage from '@/pages/home/HomePage';
import PrivacyPage from '@/pages/privacy/PrivacyPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import SearchPage from '@/pages/search/SearchPage';
import SuccessPage from '@/pages/success/SuccessPage';
import TermsPage from '@/pages/terms/TermsPage';

export type Route = {
  path: string;
  element?: React.ReactNode;
  children?: Route[];
};

export const routes: Route[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/error',
    element: <ErrorPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/logout',
    element: <ContemplatingPage />,
  },
  {
    path: '/privacy',
    element: <PrivacyPage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/signup',
    element: <LoginPage action={ 'signUp' } />,
  },
  {
    path: '/search',
    element: <SearchPage />,
  },
  {
    path: '/success',
    element: <SuccessPage />,
  },
  {
    path: '/terms',
    element: <TermsPage />,
  },
  {
    path: '/verify/alias',
    element: <ContemplatingPage />,
  },
  {
    path: '/*',
    element: <Error404NotFoundPage />,
  },
];
