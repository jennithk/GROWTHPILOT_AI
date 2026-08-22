import {
  User,
  Business,
  Lead,
  GrowthStrategyData,
  NextBestActionData,
  CampaignData,
  CustomerMessageData,
  GrowthInsightsData,
  DashboardSummary,
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('growthpilot_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Health
  checkHealth: () => request<{ status: string; geminiConfigured: boolean }>('/health'),

  // Auth
  register: (payload: { name: string; email: string; password: string; businessName?: string }) =>
    request<{ message: string; token: string; user: User; business?: Business }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    request<{ message: string; token: string; user: User; business?: Business }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  demoLogin: () =>
    request<{ message: string; token: string; user: User; business?: Business }>('/auth/demo-login', {
      method: 'POST',
    }),

  getMe: () => request<{ user: User; business: Business | null }>('/auth/me'),

  // Business
  getBusinessProfile: () => request<Business>('/business/profile'),
  saveBusinessProfile: (profile: Partial<Business>) =>
    request<{ message: string; business: Business }>('/business/profile', {
      method: 'POST',
      body: JSON.stringify(profile),
    }),
  resetSampleData: () => request<{ message: string; leads: Lead[] }>('/business/reset-sample-data', { method: 'POST' }),

  // Leads
  getLeads: (params?: { status?: string; category?: string; search?: string; source?: string; sortBy?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.source) query.append('source', params.source);
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    const qs = query.toString();
    return request<Lead[]>(`/leads${qs ? `?${qs}` : ''}`);
  },

  getLeadById: (id: string) => request<Lead>(`/leads/${id}`),

  createLead: (lead: Partial<Lead>) =>
    request<Lead>('/leads', {
      method: 'POST',
      body: JSON.stringify(lead),
    }),

  updateLead: (id: string, updates: Partial<Lead>) =>
    request<Lead>(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  deleteLead: (id: string) =>
    request<{ message: string; id: string }>(`/leads/${id}`, {
      method: 'DELETE',
    }),

  // AI Agent Workflows
  generateGrowthStrategy: (customContext?: Partial<Business>) =>
    request<GrowthStrategyData>('/ai/growth-strategy', {
      method: 'POST',
      body: JSON.stringify(customContext || {}),
    }),

  analyzeLeadWithAI: (leadId?: string, leadData?: Partial<Lead>) =>
    request<{ leadId: string; analysis: Lead['aiAnalysis'] }>('/ai/analyze-lead', {
      method: 'POST',
      body: JSON.stringify({ leadId, leadData }),
    }),

  getNextBestAction: (leadId?: string) =>
    request<NextBestActionData>('/ai/next-best-action', {
      method: 'POST',
      body: JSON.stringify({ leadId }),
    }),

  generateCampaign: (params: {
    campaignGoal: string;
    productService: string;
    targetAudience: string;
    platform: string;
  }) =>
    request<CampaignData>('/ai/generate-campaign', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  generateCustomerMessage: (params: {
    leadOrCustomerName: string;
    companyName?: string;
    messageType: string;
    tone: string;
    specificContext?: string;
    channel?: string;
  }) =>
    request<CustomerMessageData>('/ai/customer-message', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  generateGrowthInsights: () =>
    request<GrowthInsightsData>('/ai/growth-insights', {
      method: 'POST',
    }),

  getAIHistory: (type?: string) =>
    request<any[]>(`/ai/history${type ? `?type=${type}` : ''}`),

  // Analytics
  getDashboardAnalytics: () => request<DashboardSummary>('/analytics/dashboard'),
};
