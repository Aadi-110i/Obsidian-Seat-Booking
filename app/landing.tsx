'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { SafeSparkles } from '@/components/ui/safe-sparkles';
import ClientOnly from '@/components/ClientOnly';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ArrowRight, Users, Activity, Clock, Armchair, BarChart3, ShieldCheck, Building2 } from 'lucide-react';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ width: 32, height: 32, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Don't render content if user is logged in (will redirect)
  if (user) {
    return null;
  }

  return (
    <ClientOnly fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ width: 32, height: 32, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <div className="fade-in">
        {/* Theme Toggle */}
        <div style={{ position: 'absolute', top: 24, right: 24, zIndex: 100 }}>
          <ThemeToggle />
        </div>

        {/* Sparkles Hero Section */}
        <section style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, backgroundColor: 'var(--bg-primary)' }}>
            <SafeSparkles
              id="tsparticlesfullpage"
              background="transparent"
              minSize={0.6}
              maxSize={1.4}
              particleDensity={100}
              className="w-full h-full"
              particleColor="#323232"
              speed={1}
            />
          </div>
            
            {/* CTA Overlay */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 20, textAlign: 'center' }}>
              
              {/* Live Availability Badge */}
              <div style={{ marginBottom: 24, padding: '8px 16px', borderRadius: '9999px', backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#16a34a', animation: 'pulse-dot 2s infinite' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#16a34a', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Live: 14 Seats Available</span>
                <style>{`@keyframes pulse-dot { 0% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(22, 163, 74, 0); } 100% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); } }`}</style>
              </div>

              <h1 style={{ fontSize: 56, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20, letterSpacing: '-0.02em' }}>Obsidian Seat Booking</h1>
              <p style={{ fontSize: 20, color: 'var(--text-secondary)', marginBottom: 40, maxWidth: 600 }}>Smart, efficient seat reservation system for modern workspaces</p>
              
              <div style={{ display: 'flex', gap: 16 }}>
                <Link href="/login">
                  <button style={{ padding: '14px 32px', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', borderRadius: 9999, fontSize: 16, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    Get Started <ArrowRight size={18} />
                  </button>
                </Link>
                <button style={{ padding: '14px 32px', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 9999, fontSize: 16, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Learn More
                </button>
              </div>
            </div>
          </section>

          {/* Scrolling Marquee */}
          <div style={{ padding: '20px 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', overflow: 'hidden', whiteSpace: 'nowrap', display: 'flex', position: 'relative' }}>
             <div style={{ display: 'inline-flex', gap: 80, animation: 'marquee 45s linear infinite', paddingRight: 80, alignItems: 'center' }}>
               <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}><Users size={16} /> Over 5,000 Seats Booked</span>
               <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}><Activity size={16} /> 99.9% Uptime</span>
               <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}><Clock size={16} /> Instant Seat Allocation</span>
               <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}><Building2 size={16} /> Trusted by Top Enterprises</span>
             </div>
             {/* Duplicate for seamless looping */}
             <div style={{ display: 'inline-flex', gap: 80, animation: 'marquee 45s linear infinite', paddingRight: 80, alignItems: 'center', position: 'absolute', left: '100%' }}>
               <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}><Users size={16} /> Over 5,000 Seats Booked</span>
               <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}><Activity size={16} /> 99.9% Uptime</span>
               <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}><Clock size={16} /> Instant Seat Allocation</span>
               <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}><Building2 size={16} /> Trusted by Top Enterprises</span>
             </div>
             <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }`}</style>
          </div>

          {/* Features Section */}
          <section style={{ padding: '80px 20px', background: 'var(--bg-primary)' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <h2 style={{ fontSize: 40, fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center', marginBottom: 60 }}>
                Key Features
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
                <div className="glass" style={{ padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(108, 99, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <Armchair size={32} color="#6c63ff" />
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Smart Booking</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Easily book and manage your seats with our intuitive, low-latency interface.</p>
                </div>
                <div className="glass" style={{ padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <BarChart3 size={32} color="#22c55e" />
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Real-time Analytics</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Track occupancy and usage patterns in real-time with granular dashboard views.</p>
                </div>
                <div className="glass" style={{ padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <ShieldCheck size={32} color="#3b82f6" />
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Team Management</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Efficiently coordinate teams and bi-weekly batch rotations automatically.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Trending Updates Section */}
          <section style={{ padding: '80px 20px', background: 'var(--bg-secondary)' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{ fontSize: 40, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
                Trending Updates
              </h2>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 60 }}>
                Stay updated with the latest features and announcements
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, textAlign: 'left' }}>
                <div className="card glass" style={{ display: 'flex', flexDirection: 'column', gap: 12, transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', padding: '4px 10px', borderRadius: 20 }}>Feature</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Just now</span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>New Admin Dashboard</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Experience our completely redesigned admin dashboard with advanced analytics and team management capabilities.</p>
                </div>

                <div className="card glass" style={{ display: 'flex', flexDirection: 'column', gap: 12, transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#22c55e', background: 'rgba(34, 197, 94, 0.1)', padding: '4px 10px', borderRadius: 20 }}>Update</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>2 days ago</span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Instant Seat Allocation</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Our new algorithm ensures 50% faster seat allocation during peak office hours, saving your team valuable time.</p>
                </div>

                <div className="card glass" style={{ display: 'flex', flexDirection: 'column', gap: 12, transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '4px 10px', borderRadius: 20 }}>Maintenance</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>1 week ago</span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Performance Boost</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>We've optimized our backend infrastructure to handle 10x more concurrent bookings without breaking a sweat.</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section style={{ padding: '80px 20px', background: 'var(--bg-primary)' }}>
            <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', paddingTop: 40 }}>
              <h2 style={{ fontSize: 40, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
                Ready to get started?
              </h2>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 40 }}>
                Join thousands of users managing their seats efficiently
              </p>
              <Link href="/login">
                <button style={{ padding: '16px 40px', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', borderRadius: 9999, fontSize: 16, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  Start Now <ArrowRight size={18} />
                </button>
              </Link>
            </div>
          </section>
        </div>
      </ClientOnly>
    );
  }
