'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { format, addDays, startOfDay, isWeekend } from 'date-fns';
import { Info, CheckCircle, Armchair, ArrowRight, Calendar as CalendarIcon, ShieldCheck, Clock } from 'lucide-react';
import Calendar from '../../../components/Calendar';

interface SeatData {
    id: string;
    seatNumber: string;
    type: 'DESIGNATED' | 'FLOATING';
    effectiveType: 'DESIGNATED' | 'FLOATING';
    isBooked: boolean;
    isMyBooking: boolean;
    myBookingId?: string;
    available: boolean;
    reason: string;
}

interface Meta {
    weekNumber: 1 | 2;
    batchScheduled: boolean;
    floatingUnlocked: boolean;
    userBatch: string;
}

type ToastType = 'success' | 'error' | 'info';
type Toast = { msg: string; type: ToastType } | null;

export default function BookPage() {
    const { token } = useAuth();
    const [selectedDate, setSelectedDate] = useState<Date>(() => {
        const d = new Date();
        if (d.getDay() === 0) return addDays(d, 1);
        if (d.getDay() === 6) return addDays(d, 2);
        return d;
    });
    const [seats, setSeats] = useState<SeatData[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<Toast>(null);
    const [bookingLoading, setBookingLoading] = useState<string | null>(null);

    const showToast = (msg: string, type: ToastType = 'info') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchSeats = useCallback(async (date: Date) => {
        setLoading(true);
        const dateStr = format(date, 'yyyy-MM-dd');
        try {
            const res = await fetch(`/api/seats?date=${dateStr}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setSeats(data.seats || []);
            setMeta(data.meta || null);
        } catch (error) {
            showToast('Failed to fetch seats', 'error');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchSeats(selectedDate);
    }, [selectedDate, fetchSeats]);

    const handleBook = async (seat: SeatData) => {
        if (!seat.available) return;
        setBookingLoading(seat.id);
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ seatId: seat.id, date: format(selectedDate, 'yyyy-MM-dd') }),
            });
            const data = await res.json();
            if (!res.ok) { showToast(data.error, 'error'); return; }
            showToast(`Successfully booked ${seat.seatNumber}`, 'success');
            fetchSeats(selectedDate);
        } finally {
            setBookingLoading(null);
        }
    };

    const handleCancel = async (seat: SeatData) => {
        if (!seat.myBookingId) return;
        setBookingLoading(seat.id);
        try {
            const res = await fetch(`/api/bookings/${seat.myBookingId}/cancel`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) { showToast(data.error, 'error'); return; }
            showToast(`Reservation for ${seat.seatNumber} cancelled`, 'info');
            fetchSeats(selectedDate);
        } finally {
            setBookingLoading(null);
        }
    };

    const designated = seats.filter(s => s.effectiveType === 'DESIGNATED');
    const floating = seats.filter(s => s.effectiveType === 'FLOATING');
    const maxBookingDate = addDays(startOfDay(new Date()), 14);

    return (
        <div className="fade-in max-w-7xl mx-auto" style={{ padding: '40px 20px' }}>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-light-divider" style={{ gap: 32, paddingBottom: 48, marginBottom: 48 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">
                        <CalendarIcon size={12} className="text-zinc-600" />
                        Booking Suite · Floor 4
                    </div>
                    <h1 className="text-5xl font-serif text-gradient leading-tight">
                        Reserve your desk
                    </h1>
                    <p className="text-zinc-500 font-light text-xl max-w-xl">
                        Select an available date from the calendar and choose your preferred workspace.
                    </p>
                </div>

                {meta && (
                    <div className="flex flex-wrap gap-3">
                        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Cycle</span>
                            <span className="text-sm font-serif text-white">Week {meta.weekNumber}</span>
                        </div>
                        <div className={`px-4 py-2 rounded-xl border flex items-center gap-3 ${meta.batchScheduled ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${meta.batchScheduled ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
                                {meta.batchScheduled ? `Batch ${meta.userBatch} Active` : `Batch ${meta.userBatch} Locked`}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid lg:grid-cols-12" style={{ gap: 64 }}>
                {/* Left: Calendar (5 cols) */}
                <div className="lg:col-span-5" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    <div className="sticky top-12">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-8">1. Select Date</h3>
                        <Calendar
                            selectedDate={selectedDate}
                            onDateSelect={setSelectedDate}
                            maxDate={maxBookingDate}
                        />

                        <div className="glass border border-white/5 rounded-3xl" style={{ marginTop: 48, padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <div className="flex items-start" style={{ gap: 16 }}>
                                <ShieldCheck size={18} className="text-zinc-500 mt-1" />
                                <div>
                                    <h4 className="text-sm font-semibold text-white mb-2">Booking Rules</h4>
                                    <p className="text-xs text-zinc-500 leading-relaxed font-light">
                                        Reservations can be made up to 14 days in advance. Designated seats are allocated based on your batch schedule.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Seat Selection (7 cols) */}
                <div className="lg:col-span-7" style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-8">
                            2. Choose Workspace · {format(selectedDate, 'EEEE, MMM d')}
                        </h3>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 space-y-6 glass-dark rounded-[40px] border border-white/5">
                                <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Syncing Seat API...</span>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
                                {/* Designated */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                                            <h4 className="text-sm font-semibold text-white">Designated Suites</h4>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">D01 — D40</span>
                                    </div>

                                    {!meta?.batchScheduled && (
                                        <div className="flex items-center gap-4 py-2 text-red-400 text-xs">
                                            <Info size={16} />
                                            <span>Not your batch day. Designated seats are restricted to Batch {meta?.userBatch === 'A' ? 'B' : 'A'} today.</span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
                                        {designated.map(seat => (
                                            <SeatCell key={seat.id} seat={seat} onBook={handleBook} onCancel={handleCancel} loading={bookingLoading === seat.id} />
                                        ))}
                                    </div>
                                </div>

                                {/* Floating */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                                            <h4 className="text-sm font-semibold text-white">Floating Hub</h4>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">F01 — F10</span>
                                    </div>

                                    {!meta?.floatingUnlocked && (
                                        <div className="flex items-center gap-4 py-2 text-zinc-500 text-xs">
                                            <Clock size={16} />
                                            <span>Floating seats unlock at 3:00 PM the working day prior. Same-day bookings restricted.</span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
                                        {floating.map(seat => (
                                            <SeatCell key={seat.id} seat={seat} onBook={handleBook} onCancel={handleCancel} loading={bookingLoading === seat.id} />
                                        ))}
                                    </div>
                                </div>

                                {/* Legend Section */}
                                <div className="border-t border-white/5" style={{ paddingTop: 48 }}>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700 mb-6">Visual Legend</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                        {[
                                            { color: 'bg-white/[0.05]', border: 'border-white/10', label: 'Designated' },
                                            { color: 'bg-green-500/5', border: 'border-green-500/20', label: 'Floating' },
                                            { color: 'bg-white', border: 'border-white', label: 'Your Booking' },
                                            { color: 'bg-red-500/5', border: 'border-red-500/10', label: 'Reserved' },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded ${item.color} border ${item.border}`} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{item.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Toast System */}
            {toast && (
                <div className={`fixed bottom-12 right-12 z-[1000] px-8 py-5 rounded-2xl border backdrop-blur-3xl shadow-2xl fade-in flex items-center gap-4
                    ${toast.type === 'success' ? 'bg-white text-black border-white' :
                        toast.type === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            'bg-zinc-900 text-white border-white/10'}`}>
                    {toast.type === 'success' && <CheckCircle size={18} />}
                    <span className="text-xs font-black uppercase tracking-widest">{toast.msg}</span>
                </div>
            )}
        </div>
    );
}

function SeatCell({ seat, onBook, onCancel, loading }: {
    seat: SeatData;
    onBook: (s: SeatData) => void;
    onCancel: (s: SeatData) => void;
    loading: boolean;
}) {
    const isMyBooking = seat.isMyBooking;
    const isBooked = seat.isBooked && !isMyBooking;
    const isAvailable = seat.available;
    const isUnavailable = !isAvailable && !isBooked && !isMyBooking;

    const handleClick = () => {
        if (loading) return;
        if (isMyBooking) onCancel(seat);
        else if (isAvailable) onBook(seat);
    };

    return (
        <button
            disabled={isBooked || isUnavailable || loading}
            className={`
                relative h-14 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 group
                ${isMyBooking ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' :
                    isBooked ? 'bg-red-500/5 border-red-500/10 text-red-500/40 cursor-not-allowed opacity-40' :
                        isAvailable ? (seat.type === 'DESIGNATED' ? 'bg-white/[0.03] border-white/10 hover:bg-white/[0.08] hover:border-white/20' : 'bg-green-500/5 border-green-500/10 hover:bg-green-500/10 hover:border-green-500/20 text-green-500') :
                            'bg-white/[0.01] border-white/[0.03] text-zinc-800 cursor-not-allowed'}
            `}
            onClick={handleClick}
            title={isMyBooking ? 'Cancel Reservation' : seat.reason || `Seat ${seat.seatNumber}`}
        >
            {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : isMyBooking ? (
                <CheckCircle size={18} />
            ) : (
                <>
                    <span className="text-[10px] font-black tracking-tighter mb-1">{seat.seatNumber}</span>
                    <Armchair size={12} className={isBooked || isUnavailable ? 'opacity-20' : 'opacity-40'} />
                </>
            )}

            {isAvailable && !isMyBooking && (
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_8px_white]" />
            )}
        </button>
    );
}
