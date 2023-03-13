import React from "react";

import AboutPage from "@/pages/about/AboutPage";
import Error404NotFoundPage from "@/pages/errors/Error404NotFoundPage";
import HomePage from "@/pages/home/HomePage";
import LoginPage from "./login/LoginPage";
import RegisterPage from "@/pages/register/RegisterPage";
import PrivacyPage from "@/pages/privacy/PrivacyPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import SearchPage from "@/pages/search/SearchPage";
import TermsPage from "@/pages/terms/TermsPage";

export type Route = {
  path: string;
  element?: React.ReactNode;
  children?: Route[];
};

export const routes: Route[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/privacy",
    element: <PrivacyPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/search",
    element: <SearchPage />,
  },
  {
    path: "/terms",
    element: <TermsPage />,
  },
  {
    path: "/*",
    element: <Error404NotFoundPage />,
  },
];
