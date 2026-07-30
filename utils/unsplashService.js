const ACCESS_KEY = '6XVMHVFjwx6NFFe5njIlxydh8OrKKKH076rF2nXRdWs';

export const fetchRandomImage = async (query = 'drawing', signal) => {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://api.unsplash.com/photos/random?client_id=${ACCESS_KEY}&query=${encodedQuery}`;
  
  const response = await fetch(url, { signal });
  
  if (!response.ok) {
    // If it was aborted, throw a specific error we can catch
    if (response.name === 'AbortError') throw new Error('Aborted');
    throw new Error(`Failed to fetch: ${response.status}`);
  }
  
  const data = await response.json();
  
  return {
    imageUrl: data.urls.regular,
    fullImageUrl: data.urls.full,
    downloadUrl: data.links.download,
    photographer: data.user.name,
    photographerUrl: data.user.links.html,
    unsplashUrl: data.links.html,
    color: data.color
  };
};