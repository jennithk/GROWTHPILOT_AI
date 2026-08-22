import { generateStructuredAI } from './geminiService';
import { StoredBusiness, StoredLead } from '../config/db';

export interface LeadScoreResult {
  leadScore: number; // 0 - 100
  category: 'Hot' | 'Warm' | 'Cold';
  purchaseIntent: 'High' | 'Medium' | 'Low';
  customerNeed: string;
  recommendedAction: string;
  priority: 'High' | 'Medium' | 'Low';
  followUpTime: string;
  followUpMessage: string;
  scoringFactors: {
    factor: string;
    weight: 'Positive' | 'Neutral' | 'Negative';
    reason: string;
  }[];
  dealProbabilityPct: number;
  estimatedDealValue: string;
  analyzedAt: string;
}

export interface NextBestActionResponse {
  leadId: string;
  leadName: string;
  company: string;
  priority: 'High' | 'Medium' | 'Low';
  urgency: 'Immediate (Today)' | 'Within 24h' | 'Within 48h' | 'Nurture Stream';
  decisionRationale: string;
  recommendedAction: string;
  actionType: 'Send VIP Quote' | 'Follow-up Email' | 'WhatsApp Direct Call' | 'Offer Limited Discount' | 'Send Digital Proof' | 'Schedule Demo' | 'Mark Low Priority';
  suggestedMessage: string;
  alternativeActions: string[];
  conversionBoostEstimate: string;
  generatedAt: string;
}

export interface CampaignGeneratorInput {
  campaignGoal: string;
  productService: string;
  targetAudience: string;
  platform: 'Instagram' | 'LinkedIn' | 'Email' | 'WhatsApp' | 'Multi-Channel';
}

