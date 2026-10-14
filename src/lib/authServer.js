import jwt from 'jsonwebtoken';
import { pool } from '@/server/config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'orbit_i_jwt_secret_key_super_secure_2026_dev';

export async function verifyAuth(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Access token required', status: 401 };
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded.sub || decoded.email;

    const [rows] = await pool.query(
      'SELECT id, name, email, phone, company, approved, role, created_at FROM client_information WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return { error: 'User no longer exists', status: 401 };
    }

    const user = rows[0];

    if (!user.approved && user.role !== 'ADMIN') {
      return { error: 'Account not yet approved by admin. Please wait for approval.', status: 403 };
    }

    return { user };
  } catch (err) {
    return { error: 'Invalid or expired token', status: 401 };
  }
}

export async function verifyAdmin(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return auth;

  if (auth.user.role !== 'ADMIN') {
    return { error: 'Admin access required', status: 403 };
  }

  return { user: auth.user };
}
