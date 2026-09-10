import { NextResponse } from "next/server";

interface AmazonAuthRequest {
  sellerId?: string;
  marketplace?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as AmazonAuthRequest;
  const sellerId = body.sellerId?.trim();

  if (!sellerId || sellerId.length < 6) {
    return NextResponse.json(
      { connected: false, error: "A valid Amazon Seller ID is required." },
      { status: 400 }
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));
  return NextResponse.json({
    connected: true,
    storeIdentifier: sellerId,
    marketplace: body.marketplace || "US",
    platform: "Amazon Seller Central",
    accessScope: ["catalog_read", "catalog_write", "analytics_read"],
    connectedAt: new Date().toISOString(),
  });
}
