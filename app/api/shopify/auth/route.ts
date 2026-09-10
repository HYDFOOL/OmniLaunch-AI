import { NextResponse } from "next/server";

interface ShopifyAuthRequest {
  domain?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as ShopifyAuthRequest;
  const domain = body.domain?.trim().toLowerCase();

  if (!domain || !domain.includes("shopify.com")) {
    return NextResponse.json({ connected: false, error: "Please use a valid .myshopify.com domain." }, { status: 400 });
  }

  await new Promise((resolve) => setTimeout(resolve, 900));
  return NextResponse.json({ connected: true, shopName: domain, accessScope: ["read_products", "write_products", "read_inventory"], connectedAt: new Date().toISOString() });
}
