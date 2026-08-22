import { Response } from 'express';
import { db, StoredLead } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

export const getLeads = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    let leads = db.getLeadsByUserId(userId);

    const { status, category, search, source, sortBy } = req.query;

    if (status && status !== 'All') {
      leads = leads.filter(l => l.status.toLowerCase() === (status as string).toLowerCase());
    }

    if (category && category !== 'All') {
      leads = leads.filter(l => l.aiCategory?.toLowerCase() === (category as string).toLowerCase());
    }

    if (source && source !== 'All') {
      leads = leads.filter(l => l.source.toLowerCase() === (source as string).toLowerCase());
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      leads = leads.filter(
        l =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q) ||
          l.interest.toLowerCase().includes(q) ||
          l.notes.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'score_desc') {
      leads.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
    } else if (sortBy === 'score_asc') {
      leads.sort((a, b) => (a.aiScore || 0) - (b.aiScore || 0));
    } else if (sortBy === 'name') {
      leads.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default: newest first
      leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return res.json(leads);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch leads' });
  }
};

export const getLeadById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const lead = db.getLeadById(id, userId);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    return res.json(lead);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch lead' });
  }
};

export const createLead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { name, email, phone, company, source, interest, notes, status } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required for a lead' });
    }

    const newLead: StoredLead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId,
      name,
      email,
      phone: phone || '',
      company: company || '',
      source: source || 'Website',
      interest: interest || '',
      notes: notes || '',
      status: status || 'New',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = db.createLead(newLead);
    return res.status(201).json(saved);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create lead' });
  }
};

export const updateLead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const updates = req.body;

    const updated = db.updateLead(id, userId, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Lead not found or permission denied' });
    }

    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update lead' });
  }
};

export const deleteLead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const success = db.deleteLead(id, userId);
    if (!success) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    return res.json({ message: 'Lead deleted successfully', id });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete lead' });
  }
};
