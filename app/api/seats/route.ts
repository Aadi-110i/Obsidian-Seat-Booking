import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { isBatchScheduled, isFloatingUnlocked, isWeekend, getWeekNumber } from '@/lib/scheduling';
import { startOfDay } from 'date-fns';

export async function GET(req: NextRequest) {
    try {
        const user = getTokenFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const dateParam = searchParams.get('date');
        const date = dateParam ? new Date(dateParam) : new Date();

        if (isWeekend(date)) {
            return NextResponse.json({ seats: [], message: 'No seats on weekends' });
        }

        // Get all seats with their bookings for this date
        const targetDate = startOfDay(date);
        const seats = await prisma.seat.findMany({
            include: {
                bookings: {
                    where: {
                        date: targetDate,
                    },
                },
            },
        });

        const batchScheduled = await isBatchScheduled(user.batch, date);
        const floatingUnlocked = isFloatingUnlocked(date);
        const weekNumber = await getWeekNumber(date);

        const seatsWithStatus = seats.map((seat) => {
            const activeBooking = seat.bookings.find((b) => b.status === 'ACTIVE');
            const hasReleasedOrCancelled = seat.bookings.some((b) => b.status === 'RELEASED' || b.status === 'CANCELLED');
            
            const isBooked = !!activeBooking;
            const myBooking = activeBooking?.userId === user.userId ? activeBooking : undefined;

            let effectiveType = seat.type;
            if (seat.type === 'DESIGNATED' && hasReleasedOrCancelled) {
                effectiveType = 'FLOATING';
            }

            let available = false;
            let reason = '';

            if (effectiveType === 'DESIGNATED') {
                if (!batchScheduled) {
                    available = false;
                    reason = 'Not your batch day for designated seats';
                } else if (isBooked && !myBooking) {
                    available = false;
                    reason = 'Already booked';
                } else {
                    available = true;
                }
            } else {
                // FLOATING
                if (!floatingUnlocked) {
                    available = false;
                    reason = 'Floating seats unlock at 3:00 PM the previous working day (no same-day bookings)';
                } else if (isBooked && !myBooking) {
                    available = false;
                    reason = 'Already booked';
                } else {
                    available = true;
                }
            }

            return {
                id: seat.id,
                seatNumber: seat.seatNumber,
                type: seat.type,
                effectiveType,
                isBooked,
                isMyBooking: !!myBooking,
                myBookingId: myBooking?.id,
                available,
                reason,
            };
        });

        return NextResponse.json({
            seats: seatsWithStatus,
            meta: {
                date: targetDate.toISOString(),
                weekNumber,
                batchScheduled,
                floatingUnlocked,
                userBatch: user.batch,
            },
        });
    } catch (error) {
        console.error('Seats GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
