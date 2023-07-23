DROP VIEW IF EXISTS category_translation_view;
CREATE OR REPLACE VIEW category_translation_view AS
  SELECT
    l.code AS locale,
    trans."parentId",
    COALESCE(JSON_OBJECT_AGG(
      trans.attribute,
      trans.value
    ) FILTER (WHERE trans.attribute IS NOT NULL), '{}'::JSON) AS translations
  FROM
    locales l
    LEFT OUTER JOIN category_translations trans
      ON l.code = trans.locale
  GROUP BY
    l.code,
    trans."parentId";
SELECT * FROM category_translation_view LIMIT 10;