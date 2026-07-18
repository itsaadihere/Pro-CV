export async function notifyIndexNow(urls: string[]) {
  const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'BING_WEBMASTER_TOKEN';

  await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      host: 'joinsophi.com',
      key: INDEXNOW_KEY,
      keyLocation: `https://joinsophi.com/${INDEXNOW_KEY}.txt`,
      urlList: urls
    })
  });
}
