import { Router, Request, Response } from 'express';
import { db, verifyPassword, hashPassword } from '../db';
import { generateToken, requireAuth, AuthenticatedRequest } from '../auth';

export const authRouter = Router();

// Platform Admin Login (/platform/login)
authRouter.post('/platform/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.getUserByEmail(email);
  if (!user || user.role !== 'PLATFORM_ADMIN') {
    return res.status(401).json({ error: 'Invalid platform administrator credentials.' });
  }

  if (!verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid platform administrator credentials.' });
  }

  if (user.status !== 'ACTIVE') {
    return res.status(403).json({ error: 'Account is deactivated. Please contact support.' });
  }

  const { password_hash, ...cleanUser } = user;
  const token = generateToken(cleanUser);

  db.logAudit({
    clinic_id: null,
    actor_user_id: user.id,
    actor_name: user.name,
    action: 'PLATFORM_ADMIN_LOGIN',
    target_type: 'USER',
    target_id: user.id,
  });

  return res.json({
    token,
    user: cleanUser,
  });
});

// Clinic Login (/login) - shared by Clinic Admin and Clinic Staff
authRouter.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  if (user.role === 'PLATFORM_ADMIN') {
    // If platform admin tries logging in via standard /login, route them cleanly
    if (!verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const { password_hash, ...cleanUser } = user;
    const token = generateToken(cleanUser);
    return res.json({
      token,
      user: cleanUser,
      isPlatformAdmin: true,
    });
  }

  if (!verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  if (user.status !== 'ACTIVE') {
    return res.status(403).json({ error: 'Account is deactivated. Please contact clinic management.' });
  }

  if (!user.clinic_id) {
    return res.status(403).json({ error: 'User is not assigned to a clinic.' });
  }

  const clinic = db.getClinicById(user.clinic_id);
  if (!clinic || clinic.status !== 'ACTIVE') {
    return res.status(403).json({ error: 'Clinic is currently inactive or suspended.' });
  }

  const { password_hash, ...cleanUser } = user;
  const token = generateToken(cleanUser);

  db.logAudit({
    clinic_id: user.clinic_id,
    actor_user_id: user.id,
    actor_name: user.name,
    action: 'CLINIC_USER_LOGIN',
    target_type: 'USER',
    target_id: user.id,
  });

  return res.json({
    token,
    user: cleanUser,
    clinic,
  });
});

// Current User & Session Refresh
authRouter.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  let clinic = undefined;
  if (user.clinic_id) {
    clinic = db.getClinicById(user.clinic_id);
  }

  return res.json({
    user,
    clinic,
  });
});

// Force Password Change / Reset
authRouter.post('/change-password', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }

  const user = db.getUserById(req.user!.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  // If user was not forced to change, verify current password
  if (!user.must_change_password && currentPassword) {
    if (!verifyPassword(currentPassword, user.password_hash)) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }
  }

  const newHash = hashPassword(newPassword);
  const updated = db.updateUser(user.id, {
    password_hash: newHash,
    must_change_password: false,
  });

  db.logAudit({
    clinic_id: user.clinic_id,
    actor_user_id: user.id,
    actor_name: user.name,
    action: 'PASSWORD_CHANGED',
    target_type: 'USER',
    target_id: user.id,
  });

  return res.json({
    success: true,
    message: 'Password updated successfully.',
    user: updated,
  });
});
