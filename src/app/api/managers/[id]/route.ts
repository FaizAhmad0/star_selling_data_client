import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_URL || "http://localhost:5000/api/v1";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookies = request.headers.get("cookie") || "";

  const response = await fetch(`${API_BASE}/managers/${id}`, {
    headers: { cookie: cookies },
  });

  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const cookies = request.headers.get("cookie") || "";
  const csrfToken = request.headers.get("x-csrf-token") || "";

  const response = await fetch(`${API_BASE}/managers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      cookie: cookies,
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookies = request.headers.get("cookie") || "";
  const csrfToken = request.headers.get("x-csrf-token") || "";

  const response = await fetch(`${API_BASE}/managers/${id}`, {
    method: "DELETE",
    headers: {
      cookie: cookies,
      "X-CSRF-Token": csrfToken,
    },
  });

  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}
