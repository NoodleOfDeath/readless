SELECT
  "totalCount"::int "count",
  JSON_BUILD_OBJECT('sentiment', "averageSentiment") metadata,
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
    JSON_BUILD_OBJECT('id', pub.id, 'name', pub.name, 'displayName', pub."displayName") publisher,
    JSON_BUILD_OBJECT('id', cat.id, 'name', cat.name, 'displayName', cat."displayName", 'icon', cat.icon) category,
    ss.sentiment,
    ss.sentiments::jsonb sentiments,
    sm.media::jsonb media,
    st.translations::jsonb translations,
    COALESCE(JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', sibling.id, 'url', sibling.url, 'originalDate', sibling."originalDate", 'createdAt', sibling."createdAt", 'title', sibling.title, 'shortSummary', sibling."shortSummary", 'summary', sibling.summary, 'bullets', sibling.bullets, 'imageUrl', sibling."imageUrl", 'publisher', JSON_BUILD_OBJECT('id', sibling_pub.id, 'name', sibling_pub.name, 'displayName', sibling_pub."displayName"), 'category', JSON_BUILD_OBJECT('id', sibling_cat.id, 'name', sibling_cat.name, 'displayName', sibling_cat."displayName", 'icon', sibling_cat.icon), 'sentiment', sibling_ss.sentiment, 'sentiments', sibling_ss.sentiments, 'media', sibling_sm.media, 'translations', sibling_st.translations)) FILTER (WHERE sr."siblingId" IS NOT NULL), '[]'::json) siblings,
    "averageSentiment",
    "totalCount"
  FROM (
    SELECT
      *,
      AVG(sentiment) OVER () "averageSentiment",
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
  AND ((:ids) IS NULL
    OR (s.id IN (:ids)))
  AND (:excludeIds
    AND ((:ids) IS NULL
      OR s.id NOT IN (:ids))
    OR :excludeIds = FALSE)
  AND ((:publishers) IS NULL
    OR (pub.name IN (:publishers)))
  AND ((:excludedPublishers) IS NULL
    OR (pub.name NOT IN (:excludedPublishers)))
  AND ((:excludedCategories) IS NULL
    OR (cat.name NOT IN (:excludedCategories)))
  AND (:filter IS NULL
    OR LENGTH(:filter) = 0
    OR ((:categories) IS NULL
      OR (cat.name IN (:categories)))
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
  -- siblings
  LEFT OUTER JOIN summary_relations sr ON b.id = sr."parentId"
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
    AND sibling_st.locale = :locale
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

