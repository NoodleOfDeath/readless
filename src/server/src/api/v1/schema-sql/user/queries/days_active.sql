SELECT
  ROW_NUMBER() OVER (ORDER BY COUNT(DISTINCT DATE(r."createdAt")::timestamp) DESC,
    MAX(DATE(r."createdAt")::timestamp) DESC,
    r."userId" DESC) "rank",
  aliases.value "user",
  r."userId",
  COUNT(DISTINCT DATE(r."createdAt")::timestamp)::integer "count",
  MAX(r."createdAt") "updatedAt"
FROM
  requests r
  LEFT JOIN users ON r."userId" = users.id
  LEFT JOIN aliases ON r."userId" = aliases."userId"
    AND aliases.type = 'username'
WHERE (:userId IS NULL
  OR r."userId" = :userId)
AND r."userId" IS NOT NULL
GROUP BY
  "user",
  r."userId"
ORDER BY
  COUNT(DISTINCT DATE(r."createdAt")::timestamp) DESC,
  MAX(DATE(r."createdAt")::timestamp) DESC,
  r."userId" DESC
LIMIT :limit
OFFSET :offset;

