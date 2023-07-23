DROP VIEW IF EXISTS category_view;

CREATE OR REPLACE VIEW category_view AS
SELECT
  trans.locale,
  cat.id,
  cat.name,
  COALESCE(translations ->> 'displayName', cat."displayName") AS "displayName",
  cat.icon
FROM
  categories cat
  LEFT OUTER JOIN category_translation_view trans ON cat.id = trans."parentId";

SELECT
  *
FROM
  category_view
LIMIT 10;

