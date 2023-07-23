export const PUBLIC_CATEGORIES = `
SELECT
  *
FROM
  category_view cat
WHERE
  cat.locale = :locale
ORDER BY
  cat.name ASC;
`;

export const PUBLIC_PUBLISHERS = `
SELECT
  *
FROM
  publisher_view pub
WHERE
  pub.locale = :locale
ORDER BY
  pub.name ASC;
`;