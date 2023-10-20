DROP MATERIALZIED VIEW IF EXISTS publisher_view;

CREATE MATERIALIZED VIEW publisher_view AS
SELECT trans.locale,
  pub.id,
  pub.name,
  pub."displayName",
  COALESCE(trans.translations ->> 'description'::text, pub.description) AS description,
  trans.translations
FROM 
  publishers pub
  LEFT JOIN publisher_translation_view trans ON pub.id = trans."parentId";