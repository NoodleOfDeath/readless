import { Card, CardContent } from "@mui/material";
import React from "react";

type Props = React.PropsWithChildren<{}>;

export default function Page({ children }: Props) {
  return (
    <Card>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
