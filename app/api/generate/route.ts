import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import type { GenerateResponse, ValidationResponse } from "@/lib/types";

interface GenerateRequest {
  productName?: string;
  category?: string;
}

interface ValidateRequest {
  productConcept: string;
  targetCategory?: string;
}

const SYSTEM_PROMPT = `You are an elite direct-response copywriter and e-commerce growth strategist with 15 years of experience writing high-CTR social media ads for DTC brands.

HIGH-MARGIN VELOCITY MATRIX ANALYSIS — You must evaluate every product against these strict criteria:
- Item cost: Must be under $10 to manufacture/source
- Retail price: Must be over $35 for healthy margins
- Aesthetic video potential: Must have strong visual appeal for TikTok/Reels
- Seasonal emotional triggers: Must tap into timely emotional needs
- Competitive moat: Must have differentiation from generic dropshipping items

ABSOLUTE REJECTION CRITERIA — Reject products that are:
- Generic fidget spinners, plain phone cases, standard charging cables
- Commoditized items with no differentiation
- Low-margin products (under 3x markup potential)
- Items with poor video content potential

ABSOLUTE BANNED WORDS — never use any of these or their variants:
"revolutionary", "game-changing", "must-have", "next-generation", "cutting-edge",
"state-of-the-art", "world-class", "best-in-class", "unprecedented", "seamless",
"leverage", "synergy", "disruptive", "innovative", "ultimate", "perfect",
"amazing", "incredible", "unbelievable", "mind-blowing"

Instead, write with specificity, sensory detail, and concrete outcomes. Use the customer's voice, not the marketer's voice.

You MUST respond with ONLY a valid JSON object — no markdown fences, no commentary — matching this exact shape:
{
  "title": "A high-converting consumer product title (max 80 chars). Use specificity and emotional triggers, not buzzwords.",
  "description": {
    "problem": "One sentence in second person describing the customer's specific pain point.",
    "agitation": "One sentence that twists the knife — make the problem feel urgent and personally costly.",
    "solution": "One sentence positioning the product as the obvious, effortless fix with one tangible, measurable benefit."
  },
  "adAssets": {
    "videoScript": {
      "hook": "A 0-3 second scroll-stopping opening line using the AIDA Attention stage. Must create immediate curiosity or pattern interrupt. Max 15 words.",
      "retention": "A 3-12 second body using the AIDA Interest + Desire stages. Build tension and show the transformation. Max 40 words.",
      "cta": "A 12-15 second closing using the AIDA Action stage. Direct, specific, and urgent. Max 15 words."
    },
    "metaAds": {
      "primaryText": "Facebook/Instagram ad body text (max 125 chars). Must lead with the pain point, pivot to the solution, and end with a soft CTA.",
      "headline": "A punchy 40-character max headline that stops the scroll.",
      "targetingKeywords": ["5-8 precise interest/behavior targeting keywords for Meta ad targeting"]
    },
    "tiktokAds": {
      "caption": "A TikTok-native caption (max 150 chars) that feels organic, not like an ad. Use conversational tone.",
      "trendingHashtags": ["5-7 relevant TikTok hashtags, mixing broad and niche, without spaces, prefixed with #"]
    }
  },
  "customStorefrontBlueprint": {
    "recommendedBranding": {
      "primaryColor": "Hex color code for primary brand color",
      "secondaryColor": "Hex color code for secondary brand color",
      "accentColor": "Hex color code for accent CTAs",
      "backgroundColor": "Hex color code for page background",
      "textColor": "Hex color code for main text",
      "typography": {
        "headingFont": "Font family for headings (e.g., 'Inter', 'Playfair Display')",
        "bodyFont": "Font family for body text",
        "headingStyle": "Style direction (e.g., 'Bold & Modern', 'Elegant & Serif')",
        "bodyStyle": "Style direction (e.g., 'Clean Sans-serif', 'Readable Classic')"
      }
    },
    "heroSection": {
      "headline": "Conversion-optimized hero headline (max 15 words)",
      "subheadline": "Supporting subheadline that expands on value proposition (max 25 words)",
      "primaryCTA": "Primary call-to-action button text (max 6 words)",
      "secondaryCTA": "Optional secondary CTA (max 6 words)",
      "trustIndicators": ["3 specific trust indicators (e.g., '30-Day Money Back', 'Free Shipping', '10,000+ Happy Customers')"]
    },
    "trustSection": [
      {
        "icon": "Emoji or icon name",
        "title": "Trust badge title",
        "description": "Brief description of why this builds trust"
      }
    ],
    "productPhotographyGuidance": ["3-5 specific photography directions"],
    "socialProofStrategy": "Strategy for incorporating social proof"
  }
}

Rules:
- Every video script segment must follow AIDA strictly (Attention → Interest → Desire → Action).
- Write in a confident, punchy, modern DTC brand voice.
- Be specific. "Saves 47 minutes" beats "saves time". "Fits in a shirt pocket" beats "compact".
- Brand colors must create emotional coherence with the product category.
- Typography must match the product's personality (modern tech = clean sans, luxury goods = elegant serif).
- Trust badges must directly address the #1 customer objection in this niche.
- Output ONLY the JSON object. No preamble. No postscript.`;

