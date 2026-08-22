export interface User {
  id: string;
  name: string;
  email: string;
  businessId?: string;
  createdAt?: string;
}

export interface Business {
  id: string;
  userId: string;
  businessName: string;
  industry: string;
  description: string;
  products: string;
  targetLocation: string;
  targetCustomers: string;
  businessGoal: string;
  createdAt?: string;
  updatedAt?: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
export type LeadCategory = 'Hot' | 'Warm' | 'Cold';

export interface Lead {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  interest: string;
  notes: string;
  status: LeadStatus;
  aiScore?: number;
  aiCategory?: LeadCategory;
  aiAnalysis?: {
    leadScore: number;
    category: LeadCategory;
    purchaseIntent: 'High' | 'Medium' | 'Low';
    customerNeed: string;
    nextBestAction: string;
    priority: 'High' | 'Medium' | 'Low';
    followUpTime: string;
    followUpMessage: string;
    analyzedAt: string;
    scoringFactors?: {
      factor: string;
      weight: 'Positive' | 'Neutral' | 'Negative';
      reason: string;
    }[];
    dealProbabilityPct?: number;
    estimatedDealValue?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GrowthStrategyData {
  businessSummary: string;
  targetAudienceAnalysis: {
    demographics: string;
    psychographics: string;
    buyingBehaviors: string;
    marketSizeEstimate: string;
  };
  idealCustomerProfile: {
    titleOrSegment: string;
    companyOrIndividualType: string;
    budgetCapacity: string;
    triggerEvents: string;
  };
  customerPainPoints: string[];
  valueProposition: {
    headline: string;
    coreBenefit: string;
    keyDifferentiators: string[];
  };
  growthOpportunities: {
    title: string;
    impact: 'High' | 'Medium' | 'Critical';
    description: string;
    timeframe: string;
  }[];
  recommendedMarketingChannels: {
    channel: string;
    whyItWorks: string;
    tactics: string[];
    budgetAllocationPct: number;
  }[];
  salesStrategy: {
    outreachApproach: string;
    objectionHandling: { objection: string; counter: string }[];
    conversionPlaybook: string;
  };
  customerEngagementStrategy: {
    retentionFocus: string;
    onboardingCadence: string;
    loyaltyMechanisms: string[];
  };
  upsellingOpportunities: {
    bundleOrAddon: string;
    targetSegment: string;
    expectedRevenueBoost: string;
  }[];
  highPriorityActions: {
    actionNumber: number;
    title: string;
    description: string;
    timeToExecute: string;
    expectedImpact: string;
  }[];
  generatedAt: string;
}

export interface NextBestActionData {
  leadId: string;
  leadName: string;
  company: string;
  priority: 'High' | 'Medium' | 'Low';
  urgency: string;
  decisionRationale: string;
  recommendedAction: string;
  actionType: string;
  suggestedMessage: string;
  alternativeActions: string[];
  conversionBoostEstimate: string;
  generatedAt: string;
}

export interface CampaignData {
  campaignName: string;
  campaignObjective: string;
  targetAudience: string;
  platform: string;
  keyMessage: string;
  marketingCaptions: {
    hook: string;
    caption: string;
    callToAction: string;
    hashtags?: string[];
  }[];
  primaryCallToAction: string;
  hashtags: string[];
  threeDayCampaignPlan: {
    day: number;
    title: string;
    activity: string;
    deliverable: string;
    recommendedTime: string;
  }[];
  targetKpis: {
    kpi: string;
    benchmarkTarget: string;
  }[];
  generatedAt: string;
}

export interface CustomerMessageData {
  messageType: string;
  tone: string;
  subjectLine?: string;
  formattedMessage: string;
  suggestedAttachmentsOrOffers: string[];
  recommendedSendTiming: string;
  proTipsForClosing: string[];
  generatedAt: string;
}

export interface GrowthInsightsData {
  executiveSummary: string;
  keyMetricsAnalysis: {
    leadVelocity: string;
    conversionHealth: string;
    untouchedLeadsCount: number;
    topAcquisitionChannel: string;
  };
  growthOpportunities: {
    opportunity: string;
    potentialUpside: string;
    actionRequired: string;
  }[];
  customerInsights: {
    insight: string;
    evidence: string;
    strategicMeaning: string;
  }[];
  salesBottlenecks: {
    bottleneck: string;
    impact: 'High' | 'Moderate' | 'Low';
    solution: string;
  }[];
  recommendedActions: {
    priority: 'Immediate (24h)' | 'Short-term (7d)' | 'Strategic (30d)';
    action: string;
    targetLeadOrSegment: string;
    expectedOutcome: string;
  }[];
  generatedAt: string;
}

export interface DashboardSummary {
  summary: {
    totalLeads: number;
    hotLeadsCount: number;
    warmLeadsCount: number;
    coldLeadsCount: number;
    unScoredCount: number;
    conversionRate: number;
    qualifiedRate: number;
    convertedCount: number;
  };
  statusDistribution: { status: string; count: number }[];
  categoryDistribution: { category: string; count: number; fill: string }[];
  sourceDistribution: { source: string; count: number }[];
  recentLeads: Lead[];
  recommendations: {
    id: string;
    type: string;
    title: string;
    description: string;
    priority: string;
    actionLabel: string;
    targetTab: string;
    leadId?: string;
  }[];
  aiStats: {
    totalAnalysesGenerated: number;
    strategiesRun: number;
    leadsScored: number;
    campaignsCreated: number;
    messagesCrafted: number;
    insightsGenerated: number;
  };
}
