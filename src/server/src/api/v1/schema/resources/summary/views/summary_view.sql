DROP VIEW IF EXISTS summary_view;

CREATE OR REPLACE VIEW summary_view AS
SELECT
  trans.locale,
  s.id,
  s.url,
  s."originalDate",
  s."createdAt",
  s.title,
  s."shortSummary",
  s.summary,
  s.bullets,
  s."imageUrl",
  COALESCE(ROW_TO_JSON(pub.*), ROW_TO_JSON(pub_en.*)) AS publisher,
  COALESCE(ROW_TO_JSON(cat.*), ROW_TO_JSON(cat_en.*)) AS category,
  ss.sentiment,
  ss.sentiments,
  m.media,
  trans.translations
FROM
  summaries s
  LEFT OUTER JOIN summary_translation_view trans ON s.id = trans."parentId"
  LEFT OUTER JOIN publisher_view pub_en ON pub_en.id = s."publisherId"
    AND (pub_en.locale = 'en'
      OR pub_en.locale IS NULL)
  LEFT OUTER JOIN publisher_view pub ON pub.id = s."publisherId"
  AND (pub.locale = trans.locale)
  LEFT OUTER JOIN category_view cat_en ON cat_en.id = s."categoryId"
  AND (cat_en.locale = 'en'
    OR cat_en.locale IS NULL)
  LEFT OUTER JOIN category_view cat ON cat.id = s."categoryId"
  AND (cat.locale = trans.locale)
  LEFT OUTER JOIN summary_sentiment_view ss ON s.id = ss."parentId"
  LEFT OUTER JOIN summary_media_view m ON s.id = m."parentId";

SELECT
  *
FROM
  summary_view
WHERE
  locale != 'en'
ORDER BY
  "originalDate" DESC
LIMIT 10;

