'use client';

import Link from 'next/link';
import Image from 'next/image';

const RESUME_URL = 'https://drive.google.com/file/d/1MwfzURVSEyff3mysYL8Pbk28BTuZQl7e/view?usp=sharing';

export default function CaseStudyNav() {
  return (
    <nav
      style={{
        position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 20,
        display: 'flex', alignItems: 'center', gap: 12,
        filter: 'drop-shadow(0px 4px 10px #f3f3f3)',
      }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 28, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
        <Image src="/images/case-studies/shared/nav-logo.svg" alt="Logo" width={20} height={20} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 44, borderRadius: 999, background: '#000', padding: '0 18px' }}>
        <Link href="/" style={{ color: '#fff', fontFamily: 'var(--font-roboto), sans-serif', fontSize: 16, textDecoration: 'none', padding: '8px 12px', borderRadius: 22 }}>
          Home
        </Link>
        <Link href="/#work" style={{ color: '#fff', fontFamily: 'var(--font-roboto), sans-serif', fontSize: 16, textDecoration: 'none', padding: '8px 12px', borderRadius: 22, background: '#525252' }}>
          Projects
        </Link>
        <Link href="/about" style={{ color: '#fff', fontFamily: 'var(--font-roboto), sans-serif', fontSize: 16, textDecoration: 'none', padding: '8px 12px', borderRadius: 22 }}>
          About
        </Link>
      </div>

      <a
        href={RESUME_URL}
        target="_blank"
        rel="noopener"
        title="Resume"
        style={{ width: 44, height: 44, borderRadius: 28, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}
      >
        <Image src="/images/case-studies/shared/nav-resume-icon.svg" alt="Resume" width={24} height={24} />
      </a>
    </nav>
  );
}
