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
    COALESCE(ARRAY_AGG(sibling."childId" FILTER (WHERE sr."childId" IS NOT NULL), '[]'::int[]) siblings, "averageSentiment", "totalCount"
  FROM (
    SELECT
      *, AVG(sentiment) OVER () "averageSentiment", COUNT(id) OVER () AS "totalCount"
  FROM (
    SELECT
      s.id, s."originalDate", ss.sentiment
    FROM summaries s
  LEFT OUTER JOIN categories cat ON s."categoryId" = cat.id
  LEFT OUTER JOIN publishers pub ON s."publisherId" = pub.id
  LEFT OUTER JOIN summary_translations st ON st."parentId" = s.id
    AND (st.locale = :locale)
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
AND ((:categories) IS NULL
  OR (cat.name IN (:categories)))
AND ((:excludedPublishers) IS NULL
  OR (pub.name NOT IN (:excludedPublishers)))
AND ((:excludedCategories) IS NULL
  OR (cat.name NOT IN (:excludedCategories)))
AND (LENGTH(:filter) = 0
  OR (s.title ~* :filter)
  OR (s."shortSummary" ~* :filter)
  OR (s.summary ~* :filter)
  OR (s.bullets::text ~* :filter)
  OR (st.value ~* :filter))
ORDER BY s."originalDate" DESC) a ORDER BY a."originalDate" DESC LIMIT :limit OFFSET :offset) b
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
    AND (st.locale = :locale
      OR st.locale IS NULL)
    -- siblings
  LEFT OUTER JOIN topic_summaries tr ON s.id = tr."childId"
  LEFT OUTER JOIN topics t ON t.id = tr."groupId"
  LEFT OUTER JOIN topic_summaries sr ON sr."groupId" = t.id
    AND sr."childId" <> s.id GROUP BY s.id, s.url, b."originalDate", s."createdAt", s.title, s."shortSummary", s.summary, s.bullets, s."imageUrl", pub.id, pub.name, pub."displayName", pub.description, pub.translations::jsonb, cat.id, cat.name, cat."displayName", cat.icon, cat.translations::jsonb, ss.sentiment, ss.sentiments::jsonb, sm.media::jsonb, st.translations::jsonb, "averageSentiment", "totalCount" ORDER BY b."originalDate" DESC) c
  GROUP BY
    "averageSentiment",
    "totalCount";

