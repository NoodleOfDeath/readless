export const SEARCH_SUMMARIES = `
SELECT
  "totalCount"::INT AS "count",
  JSON_BUILD_OBJECT(
    'sentiment', "averageSentiment"
  ) AS metadata,
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
    -- legacy for watch
    JSON_BUILD_OBJECT(
      'id', pub.id,
      'name', pub.name,
      'displayName', pub."displayName",
      'description', pub.description,
      'translations', pub.translations::JSONB
    ) AS outlet,
    JSON_BUILD_OBJECT(
      'id', pub.id,
      'name', pub.name,
      'displayName', pub."displayName",
      'description', pub.description,
      'translations', pub.translations::JSONB
    ) AS publisher,
    JSON_BUILD_OBJECT(
      'id', cat.id,
      'name', cat.name,
      'displayName', cat."displayName",
      'icon', cat.icon,
      'translations', cat.translations::JSONB
    ) AS category,
    ss.sentiment,
    ss.sentiments::JSONB AS sentiments,
    sm.media::JSONB AS media,
    st.translations::JSONB AS translations,
    COALESCE(
      JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
        'id', sibling.id,
        'url', sibling.url,
        'originalDate', sibling."originalDate",
        'createdAt', sibling."createdAt",
        'title', sibling.title,
        'shortSummary', sibling."shortSummary",
        'summary', sibling.summary,
        'bullets', sibling.bullets,
        'imageUrl', sibling."imageUrl",
        'publisher', ROW_TO_JSON(sibling_pub.*),
        'category', ROW_TO_JSON(sibling_cat.*),
        'sentiment', sibling_ss.sentiment,
        'sentiments', sibling_ss.sentiments,
        'media', sibling_sm.media,
        'translations', sibling_st.translations
      ))
      FILTER (WHERE sr."siblingId" IS NOT NULL),
    '[]'::JSON) AS siblings,
    "averageSentiment",
    "totalCount"
  FROM (
    SELECT
      *,
      AVG(sentiment) OVER() AS "averageSentiment",
      COUNT(id) OVER() AS "totalCount"
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
      WHERE (
          (s."originalDate" > NOW() - INTERVAL :interval)
          OR (
            (s."originalDate" >= :startDate)
            AND (s."originalDate" <= :endDate)
          )
        )
        AND (
          (s.id IN (:ids))
          OR :noIds
        )
        AND (
          (:excludeIds AND s.id NOT IN (:ids))
          OR NOT :excludeIds
        )
        AND (
          (pub.name IN (:publishers))
          OR :noPublishers
        )
        AND (
          (pub.name NOT IN (:excludedPublishers))
          OR :noExcludedPublishers
        )
        AND (
          (cat.name IN (:categories))
          OR :noCategories
        )
        AND (
          (cat.name NOT IN (:excludedCategories))
          OR :noExcludedCategories
        )
        AND (
          :noFilter
          OR (s.title ~* :filter)
          OR (s."shortSummary" ~* :filter)
          OR (s.summary ~* :filter)
          OR (s.bullets::TEXT ~* :filter)
          OR (st.value ~* :filter)
        )
        ORDER BY
          s."originalDate" DESC
    ) a
    ORDER BY
      a."originalDate" DESC
    LIMIT :limit
    OFFSET :offset
  ) b
  LEFT OUTER JOIN summaries s
    ON b.id = s.id
    AND (s."deletedAt" IS NULL)
  LEFT OUTER JOIN publisher_view pub
    ON s."publisherId" = pub.id
    AND (pub.locale = :locale OR pub.locale IS NULL)
  LEFT OUTER JOIN category_view cat
    ON s."categoryId" = cat.id
    AND (cat.locale = :locale OR cat.locale IS NULL)
  LEFT OUTER JOIN summary_sentiment_view ss
    ON ss."parentId" = s.id
  LEFT OUTER JOIN summary_media_view sm
    ON sm."parentId" = s.id
  LEFT OUTER JOIN summary_translation_view st
    ON st."parentId" = s.id
    AND st.locale = :locale
  -- siblings
  LEFT OUTER JOIN summary_relations sr
    ON b.id = sr."parentId"
  LEFT OUTER JOIN summaries sibling
    ON sibling.id = sr."siblingId"
    AND (sibling."deletedAt" IS NULL)
  LEFT OUTER JOIN publisher_view sibling_pub
    ON sibling."publisherId" = sibling_pub.id
    AND (sibling_pub.locale = :locale OR sibling_pub.locale IS NULL)
  LEFT OUTER JOIN category_view sibling_cat
    ON sibling."categoryId" = sibling_cat.id
    AND (sibling_cat.locale = :locale OR sibling_cat.locale IS NULL)
  LEFT OUTER JOIN summary_sentiment_view sibling_ss
    ON sibling_ss."parentId" = sibling.id
  LEFT OUTER JOIN summary_media_view sibling_sm
    ON sibling_sm."parentId" = sibling.id
  LEFT OUTER JOIN summary_translation_view sibling_st
    ON sibling_st."parentId" = sibling.id
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
    pub.translations::JSONB,
    cat.id,
    cat.name,
    cat."displayName",
    cat.icon,
    cat.translations::JSONB,
    ss.sentiment,
    ss.sentiments::JSONB,
    sm.media::JSONB,
    st.translations::JSONB,
    "averageSentiment",
    "totalCount"
  ORDER BY
    b."originalDate" DESC
) c
GROUP BY
  "averageSentiment",
  "totalCount";
`;