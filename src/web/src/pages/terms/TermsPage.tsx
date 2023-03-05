import React from "react";
import ReactMarkdown from "react-markdown";

import { Api } from "@/api/Api";
import Page from "@/components/layout/Page";

export default function TermsPage() {
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    new Api({ baseUrl: process.env.API_ENDPOINT }).v1
      .getTermsOfService()
      .then((response) => setText(response.data.content))
      .catch(console.error);
  }, []);

  return (
    <Page left>
      <ReactMarkdown>{text}</ReactMarkdown>
    </Page>
  );
}
