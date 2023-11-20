DROP MATERIALIZED VIEW IF EXISTS category_view;

CREATE MATERIALIZED VIEW category_view AS
SELECT
  trans.locale,
  cat.id,
  cat.name,
  COALESCE(trans.translations ->> 'displayName'::text, cat."displayName"::text) "displayName",
  cat.icon,
  trans.translations
FROM
  categories cat
  LEFT JOIN category_translation_view trans ON cat.id = trans."parentId";

