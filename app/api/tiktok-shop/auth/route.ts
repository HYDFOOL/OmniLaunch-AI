import { NextResponse } from "next/server";

interface TikTokShopAuthRequest {
  shopCode?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as TikTokShopAuthRequest;
  const shopCode = body.shopCode?.trim();

  if (!shopCode) {
    return NextResponse.json(
      { connected: false, error: "A TikTok Shop code is required." },
      { status: 400 }
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 900));
  return NextResponse.json({
    connected: true,
    storeIdentifier: shopCode,
    platform: "TikTok Shop",
    accessScope: ["product_publish", "order_read", "analytics_read"],
    connectedAt: new Date().toISOString(),
  });
}
