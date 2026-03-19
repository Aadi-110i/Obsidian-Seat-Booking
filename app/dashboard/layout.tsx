'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import { Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const showThemeToggle = pathname === '/dashboard' || pathname.includes('settings');

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
                <div style={{ width: 32, height: 32, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div>
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <main className="main-content relative pb-12">
                {/* Desktop Top-Right Theme Toggle */}
                {showThemeToggle && (
                    <div className="hidden md:flex absolute top-8 right-8 z-50">
                        <ThemeToggle />
                    </div>
                )}

                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 mb-4 border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-30">
                    <div className="font-serif text-lg tracking-tight text-white flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-white flex items-center justify-center shadow-lg shadow-white/10">
                            <div className="w-3 h-3 rounded-sm bg-black rotate-45" />
                        </div>
                        obsidian
                    </div>
                    <div className="flex items-center gap-2">
                        {showThemeToggle && <ThemeToggle />}
                        <button className="text-zinc-400 p-2" onClick={() => setIsSidebarOpen(true)}>
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
                <div className="px-4 md:px-0">
                    {children}
                </div>
            </main>
        </div>
    );
}
