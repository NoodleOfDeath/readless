import React from "react";
import ReactMarkdown from "react-markdown";

import Page from "@/components/layout/Page";
import { Api } from "@/api/Api";

export default function PrivacyPage() {
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    new Api({ baseUrl: process.env.API_ENDPOINT }).v1
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
