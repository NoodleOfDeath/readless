DROP VIEW IF EXISTS summary_media_view;

CREATE MATERIALIZED VIEW summary_media_view AS
SELECT
  s.id AS "parentId",
  COALESCE(JSON_OBJECT_AGG(sm.key, sm.url) FILTER (WHERE sm.key IS NOT NULL), '{}'::json) AS media
FROM
  summaries s
  LEFT OUTER JOIN summary_media sm ON s.id = sm."parentId"
GROUP BY
  s.id;

