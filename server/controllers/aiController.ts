import { Response } from 'express';
import { db } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { generateGrowthStrategy, generateGrowthInsights } from '../services/growthAgent';
import {
  analyzeLead,
  getNextBestAction,
  generateCampaign,
  generateCustomerMessage,
} from '../services/leadAgent';

export const postGrowthStrategy = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    let business = db.findBusinessByUserId(userId);

    if (!business) {
      // Use fallback starter profile if user hasn't finished onboarding yet
      business = {
        id: `biz_${userId}`,
        userId,
        businessName: req.body.businessName || 'My Startup Business',
        industry: req.body.industry || 'E-Commerce / B2B Services',
        description: req.body.description || 'Providing modern products & services for demanding clients.',
        products: req.body.products || 'Core products and bespoke solutions',
        targetLocation: req.body.targetLocation || 'North America & Global',
        targetCustomers: req.body.targetCustomers || 'Small businesses, professionals, and direct consumers',
        businessGoal: req.body.businessGoal || 'Double qualified inbound leads and expand sales revenue',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.createBusiness(business);
    }

    const result = await generateGrowthStrategy(business);

    db.saveAnalysis({
      id: `ana_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId,
      analysisType: 'growth-strategy',
      result,
      createdAt: new Date().toISOString(),
    });

    return res.json(result);
  } catch (err: any) {
    console.error('Growth strategy error:', err);
    return res.status(500).json({ error: 'Failed to generate growth strategy' });
  }
};

export const postAnalyzeLead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { leadId, leadData } = req.body;

    let lead = leadId ? db.getLeadById(leadId, userId) : null;

    if (!lead && leadData) {
      // Analyze an unsaved or draft lead
      lead = {
        id: `lead_temp_${Date.now()}`,
        userId,
        name: leadData.name || 'Prospect',
        email: leadData.email || 'prospect@example.com',
        phone: leadData.phone || '',
        company: leadData.company || '',
        source: leadData.source || 'Website',
        interest: leadData.interest || '',
        notes: leadData.notes || '',
        status: leadData.status || 'New',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found or invalid data provided' });
    }

    let business = db.findBusinessByUserId(userId);
    if (!business) {
      business = {
        id: `biz_${userId}`,
        userId,
        businessName: 'GrowthPilot Business',
        industry: 'Services / Products',
        description: 'Quality commercial offerings',
        products: 'Services & Products',
        targetLocation: 'Global',
        targetCustomers: 'Commercial buyers',
        businessGoal: 'Increase conversions',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const analysisResult = await analyzeLead(business, lead);

    // If lead exists in DB, update with calculated AI scores
    if (leadId && lead.id === leadId) {
      db.updateLead(leadId, userId, {
        aiScore: analysisResult.leadScore,
        aiCategory: analysisResult.category,
        aiAnalysis: {
          leadScore: analysisResult.leadScore,
          category: analysisResult.category,
          purchaseIntent: analysisResult.purchaseIntent,
          customerNeed: analysisResult.customerNeed,
          nextBestAction: analysisResult.recommendedAction,
          priority: analysisResult.priority,
          followUpTime: analysisResult.followUpTime,
          followUpMessage: analysisResult.followUpMessage,
          analyzedAt: analysisResult.analyzedAt,
        },
      });
    }

    db.saveAnalysis({
      id: `ana_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId,
      leadId: lead.id,
      analysisType: 'lead-scoring',
      result: analysisResult,
      createdAt: new Date().toISOString(),
    });

    return res.json({
      leadId: lead.id,
      analysis: analysisResult,
    });
  } catch (err: any) {
    console.error('Lead analysis error:', err);
    return res.status(500).json({ error: 'Failed to analyze lead' });
  }
};