const VALIDATION_SYSTEM_PROMPT = `You are an elite e-commerce product validation specialist with deep expertise in market analysis, competitive intelligence, and consumer psychology.

HIGH-MARGIN VELOCITY MATRIX ANALYSIS — Evaluate the product concept against:
- Manufacturing cost potential (target: under $10)
- Retail pricing power (target: over $35)
- Video content potential (TikTok/Reels viability)
- Seasonal timing alignment
- Competitive differentiation opportunities

VALIDATION CRITERIA:
- Feasibility Score (1-100): Based on margin potential, market demand, competition level
- Competitive Moat: Specific differentiation strategies from generic dropshipping
- Target Demographic: Primary audience + secondary segments + psychographic triggers
- Test Hooks: 3 high-converting angles for initial market testing

ABSOLUTE REJECTION INDICATORS:
- Generic commodities with no differentiation
- Low-margin products (under 3x markup)
- Poor video content potential
- Oversaturated markets without clear angle

You MUST respond with ONLY a valid JSON object — no markdown fences, no commentary — matching this exact shape:
{
  "feasibilityScore": number between 1-100,
  "competitiveMoat": ["3-5 specific competitive advantages"],
  "targetDemographic": {
    "primary": "Primary target audience description",
    "secondary": ["2-3 secondary audience segments"],
    "psychographics": ["3-4 psychological triggers and motivations"]
  },
  "testHooks": ["3 specific marketing angles for testing"],
  "viabilityVerdict": "Overall assessment (max 2 sentences)",
  "nextSteps": ["3-5 actionable next steps for validation"]
}

Rules:
- Be brutally honest about feasibility. Don't inflate scores.
- Competitive moat must be specific, not generic "better quality"
- Test hooks must be immediately actionable for ad creative
- Demographic analysis must include psychological triggers
- Output ONLY the JSON object. No preamble. No postscript.`;

