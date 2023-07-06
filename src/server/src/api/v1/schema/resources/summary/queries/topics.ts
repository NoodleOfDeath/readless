export const GET_TOPICS = `
SELECT 
  "totalCount"::INT AS "count",
  JSON_AGG(b.*) AS rows
FROM (
  SELECT
    s.id,
    s."title",
    s."shortSummary",
    s."originalDate",
    s."imageUrl",
    JSONB_BUILD_OBJECT(
      'id', pub.id,
      'name', pub.name,
      'displayName', pub."displayName"
    ) AS outlet,
    JSONB_BUILD_OBJECT(
      'id', cat.id,
      'name', cat.name,
      'displayName', cat."displayName",
      'icon', cat.icon
    ) AS category,
    COALESCE(JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
      'id', sr.id
    )) FILTER (WHERE sr.id IS NOT NULL), '[]'::JSON) AS siblings,
    COUNT(sr.id) AS "siblingCount",
    COUNT(s.id) OVER() AS "totalCount"
  FROM summaries s
  LEFT JOIN outlets pub ON s."outletId" = pub.id
    AND pub."deletedAt" IS NULL
  LEFT JOIN categories cat ON s."categoryId" = cat.id
    AND cat."deletedAt" IS NULL
  LEFT JOIN "summary_relations" sr ON s.id = sr."parentId"
    AND sr."deletedAt" IS NULL
  WHERE s."originalDate" > NOW() - interval :interval
  AND s."deletedAt" IS NULL
  AND s.id NOT IN (:ids)
  GROUP BY
    s.id,
    s.title,
    s."shortSummary",
    s."originalDate",
    pub.id,
    pub.name,
    pub."displayName",
    cat.id,
    cat.name,
    cat."displayName",
    cat.icon
  ORDER BY
    "siblingCount" DESC,
    s."originalDate" DESC
  LIMIT :limit
  OFFSET :offset
) b
GROUP BY 
"totalCount"
`;