export const postNextBestAction = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { leadId } = req.body;

    let lead = leadId ? db.getLeadById(leadId, userId) : null;
    const allLeads = db.getLeadsByUserId(userId);

    if (!lead) {
      // Pick highest priority lead that needs action
      lead = allLeads.find(l => l.status !== 'Converted' && l.status !== 'Lost') || allLeads[0];
    }

    if (!lead) {
      return res.status(400).json({ error: 'No leads available to evaluate next best action' });
    }

    let business = db.findBusinessByUserId(userId);
    if (!business) {
      business = {
        id: `biz_${userId}`,
        userId,
        businessName: 'GrowthPilot Business',
        industry: 'Services / Products',
        description: 'Quality commercial offerings',
        products: 'Services & Products',
        targetLocation: 'Global',
        targetCustomers: 'Commercial buyers',
        businessGoal: 'Increase conversions',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const actionResult = await getNextBestAction(business, lead);

    db.saveAnalysis({
      id: `ana_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId,
      leadId: lead.id,
      analysisType: 'next-best-action',
      result: actionResult,
      createdAt: new Date().toISOString(),
    });

    return res.json(actionResult);
  } catch (err: any) {
    console.error('Next best action error:', err);
    return res.status(500).json({ error: 'Failed to calculate next best action' });
  }
};

export const postGenerateCampaign = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { campaignGoal, productService, targetAudience, platform } = req.body;

    if (!campaignGoal || !productService) {
      return res.status(400).json({ error: 'Campaign goal and product/service are required' });
    }

    let business = db.findBusinessByUserId(userId);
    if (!business) {
      business = {
        id: `biz_${userId}`,
        userId,
        businessName: 'GrowthPilot Business',
        industry: 'E-commerce & Services',
        description: 'High quality offerings',
        products: productService || 'Custom products',
        targetLocation: 'Global',
        targetCustomers: targetAudience || 'Target customers',
        businessGoal: campaignGoal || 'Grow sales',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const campaign = await generateCampaign(business, {
      campaignGoal,
      productService,
      targetAudience: targetAudience || business.targetCustomers,
      platform: platform || 'Instagram',
    });

    db.saveAnalysis({
      id: `ana_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId,
      analysisType: 'campaign',
      result: campaign,
      createdAt: new Date().toISOString(),
    });

    return res.json(campaign);
  } catch (err: any) {
    console.error('Campaign generation error:', err);
    return res.status(500).json({ error: 'Failed to generate campaign' });
  }
};

export const postCustomerMessage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { leadOrCustomerName, companyName, messageType, tone, specificContext, channel } = req.body;

    if (!leadOrCustomerName || !messageType) {
      return res.status(400).json({ error: 'Recipient name and message type are required' });
    }

    let business = db.findBusinessByUserId(userId);
    if (!business) {
      business = {
        id: `biz_${userId}`,
        userId,
        businessName: 'GrowthPilot Partner',
        industry: 'Commercial Business',
        description: 'Customer-centric offerings',
        products: 'Premium products & services',
        targetLocation: 'Global',
        targetCustomers: 'Valued clients',
        businessGoal: 'Exceptional client satisfaction and repeat sales',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const result = await generateCustomerMessage(business, {
      leadOrCustomerName,
      companyName,
      messageType: messageType || 'Follow-up',
      tone: tone || 'Professional',
      specificContext,
      channel: channel || 'Email',
    });

    db.saveAnalysis({
      id: `ana_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId,
      analysisType: 'customer-message',
      result,
      createdAt: new Date().toISOString(),
    });

    return res.json(result);
  } catch (err: any) {
    console.error('Customer message error:', err);
    return res.status(500).json({ error: 'Failed to generate message' });
  }
};

export const postGrowthInsights = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    let business = db.findBusinessByUserId(userId);
    const leads = db.getLeadsByUserId(userId);

    if (!business) {
      business = {
        id: `biz_${userId}`,
        userId,
        businessName: 'My Enterprise',
        industry: 'Growth Business',
        description: 'Scaling small business',
        products: 'Services & Products',
        targetLocation: 'Global',
        targetCustomers: 'Prospective clients',
        businessGoal: 'Scale pipeline and close deals faster',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const insights = await generateGrowthInsights(business, leads);

    db.saveAnalysis({
      id: `ana_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId,
      analysisType: 'growth-insights',
      result: insights,
      createdAt: new Date().toISOString(),
    });

    return res.json(insights);
  } catch (err: any) {
    console.error('Growth insights error:', err);
    return res.status(500).json({ error: 'Failed to generate growth insights' });
  }
};

export const getAnalysesHistory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { type } = req.query;

    const history = db.getAnalysesByUserId(userId, type as string | undefined);
    return res.json(history);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch AI analysis history' });
  }
};
