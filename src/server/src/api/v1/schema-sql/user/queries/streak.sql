WITH cte AS (
  SELECT
    *,
    DATE("createdAt")::timestamp "date",
    DATE("createdAt")::timestamp - DENSE_RANK() OVER (PARTITION BY "userId" ORDER BY DATE("createdAt")) * interval '1 day' "filter"
  FROM requests
  WHERE "userId" IS NOT NULL
)
SELECT
  "userId",
  COUNT(DISTINCT DATE("date")::timestamp)::integer "length",
  MAX(DATE("createdAt")::timestamp) "max",
  MIN(DATE("createdAt")::timestamp) "min"
FROM
  cte
WHERE (:noUserId
  OR "userId" = :userId)
GROUP BY
  "userId",
  FILTER
HAVING
  COUNT(DISTINCT DATE("date")::timestamp) - 1 > 0
ORDER BY
  COUNT(DISTINCT DATE("date")::timestamp) DESC,
  MAX("createdAt") DESC,
  "userId" DESC
