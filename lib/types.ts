export type CampaignStatus =
  | "COLLECTING_DATA"
  | "SCALING_WINNER"
  | "TERMINATED_DEFENSIVE_KILL";

export type TrafficChannel = "TikTok" | "Meta";

export type Platform = "Shopify" | "WooCommerce" | "Amazon" | "TikTok Shop";

export type Region =
  | "North America"
  | "Europe"
  | "Asia Pacific"
  | "Latin America"
  | "Middle East & Africa";

export type MicroSeason =
  | "Q4 Holiday Peak"
  | "Back-to-School Surge"
  | "Summer Lifestyle Peak"
  | "Winter Wellness Transition"
  | "Spring Renewal"
  | "Year-Round Evergreen";

export type SubscriptionTier = "free" | "scale" | "omni";

export interface BrandingDirection {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  typography: {
    headingFont: string;
    bodyFont: string;
    headingStyle: string;
    bodyStyle: string;
  };
}

export interface HeroSection {
  headline: string;
  subheadline: string;
  primaryCTA: string;
  secondaryCTA?: string;
  trustIndicators: string[];
}

export interface TrustBadge {
  icon: string;
  title: string;
  description: string;
}

export interface CustomStorefrontBlueprint {
  recommendedBranding: BrandingDirection;
  heroSection: HeroSection;
  trustSection: TrustBadge[];
  productPhotographyGuidance: string[];
  socialProofStrategy: string;
}

export interface ValidationResponse {
  feasibilityScore: number;
  competitiveMoat: string[];
  targetDemographic: {
    primary: string;
    secondary: string[];
    psychographics: string[];
  };
  testHooks: string[];
  viabilityVerdict: string;
  nextSteps: string[];
}

export interface Campaign {
  id: string;
  productTitle: string;
  productImage: string;
  trafficChannel: TrafficChannel;
  ctr: number;
  spend: number;
  status: CampaignStatus;
}

export interface RegionalAllocation {
  region: Region;
  allocationCount: number;
  maxAllocations: number;
}

export interface SeasonalMetrics {
  microSeason: MicroSeason;
  seasonalityIndex: number;
  socialEngagementMultiplier: number;
  buyerIntentCommentRatio: number;
  localTrendVelocity: number;
}

export interface VideoScript {
  hook: string;
  retention: string;
  cta: string;
}

export interface MetaAdAsset {
  primaryText: string;
  headline: string;
  targetingKeywords: string[];
}

export interface TikTokAdAsset {
  caption: string;
  trendingHashtags: string[];
}

export interface AdAssets {
  videoScript: VideoScript;
  metaAds: MetaAdAsset;
  tiktokAds: TikTokAdAsset;
  customStorefrontBlueprint?: CustomStorefrontBlueprint;
}

export interface DiscoveredProduct {
  id: string;
  title: string;
  niche: string;
  trendScore: number;
  estMargin: number;
  image: string;
  copywriting: ProductCopy;
  adAssets: AdAssets;
  platforms: Platform[];
  allocations: RegionalAllocation[];
  seasonal: SeasonalMetrics;
  locked: boolean;
}

export interface ProductCopy {
  optimizedTitle: string;
  pasDescription: {
    problem: string;
    agitation: string;
    solution: string;
  };
  adHooks: string[];
}

export interface GenerateResponse {
  title: string;
  description: {
    problem: string;
    agitation: string;
    solution: string;
  };
  adAssets: AdAssets;
  customStorefrontBlueprint: CustomStorefrontBlueprint;
}

export interface PlatformConnection {
  platform: Platform;
  connected: boolean;
  storeIdentifier: string;
  connectedAt: string;
}

export interface ShopifyConnection {
  domain: string;
  connected: boolean;
  shopName: string;
  connectedAt: string;
}
