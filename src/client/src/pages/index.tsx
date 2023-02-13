import React from "react";
import Home from "@/pages/home/Home";
import Error404NotFound from "@/pages/errors/Error404NotFound";
import ContactForm from "@/pages/contact/ContactForm";

export type Route = {
  path: string;
  element?: React.ReactNode;
  children?: Route[];
};

export const routes: Route[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/contact",
    element: <ContactForm />,
  },
  {
    path: "/*",
    element: <Error404NotFound />,
  },
];
