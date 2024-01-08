WITH SummariesWithCount AS (
  WITH SummariesWithSiblings AS (
    WITH DistinctSiblings AS (
      WITH SiblingRanks AS (
        SELECT
          s.id,
          s.title,
          s."originalDate",
          COUNT(ranked_sib.id)
          rank,
          COUNT(sib.id) total,
          SORT(COALESCE(ARRAY_AGG(DISTINCT sib.id), '{}') || ARRAY[s.id]) siblings
        FROM
          summaries s
        LEFT OUTER JOIN summary_relations sr ON s.id = sr."parentId"
        AND sr."deletedAt" IS NULL
    LEFT OUTER JOIN summaries ranked_sib ON ranked_sib.id = sr."siblingId"
    AND ranked_sib."deletedAt" IS NULL
    AND (ranked_sib."originalDate" > NOW() - INTERVAL :rankInterval)
    LEFT OUTER JOIN summaries sib ON sib.id = sr."siblingId"
    AND sib."deletedAt" IS NULL
  WHERE
    s."deletedAt" IS NULL
    AND s."originalDate" > NOW() - INTERVAL :rankInterval
    AND EXISTS (
      SELECT
        1
      FROM
        summaries sib
      WHERE
        sib.id = sr."siblingId"
        AND sib."deletedAt" IS NULL)
    GROUP BY
      s.id,
      s.title,
      s."originalDate"
    ORDER BY
      COUNT(sib.id) DESC,
      s."originalDate" DESC
)
    SELECT DISTINCT ON (siblings)
      *
    FROM
      SiblingRanks
)
    SELECT
      rank,
      COUNT(DistinctSiblings.id) OVER () "totalCount",
      AVG(ss.sentiment) OVER () "averageSentiment",
      DistinctSiblings.id,
      ss.sentiment,
      ss.sentiments::jsonb sentiments
    FROM DistinctSiblings
    LEFT OUTER JOIN summary_sentiment_view ss ON ss."parentId" = DistinctSiblings.id
GROUP BY DistinctSiblings.id,
ss.sentiment,
ss.sentiments::jsonb,
rank ORDER BY rank DESC
)
SELECT
  "rank",
  "totalCount",
  "averageSentiment",
  SummariesWithSiblings.sentiment,
  SummariesWithSiblings.sentiments::jsonb sentiments,
  s.id,
  s.url,
  s."originalDate",
  s.title,
  s."shortSummary",
  s.summary,
  s.bullets,
  JSON_BUILD_OBJECT('name', pub.name, 'displayName', pub."displayName") publisher,
  JSON_BUILD_OBJECT('name', cat.name, 'displayName', cat."displayName", 'icon', cat.icon) category,
  sm.media::jsonb media,
  st.translations::jsonb translations,
  COALESCE(JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', sibling.id, 'url', sibling.url, 'originalDate', sibling."originalDate", 'createdAt', sibling."createdAt", 'title', sibling.title, 'shortSummary', sibling."shortSummary", 'summary', sibling.summary, 'bullets', sibling.bullets, 'imageUrl', sibling."imageUrl", 'publisher', JSON_BUILD_OBJECT('id', sibling_pub.id, 'name', sibling_pub.name, 'displayName', sibling_pub."displayName"), 'category', JSON_BUILD_OBJECT('id', sibling_cat.id, 'name', sibling_cat.name, 'displayName', sibling_cat."displayName", 'icon', sibling_cat.icon), 'sentiment', sibling_ss.sentiment, 'sentiments', sibling_ss.sentiments, 'media', sibling_sm.media, 'translations', sibling_st.translations)) FILTER (WHERE sr."siblingId" IS NOT NULL), '[]'::json) siblings
FROM SummariesWithSiblings
  LEFT OUTER JOIN summaries s ON s.id = SummariesWithSiblings.id
  AND s."deletedAt" IS NULL
  LEFT OUTER JOIN publisher_view pub ON s."publisherId" = pub.id
  AND (pub.locale = :locale
  OR pub.locale IS NULL)
  LEFT OUTER JOIN category_view cat ON s."categoryId" = cat.id
  AND (cat.locale = :locale
  OR cat.locale IS NULL)
  LEFT OUTER JOIN summary_media_view sm ON sm."parentId" = s.id
  LEFT OUTER JOIN summary_translation_view st ON st."parentId" = s.id
    AND (st.locale = :locale
    OR st.locale IS NULL)
  -- siblings
  LEFT OUTER JOIN summary_relations sr ON s.id = sr."parentId"
  LEFT OUTER JOIN summaries sibling ON sibling.id = sr."siblingId"
    AND (sibling."deletedAt" IS NULL)
  LEFT OUTER JOIN publisher_view sibling_pub ON sibling."publisherId" = sibling_pub.id
  AND (sibling_pub.locale = :locale
  OR sibling_pub.locale IS NULL)
  LEFT OUTER JOIN category_view sibling_cat ON sibling."categoryId" = sibling_cat.id
  AND (sibling_cat.locale = :locale
  OR sibling_cat.locale IS NULL)
  LEFT OUTER JOIN summary_sentiment_view sibling_ss ON sibling_ss."parentId" = sibling.id
  LEFT OUTER JOIN summary_media_view sibling_sm ON sibling_sm."parentId" = sibling.id
    LEFT OUTER JOIN summary_translation_view sibling_st ON sibling_st."parentId" = sibling.id
      AND (sibling_st.locale = :locale
      OR sibling_st.locale IS NULL)
GROUP BY rank,
"totalCount",
"averageSentiment",
SummariesWithSiblings.sentiment,
SummariesWithSiblings.sentiments::jsonb,
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
st.translations::jsonb ORDER BY "rank" DESC,
s."originalDate" DESC
LIMIT :limit OFFSET :offset
)
SELECT
  "totalCount"::int count,
  JSON_AGG(SummariesWithCount.*) "rows",
  JSON_BUILD_OBJECT('sentiment', "averageSentiment") metadata
FROM
  SummariesWithCount
GROUP BY
  "averageSentiment",
  "totalCount";

