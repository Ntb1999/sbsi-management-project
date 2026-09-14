export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json; charset=utf-8"
};

export function corsJson(body: unknown, init?: ResponseInit) {
  return Response.json(body, { ...init, headers: { ...CORS_HEADERS, ...init?.headers } });
}

export function corsOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
