export function randomString(length: number) {
  let str = Math.random().toString(36).substring(2, length + 2);
  while (str.length < length) {
    str += Math.random().toString(36).substring(2);
  }
  return str.substring(0, length);
}