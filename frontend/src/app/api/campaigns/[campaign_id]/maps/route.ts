import { NextRequest, NextResponse } from "next/server";

// Disable body size limit so large map uploads can pass through to the backend
export const maxDuration = 60;

// Route segment config — must be exported as const from a route file
export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "http://backend:8080");

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ campaign_id: string }> },
) {
  const { campaign_id } = await params;

  // Forward the request as-is (including cookies and multipart body)
  const backendUrl = `${BACKEND_URL}/api/campaigns/${campaign_id}/maps`;

  const headers = new Headers();
  // Forward cookies for auth
  const cookie = request.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);
  // Let the Content-Type (with boundary) pass through from the client
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  const backendResponse = await fetch(backendUrl, {
    method: "POST",
    headers,
    body: request.body,
    // @ts-expect-error – Node.js fetch supports duplex
    duplex: "half",
  });

  const responseBody = await backendResponse.text();

  return new NextResponse(responseBody, {
    status: backendResponse.status,
    headers: {
      "content-type":
        backendResponse.headers.get("content-type") || "application/json",
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ campaign_id: string }> },
) {
  const { campaign_id } = await params;

  const backendUrl = `${BACKEND_URL}/api/campaigns/${campaign_id}/maps`;

  const headers = new Headers();
  const cookie = request.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);

  const backendResponse = await fetch(backendUrl, { headers });
  const responseBody = await backendResponse.text();

  return new NextResponse(responseBody, {
    status: backendResponse.status,
    headers: {
      "content-type":
        backendResponse.headers.get("content-type") || "application/json",
    },
  });
}
