import * as jose from 'jose';

export const ADMIN_COOKIE_NAME = 'whitehats_admin_session';

/**
 * Retrieves the cryptographic secret key used for signing and verifying JWTs.
 * Throws a configuration error in production if ADMIN_JWT_SECRET is missing.
 */
function getJwtSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('[Security Exception] ADMIN_JWT_SECRET environment variable is missing in production.');
    }
    // Safe random key for local development only
    return new TextEncoder().encode('whitehats_development_only_secret_key_32_chars_min!!');
  }
  return new TextEncoder().encode(secret);
}

export interface AdminSession {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'EDITOR';
}

/**
 * Constant-time comparison between two strings to prevent timing attacks.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Hash a password using Web Crypto PBKDF2 (100% Edge runtime compatible).
 */
export async function hashPassword(
  password: string,
  providedSalt?: string
): Promise<{ hash: string; salt: string }> {
  const enc = new TextEncoder();
  const salt =
    providedSalt ||
    Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  const hash = Array.from(new Uint8Array(derivedKey))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return { hash, salt };
}

/**
 * Verify a password against a stored PBKDF2 hash and salt using constant-time comparison.
 */
export async function verifyPassword(
  password: string,
  storedHash: string,
  storedSalt: string
): Promise<boolean> {
  const { hash } = await hashPassword(password, storedSalt);
  return timingSafeEqual(hash, storedHash);
}

/**
 * Create a cryptographically signed JWT for the admin session.
 */
export async function createAdminToken(payload: AdminSession): Promise<string> {
  const secret = getJwtSecret();
  return await new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

/**
 * Verify a JWT session token and return the admin payload if valid.
 */
export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  try {
    const secret = getJwtSecret();
    const { payload } = await jose.jwtVerify(token, secret);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: (payload.role as 'SUPER_ADMIN' | 'EDITOR') || 'EDITOR',
    };
  } catch {
    return null;
  }
}

/**
 * Server-side helper to verify admin session from Request cookies (defense-in-depth).
 */
export async function getAdminSessionFromRequest(request: Request): Promise<AdminSession | null> {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE_NAME}=([^;]+)`));
    const token = match ? match[1] : null;
    if (!token) return null;
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}
