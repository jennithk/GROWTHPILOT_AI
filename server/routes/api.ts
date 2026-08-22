import { Router } from 'express';
import { register, login, getMe, demoLogin } from '../controllers/authController';
import { getBusinessProfile, saveBusinessProfile, resetSampleData } from '../controllers/businessController';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
} from '../controllers/leadController';
import {
  postGrowthStrategy,
  postAnalyzeLead,
  postNextBestAction,
  postGenerateCampaign,
  postCustomerMessage,
  postGrowthInsights,
  getAnalysesHistory,
} from '../controllers/aiController';
import { getDashboardAnalytics } from '../controllers/analyticsController';
import { authMiddleware } from '../middleware/auth';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'GrowthPilot AI Backend Service',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
  });
});

// Authentication Routes (Public)
apiRouter.post('/auth/register', register);
apiRouter.post('/auth/login', login);
apiRouter.post('/auth/demo-login', demoLogin);

// Protected User & Business Routes
apiRouter.get('/auth/me', authMiddleware, getMe);
apiRouter.get('/business/profile', authMiddleware, getBusinessProfile);
apiRouter.post('/business/profile', authMiddleware, saveBusinessProfile);
apiRouter.post('/business/reset-sample-data', authMiddleware, resetSampleData);

// Protected Lead Management Routes
apiRouter.get('/leads', authMiddleware, getLeads);
apiRouter.get('/leads/:id', authMiddleware, getLeadById);
apiRouter.post('/leads', authMiddleware, createLead);
apiRouter.put('/leads/:id', authMiddleware, updateLead);
apiRouter.delete('/leads/:id', authMiddleware, deleteLead);

// Protected AI Growth Agent Workflows
apiRouter.post('/ai/growth-strategy', authMiddleware, postGrowthStrategy);
apiRouter.post('/ai/analyze-lead', authMiddleware, postAnalyzeLead);
apiRouter.post('/ai/next-best-action', authMiddleware, postNextBestAction);
apiRouter.post('/ai/generate-campaign', authMiddleware, postGenerateCampaign);
apiRouter.post('/ai/customer-message', authMiddleware, postCustomerMessage);
apiRouter.post('/ai/growth-insights', authMiddleware, postGrowthInsights);
apiRouter.get('/ai/history', authMiddleware, getAnalysesHistory);

// Analytics & Recommendations
apiRouter.get('/analytics/dashboard', authMiddleware, getDashboardAnalytics);
