import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = signToken({ userId: user.id, email: user.email, role: user.role, batch: user.batch });

        const response = NextResponse.json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role, batch: user.batch, squad: user.squad },
            token,
        });

        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);

        const message = error instanceof Error ? error.message.toLowerCase() : '';

        // Common deployment/runtime issues (missing or unreachable DB)
        if (
            message.includes('database_url') ||
            message.includes('unable to open database file') ||
            message.includes('readonly') ||
            message.includes('no such table')
        ) {
            return NextResponse.json(
                { error: 'Login is temporarily unavailable. Server database is not ready yet.' },
                { status: 503 }
            );
        }

        return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 });
    }
}
