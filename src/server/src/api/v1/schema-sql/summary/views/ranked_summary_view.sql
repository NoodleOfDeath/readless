DROP MATERIALIZED VIEW IF EXISTS ranked_summary_view;

CREATE MATERIALIZED VIEW ranked_summary_view AS
-- rank summaries by number of siblings within the rank interval
WITH RankedSummaries AS (
  SELECT
    s.id,
    s.title,
    s."originalDate",
    COUNT(sib.id) AS rank,
    SORT(COALESCE(ARRAY_AGG(DISTINCT sib.id), '{}') || ARRAY[s.id]) AS siblings
  FROM
    summaries s
    LEFT OUTER JOIN topic_summaries tr ON s.id = tr."childId"
    LEFT OUTER JOIN topics t ON t.id = tr."groupId"
    LEFT OUTER JOIN topic_summaries sr ON sr."groupId" = t.id
      AND sr."childId" <> s.id
    LEFT OUTER JOIN summaries sib ON sib.id = sr."childId"
    AND sib."deletedAt" IS NULL
  WHERE
    s."deletedAt" IS NULL
    AND EXISTS (
      SELECT
        1
      FROM
        summaries sib
      WHERE
        sib.id = sr."childId"
        AND sib."deletedAt" IS NULL)
    GROUP BY
      s.id,
      s.title,
      s."originalDate"
    ORDER BY
      COUNT(sib.id) DESC,
      s."originalDate" DESC
),
-- filter out rows that are siblings of already selected rows
DistinctSiblings AS (
  SELECT DISTINCT ON (siblings)
    *
  FROM
    RankedSummaries
),
-- get total count and average sentiment
SummariesWithSentiments AS (
  SELECT
    rank,
    COUNT(DistinctSiblings.id) OVER () AS "totalCount",
  AVG(ss.sentiment) OVER () AS "averageSentiment",
  DistinctSiblings.id,
  ss.sentiment,
  ss.sentiments::jsonb sentiments
FROM
  DistinctSiblings
  LEFT OUTER JOIN summary_sentiment_view ss ON ss."parentId" = DistinctSiblings.id
GROUP BY
  DistinctSiblings.id,
  ss.sentiment,
  ss.sentiments::jsonb,
  rank
ORDER BY
  -- then order by rank descending
  rank DESC
)
  SELECT
    "rank",
    "totalCount",
    "averageSentiment",
    SummariesWithSentiments.sentiment,
    SummariesWithSentiments.sentiments::jsonb AS sentiments,
    s.id,
    s.url,
    s."originalDate",
    s.title,
    s."shortSummary",
    s.summary,
    s.bullets,
    JSON_BUILD_OBJECT('name', pub.name, 'displayName', pub."displayName") AS publisher,
    JSON_BUILD_OBJECT('name', cat.name, 'displayName', cat."displayName", 'icon', cat.icon) AS category,
    sm.media::jsonb AS media,
    st.translations::jsonb AS translations,
    SORT(COALESCE(ARRAY_AGG(DISTINCT sr."childId") FILTER (WHERE sr."childId" IS NOT NULL), '{}'::integer[])) AS siblings
  FROM
    SummariesWithSentiments
    LEFT OUTER JOIN summaries s ON s.id = SummariesWithSentiments.id
    AND s."deletedAt" IS NULL
  LEFT OUTER JOIN summary_translation_view st ON st."parentId" = s.id
  LEFT OUTER JOIN publisher_view pub ON s."publisherId" = pub.id
  AND pub.locale = st.locale
  LEFT OUTER JOIN category_view cat ON s."categoryId" = cat.id
  AND cat.locale = st.locale
  LEFT OUTER JOIN summary_media_view sm ON sm."parentId" = s.id
    -- siblings
  LEFT OUTER JOIN topic_summaries tr ON s.id = tr."childId"
  LEFT OUTER JOIN topics t ON t.id = tr."groupId"
    LEFT OUTER JOIN topic_summaries sr ON sr."groupId" = t.id
      AND sr."childId" <> s.id
  GROUP BY
    rank,
    "totalCount",
    "averageSentiment",
    SummariesWithSentiments.sentiment,
    SummariesWithSentiments.sentiments::jsonb,
    s.id,
    s.url,
    s."originalDate",
    s.title,
    s."shortSummary",
    s.summary,
    s.bullets,
    s."imageUrl",
    pub.name,
    pub."displayName",
    cat.name,
    cat."displayName",
    cat.icon,
    sm.media::jsonb,
    st.translations::jsonb
  ORDER BY
    "rank" DESC,
    s."originalDate" DESC
