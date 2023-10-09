SELECT "totalCount"::INT AS "count",
  JSON_AGG(c.*) AS rows
FROM (
  SELECT 
    b.id,
    s."title",
    s."shortSummary",
    s.summary,
    s.bullets,
    s.url,
    s."originalDate",
    s."imageUrl",
    JSON_BUILD_OBJECT(
      'id', pub.id,
      'name', pub.name,
      'displayName', pub."displayName"
    ) AS publisher,
    JSON_BUILD_OBJECT(
      'id', cat.id,
      'name', cat.name,
      'displayName', cat."displayName",
      'icon', cat.icon
    ) AS category,
    ss.sentiment,
    ss.sentiments::JSONB AS sentiments,
    sm.media::JSONB AS media,
    st.translations::JSONB AS translations,
    "siblingCount",
    COALESCE(
      JSON_AGG(sr."siblingId")
      FILTER (WHERE sr."siblingId" IS NOT NULL),
    '[]'::JSON) AS siblings,
    "totalCount"
  FROM (
    SELECT
      *,
      COUNT(a.id) OVER() AS "totalCount"
  FROM (
    SELECT
      s.id,
      s."originalDate",
      COUNT(sibling.id) AS "siblingCount"
    FROM summaries s
      LEFT OUTER JOIN categories cat ON s."categoryId" = cat.id
      LEFT OUTER JOIN publishers pub ON s."publisherId" = pub.id
      LEFT OUTER JOIN summary_translations st ON st."parentId" = s.id
        AND st.locale = :locale
      LEFT OUTER JOIN "summary_relations" sr ON (s.id = sr."parentId")
        AND (sr."deletedAt" IS NULL)
      LEFT OUTER JOIN summaries sibling ON (sibling.id = sr."siblingId")
        AND (sibling."deletedAt" IS NULL)
        AND (sibling."originalDate" > NOW() - INTERVAL :interval)
      WHERE 
        s."deletedAt" IS NULL
        AND (
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
        GROUP BY
          s.id,
          s."originalDate"
        ORDER BY
          "siblingCount" DESC,
          s."originalDate" DESC
    ) a
    ORDER BY
      a."siblingCount" DESC,
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
  LEFT OUTER JOIN summary_relations sr
    ON b.id = sr."parentId"
  GROUP BY
    b.id,
    s.url,
    s."originalDate",
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
    "siblingCount",
    "totalCount"
  ORDER BY
    b."siblingCount" DESC,
    s."originalDate" DESC
) c
GROUP BY
  "totalCount";