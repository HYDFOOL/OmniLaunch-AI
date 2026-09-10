import { NextResponse } from "next/server";
import type { SubscriptionTier } from "@/lib/types";

interface CheckoutRequest {
  plan: SubscriptionTier;
}

interface LemonSqueezyCheckoutData {
  data: {
    type: string;
    attributes: {
      checkout_data: {
        custom: {
          user_id: string;
          plan: SubscriptionTier;
        };
      };
    };
    relationships: {
      store: {
        data: {
          type: string;
          id: string;
        };
      };
      variant: {
        data: {
          type: string;
          id: string;
        };
      };
    };
  };
}

const PLAN_VARIANTS: Record<SubscriptionTier, string> = {
  free: "",
  scale: process.env.LEMONSQUEEZY_SCALE_VARIANT_ID || "scale_variant_default",
  omni: process.env.LEMONSQUEEZY_OMNI_VARIANT_ID || "omni_variant_default",
};

const STORE_ID = process.env.LEMONSQUEEZY_STORE_ID || "default_store";

export async function POST(request: Request) {
  const body = (await request.json()) as CheckoutRequest;
  const { plan } = body;

  // Validate plan
  if (!plan || !["scale", "omni"].includes(plan)) {
    return NextResponse.json(
      { error: "Invalid plan. Must be 'scale' or 'omni'." },
      { status: 400 }
    );
  }

  const hasApiKey = !!process.env.LEMONSQUEEZY_API_KEY;

  if (!hasApiKey) {
    console.warn(
      "[OmniLaunch] LEMONSQUEEZY_API_KEY is not set — returning mock checkout."
    );
    return NextResponse.json({
      url: null,
      mock: true,
      plan,
      message: "Mock checkout — upgrade simulated for demo purposes."
    });
  }

  try {
    const variantId = PLAN_VARIANTS[plan];
    
    if (!variantId) {
      throw new Error(`No variant ID configured for plan: ${plan}`);
    }

    // Prepare Lemon Squeezy checkout data
    const checkoutData: LemonSqueezyCheckoutData = {
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            custom: {
              user_id: "demo_user", // In production, this would come from auth
              plan: plan
            }
          }
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: STORE_ID
            }
          },
          variant: {
            data: {
              type: "variants",
              id: variantId
            }
          }
        }
      }
    };

    // Create checkout via Lemon Squeezy API
    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        "Authorization": `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`
      },
      body: JSON.stringify(checkoutData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[OmniLaunch] Lemon Squeezy API error:", errorData);
      throw new Error(`Lemon Squeezy API error: ${response.status}`);
    }

    const data = await response.json();
    const checkoutUrl = data.data?.attributes?.url;

    if (!checkoutUrl) {
      throw new Error("No checkout URL returned from Lemon Squeezy");
    }

    return NextResponse.json({
      url: checkoutUrl,
      mock: false,
      plan
    });

  } catch (error) {
    console.error(
      "[OmniLaunch] Lemon Squeezy checkout failed, falling back to mock:",
      error instanceof Error ? error.message : error
    );
    
    // Fallback to mock on any error
    return NextResponse.json({
      url: null,
      mock: true,
      plan,
      message: "Checkout service unavailable — mock upgrade applied for demo."
    });
  }
}