export const QUERIES = `
SELECT 
  "appVersion",
  platform,
  locale,
  COUNT(*)
FROM queries 
WHERE 
  "createdAt" > NOW() - INTERVAL :interval
  AND path ~ '^(GET|POST):/'
GROUP BY 
  "appVersion", 
  platform, 
  locale
ORDER BY 
  "appVersion" ASC;
`;

export const SUMMARY_TRANSLATIONS = `
SELECT 
  COUNT(*), 
  locale
FROM summary_translations
WHERE 
  "createdAt" > NOW() - INTERVAL :interval
GROUP BY 
  locale
ORDER BY 
  count DESC;
`;

export const SUMMARY_INTERACTIONS = `
SELECT 
  type, 
  count(*)
FROM summary_interactions
WHERE 
  "createdAt" > NOW() - INTERVAL :interval 
GROUP BY 
  type;
`;