WITH DuplicateTopics AS (
  SELECT 
    COUNT(ts."childId") AS count,
    ARRAY_AGG(DISTINCT ts."groupId" ORDER BY ts."groupId" ASC) AS siblings
  FROM topic_summaries ts
  GROUP BY ts."childId"
)
SELECT 
  siblings
FROM DuplicateTopics
WHERE
  count > 1;