import React from "react";
import AboutPage from "@/pages/about/AboutPage";
import ContactPage from "@/pages/contact/ContactPage";
import Error404NotFoundPage from "@/pages/errors/Error404NotFoundPage";
import HomePage from "@/pages/home/HomePage";
import PrivacyPage from "@/pages/privacy/PrivacyPage";
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
    path: "/contact",
    element: <ContactPage />,
  },
  {
    path: "/privacy",
    element: <PrivacyPage />,
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
