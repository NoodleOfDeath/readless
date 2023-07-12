export const SEARCH_SUMMARIES = `
SELECT
  "totalCount"::INT AS "count",
  JSON_BUILD_OBJECT(
    'sentiment', "averageSentiment"
  ) AS metadata,
  JSON_AGG(c.*) AS rows
FROM (
  SELECT
    b.id,
    b.title,
    b."shortSummary",
    b.summary,
    b.bullets,
    b.url,
    b."imageUrl",
    b."originalDate",
    outlet::JSON,
    publisher::JSON,
    category::JSON,
    translations::JSON,
    b.sentiment,
    b.sentiments::JSON,
    COALESCE(JSON_OBJECT_AGG(media.key, media.url) FILTER (WHERE media.key IS NOT NULL), '{}'::JSON) AS media,
    COALESCE(JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
      'id', sibling.id,
      'title', sibling.title,
      'shortSummary', sibling."shortSummary",
      'url', sibling.url,
      'imageUrl', sibling."imageUrl",
      'originalDate', sibling."originalDate",
      'outlet', JSONB_BUILD_OBJECT(
         'name', sibling_pub.name,
         'displayName', sibling_pub."displayName"
      ),
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
    )) FILTER (WHERE sibling.id IS NOT NULL), '[]'::JSON) AS siblings,
    "averageSentiment",
    "totalCount"
  FROM (
    SELECT
      id,
      title,
      "shortSummary",
      summary,
      bullets,
      url,
      "imageUrl",
      "originalDate",
      JSONB_BUILD_OBJECT(
        'id', "publisher.id",
        'name', "publisher.name",
        'displayName', "publisher.displayName"
      )::TEXT AS outlet,
      JSONB_BUILD_OBJECT(
        'id', "publisher.id",
        'name', "publisher.name",
        'displayName', "publisher.displayName"
      )::TEXT AS publisher,
      JSONB_BUILD_OBJECT(
        'id', "category.id",
        'name', "category.name",
        'displayName', "category.displayName",
        'icon', "category.icon"
      )::TEXT AS category,
      COALESCE(JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
        'attribute', "translation.attribute",
        'value', "translation.value"
      )) FILTER (WHERE "translation.attribute" IS NOT NULL), '[]'::JSON)::TEXT AS translations,
      sentiment,
      sentiments,
      AVG(sentiment) OVER() AS "averageSentiment",
      COUNT(id) OVER() AS "totalCount"
    FROM (
      SELECT
        s.id,
        s.title,
        s."shortSummary",
        s.summary,
        s.bullets,
        s.url,
        s."imageUrl",
        s."originalDate",
        pub.id AS "publisher.id",
        pub.name AS "publisher.name",
        pub."displayName" AS "publisher.displayName",
        pub.description AS "publisher.description",
        cat.id AS "category.id",
        cat.name AS "category.name",
        COALESCE(cat_trans.value, cat."displayName") AS "category.displayName",
        cat.icon AS "category.icon",
        summary_trans.attribute AS "translation.attribute",
        summary_trans.value AS "translation.value",
        ss.sentiment,
        ss.sentiments::TEXT AS sentiments
      FROM
        summaries s
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
        LEFT OUTER JOIN summary_sentiment_caches ss
          ON (s.id = ss."parentId")
      WHERE (s."deletedAt" IS NULL)
        AND (
          (s."originalDate" > NOW() - INTERVAL :interval)
          OR (
            (s."originalDate" >= :startDate)
            AND (s."originalDate" <= :endDate)
          )
        )
        AND (
          (s.id IN (:ids))
          OR :noIds
        )
        AND (
          (:excludeIds AND s.id NOT IN (:ids))
          OR NOT :excludeIds
        )
        AND (
          (pub.name IN (:publishers))
          OR :noPublishers
        )
        AND (
          (cat.name IN (:categories))
          OR :noCategories
        )
        AND (
          :noFilter
          OR (s.title ~* :filter)
          OR (s."shortSummary" ~* :filter)
          OR (s.summary ~* :filter)
          OR (s.bullets::text ~* :filter)
          OR (summary_trans.value ~* :filter)
        )
        ORDER BY
          "originalDate" DESC
    ) a
    GROUP BY
      id,
      title,
      "shortSummary",
      summary,
      bullets,
      url,
      "imageUrl",
      "originalDate",
      "publisher.id",
      "publisher.name",
      "publisher.displayName",
      "publisher.description",
      "category.id",
      "category.name",
      "category.displayName",
      "category.icon",
      sentiment,
      sentiments
    ORDER BY
      "originalDate" DESC
    LIMIT :limit
    OFFSET :offset
  ) b
  LEFT OUTER JOIN summary_media media
    ON media."parentId" = b.id
    AND (media."deletedAt" IS NULL)
  LEFT OUTER JOIN summary_relations sr
    ON sr."parentId" = b.id
    AND (sr."deletedAt" IS NULL)
  LEFT OUTER JOIN summaries sibling
    ON sr."siblingId" = sibling.id
    AND (sr."deletedAt" IS NULL)
  LEFT OUTER JOIN publishers sibling_pub
    ON (sibling_pub.id = sibling."publisherId")
    AND (sibling_pub."deletedAt" IS NULL)
  LEFT OUTER JOIN categories sibling_cat
    ON (sibling_cat.id = sibling."categoryId")
    AND (sibling_cat."deletedAt" IS NULL)
  LEFT OUTER JOIN category_translations sibling_cat_trans
    ON (sibling."categoryId" = sibling_cat_trans."parentId")
    AND (sibling_cat_trans."deletedAt" IS NULL)
    AND (sibling_cat_trans.locale = :locale)
    AND (sibling_cat_trans.attribute = 'displayName')
  LEFT OUTER JOIN summary_sentiment_caches sib_ss
    ON (sr."siblingId" = sib_ss."parentId")
  GROUP BY
    b.id,
    b.title,
    b."shortSummary",
    b.summary,
    b.bullets,
    b.url,
    b."imageUrl",
    b."originalDate",
    b.outlet,
    b.publisher,
    b.category,
    b.translations,
    b.sentiment,
    b.sentiments,
    b."averageSentiment",
    b."totalCount"
  ORDER BY
    b."originalDate" DESC
) c 
GROUP BY
  "averageSentiment",
  "totalCount"
`;