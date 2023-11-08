SELECT
  *
FROM
  publisher_view pub
WHERE
  pub.locale = :locale
ORDER BY
  pub.name ASC;

