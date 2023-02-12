import React from "react";
import { Route } from "react-router-dom";

import { Route as RouteProps } from "@/pages";

export default function RecursiveRoute({
  path,
  element,
  children,
}: RouteProps) {
  return (
    <Route path={path} element={element}>
      {children?.map((child) => (
        <RecursiveRoute key={child.path} {...child} />
      ))}
    </Route>
  );
}
