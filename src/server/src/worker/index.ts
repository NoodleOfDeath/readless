export async function main() {
  if (process.env.WORKER_QUEUE === 'siteMaps') {
    await import('./SiteMapWorker');
  } else if (process.env.WORKER_QUEUE === 'topics') {
    await import('./TopicWorker');
  } else if (process.env.WORKER_QUEUE === 'recaps') {
    await import('./RecapWorker');
  } else {
    console.error('No worker queue specified');
    process.exit(1);
  }
}

main();
