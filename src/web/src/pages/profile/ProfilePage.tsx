import React from "react";
import ReactMarkdown from "react-markdown";

import { SessionContext } from "@/contexts";
import Page from "@/components/layout/Page";

export default function ProfilePage() {
  const { userData } = React.useContext(SessionContext);

  return (
    <Page left title="Profile">
      <ReactMarkdown>{String(userData?.id)}</ReactMarkdown>
    </Page>
  );
}
