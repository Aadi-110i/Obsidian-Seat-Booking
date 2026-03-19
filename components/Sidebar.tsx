'use client';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Settings, Users, LogOut, Armchair, X } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const navItems = [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/dashboard/book', icon: Armchair, label: 'Book a Seat' },
        { href: '/dashboard/bookings', icon: Calendar, label: 'My Bookings' },
        ...(user?.role === 'ADMIN' ? [
            { href: '/dashboard/admin/users', icon: Users, label: 'Manage Users' },
            { href: '/dashboard/admin/bookings', icon: Calendar, label: 'All Bookings' },
            { href: '/dashboard/admin/settings', icon: Settings, label: 'Settings' },
        ] : []),
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-[90] md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <nav className={`sidebar transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} z-[100]`}>
                {/* Logo Section */}
                <div className="flex items-center justify-between px-4" style={{ marginBottom: 30 }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--text-primary)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                            <div className="w-5 h-5 rounded-sm rotate-45" style={{ background: 'var(--bg-primary)' }} />
                        </div>
                        <div>
                            <div className="font-serif text-xl tracking-tight leading-none mb-1" style={{ color: 'var(--text-primary)' }}>obsidian</div>
                            <div className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-black opacity-60">Platform · Workspace</div>
                        </div>
                    </div>
                    <button className="md:hidden text-zinc-400 p-2 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                {/* Nav items */}
                <div className="flex flex-col gap-2 flex-1">

                    {navItems.map(({ href, icon: Icon, label }) => (
                        <Link key={href} href={href}
                            className={`nav-item ${pathname === href ? 'active' : ''}`}
                            onClick={() => setIsOpen(false)}>
                            <Icon size={18} className={pathname === href ? 'text-black' : 'text-zinc-500'} />
                            <span>{label}</span>
                        </Link>
                    ))}
                </div>



                {/* User info */}
                <div style={{ paddingTop: 16 }}>
                    <div style={{ padding: '24px', marginBottom: 16, borderRadius: 24, background: 'var(--stat-card-bg)', border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }} className="group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="truncate" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6, lineHeight: 1.2 }}>{user?.name}</div>
                            <div className="truncate" style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1 }}>{user?.email}</div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {user?.role === 'ADMIN' ? (
                                    <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', padding: '6px 12px', borderRadius: 8, background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>Admin Access</span>
                                ) : (
                                    <>
                                        <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', padding: '6px 12px', borderRadius: 8, background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>Batch {user?.batch}</span>
                                        {user?.squad && (
                                            <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', padding: '6px 12px', borderRadius: 8, background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>{user.squad}</span>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <button className="nav-item w-full text-zinc-500 hover:text-red-400 hover:bg-red-500/5 group px-6 py-4" onClick={logout}>
                        <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </nav>
        </>
    );
}
