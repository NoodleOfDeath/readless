SELECT
  *
FROM
  category_view cat
WHERE
  cat.locale = :locale
ORDER BY
  cat.name ASC;

