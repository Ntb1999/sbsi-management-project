/**
 * Minimal Cloudflare Workers KV client over Cloudflare's REST API.
 *
 * Used instead of a native KV binding because these apps run on Next.js
 * outside the Cloudflare Workers runtime (e.g. on Vercel), so bindings
 * aren't available — everything goes through the HTTP API instead.
 */

export interface CloudflareKvConfig {
  accountId: string;
  namespaceId: string;
  apiToken: string;
}

function resolveConfig(config?: Partial<CloudflareKvConfig>): CloudflareKvConfig {
  const accountId = config?.accountId ?? process.env.CLOUDFLARE_ACCOUNT_ID;
  const namespaceId = config?.namespaceId ?? process.env.CLOUDFLARE_KV_NAMESPACE_ID;
  const apiToken = config?.apiToken ?? process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !namespaceId || !apiToken) {
    throw new Error(
      "Cloudflare KV is not configured. Set CLOUDFLARE_ACCOUNT_ID, " +
        "CLOUDFLARE_KV_NAMESPACE_ID and CLOUDFLARE_API_TOKEN (see .env.example)."
    );
  }

  return { accountId, namespaceId, apiToken };
}

function valueUrl({ accountId, namespaceId }: CloudflareKvConfig, key: string): string {
  return `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${encodeURIComponent(
    key
  )}`;
}

/**
 * Reads a JSON value from KV. Mirrors `env.KV.get(key, { type: "json" })`
 * from the original Cloudflare Pages Functions — returns null if the key
 * doesn't exist.
 */
export async function kvGet<T = unknown>(
  key: string,
  config?: Partial<CloudflareKvConfig>
): Promise<T | null> {
  const cfg = resolveConfig(config);
  const resp = await fetch(valueUrl(cfg, key), {
    headers: { Authorization: `Bearer ${cfg.apiToken}` }
  });

  if (resp.status === 404) return null;
  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`Cloudflare KV GET ${key} failed (${resp.status}): ${body}`);
  }

  const text = await resp.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

/**
 * Writes a JSON value to KV. Mirrors `env.KV.put(key, JSON.stringify(value))`.
 */
export async function kvPut(
  key: string,
  value: unknown,
  config?: Partial<CloudflareKvConfig>
): Promise<void> {
  const cfg = resolveConfig(config);
  const resp = await fetch(valueUrl(cfg, key), {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${cfg.apiToken}`,
      "Content-Type": "text/plain"
    },
    body: JSON.stringify(value)
  });

  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`Cloudflare KV PUT ${key} failed (${resp.status}): ${body}`);
  }
}
