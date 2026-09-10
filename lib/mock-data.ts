import type { Campaign, DiscoveredProduct } from "@/lib/types";
import type { CustomStorefrontBlueprint } from "@/lib/types";

export const mockCampaigns: Campaign[] = [
  { id: "camp_01", productTitle: "AeroGlow LED Desk Lamp", productImage: "https://images.pexels.com/photos/1112581/pexels-photo-1112581.jpeg?auto=compress&cs=tinysrgb&w=400", trafficChannel: "TikTok", ctr: 4.82, spend: 1280.5, status: "SCALING_WINNER" },
  { id: "camp_02", productTitle: "PostureFix Smart Bracelet", productImage: "https://images.pexels.com/photos/4498152/pexels-photo-4498152.jpeg?auto=compress&cs=tinysrgb&w=400", trafficChannel: "Meta", ctr: 1.12, spend: 890.0, status: "COLLECTING_DATA" },
  { id: "camp_03", productTitle: "PureMist Humidifier Pro", productImage: "https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=400", trafficChannel: "TikTok", ctr: 0.38, spend: 2150.75, status: "TERMINATED_DEFENSIVE_KILL" },
  { id: "camp_04", productTitle: "FlexiGrip Phone Mount", productImage: "https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=400", trafficChannel: "Meta", ctr: 3.67, spend: 540.2, status: "SCALING_WINNER" },
  { id: "camp_05", productTitle: "ZenSleep Weighted Blanket", productImage: "https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=400", trafficChannel: "TikTok", ctr: 2.14, spend: 1670.0, status: "COLLECTING_DATA" },
  { id: "camp_06", productTitle: "ChefBot Kitchen Scale", productImage: "https://images.pexels.com/photos/4226803/pexels-photo-4226803.jpeg?auto=compress&cs=tinysrgb&w=400", trafficChannel: "Meta", ctr: 0.52, spend: 980.45, status: "TERMINATED_DEFENSIVE_KILL" },
];

