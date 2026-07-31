'use client';

import { useEffect, useRef, useState } from 'react';
import SiteNav from './SiteNav';
import { HOW_I_WORK_CARDS, AI_PROCESS_STEPS, WORK_TRACKS } from '@/lib/aboutContent';

function Placeholder({ label, style }: { label: string; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(65,77,56,0.06)', border: '1px solid rgba(65,77,56,0.12)', color: 'rgba(65,77,56,0.45)',
        fontFamily: "'Karla', sans-serif", fontSize: 13, textAlign: 'center', padding: 12, boxSizing: 'border-box',
        ...style,
      }}
    >
      {label}
    </div>
  );
}

export default function About() {
  const [workActive, setWorkActive] = useState(0);

  const hiwTrackRef = useRef<HTMLDivElement | null>(null);
  const workCardRef = useRef<HTMLDivElement | null>(null);
  const workScrollLock = useRef(false);
  const hiwSnapTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const el = hiwTrackRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const dom = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (!dom) return;
      const atStart = el.scrollLeft <= 0;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1;
      if ((dom < 0 && atStart) || (dom > 0 && atEnd)) return;
      e.preventDefault();
      // CSS scroll-snap fights programmatic scrollLeft writes (snaps back instantly);
      // suspend snapping while the wheel gesture is active, restore after it settles.
      el.style.scrollSnapType = 'none';
      el.scrollLeft += dom;
      clearTimeout(hiwSnapTimer.current);
      hiwSnapTimer.current = setTimeout(() => { el.style.scrollSnapType = 'x mandatory'; }, 150);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  useEffect(() => {
    const el = workCardRef.current;
    if (!el) return;
    const n = WORK_TRACKS.length;
    const onWheel = (e: WheelEvent) => {
      if (workScrollLock.current) return;
      const dom = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (!dom) return;
      const dir = dom > 0 ? 1 : -1;
      setWorkActive((cur) => {
        const next = Math.min(n - 1, Math.max(0, cur + dir));
        if (next === cur) return cur;
        e.preventDefault();
        workScrollLock.current = true;
        setTimeout(() => { workScrollLock.current = false; }, 550);
        return next;
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const current = WORK_TRACKS[workActive];

  return (
    <div style={{ background: '#f6ecd6', color: '#414d38', fontFamily: "'Karla', sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>
      <SiteNav showBackToMaze />

      {/* Section 1 — About me */}
      <section style={{ position: 'relative', padding: '140px 8vw 110px', boxSizing: 'border-box' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 72, alignItems: 'center', maxWidth: 1240, margin: '0 auto' }} className="about-hero-grid">
          <div>
            <div style={{ fontSize: 13, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#5f7a4a', fontWeight: 600 }}>Who I Am</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 'clamp(40px, 5.4vw, 82px)', lineHeight: 1.04, margin: '18px 0 0', letterSpacing: '-0.01em' }}>
              A designer who <em style={{ fontStyle: 'italic', color: '#5f7a4a' }}>finds the way through.</em>
            </h1>
            <div style={{ fontSize: 18, lineHeight: 1.7, maxWidth: '34em', margin: '30px 0 0', color: '#4a5641', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ margin: 0 }}>Every design challenge starts like a maze: no clear view of the way out, just walls in front of you. UX design is the practice of walking it first, so the people who come after don&rsquo;t have to.</p>
              <p style={{ margin: 0 }}>Hi, I&rsquo;m Haopeng Liu, a UX Designer &amp; Researcher based in Seattle. For the past 6+ years, I&rsquo;ve been getting delightfully lost in ambiguity, on purpose, discovering where people hesitate, uncovering the patterns beneath the noise, and turning that into something that feels like a straight line.</p>
              <p style={{ margin: 0 }}>That&rsquo;s shown up as turning early-stage ideas into experiences people actually enjoy using, translating millions of data points into direction teams can act on, and simplifying complex, high-stakes enterprise systems into flows people trust without thinking twice. Right now, I&rsquo;m especially drawn to the maze of AI-native design: building in the guardrails, trust, and moments of control that keep people oriented even as the tools get smarter.</p>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: '-18px -18px auto auto', width: '62%', height: '62%', border: '1px solid rgba(65,77,56,0.3)', borderRadius: 24, zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1, aspectRatio: '4/5', borderRadius: 24, overflow: 'hidden', boxShadow: '0 30px 70px -30px rgba(30,45,25,0.4)', animation: 'aboutFloat 8s ease-in-out infinite' }}>
              <Placeholder label="Portrait of Haopeng" />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — How I work */}
      <section style={{ position: 'relative', padding: '30px 0 110px', boxSizing: 'border-box', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 8vw', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, borderTop: '1px solid rgba(65,77,56,0.16)', paddingTop: 40 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 'clamp(32px, 4.2vw, 58px)', margin: 0, lineHeight: 1.05 }}>How I work</h2>
            <p style={{ fontSize: 16, color: '#5f7a4a', maxWidth: '26em', margin: 0 }}>
              Nine moves I return to whether I&rsquo;m sketching alone or steering a room full of stakeholders.{' '}
              <span style={{ whiteSpace: 'nowrap', fontWeight: 600, color: '#414d38' }}>Scroll to walk them &rarr;</span>
            </p>
          </div>
        </div>

        <div
          ref={hiwTrackRef}
          className="hiw-track"
          style={{ display: 'flex', gap: 22, marginTop: 44, padding: '6px 8vw 30px', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollPaddingLeft: '8vw', WebkitOverflowScrolling: 'touch' }}
        >
          {HOW_I_WORK_CARDS.map((card) => (
            <article
              key={card.num}
              style={{
                flex: 'none', width: 372, scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column',
                padding: '38px 36px', borderRadius: 22,
                background: card.dark ? '#1c2818' : '#fffaf0',
                border: '1px solid rgba(65,77,56,0.14)',
                boxShadow: card.dark ? '0 20px 50px -30px rgba(30,45,25,0.7)' : '0 20px 50px -34px rgba(30,45,25,0.5)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <span style={{
                  fontFamily: "'Karla', sans-serif", fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600,
                  color: card.dark ? '#b0bd86' : '#5f7a4a',
                  padding: '6px 14px', borderRadius: 999,
                  border: card.dark ? '1px solid rgba(139,160,95,0.4)' : '1px solid rgba(65,77,56,0.28)',
                }}>{card.tag}</span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, color: card.dark ? '#8ba05f' : '#b0bd86', lineHeight: 1 }}>{card.num}</span>
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 27, lineHeight: 1.15, margin: '26px 0 12px', color: card.dark ? '#ffffff' : '#414d38' }}>{card.title}</h3>
              <p style={{ fontSize: 15.5, lineHeight: 1.65, color: card.dark ? '#cdd4bf' : '#4a5641', margin: 0 }}>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Section 3 — AI design process */}
      <section style={{ position: 'relative', background: '#1c2818', color: '#eef0e4', padding: '100px 8vw 110px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ fontSize: 13, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#8ba05f', fontWeight: 600 }}>Working with AI</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 'clamp(32px, 4.4vw, 62px)', margin: '16px 0 0', lineHeight: 1.04, color: '#ffffff', maxWidth: '15em' }}>
            AI is my lantern, <em style={{ fontStyle: 'italic', color: '#b0bd86' }}>not my compass.</em>
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: '#cdd4bf', maxWidth: '38em', margin: '26px 0 0' }}>
            I use AI to widen the search space and move faster through the maze &mdash; never to decide which exit matters. Here&rsquo;s how a typical loop runs.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginTop: 64 }} className="ai-steps-grid">
            {AI_PROCESS_STEPS.map((step, i) => {
              const isLast = i === AI_PROCESS_STEPS.length - 1;
              return (
                <div key={step.num} style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{
                      flex: 'none', width: 44, height: 44, borderRadius: '50%', display: 'grid', placeItems: 'center',
                      fontFamily: "'Cormorant Garamond', serif", fontSize: 20,
                      border: isLast ? 'none' : '1px solid #8ba05f',
                      background: isLast ? '#8ba05f' : 'transparent',
                      color: isLast ? '#1c2818' : '#b0bd86',
                    }}>{step.num}</span>
                    {!isLast && <span style={{ flex: 1, height: 1, background: 'linear-gradient(to right, #4a5c3a, rgba(74,92,58,0))' }} />}
                  </div>
                  <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 23, margin: '22px 0 8px', color: '#ffffff' }}>{step.title}</h4>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: '#b9c1ab', margin: 0 }}>{step.body}</p>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 56, padding: '28px 32px', borderRadius: 18, border: '1px solid rgba(139,160,95,0.4)', background: 'rgba(139,160,95,0.08)', display: 'flex', gap: 18, alignItems: 'flex-start', maxWidth: '46em' }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, lineHeight: 0.7, color: '#8ba05f' }}>&ldquo;</span>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 22, lineHeight: 1.45, margin: 0, color: '#eef0e4' }}>
              The model can generate a thousand doors. Judgment is knowing which one is worth opening.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4 — Outside of work */}
      <section style={{ position: 'relative', padding: '100px 8vw 120px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 'clamp(32px, 4.2vw, 58px)', margin: 0, lineHeight: 1.05 }}>
              When I&rsquo;m not <em style={{ fontStyle: 'italic', color: '#5f7a4a' }}>at the wall</em>
            </h2>
            <p style={{ fontSize: 16, color: '#5f7a4a', maxWidth: '24em', margin: 0 }}>The maze doesn&rsquo;t stop at the office. A few of the things that keep me curious.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: 150, gap: 16, marginTop: 46 }} className="outside-grid">
            <div style={{ gridColumn: 'span 2', gridRow: 'span 2', borderRadius: 20, overflow: 'hidden' }}>
              <Placeholder label="Trail running in the Cascades" />
            </div>
            <div style={{ gridColumn: 'span 1', gridRow: 'span 1', borderRadius: 20, overflow: 'hidden' }}>
              <Placeholder label="Ceramics" />
            </div>
            <div style={{ gridColumn: 'span 1', gridRow: 'span 2', borderRadius: 20, overflow: 'hidden' }}>
              <Placeholder label="Film photography" />
            </div>
            <div style={{ gridColumn: 'span 1', gridRow: 'span 1', borderRadius: 20, overflow: 'hidden' }}>
              <Placeholder label="Sourdough" />
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 — Work with me */}
      <section style={{ position: 'relative', padding: '20px 8vw 130px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ borderTop: '1px solid rgba(65,77,56,0.16)', paddingTop: 44, display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 56, alignItems: 'end' }} className="work-intro-grid">
            <div>
              <div style={{ fontSize: 13, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#5f7a4a', fontWeight: 600 }}>Work with me</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 'clamp(32px, 4.2vw, 58px)', margin: '18px 0 0', lineHeight: 1.05 }}>
                Different teams face <em style={{ fontStyle: 'italic', color: '#5f7a4a' }}>different mazes.</em>
              </h2>
            </div>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: '#4a5641', margin: 0 }}>
              Whether you&rsquo;re scaling an enterprise product, building from zero, or need focused expertise to navigate a critical challenge, I help teams uncover opportunities, make confident decisions, and create experiences people trust.
            </p>
          </div>

          <div ref={workCardRef} style={{ marginTop: 56, padding: 48, borderRadius: 24, background: '#fffaf0', border: '1px solid rgba(65,77,56,0.14)', boxShadow: '0 24px 60px -36px rgba(30,45,25,0.4)', display: 'grid', gridTemplateColumns: '300px 1fr', gap: 56, alignItems: 'start' }} className="work-card-grid">
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              {WORK_TRACKS.map((t, i) => {
                const isActive = i === workActive;
                const isLast = i === WORK_TRACKS.length - 1;
                return (
                  <div
                    key={t.shortName}
                    onClick={() => setWorkActive(i)}
                    style={{
                      display: 'flex', alignItems: 'baseline', gap: 14, cursor: 'pointer', padding: '22px 0 22px 20px',
                      borderLeft: isActive ? '3px solid #414d38' : '3px solid transparent',
                      borderBottom: isLast ? 'none' : '1px solid rgba(65,77,56,0.14)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <span style={{ fontFamily: "'Karla', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', color: isActive ? '#414d38' : 'rgba(65,77,56,0.4)' }}>0{i + 1}</span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 24, lineHeight: 1.2, color: isActive ? '#414d38' : 'rgba(65,77,56,0.4)', transition: 'color 0.3s ease' }}>{t.shortName}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ minHeight: 420 }}>
              <div style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5f7a4a', fontWeight: 600 }}>{current.kicker}</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 32, margin: '10px 0 16px', color: '#414d38' }}>{current.title}</h3>
              {current.desc.map((d, i) => (
                <p key={i} style={{ fontSize: 16, lineHeight: 1.65, color: '#4a5641', maxWidth: '46em', margin: '0 0 10px' }}>{d}</p>
              ))}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, marginTop: 22 }} className="work-detail-grid">
                <div>
                  <div style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5f7a4a', fontWeight: 600, marginBottom: 12 }}>{current.bringLabel}</div>
                  <ul style={{ margin: 0, padding: '0 0 0 18px', fontSize: 15, lineHeight: 1.6, color: '#4a5641', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {current.bring.map((b) => <li key={b}>{b}</li>)}
                  </ul>
                </div>
                <div>
                  <div style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5f7a4a', fontWeight: 600, marginBottom: 12 }}>{current.proofLabel}</div>
                  <ul style={{ margin: 0, padding: '0 0 0 18px', fontSize: 15, lineHeight: 1.6, color: '#4a5641', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {current.proof.map((p, i) => (
                      <li key={i}><strong style={{ color: '#414d38' }}>{p.name}</strong>{p.text}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {current.pricing && (
                <div style={{ marginTop: 26, padding: '22px 26px', borderRadius: 16, border: '1px solid rgba(65,77,56,0.2)', background: '#fffaf0' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 21, margin: 0, color: '#414d38' }}>The 10-Hour Path</h4>
                    <div style={{ fontSize: 14, color: '#5f7a4a', fontWeight: 600 }}>10 hours/week &middot; Starting at $X/month</div>
                  </div>
                  <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#4a5641', margin: '10px 0 0' }}>
                    A flexible design partnership for teams that need consistent senior UX support without a full-time commitment.
                  </p>
                </div>
              )}

              <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid rgba(65,77,56,0.14)', fontSize: 14.5, color: '#5f7a4a' }}>
                <strong style={{ color: '#414d38', fontWeight: 600 }}>Best fit:</strong> {current.bestFit}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 56, paddingTop: 40, borderTop: '1px solid rgba(65,77,56,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 600, lineHeight: 1.15 }}>Let&rsquo;s find the right path forward.</div>
              <p style={{ fontSize: 15, color: '#5f7a4a', margin: '10px 0 0', maxWidth: '34em' }}>Every product starts somewhere in the maze. The question is: which path do you need help uncovering?</p>
            </div>
            <a href="/#contact" className="talk-link" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 54, padding: '0 40px', borderRadius: 999, border: '2px solid #414d38', fontSize: 14, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, color: '#414d38', flex: 'none', textDecoration: 'none' }}>
              Let&rsquo;s talk &rarr;
            </a>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes aboutFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .hiw-track { scrollbar-width: thin; scrollbar-color: rgba(65,77,56,0.35) transparent; }
        .hiw-track::-webkit-scrollbar { height: 8px; }
        .hiw-track::-webkit-scrollbar-track { background: rgba(65,77,56,0.08); border-radius: 999px; }
        .hiw-track::-webkit-scrollbar-thumb { background: rgba(65,77,56,0.32); border-radius: 999px; }
        .hiw-track::-webkit-scrollbar-thumb:hover { background: rgba(65,77,56,0.5); }
      `}</style>
      <style jsx>{`
        .talk-link:hover { background: #414d38; color: #f6ecd6; }
        @media (max-width: 860px) {
          .about-hero-grid { grid-template-columns: 1fr !important; }
          .ai-steps-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .outside-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .work-intro-grid { grid-template-columns: 1fr !important; }
          .work-card-grid { grid-template-columns: 1fr !important; }
          .work-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
