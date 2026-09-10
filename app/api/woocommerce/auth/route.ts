import { NextResponse } from "next/server";

interface WooCommerceAuthRequest {
  domain?: string;
  consumerKey?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as WooCommerceAuthRequest;
  const domain = body.domain?.trim();

  if (!domain || !domain.includes(".")) {
    return NextResponse.json(
      { connected: false, error: "A valid WooCommerce store URL is required." },
      { status: 400 }
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 800));
  return NextResponse.json({
    connected: true,
    storeIdentifier: domain,
    platform: "WooCommerce",
    accessScope: ["read_products", "write_products", "read_orders"],
    connectedAt: new Date().toISOString(),
  });
}
