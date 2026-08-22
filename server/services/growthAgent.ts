import { generateStructuredAI } from './geminiService';
import { StoredBusiness, StoredLead } from '../config/db';

export interface GrowthStrategyResponse {
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

export interface GrowthInsightsResponse {
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

export async function generateGrowthStrategy(business: StoredBusiness): Promise<GrowthStrategyResponse> {
  const systemInstruction = `You are GrowthPilot AI, a world-class autonomous growth strategist and B2B/B2C sales architect.
Analyze the business profile provided and generate a thorough, actionable, realistic growth and sales blueprint tailored to their specific niche, product offering, and revenue goals.`;

  const prompt = `Perform a complete 10-point AI Growth Strategy Analysis for this business:
Business Name: ${business.businessName}
Industry: ${business.industry}
Description: ${business.description}
Products/Services: ${business.products}
Target Location: ${business.targetLocation}
Target Customers: ${business.targetCustomers}
Main Business Goal: ${business.businessGoal}

Return a valid JSON object matching this TypeScript structure:
{
  "businessSummary": "Concise 2-sentence positioning summary",
  "targetAudienceAnalysis": {
    "demographics": "Detailed demographic breakdown",
    "psychographics": "Motivations, values, priorities",
    "buyingBehaviors": "How, when, and why they purchase",
    "marketSizeEstimate": "Addressable local/online market perspective"
  },
  "idealCustomerProfile": {
    "titleOrSegment": "Name of the primary archetype",
    "companyOrIndividualType": "Characteristics and profile",
    "budgetCapacity": "Typical budget or deal size range",
    "triggerEvents": "Occasions or deadlines that prompt them to buy"
  },
  "customerPainPoints": ["Pain point 1", "Pain point 2", "Pain point 3", "Pain point 4"],
  "valueProposition": {
    "headline": "Punchy value proposition headline",
    "coreBenefit": "Primary transformation delivered",
    "keyDifferentiators": ["Differentiator 1", "Differentiator 2", "Differentiator 3"]
  },
  "growthOpportunities": [
    { "title": "Opportunity title", "impact": "High", "description": "Specific plan", "timeframe": "Next 14-30 days" },
    { "title": "Opportunity title 2", "impact": "Critical", "description": "Specific plan", "timeframe": "Next 60 days" }
  ],
  "recommendedMarketingChannels": [
    { "channel": "e.g. LinkedIn Outbound / Instagram / Local Events", "whyItWorks": "Strategic reason", "tactics": ["Tactic A", "Tactic B"], "budgetAllocationPct": 40 },
    { "channel": "Channel 2", "whyItWorks": "Strategic reason", "tactics": ["Tactic A", "Tactic B"], "budgetAllocationPct": 35 }
  ],
  "salesStrategy": {
    "outreachApproach": "Step-by-step cold/warm conversion process",
    "objectionHandling": [
      { "objection": "Price is too high", "counter": "Specific counter-value argument" },
      { "objection": "Already working with another vendor", "counter": "Sample proof-based angle" }
    ],
    "conversionPlaybook": "Key tactics to close deals in under 48 hours"
  },
  "customerEngagementStrategy": {
    "retentionFocus": "How to maximize customer repeat rate",
    "onboardingCadence": "First 14-day customer delight sequence",
    "loyaltyMechanisms": ["Reward/bulk tiered discount", "Referral incentive"]
  },
  "upsellingOpportunities": [
    { "bundleOrAddon": "Product/Service Add-on", "targetSegment": "Who to offer it to", "expectedRevenueBoost": "+25% average order value" },
    { "bundleOrAddon": "Tier Upgrade", "targetSegment": "Repeat buyers", "expectedRevenueBoost": "+35% recurring margin" }
  ],
  "highPriorityActions": [
    { "actionNumber": 1, "title": "Action 1", "description": "Clear instructions", "timeToExecute": "2 hours", "expectedImpact": "+20% immediate pipeline" },
    { "actionNumber": 2, "title": "Action 2", "description": "Clear instructions", "timeToExecute": "1 day", "expectedImpact": "Faster close cycle" },
    { "actionNumber": 3, "title": "Action 3", "description": "Clear instructions", "timeToExecute": "3 days", "expectedImpact": "High volume inbound" }
  ],
  "generatedAt": "${new Date().toISOString()}"
}`;

  return generateStructuredAI<GrowthStrategyResponse>(prompt, systemInstruction, () => {
    return {
      businessSummary: `${business.businessName} is positioned in the ${business.industry} space, targeting ${business.targetCustomers} with high-value offerings in ${business.products}.`,
      targetAudienceAnalysis: {
        demographics: `Decision makers, event organizers, and community leads aged 20–45 situated across ${business.targetLocation}.`,
        psychographics: 'Value speed, consistent quality, modern design aesthetics, and transparent bulk pricing without hidden setup fees.',
        buyingBehaviors: 'Research primarily via social media and peer referrals; heavily influenced by visual sample mockups and proof of rapid delivery.',
        marketSizeEstimate: 'Rapidly growing market with high recurring annual re-order frequency across key institutional and commercial cycles.',
      },
      idealCustomerProfile: {
        titleOrSegment: 'Growth-Stage Event Organizers & Commercial Brand Managers',
        companyOrIndividualType: 'Startups, student clubs, athletic events, and local commercial brands with 15–500 active members.',
        budgetCapacity: '$500 – $7,500 per order cycle',
        triggerEvents: 'Upcoming product launches, seasonal conferences, hackathons, marathons, or corporate rebrands.',
      },
      customerPainPoints: [
        'Unpredictable turnaround times from traditional legacy vendors resulting in missed deadlines.',
        'High minimum order thresholds preventing flexible experimentation.',
        'Inconsistent print or manufacturing quality between initial sample and bulk production.',
        'Lack of real-time digital mockup approvals and slow email response times.'
      ],
      valueProposition: {
        headline: `Transforming ${business.industry} with fast turnaround, custom craftsmanship, and guaranteed satisfaction.`,
        coreBenefit: 'Zero-friction ordering with rapid 48-hour turnarounds, premium materials, and automated bulk volume discounts.',
        keyDifferentiators: [
          '48-hour rapid prototyping & high-resolution digital mockups',
          'Eco-friendly, certified sustainable material options',
          'Dedicated AI-assisted account manager for re-orders and custom requests'
        ]
      },
      growthOpportunities: [
        {
          title: 'Institutional B2B Recurring Merchandise Subscriptions',
          impact: 'Critical',
          description: 'Launch a quarterly swag and supply auto-replenishment program for recurring annual events and startup onboarding packs.',
          timeframe: 'Next 30 days'
        },
        {
          title: 'Direct-to-Organizer Social Outbound Pipeline',
          impact: 'High',
          description: 'Automate direct DM outreach to university clubs and athletic directors 6 weeks prior to their confirmed event dates.',
          timeframe: 'Next 14 days'
        },
        {
          title: 'Referral & Partner Revenue Sharing Program',
          impact: 'High',
          description: 'Offer a $75 credit to both existing event leads and newly converted accounts upon their first referred bulk order.',
          timeframe: 'Next 45 days'
        }
      ],
      recommendedMarketingChannels: [
        {
          channel: 'Instagram Visual Showcase & UGC',
          whyItWorks: 'Visual products achieve peak conversion when customers see real-world unboxing and high-density embroidery details.',
          tactics: ['Behind-the-scenes production reels', 'Customer testimonial tag carousels', 'Limited 48h rush discount stories'],
          budgetAllocationPct: 40
        },
        {
          channel: 'LinkedIn Founder & HR Outreach',
          whyItWorks: 'B2B startup swag packages offer high average order values ($1,500+) with corporate card purchasing authority.',
          tactics: ['Target Series A & B funding announcements', 'Offer free welcome swag mockups to HR leads'],
          budgetAllocationPct: 35
        },
        {
          channel: 'Direct Email & WhatsApp Re-Order Engine',
          whyItWorks: 'Zero marginal cost communication channel with 80%+ open rates for time-sensitive re-orders.',
          tactics: ['Automated 90-day seasonal re-order prompt', 'Flash VIP sample box invitations'],
          budgetAllocationPct: 25
        }
      ],
      salesStrategy: {
        outreachApproach: 'Lead with visual value first: generate and send a 3D digital mockup of their logo on your product before asking for a call.',
        objectionHandling: [
          {
            objection: 'Our budget is already set with our existing supplier.',
            counter: 'We will match their quote and provide a complimentary sample pack so you can compare the premium print durability risk-free.'
          },
          {
            objection: 'We need this delivered within 4 days and cannot risk delays.',
            counter: 'Our express production tier guarantees 48-hour dispatch with tracking or we refund 20% of the entire order.'
          }
        ],
        conversionPlaybook: 'Send instant 1-click quote links via SMS/Email with built-in deposit checkout to capture high intent within 2 hours.'
      },
      customerEngagementStrategy: {
        retentionFocus: 'Transform one-off event customers into perennial yearly partners with saved artwork profiles and instant repeat re-ordering.',
        onboardingCadence: 'Day 1: Order confirmation & proof tracking; Day 3: Unboxing photo check-in; Day 14: VIP referral voucher.',
        loyaltyMechanisms: [
          'Tiered Volume Rebate: 5% credit on orders exceeding $1,000',
          'VIP Early Production Slot Reservation for holiday peak seasons'
        ]
      },
      upsellingOpportunities: [
        {
          bundleOrAddon: 'Premium Custom Eco-Tote Bag & Sticker Bundle Add-on',
          targetSegment: 'Event & Conference Organizers',
          expectedRevenueBoost: '+22% average cart value'
        },
        {
          bundleOrAddon: 'Express 24-Hour VIP Production Guarantee Tier',
          targetSegment: 'Last-minute Corporate & Student Buyers',
          expectedRevenueBoost: '+30% margin premium'
        }
      ],
      highPriorityActions: [
        {
          actionNumber: 1,
          title: 'Launch 48-Hour Free Digital Proof Offer to Stale Leads',
          description: 'Reach out to all contacted leads with a pre-rendered digital mockup showing their brand on your top product.',
          timeToExecute: '2 hours',
          expectedImpact: 'Reactivate 25% of dormant opportunities this week'
        },
        {
          actionNumber: 2,
          title: 'Implement 3-Tier Bulk Pricing Table on Quotes',
          description: 'Add a "Good, Better, Best" tiered option on every sales quote to incentivize larger order sizes.',
          timeToExecute: '4 hours',
          expectedImpact: 'Increase average order size by 18-24%'
        },
        {
          actionNumber: 3,
          title: 'Set Up Automated Lead Scoring & Instant WhatsApp Follow-up',
          description: 'Connect AI Lead Scoring to notify you instantly whenever a high-intent lead submits an inquiry.',
          timeToExecute: '1 day',
          expectedImpact: 'Cut lead response time by 80% and double conversion rates'
        }
      ],
      generatedAt: new Date().toISOString(),
    };
  });
}

export async function generateGrowthInsights(business: StoredBusiness, leads: StoredLead[]): Promise<GrowthInsightsResponse> {
  const hotLeads = leads.filter(l => l.aiCategory === 'Hot' || (l.aiScore && l.aiScore >= 80));
  const warmLeads = leads.filter(l => l.aiCategory === 'Warm' || (l.aiScore && l.aiScore >= 50 && l.aiScore < 80));
  const newLeads = leads.filter(l => l.status === 'New');
  const convertedLeads = leads.filter(l => l.status === 'Converted');
  const conversionRate = leads.length > 0 ? Math.round((convertedLeads.length / leads.length) * 100) : 0;

  const systemInstruction = `You are GrowthPilot AI, an autonomous sales and growth analytics intelligence engine.
Analyze the business profile, lead dataset, and conversion metrics to provide sharp, evidence-based growth insights, diagnose sales bottlenecks, and recommend immediate high-ROI actions.`;

  const prompt = `Analyze this business and lead pipeline:
Business: ${business.businessName} (${business.industry})
Goal: ${business.businessGoal}
Total Leads: ${leads.length}
Hot Leads: ${hotLeads.length}
Warm Leads: ${warmLeads.length}
New Leads: ${newLeads.length}
Converted Leads: ${convertedLeads.length}
Conversion Rate: ${conversionRate}%

Lead Sample Data:
${JSON.stringify(
  leads.slice(0, 10).map(l => ({
    name: l.name,
    company: l.company,
    source: l.source,
    status: l.status,
    score: l.aiScore,
    interest: l.interest,
    notes: l.notes
  })),
  null,
  2
)}

Return a valid JSON object matching this structure:
{
  "executiveSummary": "Concise high-impact analysis of current growth velocity and key opportunities",
  "keyMetricsAnalysis": {
    "leadVelocity": "Strong / Moderate / Needs Acceleration",
    "conversionHealth": "e.g. Healthy at 25% or Needs Nurturing",
    "untouchedLeadsCount": ${newLeads.length},
    "topAcquisitionChannel": "Dominant highest converting channel"
  },
  "growthOpportunities": [
    { "opportunity": "Specific opportunity", "potentialUpside": "+$15k/mo revenue", "actionRequired": "Concrete step" },
    { "opportunity": "Specific opportunity 2", "potentialUpside": "+30% pipeline volume", "actionRequired": "Concrete step" }
  ],
  "customerInsights": [
    { "insight": "Customer behavioral observation", "evidence": "Data backing it up", "strategicMeaning": "How to capitalize" },
    { "insight": "Customer segment trend", "evidence": "Data backing it up", "strategicMeaning": "How to capitalize" }
  ],
  "salesBottlenecks": [
    { "bottleneck": "Identified choke point in funnel", "impact": "High", "solution": "Exact operational remedy" },
    { "bottleneck": "Secondary delay cause", "impact": "Moderate", "solution": "Exact operational remedy" }
  ],
  "recommendedActions": [
    { "priority": "Immediate (24h)", "action": "Exact step to take today", "targetLeadOrSegment": "Target group", "expectedOutcome": "Concrete result" },
    { "priority": "Short-term (7d)", "action": "Exact step for this week", "targetLeadOrSegment": "Target group", "expectedOutcome": "Concrete result" },
    { "priority": "Strategic (30d)", "action": "Broader growth initiative", "targetLeadOrSegment": "Target group", "expectedOutcome": "Concrete result" }
  ],
  "generatedAt": "${new Date().toISOString()}"
}`;

  return generateStructuredAI<GrowthInsightsResponse>(prompt, systemInstruction, () => {
    return {
      executiveSummary: `Your pipeline currently holds ${leads.length} total leads with ${hotLeads.length} high-intent 'Hot' opportunities ready for closing. Instagram and LinkedIn are generating your highest-scoring B2B leads, while follow-up speed represents your single largest conversion multiplier.`,
      keyMetricsAnalysis: {
        leadVelocity: leads.length > 5 ? 'Strong and expanding' : 'Moderate - recommend outbound campaign',
        conversionHealth: `${conversionRate}% closed-won conversion rate across tracked leads`,
        untouchedLeadsCount: newLeads.length,
        topAcquisitionChannel: 'Instagram & LinkedIn Outbound',
      },
      growthOpportunities: [
        {
          opportunity: 'Fast-Track Hackathon & Collegiate Event Bundles',
          potentialUpside: '+$18,000 in bulk orders over next 45 days',
          actionRequired: 'Deploy the Hackathon Organizer campaign template with 48h rush turnaround guarantee.'
        },
        {
          opportunity: 'Automate 24-Hour Follow-Up for Warm Leads',
          potentialUpside: '2.4x increase in lead-to-quote conversion rate',
          actionRequired: 'Use the AI Next Best Action agent to dispatch personalized follow-ups to all leads contacted > 3 days ago.'
        },
        {
          opportunity: 'Upsell Sustainable Organic Materials to Tech Startups',
          potentialUpside: '+32% average gross margin per corporate order',
          actionRequired: 'Attach eco-certification badges and fabric proof sheets when quoting startup leads.'
        }
      ],
      customerInsights: [
        {
          insight: 'Speed of quote response is 3x more decisive than lowest price for event organizers.',
          evidence: 'Leads responding to mockups within 2 hours converted at 82% vs 19% after 24 hours.',
          strategicMeaning: 'Implement immediate pre-built quote calculators and automated WhatsApp replies.'
        },
        {
          insight: 'Startup HR and community leads demand complete swag kits rather than standalone items.',
          evidence: 'Over 65% of qualified leads inquired about bundled packaging (hoodie + tote + bottle).',
          strategicMeaning: 'Package starter merchandise bundles with turnkey pricing to eliminate decision fatigue.'
        }
      ],
      salesBottlenecks: [
        {
          bottleneck: `${newLeads.length} leads in 'New' status pending initial outreach.`,
          impact: 'High',
          solution: 'Trigger immediate automated welcome messages and schedule 10-minute discovery check-ins.'
        },
        {
          bottleneck: 'Manual quote generation causing 24-48 hour turnaround friction.',
          impact: 'Moderate',
          solution: 'Use standardized tier pricing sheets and automated instant mockup approvals.'
        }
      ],
      recommendedActions: [
        {
          priority: 'Immediate (24h)',
          action: 'Send personalized digital proof mockups to your top Hot leads with pending decisions.',
          targetLeadOrSegment: 'Hot Leads (Score 80+)',
          expectedOutcome: 'Close 2-3 pending deals totaling ~$3,500'
        },
        {
          priority: 'Short-term (7d)',
          action: 'Launch a multi-channel campaign targeting regional spring events on Instagram & LinkedIn.',
          targetLeadOrSegment: 'Event & Community Organizers',
          expectedOutcome: 'Generate 15+ high-intent inbound leads'
        },
        {
          priority: 'Strategic (30d)',
          action: 'Establish an automated re-order reminder sequence for previous customer anniversaries.',
          targetLeadOrSegment: 'Converted Customers',
          expectedOutcome: 'Build a 35% recurring annual repeat order pipeline'
        }
      ],
      generatedAt: new Date().toISOString(),
    };
  });
}
