CREATE OR REPLACE VIEW summary_sentiments_view AS
  SELECT
    s.id AS "parentId",
    COALESCE(AVG(ss.score) 
      FILTER (WHERE ss.score IS NOT NULL), 0) AS sentiment,
    COALESCE(JSON_OBJECT_AGG(
      ss.method,
      JSON_BUILD_OBJECT(
        'score', ss.score,
        'method', ss.method
      )
    ) FILTER (WHERE ss.method IS NOT NULL), '{}'::JSON) AS media
  FROM
    summaries s
    LEFT OUTER JOIN summary_sentiments ss
      ON s.id = ss."parentId"
  GROUP BY
  s.id;