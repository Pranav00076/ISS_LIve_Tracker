export const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export function getCachedData<T>(key: string): T | null {
  try {
    const cachedItem = localStorage.getItem(key);
    if (!cachedItem) return null;

    const parsedItem = JSON.parse(cachedItem);
    const now = new Date().getTime();

    if (now > parsedItem.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return parsedItem.data as T;
  } catch (error) {
    console.error('Error reading from cache', error);
    return null;
  }
}

export function setCachedData<T>(key: string, data: T): void {
  try {
    const now = new Date().getTime();
    const item = {
      data,
      expiry: now + CACHE_DURATION,
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error('Error writing to cache', error);
  }
}