export interface CampaignGeneratorResponse {
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

export interface CustomerEngagementInput {
  leadOrCustomerName: string;
  companyName?: string;
  messageType: 'Welcome' | 'Follow-up' | 'Re-engagement' | 'Upselling' | 'Thank-you';
  tone: 'Professional' | 'Friendly' | 'Persuasive' | 'Casual';
  specificContext?: string;
  channel?: 'Email' | 'WhatsApp' | 'LinkedIn' | 'SMS';
}

export interface CustomerEngagementResponse {
  messageType: string;
  tone: string;
  subjectLine?: string;
  formattedMessage: string;
  suggestedAttachmentsOrOffers: string[];
  recommendedSendTiming: string;
  proTipsForClosing: string[];
  generatedAt: string;
}

export async function analyzeLead(business: StoredBusiness, lead: StoredLead): Promise<LeadScoreResult> {
  const systemInstruction = `You are GrowthPilot AI's Autonomous Lead Scoring & Sales Qualification Agent.
Evaluate the prospect lead against the business's ideal customer profile, purchase intent signals, urgency markers, and communication history.
Compute an objective lead score between 0 and 100, classify them accurately as Hot, Warm, or Cold, extract their core need, and write a high-converting, personalized follow-up message.`;

  const prompt = `Analyze and score this sales lead:
Business Profile:
- Business: ${business.businessName} (${business.industry})
- Products/Services: ${business.products}
- Target Customers: ${business.targetCustomers}
- Goal: ${business.businessGoal}

Lead Profile:
- Name: ${lead.name}
- Email: ${lead.email}
- Phone: ${lead.phone || 'Not provided'}
- Company/Org: ${lead.company || 'Not specified'}
- Lead Source: ${lead.source}
- Interest/Inquiry: ${lead.interest}
- Internal Sales Notes: ${lead.notes}
- Current Status: ${lead.status}

Return a valid JSON object matching this structure:
{
  "leadScore": 88,
  "category": "Hot",
  "purchaseIntent": "High",
  "customerNeed": "Concise definition of the customer's actual pain/need",
  "recommendedAction": "Actionable instruction for the sales rep",
  "priority": "High",
  "followUpTime": "Within 24 hours",
  "followUpMessage": "Personalized, high-converting follow-up message referencing their exact inquiry",
  "scoringFactors": [
    { "factor": "Urgency & Timing", "weight": "Positive", "reason": "Clear near-term deadline" },
    { "factor": "Budget / Volume Fit", "weight": "Positive", "reason": "Aligns with bulk production capacity" },
    { "factor": "Decision Authority", "weight": "Positive", "reason": "Direct organizer role" }
  ],
  "dealProbabilityPct": 75,
  "estimatedDealValue": "$1,200 - $3,500",
  "analyzedAt": "${new Date().toISOString()}"
}`;

  return generateStructuredAI<LeadScoreResult>(prompt, systemInstruction, () => {
    // Intelligent fallback scoring algorithm
    let score = 50;
    const interestLower = (lead.interest || '').toLowerCase();
    const notesLower = (lead.notes || '').toLowerCase();
    const sourceLower = (lead.source || '').toLowerCase();

    if (interestLower.includes('urgent') || interestLower.includes('quote') || interestLower.includes('500') || interestLower.includes('bulk') || notesLower.includes('budget') || notesLower.includes('deadline')) {
      score += 35;
    }
    if (lead.company && lead.company.trim().length > 2) {
      score += 10;
    }
    if (sourceLower.includes('referral') || sourceLower.includes('linkedin') || sourceLower.includes('instagram')) {
      score += 5;
    }
    if (lead.status === 'Qualified') score += 10;
    if (lead.status === 'Lost') score = Math.min(score, 25);
    if (interestLower.includes('personal') || interestLower.includes('1 shirt') || interestLower.includes('family')) {
      score = Math.min(score, 30);
    }

    score = Math.min(99, Math.max(15, score));
    const category: 'Hot' | 'Warm' | 'Cold' = score >= 80 ? 'Hot' : score >= 50 ? 'Warm' : 'Cold';
    const priority: 'High' | 'Medium' | 'Low' = category === 'Hot' ? 'High' : category === 'Warm' ? 'Medium' : 'Low';
    const purchaseIntent: 'High' | 'Medium' | 'Low' = category === 'Hot' ? 'High' : category === 'Warm' ? 'Medium' : 'Low';

    return {
      leadScore: score,
      category,
      purchaseIntent,
      customerNeed: lead.interest || `Custom ${business.products} tailored to ${lead.company || 'their organization'}`,
      recommendedAction: category === 'Hot' 
        ? `Schedule a 15-minute VIP proposal walkthrough and send custom mockups within 24 hours.`
        : category === 'Warm'
        ? `Send product catalog, client case study, and offer a complimentary sample kit.`
        : `Add to automated monthly newsletter and send self-serve pricing guide.`,
      priority,
      followUpTime: category === 'Hot' ? 'Within 4 hours' : category === 'Warm' ? 'Within 24 hours' : 'Automated 7-day cadence',
      followUpMessage: `Hi ${lead.name.split(' ')[0]}, thanks for reaching out to ${business.businessName}! Regarding your interest in ${lead.interest || business.products}, we’d love to prepare a tailored digital proof and exclusive volume pricing for ${lead.company || 'your team'}. When is a good time for a quick 5-minute chat?`,
      scoringFactors: [
        {
          factor: 'Inquiry Specificity',
          weight: category === 'Hot' ? 'Positive' : 'Neutral',
          reason: `Lead provided clear project context around ${lead.interest || 'services'}`
        },
        {
          factor: 'Channel Acquisition Quality',
          weight: 'Positive',
          reason: `Acquired via high-converting channel: ${lead.source}`
        },
        {
          factor: 'Commercial Fit',
          weight: category === 'Cold' ? 'Negative' : 'Positive',
          reason: `Evaluated against ${business.industry} target customer profile`
        }
      ],
      dealProbabilityPct: category === 'Hot' ? 82 : category === 'Warm' ? 54 : 18,
      estimatedDealValue: category === 'Hot' ? '$1,500 – $4,000' : category === 'Warm' ? '$600 – $1,800' : '< $500',
      analyzedAt: new Date().toISOString(),
    };
  });
}

export async function getNextBestAction(business: StoredBusiness, lead: StoredLead): Promise<NextBestActionResponse> {
  const systemInstruction = `You are GrowthPilot AI's Autonomous Next-Best-Action Decision Engine.
Given a business profile and a specific lead's history, current stage, and AI scoring metrics, determine the single most impactful tactical action to advance the deal right now.`;

  const prompt = `Determine the Next Best Action for this lead:
Business: ${business.businessName} (${business.industry})
Business Goal: ${business.businessGoal}

Lead:
- Name: ${lead.name}
- Company: ${lead.company || 'Individual'}
- Status: ${lead.status}
- Score: ${lead.aiScore || 70} (${lead.aiCategory || 'Warm'})
- Inquiry: ${lead.interest}
- Notes: ${lead.notes}

Return a valid JSON object:
{
  "leadId": "${lead.id}",
  "leadName": "${lead.name}",
  "company": "${lead.company || 'Direct Inquiry'}",
  "priority": "High",
  "urgency": "Within 24h",
  "decisionRationale": "Clear 2-sentence explanation why this action will drive highest conversion probability",
  "recommendedAction": "Specific, actionable step",
  "actionType": "Send VIP Quote",
  "suggestedMessage": "Ready-to-send personalized message draft",
  "alternativeActions": ["Alternative action 1", "Alternative action 2"],
  "conversionBoostEstimate": "+35% probability of contract signature",
  "generatedAt": "${new Date().toISOString()}"
}`;

  return generateStructuredAI<NextBestActionResponse>(prompt, systemInstruction, () => {
    const isHot = (lead.aiScore || 70) >= 80;
    return {
      leadId: lead.id,
      leadName: lead.name,
      company: lead.company || 'Direct Customer',
      priority: isHot ? 'High' : 'Medium',
      urgency: isHot ? 'Immediate (Today)' : 'Within 24h',
      decisionRationale: `The prospect has expressed explicit demand for ${lead.interest || business.products} and has active momentum. Delivering immediate visual confirmation and pricing removes evaluation hesitation.`,
      recommendedAction: isHot 
        ? `Deliver instant VIP proposal with guaranteed 48-hour delivery timeline and custom mockup.`
        : `Send proof-of-concept case study and invite to a 10-minute discovery consultation.`,
      actionType: isHot ? 'Send VIP Quote' : 'Follow-up Email',
      suggestedMessage: `Hi ${lead.name.split(' ')[0]}, we just finalized the production specs for ${business.businessName}. We can turn around your order for ${lead.company || 'your team'} with premium quality and special volume pricing. Would you like me to reserve your production slot for this week?`,
      alternativeActions: [
        'Offer a 10% discount on initial contract if signed within 48 hours',
        'Ship a complimentary sample pack directly to their office'
      ],
      conversionBoostEstimate: isHot ? '+45% close acceleration' : '+25% response rate lift',
      generatedAt: new Date().toISOString(),
    };
  });
}

export async function generateCampaign(business: StoredBusiness, input: CampaignGeneratorInput): Promise<CampaignGeneratorResponse> {
  const systemInstruction = `You are GrowthPilot AI's Autonomous Multi-Channel Campaign & Copywriting Agent.
Generate a cohesive, high-converting marketing campaign with compelling copy, hooks, CTAs, and a realistic 3-day step-by-step rollout plan for the selected platform.`;

  const prompt = `Generate a marketing campaign based on:
Business: ${business.businessName} (${business.industry})
Product/Service: ${input.productService}
Campaign Goal: ${input.campaignGoal}
Target Audience: ${input.targetAudience}
Platform: ${input.platform}

Return a valid JSON object:
{
  "campaignName": "Catchy, professional campaign title",
  "campaignObjective": "Clear objective statement",
  "targetAudience": "${input.targetAudience}",
  "platform": "${input.platform}",
  "keyMessage": "Core value hook and customer transformation",
  "marketingCaptions": [
    {
      "hook": "Scroll-stopping first line hook",
      "caption": "Full high-converting post/email body with storytelling and social proof",
      "callToAction": "Direct action link or DM prompt",
      "hashtags": ["#Tag1", "#Tag2", "#Tag3"]
    },
    {
      "hook": "Alternative angle (urgency/scarcity)",
      "caption": "Full high-converting caption",
      "callToAction": "Direct CTA",
      "hashtags": ["#Tag1", "#Tag2"]
    },
    {
      "hook": "Social proof / case study angle",
      "caption": "Full high-converting caption",
      "callToAction": "Direct CTA",
      "hashtags": ["#Tag1", "#Tag2"]
    }
  ],
  "primaryCallToAction": "Main campaign CTA button text or command",
  "hashtags": ["#GrowthPilot", "#BrandGrowth", "#CustomApparel"],
  "threeDayCampaignPlan": [
    { "day": 1, "title": "Teaser & Problem Agitation", "activity": "Post high-impact hook and poll audience", "deliverable": "Visual Reel / Intro Email", "recommendedTime": "9:30 AM EST" },
    { "day": 2, "title": "Social Proof & Showcase", "activity": "Demonstrate transformation and customer results", "deliverable": "Carousel / Case Study", "recommendedTime": "1:00 PM EST" },
    { "day": 3, "title": "Urgency & VIP Offer Close", "activity": "Final call for limited slots / early-bird discount", "deliverable": "Direct CTA Blast & DM Follow-ups", "recommendedTime": "5:00 PM EST" }
  ],
  "targetKpis": [
    { "kpi": "Click-Through Rate (CTR)", "benchmarkTarget": "> 4.8%" },
    { "kpi": "Inbound Qualified Inquiries", "benchmarkTarget": "15-25 new leads" }
  ],
  "generatedAt": "${new Date().toISOString()}"
}`;

  return generateStructuredAI<CampaignGeneratorResponse>(prompt, systemInstruction, () => {
    const isLinkedIn = input.platform === 'LinkedIn';
    const isEmail = input.platform === 'Email';
    const isWhatsApp = input.platform === 'WhatsApp';

    return {
      campaignName: `${input.campaignGoal.slice(0, 24)} Growth Blitz: ${input.productService}`,
      campaignObjective: `Achieve ${input.campaignGoal} by engaging ${input.targetAudience} across ${input.platform} with targeted value propositions and limited-time incentives.`,
      targetAudience: input.targetAudience,
      platform: input.platform,
      keyMessage: `Experience the highest quality ${input.productService} with guaranteed 48-hour turnarounds and zero compromise on craft.`,
      marketingCaptions: [
        {
          hook: isLinkedIn
            ? 'Most event organizers and founders lose 20+ hours chasing unreliable suppliers. Here is how we fixed that.'
            : isWhatsApp
            ? '🔥 Exclusive VIP Access: Get premium custom gear with guaranteed 48-hour rush delivery!'
            : 'Stop settling for generic merch that cracks after one wash. ⚡',
          caption: `${business.businessName} makes ordering ${input.productService} effortless. Whether you're organizing an event, launching a brand, or outfitting your team, our direct manufacturing and instant mockup approval mean you get flawless results on time, every time.\n\n✨ Certified sustainable materials\n⚡ 48-hour rapid dispatch available\n🎯 Dedicated design concierge\n\nDrop a comment or send us a message to claim your complimentary mockup and exclusive volume discount today!`,
          callToAction: isEmail ? 'Claim Your Free Digital Proof Mockup ->' : 'Send us a DM with "MOCKUP" for an instant quote!',
          hashtags: ['#SmallBusinessGrowth', '#MerchandiseDesign', '#B2BGrowth', '#QualityFirst']
        },
        {
          hook: isLinkedIn
            ? 'What happens when your event is 4 days away and your vendor cancels?'
            : 'Need premium customized gear without the 3-week waiting list? We got you covered. 📦',
          caption: `We built ${business.businessName} specifically for fast-moving teams that can't afford delays. From custom ${input.productService} to complete welcome kits, see why 500+ organizers trust our rush production.\n\nReserve your priority production slot before Friday to lock in complimentary express shipping!`,
          callToAction: 'Click below to check live slot availability',
          hashtags: ['#EventOrganizers', '#StartupSwag', '#FastTurnaround']
        },
        {
          hook: 'Real results: How one community organizer saved 30% and received their order in 48 hours.',
          caption: `Custom orders shouldn't require 10 back-and-forth emails. With ${business.businessName}, you send your logo, approve a 3D digital proof in minutes, and receive premium goods at your door.\n\nReady to elevate your team's look this season? Let's make it happen.`,
          callToAction: 'Get your free personalized quote now',
          hashtags: ['#CaseStudy', '#CustomerFirst', '#BrandIdentity']
        }
      ],
      primaryCallToAction: isWhatsApp ? 'Chat on WhatsApp for Instant Quote' : 'Claim Free Digital Proof & 10% Discount',
      hashtags: ['#GrowthPilotAI', '#BusinessGrowth', '#SalesAutomation', '#SmartMarketing'],
      threeDayCampaignPlan: [
        {
          day: 1,
          title: 'Problem Awareness & Visual Teaser',
          activity: `Publish Hook #1 on ${input.platform} focusing on common frustration points in ${business.industry}.`,
          deliverable: 'High-contrast visual post / Direct outreach blast',
          recommendedTime: '09:00 AM local time'
        },
        {
          day: 2,
          title: 'Social Proof & Product Demonstration',
          activity: 'Share customer unboxing photos, mockup proofs, and print durability demonstrations.',
          deliverable: 'Carousel / Video demonstration / Case study email',
          recommendedTime: '01:30 PM local time'
        },
        {
          day: 3,
          title: 'Limited-Time Incentive & Close',
          activity: 'Direct call to action offering a free sample kit or 10% bulk discount for next 24 hours.',
          deliverable: 'Urgency post + 1-on-1 direct message follow-ups to commenters',
          recommendedTime: '05:00 PM local time'
        }
      ],
      targetKpis: [
        { kpi: 'Inbound Inquiries', benchmarkTarget: '12 – 20 qualified leads' },
        { kpi: 'Engagement Rate', benchmarkTarget: '4.2% – 6.5%' },
        { kpi: 'Target Revenue Impact', benchmarkTarget: '$4,500 – $8,000' }
      ],
      generatedAt: new Date().toISOString(),
    };
  });
}

export async function generateCustomerMessage(business: StoredBusiness, input: CustomerEngagementInput): Promise<CustomerEngagementResponse> {
  const systemInstruction = `You are GrowthPilot AI's Autonomous Customer Engagement & Communication Agent.
Create highly personalized, empathetic, and persuasive messages for customers and leads based on their relationship stage, industry, and the chosen communication tone.`;

  const prompt = `Generate a ${input.messageType} message with a ${input.tone} tone:
Business: ${business.businessName} (${business.industry})
Products/Services: ${business.products}
Recipient: ${input.leadOrCustomerName} ${input.companyName ? `(${input.companyName})` : ''}
Message Stage: ${input.messageType}
Preferred Tone: ${input.tone}
Specific Context: ${input.specificContext || 'General inquiry regarding custom products and bulk delivery'}
Channel: ${input.channel || 'Email'}

Return a valid JSON object:
{
  "messageType": "${input.messageType}",
  "tone": "${input.tone}",
  "subjectLine": "Compelling subject line (if email)",
  "formattedMessage": "Complete ready-to-send message body with proper spacing, salutation, and signoff",
  "suggestedAttachmentsOrOffers": ["Digital Mockup PDF", "Volume Tier Pricing Sheet"],
  "recommendedSendTiming": "Best day and time to send",
  "proTipsForClosing": ["Pro tip 1 for maximizing response rate", "Pro tip 2 on handling hesitations"],
  "generatedAt": "${new Date().toISOString()}"
}`;

  return generateStructuredAI<CustomerEngagementResponse>(prompt, systemInstruction, () => {
    const firstName = input.leadOrCustomerName.split(' ')[0] || 'there';
    const biz = business.businessName;

    let subject = '';
    let body = '';

    if (input.messageType === 'Welcome') {
      subject = `Welcome to ${biz} – Let's bring your ideas to life!`;
      body = `Hi ${firstName},\n\nThank you for connecting with us at ${biz}! We're thrilled to partner with you on your upcoming projects.\n\nWhether you need customized ${business.products} for an upcoming event, team rollout, or brand launch, we make the entire process effortless with 48-hour turnarounds and guaranteed print craftsmanship.\n\nI’ve reserved a complimentary digital proof mockup for your brand. Whenever you’re ready, feel free to reply directly to this message or share your logo artwork.\n\nBest regards,\nThe ${biz} Team`;
    } else if (input.messageType === 'Follow-up') {
      subject = `Quick update on your inquiry with ${biz} (${input.companyName || 'your project'})`;
      body = `Hi ${firstName},\n\nI wanted to follow up on your recent inquiry regarding ${business.products}.\n\nWe know that project timelines can be tight, so we’ve put together a preliminary volume pricing tier and digital proof preview to help your team review options quickly.\n\nWould you have 5 minutes this week for a quick check-in, or would you like me to send over the PDF mockup directly?\n\nWarmly,\n${biz} Growth Concierge`;
    } else if (input.messageType === 'Re-engagement') {
      subject = `Special VIP incentive for ${input.companyName || firstName} – exclusive 10% credit`;
      body = `Hi ${firstName},\n\nIt’s been a little while since we last spoke, and I wanted to check in on how things are going with ${input.companyName || 'your upcoming plans'}.\n\nWe're currently preparing our next production schedule and would love to offer you an exclusive 10% credit and complimentary rush delivery on your next order of ${business.products}.\n\nIf you have an upcoming launch or event on the horizon, reply with "QUOTE" and I’ll have pricing ready for you within 2 hours.\n\nCheers,\n${biz}`;
    } else if (input.messageType === 'Upselling') {
      subject = `Elevate your ${input.companyName || 'team'} merchandise with our complete VIP package`;
      body = `Hi ${firstName},\n\nWe love the positive feedback on your recent orders! Many of our partner organizations who ordered ${business.products} found that bundling with our custom eco-totes and embroidered caps increased their member engagement by over 40%.\n\nBecause you're an existing valued partner, we can add these companion items to your next run at our direct wholesale partner rate with zero extra setup fees.\n\nLet me know if you'd like to see a digital sample mockup of the full set!\n\nBest,\n${biz}`;
    } else {
      // Thank-you
      subject = `Thank you from the ${biz} team! ✨`;
      body = `Hi ${firstName},\n\nWe wanted to send a heartfelt thank you for choosing ${biz}! It was an absolute pleasure crafting your order of ${business.products}.\n\nOur top priority is making sure everything arrived exactly to your specifications. If there is anything else you need or if you'd like to save your print specs for effortless 1-click re-orders in the future, we are always here for you.\n\nThank you for trusting us with your brand!\n\nWarmest regards,\nThe ${biz} Team`;
    }

    return {
      messageType: input.messageType,
      tone: input.tone,
      subjectLine: subject,
      formattedMessage: body,
      suggestedAttachmentsOrOffers: [
        'High-Resolution Digital Proof Mockup',
        'Direct 1-Click Quote & Deposit Link',
        'Eco-Friendly Material Certification Sheet'
      ],
      recommendedSendTiming: 'Tuesday or Thursday morning between 9:00 AM – 11:00 AM',
      proTipsForClosing: [
        'Reference their specific deadline or event name to establish high personal relevance.',
        'Keep the call-to-action low friction (e.g. asking for a simple reply rather than demanding a 30-min call).'
      ],
      generatedAt: new Date().toISOString(),
    };
  });
}
