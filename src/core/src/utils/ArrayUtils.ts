// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const lengthOf = (...objs: any[]): number => {
  if (objs.length === 0) {
    return 0;
  }
  return objs.reduce((curr, next) => curr + Object.values(next ?? {}).length, 0);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const firstOf = (...objs: any[]): any => {
  return objs.length > 0 ? objs[0] : undefined;
};