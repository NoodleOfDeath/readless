export async function main() {
  switch (process.env.WORKER_QUEUE) {
  case 'sitemaps':
    await import('./SitemapWorker');
    break;
  case 'topics':
    await import('./TopicWorker');
    break;
  case 'media':
    await import('./MediaWorker');
    break;
  case 'notifs':
    await import('./NotificationsWorker');
    break;
  case 'caches':
    await import('./CacheWorker');
    break;
  default:
    console.error('No worker queue specified');
    process.exit(1);
  }
}

main();