const adAssetsFor = (product: string, niche: string) => ({
  videoScript: {
    hook: `Nobody talks about this ${niche.toLowerCase()} mistake — but it's costing you every single day.`,
    retention: `Here's what happens when you switch to the ${product.toLowerCase()}: within 48 hours you notice the difference. No adjustment period, no fine print. Just a product that works the way it should have all along.`,
    cta: `Tap the link, grab yours today, and stop settling for less.`,
  },
  metaAds: {
    primaryText: `Tired of ${niche.toLowerCase()} products that overpromise and underdeliver? The ${product.toLowerCase()} is different — built to solve one specific problem, really well. See the difference in 48 hours or your money back.`,
    headline: `The ${niche.toLowerCase()} fix that actually works.`,
    targetingKeywords: ["online shopping", "home improvement", "productivity tools", "direct-to-consumer brands", "lifestyle upgrades", "smart home gadgets"],
  },
  tiktokAds: {
    caption: `I waited 6 months to try this and I'm genuinely annoyed I didn't find it sooner. The ${product.toLowerCase()} just... works.`,
    trendingHashtags: ["#tiktokmademebuyit", "#productfind", `#${niche.replace(/\s+/g, "").toLowerCase()}`, "#lifehacks", "#amazonfinds", "#duetthis"],
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
      headline: `Transform Your ${niche} Experience Forever`,
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
});

export const mockProducts: DiscoveredProduct[] = [
  {
    id: "prod_01", title: "AeroGlow LED Desk Lamp", niche: "Home Office", trendScore: 94, estMargin: 68,
    image: "https://images.pexels.com/photos/1112581/pexels-photo-1112581.jpeg?auto=compress&cs=tinysrgb&w=600",
    platforms: ["Shopify", "WooCommerce", "TikTok Shop"],
    allocations: [{ region: "North America", allocationCount: 3, maxAllocations: 5 }, { region: "Europe", allocationCount: 2, maxAllocations: 4 }, { region: "Asia Pacific", allocationCount: 4, maxAllocations: 5 }],
    seasonal: { microSeason: "Back-to-School Surge", seasonalityIndex: 8.7, socialEngagementMultiplier: 3.2, buyerIntentCommentRatio: 0.34, localTrendVelocity: 14.5 },
    locked: false,
    copywriting: { optimizedTitle: "AeroGlow — The Last Desk Lamp You'll Ever Need", pasDescription: { problem: "Your eyes strain after hours under harsh, flickering overhead lights. Headaches creep in by 3 PM, and your productivity crashes.", agitation: "Cheap lamps buzz, dim unevenly, and die within months. You've replaced three this year alone — each one worse than the last.", solution: "AeroGlow's flicker-free LED panel delivers 650 lumens of warm, natural light with a single touch. USB-C charging, 3 color modes, and a 50,000-hour rated lifespan." }, adHooks: ["POV: your desk finally looks like a $5,000 setup (for $39)", "I threw out 4 lamps after trying this one", "The lamp that fixed my 3 PM headaches"] },
    adAssets: adAssetsFor("AeroGlow LED Desk Lamp", "Home Office"),
  },
  {
    id: "prod_02", title: "PostureFix Smart Bracelet", niche: "Health & Wellness", trendScore: 87, estMargin: 72,
    image: "https://images.pexels.com/photos/4498152/pexels-photo-4498152.jpeg?auto=compress&cs=tinysrgb&w=600",
    platforms: ["Shopify", "Amazon", "TikTok Shop"],
    allocations: [{ region: "North America", allocationCount: 4, maxAllocations: 5 }, { region: "Europe", allocationCount: 1, maxAllocations: 3 }, { region: "Asia Pacific", allocationCount: 2, maxAllocations: 4 }],
    seasonal: { microSeason: "Winter Wellness Transition", seasonalityIndex: 7.2, socialEngagementMultiplier: 2.8, buyerIntentCommentRatio: 0.41, localTrendVelocity: 9.8 },
    locked: false,
    copywriting: { optimizedTitle: "PostureFix — Your Posture Coach That Never Sleeps", pasDescription: { problem: "You slouch for 8+ hours a day. Your neck aches, your shoulders round, and your confidence drops with every inch forward.", agitation: "Posture braces are bulky, embarrassing, and you forget to wear them. Apps remind you but can't actually feel when you're slumping.", solution: "PostureFix uses a micro-gyro to detect slouching in real-time and gently vibrates to correct you. 7-day battery, waterproof, and invisible under a sleeve." }, adHooks: ["My chiropractor hates this $29 bracelet", "Day 1 vs Day 30 wearing PostureFix", "The vibration that fixed my slouch in 2 weeks"] },
    adAssets: adAssetsFor("PostureFix Smart Bracelet", "Health & Wellness"),
  },
  {
    id: "prod_03", title: "PureMist Humidifier Pro", niche: "Home & Living", trendScore: 81, estMargin: 61,
    image: "https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=600",
    platforms: ["Shopify", "WooCommerce"],
    allocations: [{ region: "North America", allocationCount: 5, maxAllocations: 5 }, { region: "Europe", allocationCount: 3, maxAllocations: 3 }, { region: "Asia Pacific", allocationCount: 1, maxAllocations: 4 }],
    seasonal: { microSeason: "Winter Wellness Transition", seasonalityIndex: 9.1, socialEngagementMultiplier: 2.4, buyerIntentCommentRatio: 0.28, localTrendVelocity: 7.3 },
    locked: true,
    copywriting: { optimizedTitle: "PureMist Pro — Breathe Better, Sleep Deeper", pasDescription: { problem: "Dry air wakes you up with a sore throat, cracked lips, and dry skin. Your plants droop and your sinuses suffer all winter.", agitation: "Loud humidifiers keep you awake. Cheap ones grow mold in the tank within a week. Refilling them is a daily chore you dread.", solution: "PureMist Pro runs whisper-quiet for 36 hours on one fill. UV-C sterilization kills 99.9% of tank bacteria. Auto-adjusts humidity based on room conditions." }, adHooks: ["I stopped waking up with a sore throat because of this", "The humidifier that cleans itself", "Why my skin stopped cracking in winter"] },
    adAssets: adAssetsFor("PureMist Humidifier Pro", "Home & Living"),
  },
  {
    id: "prod_04", title: "FlexiGrip Phone Mount", niche: "Mobile Accessories", trendScore: 90, estMargin: 78,
    image: "https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=600",
    platforms: ["Shopify", "Amazon", "TikTok Shop", "WooCommerce"],
    allocations: [{ region: "North America", allocationCount: 2, maxAllocations: 5 }, { region: "Europe", allocationCount: 3, maxAllocations: 4 }, { region: "Asia Pacific", allocationCount: 3, maxAllocations: 5 }],
    seasonal: { microSeason: "Summer Lifestyle Peak", seasonalityIndex: 6.4, socialEngagementMultiplier: 4.1, buyerIntentCommentRatio: 0.52, localTrendVelocity: 18.2 },
    locked: false,
    copywriting: { optimizedTitle: "FlexiGrip — The Only Phone Mount That Actually Stays", pasDescription: { problem: "Your phone mount falls off the dashboard every time you hit a bump. You fumble with one hand while driving, risking a ticket — or worse.", agitation: "Suction cups fail in heat. Vent clips block your AC. Magnetic ones slide at every turn. You've wasted $100+ on mounts that don't mount.", solution: "FlexiGrip's nano-gel base bonds to any surface — dash, windshield, or desk — and holds firm from -20F to 200F. 360-rotation, one-hand release, zero residue." }, adHooks: ["I drove 500 miles on a bumpy road and my phone didn't move once", "The $19 mount that replaced my $80 one", "Why I threw away every other phone mount"] },
    adAssets: adAssetsFor("FlexiGrip Phone Mount", "Mobile Accessories"),
  },
  {
    id: "prod_05", title: "ZenSleep Weighted Blanket", niche: "Sleep & Wellness", trendScore: 85, estMargin: 65,
    image: "https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=600",
    platforms: ["Shopify", "WooCommerce", "Amazon"],
    allocations: [{ region: "North America", allocationCount: 4, maxAllocations: 5 }, { region: "Europe", allocationCount: 2, maxAllocations: 4 }, { region: "Asia Pacific", allocationCount: 1, maxAllocations: 3 }],
    seasonal: { microSeason: "Winter Wellness Transition", seasonalityIndex: 8.9, socialEngagementMultiplier: 3.5, buyerIntentCommentRatio: 0.38, localTrendVelocity: 11.7 },
    locked: false,
    copywriting: { optimizedTitle: "ZenSleep — Fall Asleep 37% Faster, Stay Asleep Longer", pasDescription: { problem: "You toss and turn for an hour before falling asleep. Your mind races. You wake at 3 AM and can't get back.", agitation: "Sleep aids leave you groggy. White noise apps don't calm your body. Melatonin gives you weird dreams and a morning headache.", solution: "ZenSleep's 15 lb deep-touch-pressure blanket calms your nervous system naturally. Glass-bead fill stays evenly distributed. Cooling bamboo cover, machine washable." }, adHooks: ["I fell asleep in 8 minutes for the first time in years", "The blanket that replaced my sleeping pills", "My Oura data after 30 nights with ZenSleep"] },
    adAssets: adAssetsFor("ZenSleep Weighted Blanket", "Sleep & Wellness"),
  },
  {
    id: "prod_06", title: "ChefBot Kitchen Scale", niche: "Kitchen & Cooking", trendScore: 78, estMargin: 59,
    image: "https://images.pexels.com/photos/4226803/pexels-photo-4226803.jpeg?auto=compress&cs=tinysrgb&w=600",
    platforms: ["Shopify", "Amazon"],
    allocations: [{ region: "North America", allocationCount: 1, maxAllocations: 4 }, { region: "Europe", allocationCount: 2, maxAllocations: 4 }, { region: "Asia Pacific", allocationCount: 3, maxAllocations: 5 }],
    seasonal: { microSeason: "Spring Renewal", seasonalityIndex: 5.8, socialEngagementMultiplier: 2.1, buyerIntentCommentRatio: 0.22, localTrendVelocity: 6.4 },
    locked: false,
    copywriting: { optimizedTitle: "ChefBot — The Smart Scale That Makes You a Better Cook", pasDescription: { problem: "You eyeball measurements and your recipes fail. Too much flour, not enough salt — the dish is ruined and you don't know why.", agitation: "Analog scales drift and need constant recalibration. Apps require you to manually log every ingredient. You give up and just order takeout.", solution: "ChefBot auto-detects 2,000+ ingredients, tracks nutrition in real-time, and syncs to your phone with zero manual entry. 0.1g precision, USB-C rechargeable." }, adHooks: ["My macarons stopped failing after I got this scale", "The kitchen gadget that made me cook like a chef", "I track macros without opening a single app now"] },
    adAssets: adAssetsFor("ChefBot Kitchen Scale", "Kitchen & Cooking"),
  },
];
