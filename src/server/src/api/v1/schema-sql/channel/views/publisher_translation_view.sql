DROP MATERIALIZED VIEW IF EXISTS publisher_translation_view;

CREATE MATERIALIZED VIEW publisher_translation_view AS
SELECT l.code AS locale,
  trans."parentId",
  COALESCE(json_object_agg(trans.attribute, trans.value) FILTER (WHERE trans.attribute IS NOT NULL), '{}'::json) AS translations
FROM
  locales l
  LEFT JOIN publisher_translations trans ON l.code::text = trans.locale::text
  GROUP BY l.code, trans."parentId";