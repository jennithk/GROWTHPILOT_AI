import { Response } from 'express';
import { db } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

export const getDashboardAnalytics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const leads = db.getLeadsByUserId(userId);
    const business = db.findBusinessByUserId(userId);
    const analyses = db.getAnalysesByUserId(userId);

    const totalLeads = leads.length;
    const hotLeads = leads.filter(l => l.aiCategory === 'Hot' || (l.aiScore && l.aiScore >= 80));
    const warmLeads = leads.filter(l => l.aiCategory === 'Warm' || (l.aiScore && l.aiScore >= 50 && l.aiScore < 80));
    const coldLeads = leads.filter(l => l.aiCategory === 'Cold' || (l.aiScore && l.aiScore < 50));
    const unScoredLeads = leads.filter(l => !l.aiScore && !l.aiCategory);

    const statusCounts = {
      New: leads.filter(l => l.status === 'New').length,
      Contacted: leads.filter(l => l.status === 'Contacted').length,
      Qualified: leads.filter(l => l.status === 'Qualified').length,
      Converted: leads.filter(l => l.status === 'Converted').length,
      Lost: leads.filter(l => l.status === 'Lost').length,
    };

    const sourceCounts: Record<string, number> = {};
    leads.forEach(l => {
      const src = l.source || 'Website';
      sourceCounts[src] = (sourceCounts[src] || 0) + 1;
    });

    const conversionRate = totalLeads > 0 ? Math.round((statusCounts.Converted / totalLeads) * 100) : 0;
    const qualifiedRate = totalLeads > 0 ? Math.round(((statusCounts.Qualified + statusCounts.Converted) / totalLeads) * 100) : 0;

    // Build intelligent daily AI growth recommendations
    const recommendations = [];

    // 1. Check for urgent Hot leads
    if (hotLeads.length > 0) {
      const topHot = hotLeads[0];
      recommendations.push({
        id: 'rec_hot_lead',
        type: 'lead_followup',
        title: `High-Priority Follow-Up: ${topHot.name} (${topHot.company || 'Hot Lead'})`,
        description: topHot.aiAnalysis?.nextBestAction || `Lead score is ${topHot.aiScore || 88}/100. Reach out to secure agreement today.`,
        priority: 'Urgent',
        actionLabel: 'View Lead & Message',
        targetTab: 'leads',
        leadId: topHot.id,
      });
    }

    // 2. Check for untouched new leads
    if (statusCounts.New > 0) {
      recommendations.push({
        id: 'rec_new_leads',
        type: 'pipeline',
        title: `${statusCounts.New} Uncontacted New Leads Awaiting Outreach`,
        description: 'Engage new inquiries within the first 4 hours to increase conversion probability by up to 300%.',
        priority: 'High',
        actionLabel: 'Score & Qualify Leads',
        targetTab: 'leads',
      });
    }

    // 3. Campaign recommendation
    recommendations.push({
      id: 'rec_campaign',
      type: 'campaign',
      title: `Launch Targeted Multi-Channel Campaign for ${business?.industry || 'Your Market'}`,
      description: `Generate a tailored 3-day promotional sequence to capture active buyers across Instagram, LinkedIn, and Email.`,
      priority: 'Medium',
      actionLabel: 'Open Campaign Generator',
      targetTab: 'campaigns',
    });

    // 4. Stale/Warm re-engagement
    if (warmLeads.length > 0) {
      recommendations.push({
        id: 'rec_reengage',
        type: 'reengagement',
        title: `Offer VIP Volume Tier to ${warmLeads.length} Warm Prospects`,
        description: `Deliver personalized sample proof mockups or a limited 10% credit to accelerate pending purchase decisions.`,
        priority: 'Medium',
        actionLabel: 'Launch Customer Engagement',
        targetTab: 'engagement',
      });
    }

    const aiStats = {
      totalAnalysesGenerated: analyses.length,
      strategiesRun: analyses.filter(a => a.analysisType === 'growth-strategy').length,
      leadsScored: analyses.filter(a => a.analysisType === 'lead-scoring').length,
      campaignsCreated: analyses.filter(a => a.analysisType === 'campaign').length,
      messagesCrafted: analyses.filter(a => a.analysisType === 'customer-message').length,
      insightsGenerated: analyses.filter(a => a.analysisType === 'growth-insights').length,
    };

    return res.json({
      summary: {
        totalLeads,
        hotLeadsCount: hotLeads.length,
        warmLeadsCount: warmLeads.length,
        coldLeadsCount: coldLeads.length,
        unScoredCount: unScoredLeads.length,
        conversionRate,
        qualifiedRate,
        convertedCount: statusCounts.Converted,
      },
      statusDistribution: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
      categoryDistribution: [
        { category: 'Hot (80-100)', count: hotLeads.length, fill: '#ef4444' },
        { category: 'Warm (50-79)', count: warmLeads.length, fill: '#f59e0b' },
        { category: 'Cold (<50)', count: coldLeads.length, fill: '#3b82f6' },
      ],
      sourceDistribution: Object.entries(sourceCounts).map(([source, count]) => ({ source, count })),
      recentLeads: leads.slice(0, 5),
      recommendations,
      aiStats,
    });
  } catch (err: any) {
    console.error('Analytics error:', err);
    return res.status(500).json({ error: 'Failed to fetch dashboard analytics' });
  }
};
