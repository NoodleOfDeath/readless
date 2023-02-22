import React from "react";
import HomePage from "@/pages/home/HomePage";
import Error404NotFoundPage from "@/pages/errors/Error404NotFoundPage";
import ContactPage from "@/pages/contact/ContactPage";
import AboutPage from "@/pages/about/AboutPage";

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
    path: "/*",
    element: <Error404NotFoundPage />,
  },
];
