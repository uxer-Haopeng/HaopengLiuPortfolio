'use client';

import Link from 'next/link';

const NAV_PILL_STYLE: React.CSSProperties = { display: 'flex', alignItems: 'center' };
const linkStyle: React.CSSProperties = { fontFamily: "'Karla', sans-serif", fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#414d38', textDecoration: 'none' };

export default function SiteNav({
  audioOn = false,
  darkMode = false,
  onToggleAudio,
  onToggleTheme,
  showBackToMaze = false,
  visible = true,
}: {
  audioOn?: boolean;
  darkMode?: boolean;
  onToggleAudio?: () => void;
  onToggleTheme?: () => void;
  showBackToMaze?: boolean;
  visible?: boolean;
}) {
  const themeTrackStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', width: 42, height: 24, borderRadius: 999,
    border: 'none', padding: 2, boxSizing: 'border-box', cursor: 'pointer',
    justifyContent: darkMode ? 'flex-end' : 'flex-start',
    background: darkMode ? '#1c2430' : '#e7e0cd',
    transition: 'background 0.3s ease',
  };

  const themeKnobStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20,
    borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.25)', transition: 'transform 0.25s ease, background 0.3s ease',
    background: darkMode ? '#0f1a12' : '#fff7e6',
  };

  const navStyle: React.CSSProperties = {
    position: 'fixed', top: 18, left: 24, right: 24, zIndex: 20, maxWidth: 1400, margin: '0 auto',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
    height: 54, padding: '0 24px', boxSizing: 'border-box', borderRadius: 10,
    background: 'rgba(250,243,222,0.35)', backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 0 30px rgba(255,255,255,0.15)',
    transform: visible ? 'translateY(0)' : 'translateY(-140%)',
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'auto' : 'none',
    transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease',
  };

  return (
    <nav style={navStyle}>
      <div style={NAV_PILL_STYLE}>
        <Link href="/#top" className="hover-accent" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, letterSpacing: '0.02em', color: '#414d38', textDecoration: 'none' }}>
          Haopeng Liu
        </Link>
      </div>
      <div style={{ ...NAV_PILL_STYLE, gap: 28 }}>
        <Link href="/#work" className="hover-accent" style={linkStyle}>Projects</Link>
        <Link href="/about" className="hover-accent" style={linkStyle}>About</Link>
        <Link href="/#contact" className="hover-accent" style={linkStyle}>Contact</Link>
        {showBackToMaze && (
          <>
            <span style={{ width: 1, height: 16, background: 'rgba(65,77,56,0.22)' }} />
            <Link href="/#top" className="hover-accent" style={{ ...linkStyle, letterSpacing: '0.06em', fontWeight: 600 }}>&larr; Maze</Link>
          </>
        )}
      </div>
      <div style={{ ...NAV_PILL_STYLE, gap: 14 }}>
        <button
          onClick={onToggleAudio}
          title="Toggle sound"
          className="icon-btn"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'rgba(65,77,56,0.08)', color: '#414d38', cursor: onToggleAudio ? 'pointer' : 'default', padding: 0 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#414d38" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: audioOn ? 1 : 0.45 }}>
            <circle cx="12" cy="12" r="10.5" />
            <path d="M9.2 10.2H7v3.6h2.2l3.1 2.6V7.6z" fill="#414d38" stroke="none" />
            <path d="M14.8 9.6c0.8 0.7 1.3 1.5 1.3 2.4s-0.5 1.7-1.3 2.4" />
            <path d="M16.3 8c1.3 1.1 2.1 2.4 2.1 4s-0.8 2.9-2.1 4" />
          </svg>
        </button>
        <button onClick={onToggleTheme} title="Toggle theme" style={themeTrackStyle}>
          <span style={themeKnobStyle}>
            {darkMode ? (
              <span style={{ position: 'relative', width: 12, height: 12 }}>
                <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#f0ede5' }} />
                <span style={{ position: 'absolute', top: -3, right: -4, width: 12, height: 12, borderRadius: '50%', background: '#1c2818' }} />
              </span>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1c1c1c" strokeWidth={2} strokeLinecap="round">
                <circle cx="12" cy="12" r="4.5" fill="#1c1c1c" stroke="none" />
                <line x1="12" y1="1.5" x2="12" y2="4.5" />
                <line x1="12" y1="19.5" x2="12" y2="22.5" />
                <line x1="1.5" y1="12" x2="4.5" y2="12" />
                <line x1="19.5" y1="12" x2="22.5" y2="12" />
                <line x1="4.4" y1="4.4" x2="6.5" y2="6.5" />
                <line x1="17.5" y1="17.5" x2="19.6" y2="19.6" />
                <line x1="4.4" y1="19.6" x2="6.5" y2="17.5" />
                <line x1="17.5" y1="6.5" x2="19.6" y2="4.4" />
              </svg>
            )}
          </span>
        </button>
      </div>

      <style jsx>{`
        .hover-accent:hover { color: #a8762f; }
        .icon-btn:hover { background: rgba(65, 77, 56, 0.16); }
      `}</style>
    </nav>
  );
}
