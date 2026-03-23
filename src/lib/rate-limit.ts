import { LRUCache } from "lru-cache";

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number; // ms
};

/**
 * Simple in-process rate limiter.
 * Tracks attempts per key (IP or email) using an LRU cache.
 * Suitable for single-server deployments. For multi-server, use Redis.
 */
export function createRateLimiter(options?: Options) {
  const tokenCache = new LRUCache<string, number[]>({
    max: options?.uniqueTokenPerInterval ?? 500,
    ttl: options?.interval ?? 60_000,
  });

  return {
    /**
     * Check if key has exceeded the limit.
     * @returns { success: true } if allowed, { success: false, remaining: 0 } if blocked
     */
    check(key: string, limit: number): { success: boolean; remaining: number } {
      const now = Date.now();
      const windowStart = now - (options?.interval ?? 60_000);

      const attempts = (tokenCache.get(key) ?? []).filter(t => t > windowStart);
      attempts.push(now);
      tokenCache.set(key, attempts);

      const remaining = Math.max(0, limit - attempts.length);
      return {
        success: attempts.length <= limit,
        remaining,
      };
    },

    /** Clear all attempts for a key (e.g. on successful login) */
    reset(key: string) {
      tokenCache.delete(key);
    },
  };
}

// Login rate limiter: max 5 attempts per 15 minutes per email
export const loginLimiter = createRateLimiter({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 1000,
});

// Global IP limiter: max 20 attempts per 15 minutes per IP
export const ipLoginLimiter = createRateLimiter({
  interval: 15 * 60 * 1000,
  uniqueTokenPerInterval: 500,
});

// Public form submission limiter: max 5 submissions per 10 minutes per IP.
// Applied to contact form and comment submissions to slow bot flooding.
export const submissionLimiter = createRateLimiter({
  interval: 10 * 60 * 1000, // 10 minutes
  uniqueTokenPerInterval: 2000,
});

export const SUBMISSION_RATE_LIMIT = 5;

// Public API rate limiter: max 60 requests per minute per IP
export const apiLimiter = createRateLimiter({
  interval: 60_000, // 1 minute
  uniqueTokenPerInterval: 2000, // track up to 2000 unique IPs per window
});

const API_RATE_LIMIT = 60;

/**
 * Check the public API rate limit for a request (Node.js runtime only — NOT Edge).
 * Returns a 429 Response if the IP has exceeded the limit, or null if the request is allowed.
 *
 * Usage:
 *   const limited = checkApiRateLimit(req);
 *   if (limited) return limited;
 */
export function checkApiRateLimit(req: { headers: { get(name: string): string | null } }): Response | null {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { success, remaining } = apiLimiter.check(ip, API_RATE_LIMIT);

  if (!success) {
    return new Response("Too Many Requests", {
      status: 429,
      headers: {
        "Content-Type": "text/plain",
        "Retry-After": "60",
        "X-RateLimit-Limit": String(API_RATE_LIMIT),
        "X-RateLimit-Remaining": "0",
      },
    });
  }

  // Attach informational headers to the caller's response if needed:
  //   res.headers.set("X-RateLimit-Limit", String(API_RATE_LIMIT));
  //   res.headers.set("X-RateLimit-Remaining", String(remaining));
  void remaining;
  return null;
}
