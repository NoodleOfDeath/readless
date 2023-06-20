export const parseKeywords = (str?: string): string[] => {
  const matches = str?.matchAll(/(['"])(.+?)\1|\b([\S]+)\b/gm);
  const keywords: string[] = [];
  for (const match of Array.from(matches ?? [])) {
    if (!match || match.length < 4) {
      continue;
    }
    keywords.push((match[1] ? match[2] : match[3]).replace(/[-+*|=<>.^$!?(){}[\]\\]/g, ($0) => `\\${$0}`).trim());
  }
  return keywords;
};

export function randomString(length: number) {
  let str = Math.random().toString(36).substring(2, length + 2);
  while (str.length < length) {
    str += Math.random().toString(36).substring(2);
  }
  return str.substring(0, length);
}