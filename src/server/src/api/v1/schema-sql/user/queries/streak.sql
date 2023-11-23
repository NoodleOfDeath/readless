WITH cte AS (
  SELECT
    r."userId",
    a."value" "user",
    DATE(r."createdAt")::timestamp "date",
    DATE(r."createdAt")::timestamp - DENSE_RANK() OVER (PARTITION BY r."userId" ORDER BY DATE(r."createdAt")::timestamp) * interval '1 day' "filter",
    r."createdAt"
  FROM requests r
  LEFT JOIN aliases a ON r."userId" = a."userId"
    AND (a."type" = 'username')
WHERE r."userId" IS NOT NULL
)
SELECT
  ROW_NUMBER() OVER (ORDER BY COUNT(DISTINCT DATE("date")::timestamp) DESC,
    MAX(DATE("date")::timestamp) DESC,
    "userId" DESC) "rank",
  "user",
  "userId",
  COUNT(DISTINCT DATE("date")::timestamp)::integer "count",
  MAX(DATE("date")::timestamp) "max",
  MIN(DATE("date")::timestamp) "min",
  MAX("createdAt") "updatedAt"
FROM
  cte
WHERE (:userId IS NULL
  OR "userId" = :userId)
GROUP BY
  "user",
  "userId",
  FILTER
HAVING
  COUNT(DISTINCT DATE("date")::timestamp) - 1 > 0
ORDER BY
  COUNT(DISTINCT DATE("date")::timestamp) DESC,
  MAX(DATE("date")::timestamp) DESC,
  "userId" DESC
LIMIT :limit;

