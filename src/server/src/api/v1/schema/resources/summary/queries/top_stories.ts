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
    b."originalDate",
    b."imageUrl",
    b.publisher,
    b.category,
    siblings,
    sentiment,
    sentiments,
    "totalCount"
  FROM (
    SELECT
      s.id,
      s."title",
      s."shortSummary",
      s.summary,
      s.bullets,
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
        'displayName', cat."displayName",
        'icon', cat.icon
      ) AS category,
      COALESCE(JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
        'id', sr."siblingId",
        'title', sibling.title,
        'shortSummary', sibling."shortSummary",
        'imageUrl', sibling."imageUrl",
        'originalDate', sibling."originalDate",
        'publisher', JSONB_BUILD_OBJECT(
          'name', sibling_pub.name,
          'displayName', sibling_pub."displayName"
        ),
        'category', JSONB_BUILD_OBJECT( 
          'name', sibling_cat.name,
          'displayName', sibling_cat."displayName",
          'icon', sibling_cat.icon
        ),
        'sentiment', sib_ss.sentiment,
        'sentiments', sib_ss.sentiments
      )) FILTER (WHERE sr."siblingId" IS NOT NULL), '[]'::JSON) AS siblings,
      COUNT(sr.id) AS "siblingCount",
      COUNT(s.id) OVER() AS "totalCount"
    FROM summaries s
    LEFT OUTER JOIN publishers pub 
      ON (s."publisherId" = pub.id)
      AND (pub."deletedAt" IS NULL)
    LEFT OUTER JOIN categories cat 
      ON (s."categoryId" = cat.id)
      AND (cat."deletedAt" IS NULL)
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
    LEFT OUTER JOIN summary_sentiment_caches sib_ss 
      ON (sibling.id = sib_ss."parentId")
    WHERE s."originalDate" > NOW() - interval :interval
    AND s."deletedAt" IS NULL
    AND s.id NOT IN (:ids)
    GROUP BY
      s.id,
      s.title,
      s."shortSummary",
      s."originalDate",
      pub.id,
      pub.name,
      pub."displayName",
      cat.id,
      cat.name,
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
) c
GROUP BY 
  "totalCount"
`;