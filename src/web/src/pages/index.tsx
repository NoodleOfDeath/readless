import React from 'react';

import AboutPage from '@/pages/about/AboutPage';
import ContemplatingPage from '@/pages/contemplating/ContemplatingPage';
import Error404NotFoundPage from '@/pages/errors/Error404NotFoundPage';
import ErrorPage from '@/pages/errors/ErrorPage';
import HomePage from '@/pages/home/HomePage';
import LoginPage from '@/pages/login/LoginPage';
import PrivacyPage from '@/pages/privacy/PrivacyPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import SearchPage from '@/pages/search/SearchPage';
import SuccessPage from '@/pages/success/SuccessPage';
import TermsPage from '@/pages/terms/TermsPage';

export const ROUTES: Record<string, React.ReactNode> = {
  '/':              <HomePage />,
  '/*':             <Error404NotFoundPage />,
  '/about':         <AboutPage />,
  '/error':         <ErrorPage />,
  '/login':         <LoginPage />,
  '/logout':        <ContemplatingPage />,
  '/privacy':       <PrivacyPage />,
  '/profile':       <ProfilePage />,
  '/search':        <SearchPage />,
  '/signup':        <LoginPage action={ 'signUp' } />,
  '/success':       <SuccessPage />,
  '/terms':         <TermsPage />,
  '/verify/alias':  <ContemplatingPage />,
};
