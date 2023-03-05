import React from "react";
import { useNavigate } from "react-router-dom";

import Page from "@/components/layout/Page";

export default function HomePage() {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate("/search");
  }, [navigate]);

  return (
    <Page>
      <h1>Home Page</h1>
    </Page>
  );
}
