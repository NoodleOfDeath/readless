export const GET_TOP_STORIES = `
SELECT 
  "totalCount"::INT AS "count",
  JSON_AGG(c.*) AS rows
FROM (
  SELECT 
    b.id,
    b."title",
    b."shortSummary",
    b.summary,
    b.bullets,
    b.url,
    b."originalDate",
    b."imageUrl",
    b.publisher,
    b.category,
    siblings,
    sentiment,
    sentiments,
    translations,
    "totalCount"
  FROM (
    SELECT
      s.id,
      s."title",
      s."shortSummary",
      s.summary,
      s.bullets,
      s.url,
      s."originalDate",
      s."imageUrl",
      JSONB_BUILD_OBJECT(
        'id', pub.id,
        'name', pub.name,
        'displayName', pub."displayName"
      ) AS publisher,
      JSONB_BUILD_OBJECT(
        'id', cat.id,
        'name', cat.name,
        'displayName', COALESCE(cat_trans.value, cat."displayName"),
        'icon', cat.icon
      ) AS category,
      COALESCE(JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
        'id', sr."siblingId",
        'title', sibling.title,
        'shortSummary', sibling."shortSummary",
        'url', sibling.url,
        'imageUrl', sibling."imageUrl",
        'originalDate', sibling."originalDate",
        'publisher', JSONB_BUILD_OBJECT(
          'name', sibling_pub.name,
          'displayName', sibling_pub."displayName"
        ),
        'category', JSONB_BUILD_OBJECT( 
          'name', sibling_cat.name,
          'displayName', COALESCE(sibling_cat_trans.value, sibling_cat."displayName"),
          'icon', sibling_cat.icon
        ),
        'sentiment', sib_ss.sentiment,
        'sentiments', sib_ss.sentiments
      )) FILTER (WHERE sr."siblingId" IS NOT NULL), '[]'::JSON) AS siblings,
      COUNT(sr.id) AS "siblingCount",
      COALESCE(JSON_OBJECT_AGG(media.key, media.url) FILTER (WHERE media.key IS NOT NULL), '{}'::JSON) AS media,
      COUNT(s.id) OVER() AS "totalCount"
    FROM summaries s
    LEFT OUTER JOIN publishers pub 
      ON (s."publisherId" = pub.id)
      AND (pub."deletedAt" IS NULL)
    LEFT OUTER JOIN categories cat 
      ON (s."categoryId" = cat.id)
      AND (cat."deletedAt" IS NULL)
    LEFT OUTER JOIN category_translations cat_trans
      ON (s."categoryId" = cat_trans."parentId")
      AND (cat_trans."deletedAt" IS NULL)
      AND (cat_trans.locale = :locale)
      AND (cat_trans.attribute = 'displayName')
    LEFT OUTER JOIN summary_translations summary_trans
      ON (s.id = summary_trans."parentId")
      AND (summary_trans."deletedAt" IS NULL)
      AND (summary_trans.locale = :locale)
    LEFT OUTER JOIN summary_media media
      ON media."parentId" = s.id
      AND (media."deletedAt" IS NULL)
    LEFT OUTER JOIN "summary_relations" sr 
      ON (s.id = sr."parentId")
      AND (sr."deletedAt" IS NULL)
    LEFT OUTER JOIN summaries sibling 
      ON (sr."siblingId" = sibling.id)
      AND (sibling."deletedAt" IS NULL)
    LEFT OUTER JOIN publishers sibling_pub 
      ON (sibling."publisherId" = sibling_pub.id)
      AND (sibling_pub."deletedAt" IS NULL)
    LEFT OUTER JOIN categories AS sibling_cat
      ON (sibling_cat.id = sibling."categoryId")
      AND (sibling_cat."deletedAt" IS NULL)
    LEFT OUTER JOIN category_translations sibling_cat_trans
      ON (sibling."categoryId" = sibling_cat_trans."parentId")
      AND (sibling_cat_trans."deletedAt" IS NULL)
      AND (sibling_cat_trans.locale = :locale)
      AND (sibling_cat_trans.attribute = 'displayName')
    LEFT OUTER JOIN summary_sentiment_caches sib_ss 
      ON (sibling.id = sib_ss."parentId")
    WHERE s."originalDate" > NOW() - interval :interval
    AND s."deletedAt" IS NULL
    AND s.id NOT IN (:ids)
    GROUP BY
      s.id,
      s.title,
      s."shortSummary",
      s.summary,
      s.bullets,
      s.url,
      s."originalDate",
      pub.id,
      pub.name,
      pub."displayName",
      cat.id,
      cat.name,
      cat_trans.value,
      cat."displayName",
      cat.icon
    ORDER BY
      "siblingCount" DESC,
      s."originalDate" DESC
    LIMIT :limit
    OFFSET :offset
  ) b
  LEFT OUTER JOIN summary_sentiment_caches ss 
    ON b.id = ss."parentId"
  LEFT OUTER JOIN summary_translation_view st
    ON b.id = st."parentId"
    AND st.locale = :locale
  ORDER BY
    "siblingCount" DESC,
    b."originalDate" DESC
) c
GROUP BY 
  "totalCount"
`;