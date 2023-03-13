import React from "react";
import ReactMarkdown from "react-markdown";

import API from "@/api";
import Page from "@/components/layout/Page";

export default function PrivacyPage() {
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    API
      .getPrivacyPolicy()
      .then((response) => setText(response.data.content))
      .catch(console.error);
  }, []);

  return (
    <Page left>
      <ReactMarkdown>{text}</ReactMarkdown>
    </Page>
  );
}
