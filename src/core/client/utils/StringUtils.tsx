export const parseKeywords = (str?: string): string[] => {
  const matches = str?.matchAll(/(['"])(.+?)\1|\b([\S]+)\b/gm);
  const keywords: string[] = [];
  for (const match of (matches ?? [])) {
    if (!match || match.length < 4) {
      continue;
    }
    keywords.push((match[1] ? match[2] : match[3]).replace(/[-+*|=<>.^$!?(){}[\]\\]/g, ($0) => `\\${$0}`).trim());
  }
  return keywords;
};