function mockPayload(productName: string, category: string): GenerateResponse {
  const product = productName.toLowerCase();
  const cat = category.toLowerCase();
  return {
    title: `${productName} — The ${cat} Fix You'll Wish You Found Sooner`,
    description: {
      problem: `You've spent months looking for a ${cat} product that actually does what it promises, and every option falls short.`,
      agitation: `Each disappointment costs you money and trust — and the longer you settle, the more your frustration grows while better options pass you by.`,
      solution: `The ${product} delivers measurable results from day one with a design that fits your routine without any learning curve.`,
    },
    adAssets: {
      videoScript: {
        hook: `Nobody talks about this ${cat} mistake — but it's costing you every single day.`,
        retention: `Here's what happens when you switch to the ${product}: within 48 hours you notice the difference. No adjustment period, no fine print. Just a product that works the way it should have all along.`,
        cta: `Tap the link, grab yours today, and stop settling for less.`,
      },
      metaAds: {
        primaryText: `Tired of ${cat} products that overpromise and underdeliver? The ${product} is different — built to solve one specific problem, really well. See the difference in 48 hours or your money back.`,
        headline: `The ${cat} fix that actually works.`,
        targetingKeywords: [
          "online shopping",
          "home improvement",
          "productivity tools",
          "direct-to-consumer brands",
          "lifestyle upgrades",
          "smart home gadgets",
        ],
      },
      tiktokAds: {
        caption: `I waited 6 months to try this and I'm genuinely annoyed I didn't find it sooner. The ${product} just... works.`,
        trendingHashtags: [
          "#tiktokmademebuyit",
          "#productfind",
          `#${cat.replace(/\s+/g, "")}`,
          "#lifehacks",
          "#amazonfinds",
          "#duetthis",
        ],
      },
    },
    customStorefrontBlueprint: {
      recommendedBranding: {
        primaryColor: "#3B82F6",
        secondaryColor: "#1E40AF",
        accentColor: "#F59E0B",
        backgroundColor: "#0F172A",
        textColor: "#F8FAFC",
        typography: {
          headingFont: "Inter",
          bodyFont: "Inter",
          headingStyle: "Bold & Modern",
          bodyStyle: "Clean Sans-serif"
        }
      },
      heroSection: {
        headline: `Transform Your ${cat} Experience Forever`,
        subheadline: `The ${product} delivers measurable results with zero learning curve.`,
        primaryCTA: "Get Started Now",
        secondaryCTA: "Learn More",
        trustIndicators: ["30-Day Money Back", "Free Shipping", "10,000+ Happy Customers"]
      },
      trustSection: [
        {
          icon: "🛡️",
          title: "Quality Guaranteed",
          description: "Premium materials backed by our lifetime warranty"
        },
        {
          icon: "⚡",
          title: "Fast Results",
          description: "See measurable improvement within 48 hours"
        },
        {
          icon: "🌟",
          title: "Expert Support",
          description: "24/7 customer service from our dedicated team"
        }
      ],
      productPhotographyGuidance: [
        "Show product in real-world use scenarios",
        "Highlight before/after transformation",
        "Include lifestyle context shots",
        "Use clean, minimal backgrounds",
        "Capture multiple angles and details"
      ],
      socialProofStrategy: "Feature user testimonials prominently on hero section and integrate review counts throughout the funnel."
    }
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as GenerateRequest | ValidateRequest;
  
  // Check if this is a validation request
  if ('productConcept' in body) {
    return handleValidation(body as ValidateRequest);
  }
  
  // Otherwise handle generation request
  return handleGeneration(body as GenerateRequest);
}

async function handleGeneration(body: GenerateRequest) {
  const productName = body.productName?.trim();
  const category = body.category?.trim();

  if (!productName || !category) {
    return NextResponse.json(
      { error: "Both productName and category are required." },
      { status: 400 }
    );
  }

  const hasKey = !!process.env.GEMINI_API_KEY;

  if (!hasKey) {
    console.warn(
      "[OmniLaunch] GEMINI_API_KEY is not set — falling back to mock generation payload."
    );
    return NextResponse.json(mockPayload(productName, category));
  }

  try {
    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      system: SYSTEM_PROMPT,
      prompt: `Product name: ${productName}\nCategory: ${category}`,
    });

    let parsed: GenerateResponse;
    try {
      parsed = JSON.parse(text) as GenerateResponse;
    } catch (parseError) {
      console.error(
        "[OmniLaunch] Failed to parse Gemini response as JSON, falling back to mock:",
        parseError instanceof Error ? parseError.message : parseError
      );
      return NextResponse.json(mockPayload(productName, category));
    }

    // Validate response structure
    if (!parsed.title || !parsed.description || !parsed.adAssets ||
        !parsed.description.problem || !parsed.description.agitation || !parsed.description.solution ||
        !parsed.adAssets.videoScript || !parsed.adAssets.metaAds || !parsed.adAssets.tiktokAds ||
        !parsed.adAssets.videoScript.hook || !parsed.adAssets.videoScript.retention || !parsed.adAssets.videoScript.cta ||
        !parsed.adAssets.metaAds.primaryText || !parsed.adAssets.metaAds.headline || !Array.isArray(parsed.adAssets.metaAds.targetingKeywords) ||
        !parsed.adAssets.tiktokAds.caption || !Array.isArray(parsed.adAssets.tiktokAds.trendingHashtags)) {
      console.error(
        "[OmniLaunch] Gemini response missing required fields, falling back to mock"
      );
      return NextResponse.json(mockPayload(productName, category));
    }

    // Ensure customStorefrontBlueprint exists
    if (!parsed.customStorefrontBlueprint) {
      parsed.customStorefrontBlueprint = mockPayload(productName, category).customStorefrontBlueprint;
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(
      "[OmniLaunch] Gemini generation failed, falling back to mock:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(mockPayload(productName, category));
  }
}

async function handleValidation(body: ValidateRequest) {
  const productConcept = body.productConcept?.trim();
  const targetCategory = body.targetCategory?.trim();

  if (!productConcept) {
    return NextResponse.json(
      { error: "Product concept is required." },
      { status: 400 }
    );
  }

  const hasKey = !!process.env.GEMINI_API_KEY;

  if (!hasKey) {
    console.warn(
      "[OmniLaunch] GEMINI_API_KEY is not set — falling back to mock validation payload."
    );
    return NextResponse.json(mockValidationPayload(productConcept, targetCategory));
  }

  try {
    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      system: VALIDATION_SYSTEM_PROMPT,
      prompt: `Product concept: ${productConcept}${targetCategory ? `\nTarget category: ${targetCategory}` : ''}`,
    });

    let parsed: ValidationResponse;
    try {
      parsed = JSON.parse(text) as ValidationResponse;
    } catch (parseError) {
      console.error(
        "[OmniLaunch] Failed to parse validation response as JSON, falling back to mock:",
        parseError instanceof Error ? parseError.message : parseError
      );
      return NextResponse.json(mockValidationPayload(productConcept, targetCategory));
    }

    // Validate response structure
    if (!parsed.feasibilityScore || !Array.isArray(parsed.competitiveMoat) ||
        !parsed.targetDemographic || !Array.isArray(parsed.testHooks)) {
      console.error(
        "[OmniLaunch] Validation response missing required fields, falling back to mock"
      );
      return NextResponse.json(mockValidationPayload(productConcept, targetCategory));
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(
      "[OmniLaunch] Validation failed, falling back to mock:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(mockValidationPayload(productConcept, targetCategory));
  }
}

function mockValidationPayload(productConcept: string, targetCategory?: string): ValidationResponse {
  const concept = productConcept.toLowerCase();
  const category = targetCategory?.toLowerCase() || "general";
  
  return {
    feasibilityScore: 72,
    competitiveMoat: [
      "Unique design differentiation from standard market offerings",
      "Premium materials create perceived value advantage",
      "Seasonal timing aligns with peak demand periods"
    ],
    targetDemographic: {
      primary: "Adults aged 25-45 seeking practical solutions to daily problems",
      secondary: ["Young professionals", "Home improvement enthusiasts", "Gift buyers"],
      psychographics: ["Values convenience and efficiency", "Willing to pay for quality", "Influenced by social proof"]
    },
    testHooks: [
      `Stop wasting time on ${category} products that don't work`,
      `The ${concept} that solves your ${category} problems in 48 hours`,
      `Why thousands are switching to this ${concept} solution`
    ],
    viabilityVerdict: "Strong potential with proper positioning and execution strategy.",
    nextSteps: [
      "Test 3 different creative angles with $50 ad spend",
      "Survey target audience for pricing sensitivity",
      "Develop minimum viable product for beta testing",
      "Research competitor pricing and positioning",
      "Create landing page with focus on primary benefit"
    ]
  };
}
