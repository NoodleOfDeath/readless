export const SEARCH_SUMMARIES = `
SELECT
  "totalCount" AS "count",
  JSON_BUILD_OBJECT(
    'sentiment', "averageSentiment"
  ) AS metadata,
  JSON_AGG(c.*) AS rows
FROM (
  SELECT
    b.id,
    b.title,
    b."shortSummary",
    b.summary,
    b.bullets,
    b.url,
    b."imageUrl",
    b."originalDate",
    outlet::JSON,
    category::JSON,
    translations::JSON,
    sentiment,
    sentiments::JSON,
    COALESCE(JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
      'key', media.key,
      'url', media.url,
      'path', media.path
    ))
    FILTER (WHERE media.key IS NOT NULL), '[]'::JSON)AS media,
    COALESCE(JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
      'id', sibling.id,
      'title', sibling.title,
      'originalDate', sibling."originalDate",
      'outlet', JSONB_BUILD_OBJECT( 
         'name', sibling_outlet.name,
         'displayName', sibling_outlet."displayName"
      )
    )) FILTER (WHERE sibling.id IS NOT NULL), '[]'::JSON) AS siblings,
    "averageSentiment",
    "totalCount"
  FROM (
    SELECT
      id,
      title,
      "shortSummary",
      summary,
      bullets,
      url,
      "imageUrl",
      "originalDate",
      JSONB_BUILD_OBJECT(
        'id', "outlet.id",
        'name', "outlet.name",
        'displayName', "outlet.displayName",
        'brandImageUrl', "outlet.brandImageUrl",
        'description', "outlet.description"
      )::TEXT AS outlet,
      JSONB_BUILD_OBJECT(
        'id', "category.id",
        'name', "category.name",
        'displayName', "category.displayName",
        'icon', "category.icon"
      )::TEXT AS category,
      COALESCE(JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
        'attribute', "translation.attribute",
        'value', "translation.value"
      )) FILTER (WHERE "translation.attribute" IS NOT NULL), '[]'::JSON)::TEXT AS translations,
      sentiment,
      sentiments,
      AVG(sentiment) OVER() AS "averageSentiment",
      COUNT(id) OVER() AS "totalCount"
    FROM (
      SELECT
        summaries.id,
        summaries.title,
        summaries."shortSummary",
        summaries.summary,
        summaries.bullets,
        summaries.url,
        summaries."imageUrl",
        summaries."originalDate",
        outlets.id AS "outlet.id",
        outlets.name AS "outlet.name",
        outlets."displayName" AS "outlet.displayName",
        outlets."brandImageUrl" AS "outlet.brandImageUrl",
        outlets.description AS "outlet.description",
        cat.id AS "category.id",
        cat.name AS "category.name",
        cat."displayName" AS "category.displayName",
        cat.icon AS "category.icon",
        summary_translations.attribute AS "translation.attribute",
        summary_translations.value AS "translation.value",
        ss.sentiment,
        ss.sentiments::TEXT AS sentiments
      FROM
        summaries
        LEFT OUTER JOIN outlets
          ON summaries."outletId" = outlets.id 
          AND (outlets."deletedAt" IS NULL) 
        LEFT OUTER JOIN categories cat
          ON summaries."categoryId" = cat.id 
          AND (cat."deletedAt" IS NULL) 
        LEFT OUTER JOIN summary_translations
          ON summaries.id = summary_translations."parentId"
          AND (summary_translations."deletedAt" IS NULL)
          AND (summary_translations.locale = :locale)
        LEFT OUTER JOIN summary_sentiment_caches ss
    ON summaries.id = ss."parentId"
      WHERE (summaries."deletedAt" IS NULL)
        AND (
          (summaries."originalDate" > NOW() - INTERVAL :interval)
          OR (
            (summaries."originalDate" >= :startDate)
            AND (summaries."originalDate" <= :endDate)
          )
        )
        AND (
          (summaries.id IN (:ids))
          OR :noIds
        )
        AND (
          (:excludeIds AND summaries.id NOT IN (:ids))
          OR NOT :excludeIds
        )
        AND (
          (outlets.name IN (:outlets))
          OR :noOutlets
        )
        AND (
          (cat.name IN (:categories))
          OR :noCategories
        )
        AND (
          :noFilter
          OR (summaries.title ~* :filter)
          OR (summaries."shortSummary" ~* :filter)
          OR (summaries.summary ~* :filter)
          OR (summaries.bullets::text ~* :filter)
          OR (summary_translations.value ~* :filter)
        )
        ORDER BY
          "originalDate" DESC
    ) a
    GROUP BY
      id,
      title,
      "shortSummary",
      summary,
      bullets,
      url,
      "imageUrl",
      "originalDate",
      "outlet.id",
      "outlet.name",
      "outlet.displayName",
      "outlet.brandImageUrl",
      "outlet.description",
      "category.id",
      "category.name",
      "category.displayName",
      "category.icon",
      sentiment,
      sentiments
    ORDER BY
      "originalDate" DESC
    LIMIT :limit
    OFFSET :offset
  ) b
  LEFT OUTER JOIN summary_media media
    ON media."parentId" = b.id
    AND (media."deletedAt" IS NULL)
  LEFT OUTER JOIN summary_relations sr
    ON sr."parentId" = b.id
    AND (sr."deletedAt" IS NULL)
  LEFT OUTER JOIN summaries AS sibling
    ON sr."siblingId" = sibling.id
    AND (sr."deletedAt" IS NULL)
  LEFT OUTER JOIN outlets AS sibling_outlet
    ON (sibling_outlet.id = sibling."outletId")
  GROUP BY
    b.id,
    b.title,
    b."shortSummary",
    b.summary,
    b.bullets,
    b.url,
    b."imageUrl",
    b."originalDate",
    b.outlet,
    b.category,
    b.translations,
    b.sentiment,
    b.sentiments,
    b."averageSentiment",
    b."totalCount"
  ORDER BY
    b."originalDate" DESC
) c 
GROUP BY
  "averageSentiment",
  "totalCount"
`;