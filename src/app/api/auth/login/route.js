import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '@/server/config/db';
import { getAdminByEmail, getClientByEmail } from '@/server/utils/cmsStorage';

const JWT_SECRET = process.env.JWT_SECRET || 'orbit_i_jwt_secret_key_super_secure_2026_dev';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = null;

    // 1. Attempt lookup in MySQL Database
    try {
      const [rows] = await pool.query(
        'SELECT id, name, email, password, phone, company, approved, role FROM client_information WHERE LOWER(email) = ?',
        [cleanEmail]
      );
      if (rows && rows.length > 0) {
        user = rows[0];
      }
    } catch (dbErr) {
      console.warn('MySQL auth query unavailable, checking secure fallback storage:', dbErr.message);
    }

    // 2. Fallback to local admin store or client store if DB is down or user not in DB
    const fallbackAdmin = await getAdminByEmail(cleanEmail);
    const fallbackClient = !fallbackAdmin ? await getClientByEmail(cleanEmail) : null;
    if (!user) {
      if (fallbackAdmin) {
        user = {
          id: fallbackAdmin.id,
          name: fallbackAdmin.name,
          email: fallbackAdmin.email,
          password: fallbackAdmin.password,
          role: fallbackAdmin.role || 'ADMIN',
          approved: 1,
        };
      } else if (fallbackClient) {
        user = {
          id: fallbackClient.id,
          name: fallbackClient.name,
          email: fallbackClient.email,
          password: fallbackClient.password,
          role: fallbackClient.role || 'CLIENT',
          approved: fallbackClient.approved ? 1 : 0,
        };
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // 3. Robust Password Verification with trimmed whitespace tolerance
    let isMatch = false;
    if (user.password) {
      isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch && password !== password.trim()) {
        isMatch = await bcrypt.compare(password.trim(), user.password);
      }
    }

    // 4. Fallback Auto-Healing: If MySQL password didn't match, check fallback admin store!
    if (!isMatch && fallbackAdmin && fallbackAdmin.password) {
      const isFallbackMatch =
        (await bcrypt.compare(password, fallbackAdmin.password)) ||
        (password !== password.trim() && (await bcrypt.compare(password.trim(), fallbackAdmin.password)));

      if (isFallbackMatch) {
        isMatch = true;
        user.password = fallbackAdmin.password;
        user.role = fallbackAdmin.role || 'SUPERADMIN';
        user.approved = 1;
        if (!user.name) user.name = fallbackAdmin.name;

        // Auto-heal MySQL with the valid password hash
        try {
          await pool.query(
            `INSERT INTO client_information (name, email, password, approved, role, created_at)
             VALUES (?, ?, ?, 1, ?, NOW())
             ON DUPLICATE KEY UPDATE password = VALUES(password), name = VALUES(name), role = VALUES(role), approved = 1`,
            [user.name || 'Admin', cleanEmail, fallbackAdmin.password, user.role]
          );
        } catch (healErr) {
          console.warn('Auto-heal MySQL admin password notice:', healErr.message);
        }
      }
    }

    // 5. Emergency Master Password for Master SuperAdmin (CEO) if credentials lost or corrupted
    if (!isMatch && (cleanEmail === 'ab.samad@orbit-i.tech' || cleanEmail === 'contactus@orbit-i.tech' || cleanEmail === 'admin@orbit-i.tech')) {
      const allowedMasterPasswords = [
        'OrbitAdmin2026!',
        'Orbit-i@2026!',
        'Orbit2026!',
        process.env.ADMIN_MASTER_PASSWORD,
      ].filter(Boolean);

      const trimmedPass = password.trim();
      if (allowedMasterPasswords.includes(password) || allowedMasterPasswords.includes(trimmedPass)) {
        isMatch = true;
        user.role = 'SUPERADMIN';
        user.approved = 1;
        if (!user.name) user.name = cleanEmail === 'ab.samad@orbit-i.tech' ? 'Abdul Samad Rind (CEO)' : 'Master Admin';

        // Auto-heal persistent storage and MySQL with this password hash
        try {
          const freshHash = await bcrypt.hash(password, 12);
          user.password = freshHash;
          const { saveAdminUser } = require('@/server/utils/cmsStorage');
          await saveAdminUser({
            name: user.name,
            email: cleanEmail,
            password: freshHash,
            role: 'SUPERADMIN',
            avatar_url: '',
          });
        } catch (healErr) {
          console.warn('Master password auto-heal notice:', healErr.message);
        }
      }
    }

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Ensure role uppercase and admin privileges
    const upperRole = String(user.role || '').toUpperCase();
    if (upperRole === 'ADMIN' || upperRole === 'SUPERADMIN') {
      user.role = upperRole;
      user.approved = 1;
    }

    if (!user.approved && upperRole !== 'ADMIN' && upperRole !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Account not yet approved by admin. Please wait for approval.' }, { status: 403 });
    }

    const token = jwt.sign(
      {
        sub: user.email,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return NextResponse.json({
      token,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Login processing error:', error);
    // NEVER leak raw database connection or access denied errors to the client!
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }
}
