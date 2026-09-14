// Ported from the original Cloudflare Pages Function: functions/api/audit.js
// Stores and streams live activity feed across all testers

import { kvGet, kvPut } from "@sbsi/cloudflare-kv";
import { corsJson, corsOptions } from "@/lib/cors";

export async function OPTIONS() {
  return corsOptions();
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit") || "20", 10);

  try {
    const logs = (await kvGet<any[]>("sbsi_audit_logs")) || [];

    return corsJson({
      success: true,
      logs: logs.slice(0, limit),
      count: logs.length,
      timestamp: Date.now()
    });
  } catch (error) {
    return corsJson(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        logs: []
      },
      { status: 200 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const entry = await request.json();
    let logs = (await kvGet<any[]>("sbsi_audit_logs")) || [];

    logs.unshift({
      id: entry.id || "",
      platform: entry.platform || "",
      status: entry.status || "",
      tester: entry.tester || "Tester",
      time: entry.time || new Date().toLocaleTimeString("vi-VN"),
      timestamp: Date.now()
    });

    if (logs.length > 50) logs = logs.slice(0, 50);
    await kvPut("sbsi_audit_logs", logs);

    return corsJson({
      success: true,
      message: "Audit log appended",
      timestamp: Date.now()
    });
  } catch (error) {
    return corsJson(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
