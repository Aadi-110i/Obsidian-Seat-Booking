'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { Calendar, CheckCircle, Clock, TrendingUp, Armchair, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Booking {
    id: string;
    date: string;
    status: string;
    seat: { seatNumber: string; type: string };
}

export default function DashboardPage() {
    const { user, token } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [today, setToday] = useState<Date | null>(null);

    useEffect(() => {
        setToday(new Date());
    }, []);

    useEffect(() => {
        if (token) {
            fetch('/api/bookings?upcoming=true', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(r => r.json())
                .then(d => {
                    setBookings(d.bookings || []);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [token]);

    const todayBooking = today ? bookings.find(b => format(new Date(b.date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) : null;

    const getGreeting = () => {
        if (!today) return 'Welcome';
        const hours = today.getHours();
        if (hours < 12) return 'Good morning';
        if (hours < 17) return 'Good afternoon';
        return 'Good evening';
    };

    if (!today || loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="fade-in max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between" style={{ gap: 20, marginBottom: 30 }}>
                <div>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 mb-6">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                        System Operational · {format(today, 'EEEE, MMMM d')}
                    </div>
                    <h1 className="text-5xl md:text-6xl font-serif mb-4 text-gradient leading-[1.1]">
                        {getGreeting()},<br />{user?.name?.split(' ')[0]}
                    </h1>
                    <p className="text-zinc-500 font-light text-xl max-w-lg leading-relaxed">
                        Manage your workspace and upcoming reservations with absolute precision.
                    </p>
                </div>

                <div className="hidden lg:block">
                    <Link href="/dashboard/book" className="btn btn-primary px-12 py-6 text-sm uppercase tracking-[0.2em] font-black group shadow-2xl">
                        New Reservation <ArrowRight size={20} className="ml-3 group-hover:translate-x-1.5 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Stats Grid - Symmetrical 3-Column */}
            <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 48, marginBottom: 30 }}>
                <div className="stat-card">
                    <div className="flex justify-between items-start">
                        <div className="space-y-4">
                            <div className="stat-label">Upcoming</div>
                            <div className="stat-value">{bookings.length}</div>
                            <p className="text-xs text-zinc-500 font-medium">Scheduled bookings</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center shadow-inner">
                            <Calendar size={20} className="text-white opacity-80" />
                        </div>
                    </div>
                </div>

                <div className="stat-card relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start relative z-10">
                        <div className="space-y-4">
                            <div className="stat-label">Today's Seat</div>
                            <div className="stat-value font-mono">{todayBooking ? todayBooking.seat.seatNumber : '—'}</div>
                            {todayBooking ? (
                                <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                                    Confirmed
                                </div>
                            ) : (
                                <p className="text-xs text-zinc-500 font-medium">No seat assigned</p>
                            )}
                        </div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner border ${todayBooking ? 'bg-green-500/10 border-green-500/20' : 'bg-white/[0.03] border-white/[0.08]'}`}>
                            <Armchair size={20} className={todayBooking ? "text-green-500" : "text-white opacity-40"} />
                        </div>
                    </div>
                </div>

                <div className="stat-card relative overflow-hidden">
                    <div className="flex justify-between items-start relative z-10">
                        <div className="space-y-4">
                            <div className="stat-label">Access</div>
                            <div className="stat-value">Active</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 opacity-60">
                                Batch {user?.batch} · {user?.squad}
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center shadow-inner">
                            <TrendingUp size={20} className="text-white opacity-80" />
                        </div>
                    </div>
                    <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white/[0.02] rounded-full blur-3xl" />
                </div>
            </div>

            {/* Content Grid - Symmetrical 2:1 Split */}
            <div className="grid lg:grid-cols-12 gap-12 items-start">
                {/* Main Content Area (8 cols) */}
                <div className="lg:col-span-8" style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
                    {/* Hero Action Card */}
                    <div className="glass-dark border border-white/10 rounded-[32px] p-12 relative overflow-hidden group min-h-[320px] flex flex-col justify-center" style={{ alignItems: 'center', textAlign: 'center' }}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/[0.02] rounded-full blur-[100px]" />

                        <div className="relative z-10" style={{ maxWidth: 520 }}>
                            <h2 className="text-3xl font-serif text-white" style={{ marginBottom: 20 }}>Secure your workspace</h2>
                            <p className="text-zinc-500 font-light text-lg leading-relaxed" style={{ marginBottom: 40 }}>
                                Experience a systematic approach to seat booking. Designed for high-performance teams who value focus and precision.
                            </p>
                            <Link href="/dashboard/book" className="btn btn-primary px-10 py-4 text-xs font-black uppercase tracking-[0.2em] shadow-2xl">
                                Start Booking
                            </Link>
                        </div>
                    </div>

                    {/* Upcoming Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-4">
                            <h3 className="text-[11px] font-black uppercase text-zinc-600" style={{ letterSpacing: '0.3em', wordSpacing: '0.6em' }}>Recent Itinerary</h3>
                            <Link href="/dashboard/bookings" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all border-b border-white/0 hover:border-white/20 pb-1">
                                Full Schedule
                            </Link>
                        </div>

                        <div className="grid gap-4">
                            {bookings.length > 0 ? (
                                bookings.slice(0, 3).map((b) => (
                                    <div key={b.id} className="flex items-center justify-between p-8 rounded-[24px] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all group">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-zinc-500 group-hover:text-white transition-all group-hover:scale-110">
                                                <Calendar size={22} />
                                            </div>
                                            <div>
                                                <div className="text-lg font-semibold text-white mb-1">{format(new Date(b.date), 'EEEE, MMM d')}</div>
                                                <div className="text-sm text-zinc-500 font-light tracking-wide">
                                                    Floor 4 · Seat <span className="font-mono font-medium text-zinc-300">{b.seat.seatNumber}</span> · {b.seat.type}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="hidden sm:block">
                                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 border border-white/[0.05] px-4 py-2 rounded-xl">Confirmed</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-20 text-center rounded-[32px] border border-dashed border-white/10 bg-white/[0.01]">
                                    <p className="text-zinc-600 text-sm font-light italic tracking-widest">No upcoming reservations found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info Area (4 cols) */}
                <div className="lg:col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    <div className="glass border border-white/[0.08] rounded-[32px]" style={{ padding: 40 }}>
                        <div style={{ marginBottom: 40 }}>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600" style={{ marginBottom: 24 }}>Platform Status</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                {[
                                    { label: 'Cloud Infrastructure', value: 'Operational', status: 'ok' },
                                    { label: 'Real-time Sync', value: 'Active', status: 'ok' },
                                    { label: 'Booking Window', value: '14 Days', status: 'info' }
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center group">
                                        <span className="text-xs text-zinc-500 font-medium group-hover:text-zinc-400 transition-colors">{item.label}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/90">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600" style={{ marginBottom: 16 }}>Concierge</h3>
                            <p className="text-xs text-zinc-500 leading-relaxed font-light" style={{ marginBottom: 24 }}>
                                For specialized workspace configurations or priority access requests, please contact the administrative suite.
                            </p>
                            <button className="w-full py-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition-all duration-500">
                                Contact Suite
                            </button>
                        </div>
                    </div>

                    <div className="glass-dark border border-white/[0.08] rounded-[32px] relative overflow-hidden" style={{ padding: 40 }}>
                        <div className="flex items-center text-zinc-400" style={{ gap: 16, marginBottom: 16 }}>
                            <CheckCircle size={18} className="text-green-500" />
                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400">Security</h3>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed font-light">
                            All reservations are encrypted and verified against organizational batch protocols.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
