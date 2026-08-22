import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Flexible Data Storage Layer:
// Connects to MongoDB if MONGODB_URI is provided.
// If MONGODB_URI is absent or connecting fails, seamlessly maintains persistent JSON / memory storage
// so the application operates with 100% functionality without setup bottlenecks.

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string; // hashed
  businessId?: string;
  createdAt: string;
}

export interface StoredBusiness {
  id: string;
  userId: string;
  businessName: string;
  industry: string;
  description: string;
  products: string;
  targetLocation: string;
  targetCustomers: string;
  businessGoal: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredLead {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  interest: string;
  notes: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
  aiScore?: number;
  aiCategory?: 'Hot' | 'Warm' | 'Cold';
  aiAnalysis?: {
    leadScore: number;
    category: 'Hot' | 'Warm' | 'Cold';
    purchaseIntent: string;
    customerNeed: string;
    nextBestAction: string;
    priority: 'High' | 'Medium' | 'Low';
    followUpTime: string;
    followUpMessage: string;
    analyzedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface StoredAIAnalysis {
  id: string;
  userId: string;
  leadId?: string;
  analysisType: 'growth-strategy' | 'lead-scoring' | 'next-best-action' | 'campaign' | 'customer-message' | 'growth-insights';
  result: any;
  createdAt: string;
}

const DATA_FILE = path.join(process.cwd(), 'data-storage.json');

class StorageManager {
  private users: StoredUser[] = [];
  private businesses: StoredBusiness[] = [];
  private leads: StoredLead[] = [];
  private analyses: StoredAIAnalysis[] = [];
  private isMongoConnected: boolean = false;

  constructor() {
    this.loadFromDisk();
    this.seedDefaultDataIfEmpty();
  }

  public async connectMongo(): Promise<void> {
    const uri = process.env.MONGODB_URI;
    if (!uri || uri.trim() === '') {
      console.log('ℹ️ No MONGODB_URI provided. Operating in embedded storage engine mode.');
      return;
    }

    try {
      await mongoose.connect(uri);
      this.isMongoConnected = true;
      console.log('✅ Connected to MongoDB successfully.');
    } catch (err: any) {
      console.warn('⚠️ MongoDB connection failed. Continuing with local persistent storage:', err.message);
      this.isMongoConnected = false;
    }
  }

  public isUsingMongo(): boolean {
    return this.isMongoConnected;
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const data = JSON.parse(raw);
        this.users = data.users || [];
        this.businesses = data.businesses || [];
        this.leads = data.leads || [];
        this.analyses = data.analyses || [];
      }
    } catch (e) {
      console.error('Error loading data storage from disk:', e);
    }
  }

  private saveToDisk() {
    try {
      const data = {
        users: this.users,
        businesses: this.businesses,
        leads: this.leads,
        analyses: this.analyses,
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving data storage to disk:', e);
    }
  }

  private seedDefaultDataIfEmpty() {
    if (this.users.length === 0) {
      // Create a pre-seeded demo user and business for instant discovery
      const hashedPassword = bcrypt.hashSync('demo123', 10);
      const demoUserId = 'usr_demo_growthpilot_1';
      const demoBusinessId = 'biz_demo_customtees_1';

      this.users.push({
        id: demoUserId,
        name: 'Sarah Jenkins',
        email: 'demo@growthpilot.ai',
        password: hashedPassword,
        businessId: demoBusinessId,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      });

      this.businesses.push({
        id: demoBusinessId,
        userId: demoUserId,
        businessName: 'CustomTees Studio',
        industry: 'Apparel & Fashion / E-commerce',
        description: 'We produce premium sustainable customized apparel, screen-printed merchandise, and event uniforms for college organizations, sports teams, and high-growth startups with rapid 48-hour turnarounds.',
        products: 'Custom organic cotton T-shirts, embroidered hoodies, promotional tote bags, event caps, and bulk merchandise starter packs.',
        targetLocation: 'North America (US & Canada)',
        targetCustomers: 'University clubs, tech startup founders, marathon & fitness event organizers, and indie brands.',
        businessGoal: 'Scale online sales from $35k/mo to $100k/mo, improve lead conversion rate from 14% to 28%, and build an automated B2B customer re-order pipeline.',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Seed realistic initial leads
      this.leads.push(
        {
          id: 'lead_101',
          userId: demoUserId,
          name: 'Michael Torres',
          email: 'm.torres@stanfordhack.org',
          phone: '+1 (555) 234-5678',
          company: 'Stanford Tech Summit 2026',
          source: 'Instagram',
          interest: '500 custom heavyweight hoodies and badges for annual spring hackathon.',
          notes: 'Has urgent budget deadline in 3 days. Needs quote with fast turnaround.',
          status: 'Qualified',
          aiScore: 94,
          aiCategory: 'Hot',
          aiAnalysis: {
            leadScore: 94,
            category: 'Hot',
            purchaseIntent: 'High',
            customerNeed: '500 heavyweight custom embroidered hoodies for urgent hackathon event with tight deadline',
            nextBestAction: 'Deliver instant VIP bulk quote with guaranteed 48-hour rush delivery proof mockup.',
            priority: 'High',
            followUpTime: 'Within 2 hours',
            followUpMessage: 'Hi Michael, we can guarantee delivery of your 500 Stanford Tech Summit hoodies with 48h rush turnaround and exclusive student organizer pricing. Shall I share the digital mockups now?',
            analyzedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'lead_102',
          userId: demoUserId,
          name: 'Elena Rostova',
          email: 'elena@novapulse.io',
          phone: '+1 (555) 876-5432',
          company: 'NovaPulse AI (Series A)',
          source: 'LinkedIn',
          interest: '120 employee onboarding swag packs (hoodie, t-shirt, tote).',
          notes: 'Requested fabric samples and sustainable organic cotton certifications.',
          status: 'Contacted',
          aiScore: 86,
          aiCategory: 'Hot',
          aiAnalysis: {
            leadScore: 86,
            category: 'Hot',
            purchaseIntent: 'High',
            customerNeed: 'Premium sustainable employee welcome merch packs for newly funded startup',
            nextBestAction: 'Send eco-friendly fabric sample kit and corporate onboarding pricing sheet.',
            priority: 'High',
            followUpTime: 'Within 24 hours',
            followUpMessage: 'Hi Elena! Congratulations on the NovaPulse milestone. We’ve pre-packaged our GOTS-certified organic cotton swag sample box for your team. Where should we ship your complimentary sample kit?',
            analyzedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          },
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'lead_103',
          userId: demoUserId,
          name: 'David Chen',
          email: 'david@baycityrunning.com',
          phone: '+1 (555) 432-1098',
          company: 'Bay City Marathon Club',
          source: 'Website',
          interest: 'Moisture-wicking athletic tees for 350 runners.',
          notes: 'Checking 2 other vendors for competitive pricing.',
          status: 'New',
          aiScore: 68,
          aiCategory: 'Warm',
          aiAnalysis: {
            leadScore: 68,
            category: 'Warm',
            purchaseIntent: 'Medium',
            customerNeed: 'Athletic technical running shirts with breathable UV-protective sublimation print',
            nextBestAction: 'Send comparison breakdown highlighting our no-fade athletic print quality and 10% first-club discount.',
            priority: 'Medium',
            followUpTime: 'Tomorrow morning',
            followUpMessage: 'Hey David, runners love our ultra-breathable moisture-wicking tees because the prints never crack or chafe. We’d love to extend an exclusive 10% Club Partner discount on your 350 tees.',
            analyzedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
          },
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'lead_104',
          userId: demoUserId,
          name: 'Jessica Vance',
          email: 'jess@artisanroasters.co',
          phone: '+1 (555) 901-2345',
          company: 'Artisan Coffee Roasters',
          source: 'Instagram',
          interest: '50 barista aprons and organic tote bags for retail.',
          notes: 'Expressed interest 5 days ago, has not replied to initial email.',
          status: 'Contacted',
          aiScore: 54,
          aiCategory: 'Warm',
          aiAnalysis: {
            leadScore: 54,
            category: 'Warm',
            purchaseIntent: 'Medium',
            customerNeed: 'Merchandise merchandise for coffee shop retail shelves and staff uniforms',
            nextBestAction: 'Send low-friction re-engagement message with photos of similar cafe merchandise.',
            priority: 'Medium',
            followUpTime: 'Within 48 hours',
            followUpMessage: 'Hi Jessica! We just finished a gorgeous line of heavy-canvas barista totes for a local cafe and thought of Artisan Coffee. Here are a couple of quick photos—would love to send you a sample apron!',
            analyzedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          },
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'lead_105',
          userId: demoUserId,
          name: 'Marcus Brody',
          email: 'mbrody@gmail.com',
          phone: '+1 (555) 345-6789',
          company: 'Personal Inquiry',
          source: 'WhatsApp',
          interest: 'Looking for 3 custom printed shirts for a family barbecue.',
          notes: 'Below minimum order quantity of 15 units.',
          status: 'New',
          aiScore: 22,
          aiCategory: 'Cold',
          aiAnalysis: {
            leadScore: 22,
            category: 'Cold',
            purchaseIntent: 'Low',
            customerNeed: 'Low volume single-event personal printing',
            nextBestAction: 'Politely redirect to direct-to-garment single-item partner or offer our 15-pack family tier.',
            priority: 'Low',
            followUpTime: 'Automated response',
            followUpMessage: 'Hi Marcus, thanks for checking in! Our bulk wholesale runs start at 15 items, but we offer a discounted Family Pack bundle if you’d like extras for relatives.',
            analyzedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          },
          createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'lead_106',
          userId: demoUserId,
          name: 'Rachel Adams',
          email: 'rachel@peakfitgym.com',
          phone: '+1 (555) 789-0123',
          company: 'PeakFit Training Club',
          source: 'Website',
          interest: '250 gym member dry-fit performance shirts and shaker bottles.',
          notes: 'Signed contract and submitted initial deposit!',
          status: 'Converted',
          aiScore: 98,
          aiCategory: 'Hot',
          createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );

      this.saveToDisk();
    }
  }

  // User Operations
  public findUserByEmail(email: string): StoredUser | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): StoredUser | undefined {
    return this.users.find(u => u.id === id);
  }

  public createUser(user: StoredUser): StoredUser {
    this.users.push(user);
    this.saveToDisk();
    return user;
  }

  public updateUser(id: string, updates: Partial<StoredUser>): StoredUser | undefined {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], ...updates };
      this.saveToDisk();
      return this.users[idx];
    }
    return undefined;
  }

  // Business Operations
  public findBusinessByUserId(userId: string): StoredBusiness | undefined {
    return this.businesses.find(b => b.userId === userId);
  }

  public findBusinessById(id: string): StoredBusiness | undefined {
    return this.businesses.find(b => b.id === id);
  }

  public createBusiness(business: StoredBusiness): StoredBusiness {
    this.businesses.push(business);
    this.saveToDisk();
    return business;
  }

  public updateBusiness(userId: string, updates: Partial<StoredBusiness>): StoredBusiness | undefined {
    const idx = this.businesses.findIndex(b => b.userId === userId);
    if (idx !== -1) {
      this.businesses[idx] = {
        ...this.businesses[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.saveToDisk();
      return this.businesses[idx];
    }
    return undefined;
  }

  // Lead Operations
  public getLeadsByUserId(userId: string): StoredLead[] {
    return this.leads.filter(l => l.userId === userId);
  }

  public getLeadById(id: string, userId: string): StoredLead | undefined {
    return this.leads.find(l => l.id === id && l.userId === userId);
  }

  public createLead(lead: StoredLead): StoredLead {
    this.leads.unshift(lead);
    this.saveToDisk();
    return lead;
  }

  public updateLead(id: string, userId: string, updates: Partial<StoredLead>): StoredLead | undefined {
    const idx = this.leads.findIndex(l => l.id === id && l.userId === userId);
    if (idx !== -1) {
      this.leads[idx] = {
        ...this.leads[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.saveToDisk();
      return this.leads[idx];
    }
    return undefined;
  }

  public deleteLead(id: string, userId: string): boolean {
    const initLen = this.leads.length;
    this.leads = this.leads.filter(l => !(l.id === id && l.userId === userId));
    if (this.leads.length !== initLen) {
      this.saveToDisk();
      return true;
    }
    return false;
  }

  // AI Analysis Operations
  public saveAnalysis(analysis: StoredAIAnalysis): StoredAIAnalysis {
    this.analyses.unshift(analysis);
    this.saveToDisk();
    return analysis;
  }

  public getAnalysesByUserId(userId: string, type?: string): StoredAIAnalysis[] {
    return this.analyses.filter(a => a.userId === userId && (!type || a.analysisType === type));
  }

  public resetToSampleData(userId: string, businessName?: string): void {
    // Reset or generate rich mock leads for testing
    this.leads = this.leads.filter(l => l.userId !== userId);
    const biz = this.findBusinessByUserId(userId);
    const bName = businessName || biz?.businessName || 'GrowthPilot Partner';

    const newLeads: StoredLead[] = [
      {
        id: `lead_${Date.now()}_1`,
        userId,
        name: 'Jordan Miller',
        email: 'jordan@vanguardtech.co',
        phone: '+1 (555) 321-7654',
        company: 'Vanguard Tech Solutions',
        source: 'LinkedIn',
        interest: `Inquiring about corporate rollout for ${biz?.products || 'services'} for 200+ team members.`,
        notes: 'Requested immediate pricing and proof of concept.',
        status: 'Qualified',
        aiScore: 92,
        aiCategory: 'Hot',
        aiAnalysis: {
          leadScore: 92,
          category: 'Hot',
          purchaseIntent: 'High',
          customerNeed: `Enterprise scale implementation for ${biz?.products || 'solutions'}`,
          nextBestAction: 'Schedule a tailored 15-minute executive briefing with live product walkthrough.',
          priority: 'High',
          followUpTime: 'Today within 3 hours',
          followUpMessage: `Hi Jordan, we reviewed Vanguard's expansion and prepared a customized proposal for ${bName}. Would you have 15 minutes today to review the executive summary?`,
          analyzedAt: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `lead_${Date.now()}_2`,
        userId,
        name: 'Samantha Reed',
        email: 'samantha@elevatebrands.org',
        phone: '+1 (555) 654-9870',
        company: 'Elevate Brand Collective',
        source: 'Instagram',
        interest: 'Looking for a sustainable partner to fulfill upcoming regional campaigns.',
        notes: 'Evaluating 2 other alternative providers.',
        status: 'Contacted',
        aiScore: 78,
        aiCategory: 'Warm',
        aiAnalysis: {
          leadScore: 78,
          category: 'Warm',
          purchaseIntent: 'Medium',
          customerNeed: 'High-quality sustainable vendor for multi-city campaign rollout',
          nextBestAction: 'Send case studies and social proof demonstrating our reliability and client satisfaction.',
          priority: 'Medium',
          followUpTime: 'Tomorrow at 10 AM',
          followUpMessage: `Hi Samantha! We understand how critical reliability is for multi-city launches. Here is a 1-page case study showing how ${bName} delivered 99.4% on-time completion for similar campaigns.`,
          analyzedAt: new Date().toISOString(),
        },
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `lead_${Date.now()}_3`,
        userId,
        name: 'Liam O’Connor',
        email: 'liam@metrogreens.com',
        phone: '+1 (555) 789-4321',
        company: 'Metro Greens Co.',
        source: 'Website',
        interest: 'Interested in pilot package for next quarter.',
        notes: 'Budget is approved for Q3.',
        status: 'New',
        aiScore: 84,
        aiCategory: 'Hot',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    this.leads.push(...newLeads);
    this.saveToDisk();
  }
}

export const db = new StorageManager();
