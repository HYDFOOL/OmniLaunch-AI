import { NextResponse } from "next/server";

export async function POST() {
  const hasKey = !!process.env.STRIPE_SECRET_KEY;

  if (!hasKey) {
    console.warn(
      "[OmniLaunch] STRIPE_SECRET_KEY is not set — returning mock checkout session."
    );
    return NextResponse.json({
      sessionId: "mock_session_" + Date.now(),
      url: null,
      mock: true,
      tier: "premium",
      message: "Mock checkout — upgrade simulated for demo purposes.",
    });
  }

  try {
    const Stripe = (await import("stripe")).default as any;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: process.env.STRIPE_PRICE_ID || "price_mock", quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing?status=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing?status=cancelled`,
    });
    return NextResponse.json({ sessionId: session.id, url: session.url, mock: false });
  } catch (error) {
    console.error("[OmniLaunch] Stripe checkout failed:", error);
    return NextResponse.json({
      sessionId: "mock_session_" + Date.now(),
      url: null,
      mock: true,
      tier: "premium",
      message: "Stripe unavailable — mock upgrade applied for demo.",
    });
  }
}
