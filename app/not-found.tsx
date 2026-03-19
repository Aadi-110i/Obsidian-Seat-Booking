import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)'
    }}>
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '500px',
        textAlign: 'center',
        border: '1px solid var(--border)'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '700',
          marginBottom: '16px',
          color: 'var(--text-primary)'
        }}>
          404
        </h1>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          marginBottom: '16px'
        }}>
          Page Not Found
        </h2>
        <p style={{
          color: 'var(--text-secondary)',
          marginBottom: '24px',
          lineHeight: '1.5'
        }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <button
            style={{
              background: 'var(--accent)',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textDecoration: 'none'
            }}
          >
            Go Home
          </button>
        </Link>
      </div>
    </div>
  );
}