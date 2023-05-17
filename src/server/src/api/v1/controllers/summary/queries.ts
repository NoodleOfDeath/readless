export const GET_SUMMARIES = `
SELECT 
  "summary"."id", 
  "summary"."title", 
  "summary"."text", 
  "summary"."imageUrl",
  "summary"."createdAt",
  "summary"."summary", 
  "summary"."shortSummary", 
  "summary"."bullets",
  "summary"."outletId", 
  "summary"."categoryId", 
  "summary"."url",
  "summary"."originalDate",
  "outlet"."name" AS "outlet.name", 
  "outlet"."displayName" AS "outlet.displayName", 
  "outlet"."brandImageUrl" AS "outlet.brandImageUrl", 
  "outlet"."description" AS "outlet.description", 
  "category"."name" AS "category.name", 
  "category"."displayName" AS "category.displayName", 
  "category"."icon" AS "category.icon",
  JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
    'method', "sentiments"."method",
    'score', "sentiments"."score",
    'tokens', "summary"."sentiment_tokens"
  )) AS "sentiments",
  "overallSentiment",
  "count"
FROM (
  SELECT 
    "summary"."id", 
    "summary"."title", 
    "summary"."text", 
    "summary"."imageUrl",
    "summary"."createdAt",
    "summary"."summary", 
    "summary"."shortSummary", 
    "summary"."bullets",
    "summary"."outletId", 
    "summary"."categoryId", 
    "summary"."url",
    "summary"."originalDate",
    JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
      'text', "summary_sentiment_tokens"."text",
      'type', "summary_sentiment_tokens"."type"
    )) AS "sentiment_tokens",
    AVG("summary_sentiments"."score") OVER() AS "overallSentiment",
    COUNT("summary"."id") OVER()
  FROM "summaries" AS "summary"
  LEFT OUTER JOIN "outlets"
  ON "summary"."outletId" = "outlets"."id"
  LEFT OUTER JOIN "categories"
  ON "summary"."categoryId" = "categories"."id"
  LEFT OUTER JOIN "summary_tokens"
  ON "summary"."id" = "summary_tokens"."parentId"
  LEFT OUTER JOIN "summary_sentiments"
    ON "summary"."id" = "summary_sentiments"."parentId"
    AND ("summary_sentiments"."deletedAt" IS NULL)
  LEFT OUTER JOIN "summary_sentiment_tokens"
    ON "summary_sentiments"."id" = "summary_sentiment_tokens"."parentId"
    AND ("summary_sentiment_tokens"."deletedAt" IS NULL)
  WHERE ("summary"."deletedAt" IS NULL)
    AND ("summary"."originalDate" > NOW() - INTERVAL :interval)
  AND (
    ("summary"."id" IN (:ids))
    OR :noIds
  )
  AND (
    (:excludeIds AND "summary"."id" NOT IN (:ids))
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
    ("summary"."title" ~* :filter)
    OR ("summary"."shortSummary" ~* :filter)
    OR ("summary"."summary" ~* :filter)
    OR ("summary"."bullets"::text ~* :filter)
    OR ("summary_tokens"."text" ~* :filter)
  )
  GROUP BY
    "summary"."id", 
    "summary"."title", 
    "summary"."text", 
    "summary"."imageUrl",
    "summary"."createdAt",
    "summary"."summary", 
    "summary"."shortSummary", 
    "summary"."bullets",
    "summary"."outletId", 
    "summary"."categoryId", 
    "summary"."url",
    "summary"."originalDate",
    "summary_sentiments"."score"
  ORDER BY 
    "summary"."originalDate" DESC,
    "summary"."createdAt" DESC
  LIMIT :limit
  OFFSET :offset
) AS "summary"
LEFT OUTER JOIN "outlets" AS "outlet"
  ON "summary"."outletId" = "outlet"."id" 
  AND ("outlet"."deletedAt" IS NULL) 
LEFT OUTER JOIN "categories" AS "category" 
  ON "summary"."categoryId" = "category"."id" 
  AND ("category"."deletedAt" IS NULL) 
LEFT OUTER JOIN "summary_sentiments" AS "sentiments" 
  ON "summary"."id" = "sentiments"."parentId" 
  AND ("sentiments"."deletedAt" IS NULL)
LEFT OUTER JOIN "summary_sentiment_tokens" AS "sentiments->tokens"
  ON "sentiments"."id" = "sentiments->tokens"."parentId" 
  AND ("sentiments->tokens"."deletedAt" IS NULL)
GROUP BY
  "summary"."id", 
  "summary"."title", 
  "summary"."text", 
  "summary"."imageUrl",
  "summary"."createdAt",
  "summary"."summary", 
  "summary"."shortSummary", 
  "summary"."bullets",
  "summary"."outletId", 
  "summary"."categoryId", 
  "summary"."url",
  "summary"."originalDate",
  "outlet.name",
  "outlet.displayName",
  "outlet.brandImageUrl",
  "outlet.description",
  "category.name",
  "category.displayName",
  "category.icon",
  "overallSentiment",
  "count"
ORDER BY 
  "summary"."originalDate" DESC,
  "summary"."createdAt" DESC;
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
    LEFT OUTER JOIN summaries ON summaries.id = summary_tokens."parentId"
    AND (summaries."deletedAt" IS NULL)
    AND ("originalDate" > NOW() - INTERVAL :interval)
    WHERE 
      (summary_tokens."deletedAt" IS NULL)
      AND (type ~* :type)
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
