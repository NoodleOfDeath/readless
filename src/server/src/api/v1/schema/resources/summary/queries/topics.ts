export const GET_TOPICS = `
SELECT
  s.id,
  s."title",
  s."shortSummary",
  s."originalDate",
  s."imageUrl",
  JSONB_BUILD_OBJECT(
    'id', o.id,
    'name', o."name",
    'displayName', o."displayName"
  ) AS outlet,
  JSONB_BUILD_OBJECT(
    'id', c."id",
    'name', c."name",
    'displayName', c."displayName",
    'icon', c."icon"
  ) AS category,
  COALESCE(JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
    'id', sib.id,
    'title', sib.title,
    'originalDate', sib."originalDate",
    'outlet', JSONB_BUILD_OBJECT( 
      'name', sibo."name",
      'displayName', sibo."displayName"
    )
  )) FILTER (WHERE sib.id IS NOT NULL), '[]'::JSON) AS siblings,
  COUNT(sr.id) AS "siblingCount"
FROM summaries s
LEFT JOIN outlets o ON s."outletId" = o.id
  AND o."deletedAt" IS NULL
LEFT JOIN categories c ON s."categoryId" = c.id
  AND c."deletedAt" IS NULL
LEFT JOIN "summary_relations" sr ON s.id = sr."parentId"
  AND sr."deletedAt" IS NULL
LEFT JOIN summaries sib ON sib.id = sr."siblingId"
  AND sib."deletedAt" IS NULL
LEFT JOIN outlets sibo ON sib."outletId" = sibo.id
  AND sibo."deletedAt" IS NULL
WHERE s."originalDate" > NOW() - interval :interval
AND s."deletedAt" IS NULL
AND s.id NOT IN (:ids)
GROUP BY
  s.id,
  s."title",
  s."shortSummary",
  s."originalDate",
  o.id,
  o.name,
  o."displayName",
  c.id,
  c.name,
  c."displayName",
  c.icon
ORDER BY
  "siblingCount" desc,
  s."originalDate" desc
LIMIT :limit
OFFSET :offset;
`;