export async function main() {
  if (process.env.WORKER_QUEUE === 'sitemaps') {
    await import('./SiteMapWorker');
  } else if (process.env.WORKER_QUEUE === 'topics') {
    await import('./TopicWorker');
  } else if (process.env.WORKER_QUEUE === 'recaps') {
    await import('./RecapWorker');
  } else if (process.env.WORKER_QUEUE === 'caches') {
    await import('./CacheWorker');
  } else {
    console.error('No worker queue specified');
    process.exit(1);
  }
}

main();
