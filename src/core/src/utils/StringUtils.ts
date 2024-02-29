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

export type ValidationResult = {
  success?: boolean;
  error?: string;
};

export type LetterGroupRequirement = {
  expr?: (RegExp | string)[] | RegExp | string;
  error?: string;
};

export type ValidationCriteria = {
  min?: number;
  max?: number;
  requirements?: LetterGroupRequirement[];
};

export function validateEmail(email: string) {
  // eslint-disable-next-line no-control-regex
  return /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/.test(email);
}

export const PASSWORD_CRITERIA = {
  max: 20,
  min: 8,
  requirements: [
    {
      error: 'Password must contain at least one capital letter',
      expr: /[A-Z]/,
    },
    {
      error: 'Password must contain at least one number',
      expr: /\d/,
    },
  ],
};

export function validatePassword(
  password?: string, 
  { 
    min = PASSWORD_CRITERIA.min, 
    max = PASSWORD_CRITERIA.max,
    requirements = PASSWORD_CRITERIA.requirements,
  }: ValidationCriteria = {}
): ValidationResult {
  password = password?.trim();
  if (!password) {
    return { error: 'Missing password' };
  }
  if (password.length < min) {
    return { error: `Password must be at least ${min} characters long` };
  }
  if (password.length > max) {
    return { error: `Password may not be more than ${max} characters long` };
  }
  for (const req of requirements) {
    if (!req.expr) {
      continue;
    }
    if (Array.isArray(req.expr)) {
      if (!req.expr.every((r) => (typeof r === 'string' ? new RegExp(r) : r).test(password))) {
        return { error: req.error };
      }
    } else {
      if (!(typeof req.expr === 'string' ? new RegExp(req.expr) : req.expr).test(password)) {
        return { error: req.error };
      }
    }
  }
  return { success: true };
}

