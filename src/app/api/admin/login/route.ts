import { NextResponse } from 'next/server';
import { verifyPassword, createAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth';
import { getDb } from '@/lib/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    interface AdminUserRecord {
      id: string;
      email: string;
      name: string;
      role: 'SUPER_ADMIN' | 'EDITOR';
      passwordHash: string;
      salt: string;
    }
    const db = getDb();
    let adminUser: AdminUserRecord | null = null;
    if (db) {
      const users = await db
        .select()
        .from(schema.adminUsers)
        .where(eq(schema.adminUsers.email, email.toLowerCase().trim()))
        .limit(1);

      if (users && users.length > 0) {
        adminUser = users[0] as unknown as AdminUserRecord;
      }
    }

    // Read initial admin account credentials strictly from environment variables
    const defaultAdminEmail = process.env.ADMIN_INIT_EMAIL ? process.env.ADMIN_INIT_EMAIL.toLowerCase().trim() : null;
    const defaultAdminPass = process.env.ADMIN_INIT_PASSWORD || null;

    if (!adminUser && defaultAdminEmail && email.toLowerCase().trim() === defaultAdminEmail) {
      if (defaultAdminPass && password === defaultAdminPass) {
        const token = await createAdminToken({
          id: 'adm-01',
          email: defaultAdminEmail,
          name: 'Lead Operator',
          role: 'SUPER_ADMIN',
        });

        const response = NextResponse.json({
          success: true,
          user: { id: 'adm-01', email: defaultAdminEmail, name: 'Lead Operator', role: 'SUPER_ADMIN' },
        });

        response.cookies.set({
          name: ADMIN_COOKIE_NAME,
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
      }
    }

    if (!adminUser) {
      return NextResponse.json({ error: 'Invalid operator credentials' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, adminUser.passwordHash, adminUser.salt);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid operator credentials' }, { status: 401 });
    }

    const token = await createAdminToken({
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
      },
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Authentication protocol failure' }, { status: 500 });
  }
}
