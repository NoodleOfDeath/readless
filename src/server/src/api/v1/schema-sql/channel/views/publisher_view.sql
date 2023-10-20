DROP VIEW IF EXISTS publisher_view;

CREATE MATERIALIZED VIEW publisher_view AS
SELECT
  trans.locale,
  pub.id,
  pub.name,
  pub."displayName",
  COALESCE(translations ->> 'description', pub.description) AS description,
  translations
FROM
  publishers pub
  LEFT OUTER JOIN publisher_translation_view trans ON pub.id = trans."parentId";