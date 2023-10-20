DROP MATERIALIZED VIEW IF EXISTS summary_sentiment_view;

CREATE MATERIALIZED VIEW summary_sentiment_view AS
SELECT
  s.id AS "parentId",
  COALESCE(AVG(ss.score) FILTER (WHERE ss.score IS NOT NULL), 0) AS sentiment,
  COALESCE(JSON_OBJECT_AGG(ss.method, JSON_BUILD_OBJECT('score', ss.score, 'method', ss.method)) FILTER (WHERE ss.method IS NOT NULL), '{}'::json) AS sentiments
FROM
  summaries s
  LEFT OUTER JOIN summary_sentiments ss ON s.id = ss."parentId"
GROUP BY
  s.id;

