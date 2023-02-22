import React from "react";
import Page from "@/components/layout/Page";
import { Card, CardContent, CardHeader } from "@mui/material";

export default function AboutPage() {
  return (
    <Page>
      <Card>
        <CardHeader title="About" />
        <CardContent>
          TheSkoop is an AI powered news aggregator that helps you stay up to
          date with the latest news by summarizing the news articles for you in
          various consumptions lengths to fit your busy schedule. Get everything
          you need to know in just a few minutes, or read the full article at
          your leisure. All sources are hand curated by our team of editors to
          ensure that you only get the best content and the original source is
          always credited and linked.
        </CardContent>
      </Card>
    </Page>
  );
}
