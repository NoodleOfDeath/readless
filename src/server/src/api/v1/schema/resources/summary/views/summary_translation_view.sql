DROP VIEW IF EXISTS summary_translation_view;

CREATE OR REPLACE VIEW summary_translation_view AS
SELECT
  l.code AS locale,
  trans."parentId",
  COALESCE(JSON_OBJECT_AGG(trans.attribute, trans.value) FILTER (WHERE trans.attribute IS NOT NULL), '{}'::json) AS translations
FROM
  locales l
  LEFT OUTER JOIN summary_translations trans ON l.code = trans.locale
GROUP BY
  l.code,
  trans."parentId";

SELECT
  *
FROM
  summary_translation_view
LIMIT 10;

