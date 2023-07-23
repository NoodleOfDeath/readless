CREATE OR REPLACE VIEW summary_media_view AS
  SELECT
    s.id AS "parentId",
    COALESCE(JSON_OBJECT_AGG(
      sm.key,
      JSON_BUILD_OBJECT(
        'type', sm.type,
        'url', sm.url,
        'createdAt', sm."createdAt",
        'updatedAt', sm."updatedAt"
      )
    ) FILTER (WHERE sm.key IS NOT NULL), '{}'::JSON) AS media
  FROM
    summaries s
    LEFT OUTER JOIN summary_media sm
      ON s.id = sm."parentId"
  GROUP BY
    s.id;