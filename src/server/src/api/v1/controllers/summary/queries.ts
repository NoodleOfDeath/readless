export const GET_SUMMARIES = `
SELECT
  c.total_count AS count,
  JSON_BUILD_OBJECT(
    'sentiment', c.average_sentiment
  ) AS metadata,
  JSON_AGG(c.*) AS rows
FROM (
  SELECT
    *,
    AVG(b.sentiment) OVER() AS average_sentiment
  FROM (
    SELECT
      a.id,
      a.title,
      a."shortSummary",
      a.summary,
      a.bullets,
      a.url,
      a."imageUrl",
      a."originalDate",
      JSON_BUILD_OBJECT(
        'name', a."outlet.name",
        'displayName', a."outlet.displayName",
        'brandImageUrl', a."outlet.brandImageUrl",
        'description', a."outlet.description"
      ) as outlet,
      JSON_BUILD_OBJECT(
        'name', a."category.name",
        'displayName', a."category.displayName",
        'icon', "category.icon"
      ) as category,
      JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
        'method', a.method,
        'score', a.score,
        'tokens', tokens
      )) AS sentiments,
      AVG(a.score) as sentiment,
      COUNT(a.id) OVER() AS total_count
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
        outlets.name as "outlet.name",
        outlets."displayName" as "outlet.displayName",
        outlets."brandImageUrl" as "outlet.brandImageUrl",
        outlets."description" as "outlet.description",
        categories.name as "category.name",
        categories."displayName" as "category.displayName",
        categories.icon as "category.icon",
        summary_sentiments.method,
        summary_sentiments.score,
        JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
          'text', summary_sentiment_tokens.text
        )) AS tokens
      FROM
        summaries
        LEFT OUTER JOIN "outlets"
          ON summaries."outletId" = "outlets"."id" 
          AND ("outlets"."deletedAt" IS NULL) 
        LEFT OUTER JOIN "categories" 
          ON "summaries"."categoryId" = "categories"."id" 
          AND ("categories"."deletedAt" IS NULL) 
        LEFT OUTER JOIN summary_tokens
          ON summaries.id = summary_tokens."parentId"
          AND (summary_tokens."deletedAt" IS NULL)
        LEFT OUTER JOIN summary_sentiments
          ON summaries.id = summary_sentiments."parentId"
          AND (summary_sentiments."deletedAt" IS NULL)
        LEFT OUTER JOIN summary_sentiment_tokens
          ON summary_sentiments.id = summary_sentiment_tokens."parentId"
          AND (summary_sentiment_tokens."deletedAt" IS NULL)
      WHERE ("summaries"."deletedAt" IS NULL)
        AND ("summaries"."originalDate" > NOW() - INTERVAL :interval)
        AND (
          ("summaries"."id" IN (:ids))
          OR :noIds
        )
        AND (
          (:excludeIds AND "summaries"."id" NOT IN (:ids))
          OR NOT :excludeIds
        )
        AND (
          ("outlets"."name" IN (:outlets))
          OR :noOutlets
        )
        AND (
          ("categories"."name" IN (:categories))
          OR :noCategories
        )
        AND (
          summaries.title ~* :filter
          OR (summaries."shortSummary" ~* :filter)
          OR (summaries.summary ~* :filter)
          OR (summaries."bullets"::text ~* :filter)
          OR (summary_tokens.text ~* :filter)
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
        "outlet.name",
        "outlet.displayName",
        "outlet.brandImageUrl",
        "outlet.description",
        "category.name",
        "category.displayName",
        "category.icon",
        summary_sentiments.method,
        summary_sentiments.score
    ) a
    GROUP BY
      a.id,
      a.title,
      a."shortSummary",
      a.summary,
      a.bullets,
      a.url,
      a."imageUrl",
      a."originalDate",
      a."outlet.name",
      a."outlet.displayName",
      a."outlet.brandImageUrl",
      a."outlet.description",
      a."category.name",
      a."category.displayName",
      a."category.icon"
    ORDER BY a."originalDate" DESC
    LIMIT :limit
    OFFSET :offset
  ) b
) c
GROUP BY
  c.total_count,
  c.average_sentiment
`;

export const GET_SUMMARY_TOKEN_COUNTS = `
SELECT 
  total_count AS count,
  JSON_AGG(JSON_BUILD_OBJECT(
    'text', b.text,
    'type', b.type,
    'count', b.count
  ) ORDER BY b.count DESC) AS rows
FROM (
  SELECT
    COUNT(*) OVER() AS total_count,
    COUNT(*) count,
    a.text,
    a.type
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
    a.text,
    a.type
  HAVING COUNT(*) >= :min
  ORDER BY count DESC
  LIMIT :limit
  OFFSET :offset
) b
GROUP BY total_count;
`;

