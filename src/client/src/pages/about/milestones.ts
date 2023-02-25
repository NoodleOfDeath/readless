type Milestone = {
  title: string;
  description: string;
  completed?: boolean;
};

export const MILESTONES: Milestone[] = [
  {
    title: "Phase 1: Prototype and Proof of Concept Development",
    description: `The first phase of the roadmap for TheSkoop is the development and testing of the prototype version, which is already available. During this phase, we will focus on testing the application with a larger user base to gain insights into what works and what needs improvement. This will also include testing the OpenAI completion service's performance and accuracy, as well as ensuring that the service provides appropriate credit and links to the original news sources.`,
    completed: true,
  },
  {
    title:
      "Phase 2: AI Generated Media, User Accounts, Interactions, Subscriptions, and Metrics",
    description: `During Phase 2, we will focus on enhancing the application's user experience and adding new features to the existing service. This will include adding AI media for each article to provide categories, user login, subscription options, and metrics for measuring user usage. The AI media will provide personalized recommendations for the user based on their interests and reading history. The user login feature will allow users to save their reading preferences, history, and follow specific news outlets. Subscription options will allow users to support TheSkoop and access additional features such as ad-free reading and early access to new features. Metrics will allow us to measure user engagement and preferences and inform us of any necessary updates or adjustments to the application.`,
  },
  {
    title: "Phase 3: Article Generation and Discover Page",
    description: `In Phase 3, TheSkoop will take news aggregation to the next level by requesting ChatGPT to create comprehensive cross-comparative articles from multiple sources writing about the same topic. The AI-powered articles will be professionally written and cite original sources with footnotes. This will provide users with a comprehensive understanding of a current event without the need to read multiple articles from different sources. TheSkoop plans to introduce a Discover page, where users can explore news from various outlets on various topics. News outlets will be able to compete or pay to be included in the generated articles, bringing about a new era of news consumption. This feature is intended to support and promote quality journalism and provide additional value to users.`,
  },
  {
    title: "Phase 4: AI Generated Media for Social Media",
    description: `In Phase 4, TheSkoop will expand its AI media to include social media platforms. TheSkoop will provide AI media for social media platforms such as Twitter, Facebook, and Instagram. The AI media will include a summary of the article, a link to the original article, and a link to the TheSkoop article. The AI media will also include a link to the TheSkoop article, which will provide additional information about the article and allow users to read the full article. TheSkoop will also provide AI media for social media platforms such as Twitter, Facebook, and Instagram. The AI media will include a summary of the article, a link to the original article, and a link to the TheSkoop article. The AI media will also include a link to the TheSkoop article, which will provide additional information about the article and allow users to read the full article.`,
  },
];
