import { Response } from 'express';
import { db } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

export const getBusinessProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const business = db.findBusinessByUserId(userId);

    if (!business) {
      return res.status(404).json({ error: 'Business profile not found. Please complete onboarding.' });
    }

    return res.json(business);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve business profile' });
  }
};

export const saveBusinessProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      businessName,
      industry,
      description,
      products,
      targetLocation,
      targetCustomers,
      businessGoal,
    } = req.body;

    if (!businessName || !industry || !description || !products || !targetCustomers || !businessGoal) {
      return res.status(400).json({
        error: 'Please fill in all required fields (business name, industry, description, products, target customers, and goal)',
      });
    }

    let business = db.findBusinessByUserId(userId);

    if (business) {
      business = db.updateBusiness(userId, {
        businessName,
        industry,
        description,
        products,
        targetLocation: targetLocation || 'Global',
        targetCustomers,
        businessGoal,
      });
    } else {
      const businessId = `biz_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      business = db.createBusiness({
        id: businessId,
        userId,
        businessName,
        industry,
        description,
        products,
        targetLocation: targetLocation || 'Global',
        targetCustomers,
        businessGoal,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      db.updateUser(userId, { businessId });
    }

    return res.json({
      message: 'Business profile saved successfully',
      business,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to save business profile' });
  }
};

export const resetSampleData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const business = db.findBusinessByUserId(userId);
    db.resetToSampleData(userId, business?.businessName);
    const updatedLeads = db.getLeadsByUserId(userId);

    return res.json({
      message: 'Sample leads and pipeline refreshed successfully',
      leads: updatedLeads,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to reset sample data' });
  }
};
