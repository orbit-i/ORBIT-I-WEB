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

    try {
      const [rows] = await pool.query(
        'SELECT id, name, email, phone, company, approved, role, created_at FROM client_information WHERE email = ?',
        [email]
      );

      if (rows.length > 0) {
        const user = rows[0];
        if (!user.approved && user.role !== 'ADMIN') {
          return { error: 'Account not yet approved by admin. Please wait for approval.', status: 403 };
        }
        return { user };
      }
    } catch {
      // DB connection failed or offline — fall back to JWT decoded claims
      if (decoded.role === 'ADMIN' || decoded.role === 'CLIENT') {
        return { user: { email, role: decoded.role, name: decoded.name || 'Admin User', approved: 1 } };
      }
    }

    if (decoded.role) {
      return { user: { email, role: decoded.role, name: decoded.name || 'Admin User', approved: 1 } };
    }

    return { error: 'User not recognized', status: 401 };
  } catch {
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
