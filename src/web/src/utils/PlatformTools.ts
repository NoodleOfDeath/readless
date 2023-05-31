export function getUserAgent() {
  return {
    OS: 'web',
    currentVersion: 'web1.7.10',
    locale: window.navigator.language,
    userAgent: window.navigator.userAgent,
  };
}