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
    s.publisher::JSONB AS publisher,
    s.category::JSONB AS category,
    s.sentiment,
    s.sentiments::JSONB AS sentiments,
    s.media::JSONB AS media,
    s.translations::JSONB AS translations,
    COALESCE(
      JSON_AGG(ROW_TO_JSON(sibling.*))
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
  LEFT OUTER JOIN summary_view s
    ON b.id = s.id
  LEFT OUTER JOIN summary_relations sr
    ON b.id = sr."parentId"
  LEFT OUTER JOIN summary_view sibling
    ON sibling.id = sr."siblingId"
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
    s.publisher::JSONB,
    s.category::JSONB,
    s.sentiment,
    s.sentiments::JSONB,
    s.media::JSONB,
    s.translations::JSONB,
    "averageSentiment",
    "totalCount"
  ORDER BY
    b."originalDate" DESC
) c
GROUP BY
  "averageSentiment",
  "totalCount"
`;