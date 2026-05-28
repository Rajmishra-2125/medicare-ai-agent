/**
 * A utility to manage caching of API responses and data.
 * Supports Time-to-Live (TTL) expiration.
 */

const CACHE_PREFIX = "medicare_cache_";
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

export const cacheManager = {
  /**
   * Set data into the cache with an expiration time.
   * @param {string} key Unique identifier for the cache
   * @param {any} data The data to cache
   * @param {number} ttl Time to live in milliseconds
   */
  set: (key, data, ttl = DEFAULT_TTL) => {
    try {
      const item = {
        data,
        expiry: Date.now() + ttl,
      };
      localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(item));
    } catch (error) {
      console.warn("Failed to set cache:", error);
      // Fails gracefully (e.g. if localStorage is full or disabled)
    }
  },

  /**
   * Get data from the cache. Returns null if expired or missing.
   * @param {string} key Unique identifier
   * @returns {any|null} The cached data or null
   */
  get: (key) => {
    try {
      const itemStr = localStorage.getItem(`${CACHE_PREFIX}${key}`);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      
      // Check if cache has expired
      if (Date.now() > item.expiry) {
        localStorage.removeItem(`${CACHE_PREFIX}${key}`);
        return null;
      }
      
      return item.data;
    } catch (error) {
      console.warn("Failed to get cache:", error);
      return null;
    }
  },

  /**
   * Invalidate a specific cache key
   * @param {string} key Unique identifier
   */
  invalidate: (key) => {
    try {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    } catch {
      // ignore
    }
  },

  /**
   * Clear all medicare caches
   */
  clearAll: () => {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch {
      // ignore
    }
  }
};
