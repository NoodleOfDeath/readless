WITH Ranked AS (
  SELECT
    ROW_NUMBER() OVER (ORDER BY COUNT(DISTINCT s."id") DESC,
      s."userId" DESC) "rank",
    COUNT(DISTINCT s."id") "count",
    a."value" "user",
    s."userId"
  FROM summary_interactions s
  LEFT JOIN aliases a ON s."userId" = a."userId"
    AND (a."type" = 'username')
WHERE s."userId" IS NOT NULL
AND (:userId IS NULL
  OR s."userId" = :userId)
AND ((:type) IS NULL
  OR s."type" IN (:type))
AND (:interval IS NULL
  OR s."createdAt" > DATE_TRUNC(:interval, NOW()))
AND revert = FALSE
GROUP BY "user",
s."userId" ORDER BY COUNT(DISTINCT s."id") DESC,
s."userId" DESC
LIMIT :limit OFFSET :offset
)
SELECT
  "rank",
  "count",
  "user",
  "userId"
FROM
  Ranked
WHERE (:minCount IS NULL
  OR "count" >= :minCount);

