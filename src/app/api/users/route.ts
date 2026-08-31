import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_URL || "http://localhost:5000/api/v1";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cookies = request.headers.get("cookie") || "";
  const targetUrl = new URL(`${API_BASE}/users`);
  searchParams.forEach((value, key) => { targetUrl.searchParams.set(key, value); });
  const response = await fetch(targetUrl.toString(), { headers: { cookie: cookies } });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const cookies = request.headers.get("cookie") || "";
  const csrfToken = request.headers.get("x-csrf-token") || "";
  const response = await fetch(`${API_BASE}/users/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie: cookies, "X-CSRF-Token": csrfToken },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}