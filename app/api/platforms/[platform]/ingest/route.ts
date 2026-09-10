import { NextResponse } from "next/server";

const supportedPlatforms = new Set(["shopify", "woocommerce", "amazon", "tiktok-shop"]);

interface IngestPayload {
  productId?: string;
  event?: string;
}

export async function POST(
  request: Request,
  { params }: { params: { platform: string } }
) {
  const platform = params.platform.toLowerCase();
  if (!supportedPlatforms.has(platform)) {
    return NextResponse.json({ accepted: false, error: "Unsupported platform." }, { status: 404 });
  }

  const body = (await request.json()) as IngestPayload;
  return NextResponse.json({
    accepted: true,
    platform,
    productId: body.productId || null,
    event: body.event || "catalog_sync",
    receivedAt: new Date().toISOString(),
    message: "Platform event queued for the autonomous performance loop.",
  });
}
