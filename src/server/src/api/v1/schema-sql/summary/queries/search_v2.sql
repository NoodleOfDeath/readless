SELECT
  "totalCount"::int AS "count",
  JSON_BUILD_OBJECT('sentiment', "averageSentiment") AS metadata,
  JSON_AGG(c.*) AS rows
FROM (
  SELECT
    s.id,
    s.url,
    b."originalDate",
    s."createdAt",
    s.title,
    s."shortSummary",
    s.summary,
    s.bullets,
    s."imageUrl",
    JSON_BUILD_OBJECT('id', pub.id, 'name', pub.name, 'displayName', pub."displayName") AS publisher,
    JSON_BUILD_OBJECT('id', cat.id, 'name', cat.name, 'displayName', cat."displayName", 'icon', cat.icon) AS category,
    ss.sentiment,
    ss.sentiments::jsonb AS sentiments,
    sm.media::jsonb AS media,
    st.translations::jsonb AS translations,
    COALESCE(JSON_AGG(DISTINCT sr."siblingId") FILTER (WHERE sr."siblingId" IS NOT NULL), '[]'::json) AS siblings,
    "averageSentiment",
    "totalCount"
  FROM (
    SELECT
      *,
      AVG(sentiment) OVER () AS "averageSentiment",
      COUNT(id) OVER () AS "totalCount"
    FROM (
      SELECT
        s.id,
        s."originalDate",
        ss.sentiment
      FROM
        summaries s
      LEFT OUTER JOIN categories cat ON s."categoryId" = cat.id
    LEFT OUTER JOIN publishers pub ON s."publisherId" = pub.id
    LEFT OUTER JOIN summary_translations st ON st."parentId" = s.id
      AND st.locale = :locale
  LEFT OUTER JOIN summary_sentiment_view ss ON ss."parentId" = s.id
WHERE
  s."deletedAt" IS NULL
  AND ((s."originalDate" > NOW() - INTERVAL :interval)
    OR ((s."originalDate" >= :startDate)
      AND (s."originalDate" <= :endDate)))
  AND ((s.id IN (:ids))
    OR :noIds)
  AND ((:excludeIds
      AND s.id NOT IN (:ids))
    OR NOT :excludeIds)
  AND ((pub.name IN (:publishers))
    OR :noPublishers)
  AND ((pub.name NOT IN (:excludedPublishers))
    OR :noExcludedPublishers)
  AND ((cat.name IN (:categories))
    OR :noCategories)
  AND ((cat.name NOT IN (:excludedCategories))
    OR :noExcludedCategories)
  AND (:noFilter
    OR (s.title ~* :filter)
    OR (s."shortSummary" ~* :filter)
    OR (s.summary ~* :filter)
    OR (s.bullets::text ~* :filter)
    OR (st.value ~* :filter))
ORDER BY
  s."originalDate" DESC) a
ORDER BY
  a."originalDate" DESC
LIMIT :limit OFFSET :offset) b
  LEFT OUTER JOIN summaries s ON b.id = s.id
  AND (s."deletedAt" IS NULL)
  LEFT OUTER JOIN publisher_view pub ON s."publisherId" = pub.id
  AND (pub.locale = :locale
    OR pub.locale IS NULL)
  LEFT OUTER JOIN category_view cat ON s."categoryId" = cat.id
  AND (cat.locale = :locale
    OR cat.locale IS NULL)
  LEFT OUTER JOIN summary_sentiment_view ss ON ss."parentId" = s.id
  LEFT OUTER JOIN summary_media_view sm ON sm."parentId" = s.id
  LEFT OUTER JOIN summary_translation_view st ON st."parentId" = s.id
    AND st.locale = :locale
    -- siblings
  LEFT OUTER JOIN summary_relations sr ON b.id = sr."parentId"
  LEFT OUTER JOIN summaries sibling ON sibling.id = sr."siblingId"
    AND (sibling."deletedAt" IS NULL)
GROUP BY
  s.id,
  s.url,
  b."originalDate",
  s."createdAt",
  s.title,
  s."shortSummary",
  s.summary,
  s.bullets,
  s."imageUrl",
  pub.id,
  pub.name,
  pub."displayName",
  pub.description,
  pub.translations::jsonb,
  cat.id,
  cat.name,
  cat."displayName",
  cat.icon,
  cat.translations::jsonb,
  ss.sentiment,
  ss.sentiments::jsonb,
  sm.media::jsonb,
  st.translations::jsonb,
  "averageSentiment",
  "totalCount"
ORDER BY
  b."originalDate" DESC) c
GROUP BY
  "averageSentiment",
  "totalCount";

