export const GET_SUMMARIES = `
SELECT
  "totalCount"::INT AS count,
  JSONB_BUILD_OBJECT(
    'sentiment', "averageSentiment"
  ) AS metadata,
  JSON_AGG(c.*) AS rows
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
    outlet,
    category,
    translations,
    COALESCE(sentiment, 0) AS sentiment,
    sentiments,
    AVG(sentiment) OVER() AS "averageSentiment",
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
      ) AS outlet,
      JSONB_BUILD_OBJECT(
        'id', "category.id",
        'name', "category.name",
        'displayName', "category.displayName",
        'icon', "category.icon"
      ) AS category,
      COALESCE(JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
        'attribute', "translation.attribute",
        'value', "translation.value"
      )) FILTER (WHERE "translation.attribute" IS NOT NULL), '[]'::JSON) AS translations,
      AVG("sentiment.score") AS sentiment,
      COALESCE(JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
        'method', "sentiment.method",
        'score', "sentiment.score",
        'description', '',
        'tokens', '[]'::JSON
      )) FILTER (WHERE "sentiment.score" IS NOT NULL), '[]'::JSON) AS sentiments,
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
        categories.id AS "category.id",
        categories.name AS "category.name",
        categories."displayName" AS "category.displayName",
        categories.icon AS "category.icon",
        summary_translations.attribute AS "translation.attribute",
        summary_translations.value AS "translation.value",
        summary_sentiments.method AS "sentiment.method",
        summary_sentiments.score AS "sentiment.score"
      FROM
        summaries
        LEFT OUTER JOIN outlets
          ON summaries."outletId" = outlets.id 
          AND (outlets."deletedAt" IS NULL) 
        LEFT OUTER JOIN categories
          ON summaries."categoryId" = categories.id 
          AND (categories."deletedAt" IS NULL) 
        LEFT OUTER JOIN summary_translations
          ON summaries.id = summary_translations."parentId"
          AND (summary_translations."deletedAt" IS NULL)
          AND (summary_translations.locale = :locale)
        LEFT OUTER JOIN summary_tokens
          ON summaries.id = summary_tokens."parentId"
          AND (summary_tokens."deletedAt" IS NULL)
        LEFT OUTER JOIN summary_sentiments
          ON summaries.id = summary_sentiments."parentId"
          AND (summary_sentiments."deletedAt" IS NULL)
      WHERE (summaries."deletedAt" IS NULL)
        AND (summaries."originalDate" > NOW() - INTERVAL :interval)
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
          (categories.name IN (:categories))
          OR :noCategories
        )
        AND (
          summaries.title ~* :filter
          OR (summaries."shortSummary" ~* :filter)
          OR (summaries.summary ~* :filter)
          OR (summaries.bullets::text ~* :filter)
          OR (summary_tokens.text ~* :filter)
          OR (summary_translations.value ~* :filter)
        )
      GROUP BY
        summaries.id,
        summaries.title,
        summaries."shortSummary",
        summaries.summary,
        summaries.bullets,
        summaries.url,
        summaries."imageUrl",
        summaries."originalDate",
        "outlet.id",
        "outlet.name",
        "outlet.displayName",
        "outlet.brandImageUrl",
        "outlet.description",
        "category.id",
        "category.name",
        "category.displayName",
        "category.icon",
        "translation.attribute",
        "translation.value",
        "sentiment.method",
        "sentiment.score"
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
      "category.icon"
    ORDER BY "originalDate" DESC
  ) b
  LIMIT :limit
  OFFSET :offset
) c
GROUP BY
  "averageSentiment",
  "totalCount"
`;

export const GET_SUMMARY_TOKEN_COUNTS = `
SELECT 
  "totalCount" AS count,
  COALESCE(JSON_AGG(JSONB_BUILD_OBJECT(
    'text', text,
    'type', type,
    'count', count
  ) ORDER BY count DESC), '[]'::JSON) AS rows
FROM (
  SELECT
    COUNT(*) OVER() AS "totalCount",
    COUNT(*) AS count,
    text,
    type
  FROM (
    SELECT
      summary_tokens.text, 
      summary_tokens.type
    FROM summary_tokens
    LEFT OUTER JOIN summaries 
      ON summaries.id = summary_tokens."parentId"
      AND (summaries."deletedAt" IS NULL)
    WHERE 
      (summary_tokens."deletedAt" IS NULL)
      AND (summary_tokens.type ~* :type)
      AND (summaries."originalDate" > NOW() - INTERVAL :interval)
  ) a
  GROUP BY
    text,
    type
  HAVING COUNT(*) >= :min
  ORDER BY count DESC
  LIMIT :limit
  OFFSET :offset
) b
GROUP BY 
  "totalCount";
`;

