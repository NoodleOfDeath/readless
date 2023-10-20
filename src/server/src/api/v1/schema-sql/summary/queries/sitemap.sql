SELECT
  s.id,
  s.title,
  JSON_BUILD_OBJECT('displayName', pub."displayName") AS publisher,
  s."originalDate",
  s."createdAt",
  s."updatedAt",
  COALESCE(COUNT(sr.id), 0) AS "siblingCount"
FROM
  summaries s
  LEFT OUTER JOIN publishers pub ON pub.id = s."publisherId"
  LEFT OUTER JOIN summary_relations sr ON sr."parentId" = s.id
GROUP BY
  s.id,
  s.title,
  pub."displayName",
  s."originalDate",
  s."createdAt",
  s."updatedAt"
ORDER BY
  "siblingCount" DESC;

