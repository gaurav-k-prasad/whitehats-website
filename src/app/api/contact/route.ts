import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import * as schema from '@/db/schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Strict validation
    if (!name || typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
      return NextResponse.json({ error: 'Valid name is required (max 100 chars)' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim()) || email.length > 150) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0 || message.length > 3000) {
      return NextResponse.json({ error: 'Message content is required (max 3000 chars)' }, { status: 400 });
    }

    const cleanSubject = typeof subject === 'string' && subject.trim().length > 0 ? subject.trim().slice(0, 100) : 'General Inquiry';
    const messageId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `msg-${Date.now()}`;

    const db = getDb();
    if (db) {
      await db.insert(schema.contactMessages).values({
        id: messageId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        subject: cleanSubject,
        message: message.trim(),
        status: 'UNREAD',
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      messageId,
      message: 'Transmission successfully logged to WhiteHats command center.',
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json({ error: 'Failed to record transmission' }, { status: 500 });
  }
}
