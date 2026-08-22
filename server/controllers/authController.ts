import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db, StoredUser } from '../config/db';
import { generateToken, AuthenticatedRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, businessName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = db.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const businessId = `biz_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    const newUser: StoredUser = {
      id: userId,
      name,
      email,
      password: hashedPassword,
      businessId,
      createdAt: new Date().toISOString(),
    };

    db.createUser(newUser);

    // If business name was provided at signup, initialize draft business record
    if (businessName) {
      db.createBusiness({
        id: businessId,
        userId,
        businessName,
        industry: 'E-commerce / Retail',
        description: `Small business dedicated to providing high quality products and services.`,
        products: 'Core products & services',
        targetLocation: 'North America / Global',
        targetCustomers: 'Online shoppers and commercial buyers',
        businessGoal: 'Increase inbound leads and grow quarterly revenue',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      businessId: newUser.businessId,
    });

    const business = db.findBusinessByUserId(userId);

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        businessId: newUser.businessId,
      },
      business,
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      businessId: user.businessId,
    });

    const business = db.findBusinessByUserId(user.id);

    return res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        businessId: user.businessId,
      },
      business,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error during login' });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = db.findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const business = db.findBusinessByUserId(userId);

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        businessId: user.businessId,
        createdAt: user.createdAt,
      },
      business: business || null,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Server error fetching user profile' });
  }
};

export const demoLogin = async (_req: Request, res: Response) => {
  try {
    const demoUser = db.findUserByEmail('demo@growthpilot.ai');
    if (!demoUser) {
      return res.status(404).json({ error: 'Demo user not found' });
    }

    const token = generateToken({
      id: demoUser.id,
      email: demoUser.email,
      name: demoUser.name,
      businessId: demoUser.businessId,
    });

    const business = db.findBusinessByUserId(demoUser.id);

    return res.json({
      message: 'Logged in as Demo User',
      token,
      user: {
        id: demoUser.id,
        name: demoUser.name,
        email: demoUser.email,
        businessId: demoUser.businessId,
      },
      business,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Error processing demo login' });
  }
};
