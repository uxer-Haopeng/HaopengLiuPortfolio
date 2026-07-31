'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import MazeController from '@/lib/mazeController';
import SiteNav from './SiteNav';
import { PILE_LABELS, PILE_EMOJIS, TESTIMONIALS, PROJECT_CARDS } from '@/lib/heroData';

export default function MazeHero() {
  const [audioOn, setAudioOn] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const mountRef = useRef<HTMLDivElement | null>(null);
  const mazeRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);
  const gardenRef = useRef<HTMLDivElement | null>(null);
  const pileRef = useRef<HTMLDivElement | null>(null);
  const caseRef = useRef<HTMLDivElement | null>(null);
  const contactSceneRef = useRef<HTMLDivElement | null>(null);

  const pileRefObjects = useRef(
    Array.from({ length: PILE_LABELS.length + PILE_EMOJIS.length }, () => ({ current: null as HTMLDivElement | null }))
  );
  const testimonialRefObjects = useRef(
    TESTIMONIALS.map(() => ({ current: null as HTMLDivElement | null }))
  );

  const controllerRef = useRef<MazeController | null>(null);

  useEffect(() => {
    const controller = new MazeController({
      onStateChange: (state: { audioOn: boolean; navVisible: boolean; darkMode: boolean }) => {
        setAudioOn(state.audioOn);
        setNavVisible(state.navVisible);
        setDarkMode(state.darkMode);
      },
    });
    controllerRef.current = controller;
    controller.mount({
      mountEl: mountRef.current,
      mazeEl: mazeRef.current,
      hintEl: hintRef.current,
      gardenEl: gardenRef.current,
      pileEl: pileRef.current,
      caseEl: caseRef.current,
      contactSceneEl: contactSceneRef.current,
      pileRefs: pileRefObjects.current,
      testimonialRefs: testimonialRefObjects.current,
    });
    return () => controller.unmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pileItems = useMemo(
    () => [
      ...PILE_LABELS.map((label) => ({ label, isPill: true, isEmoji: false })),
      ...PILE_EMOJIS.map((label) => ({ label, isPill: false, isEmoji: true })),
    ],
    []
  );

  const sectionBg = darkMode ? '#1c2818' : '#f6ecd6';
  const sectionText = darkMode ? '#f0ede5' : '#414d38';

  const floatingAudioStyle: React.CSSProperties = {
    position: 'fixed', right: 24, bottom: 24, zIndex: 2,
    display: 'flex', alignItems: 'center', gap: 10, minHeight: 44, padding: '0 20px',
    borderRadius: 999, border: '1px solid rgba(65,77,56,0.5)', background: 'rgba(250,243,222,0.6)',
    color: '#414d38', fontFamily: "'Karla', sans-serif", fontSize: 13, letterSpacing: '0.14em',
    textTransform: 'uppercase', cursor: 'pointer', backdropFilter: 'blur(8px)', boxShadow: '0 0 24px rgba(65,77,56,0.12)',
    opacity: navVisible ? 0 : 1,
    pointerEvents: navVisible ? 'none' : 'auto',
    transform: navVisible ? 'translate(-40px, -78vh) scale(0.2)' : 'translate(0, 0) scale(1)',
    transformOrigin: 'bottom right',
    transition: 'transform 0.7s cubic-bezier(0.5,0,0.2,1), opacity 0.55s ease 0.15s',
  };

  return (
    <div style={{ fontFamily: "'Karla', sans-serif", color: '#fdf6e3' }}>
      <SiteNav
        audioOn={audioOn}
        darkMode={darkMode}
        visible={navVisible}
        onToggleAudio={() => controllerRef.current?.toggleAudio()}
        onToggleTheme={() => controllerRef.current?.toggleTheme()}
      />

      <div ref={mazeRef} id="top" style={{ position: 'relative' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', zIndex: 0, overflow: 'hidden' }}>
          <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, marginTop: '-100vh' }}>
          <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px', boxSizing: 'border-box' }}>
            <div style={{ animation: 'softIn 1.6s ease both' }}>
              <div style={{ fontSize: 13, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#ffffff', fontWeight: 600, textShadow: '0 0 20px rgba(255,255,255,0.6), 0 2px 8px rgba(0,0,0,0.4)' }}>UX Designer</div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 'clamp(44px, 7vw, 100px)', lineHeight: 1.05, margin: '20px 0 0', color: '#ffffff', textShadow: '0 0 30px rgba(255,255,255,0.5), 0 4px 40px rgba(15,35,20,0.6)' }}>Hi, I&rsquo;m Haopeng Liu.</h1>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(24px, 3.2vw, 40px)', marginTop: 14, color: '#f5f5f0', textShadow: '0 0 25px rgba(255,255,255,0.4), 0 3px 28px rgba(15,35,20,0.65)' }}>I treat every design challenge like a maze.</div>
            </div>
            <div ref={hintRef} style={{ display: 'none', position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', flexDirection: 'column', alignItems: 'center', gap: 12, animation: 'hintBob 2.4s ease-in-out infinite', transition: 'opacity 0.5s ease' }}>
              <div style={{ fontSize: 17, color: '#e8e8e0', textShadow: '0 0 18px rgba(255,255,255,0.35), 0 2px 20px rgba(15,35,20,0.7)' }}>Scroll to walk through how I think.</div>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f5f5f0" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.4))' }}><path d="M12 5v14M5 12l7 7 7-7" /></svg>
            </div>
          </section>

          <div style={{ height: '90vh' }} />

          <section style={{ height: '150vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '0 8vw', boxSizing: 'border-box' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(30px, 4vw, 52px)', lineHeight: 1.25, maxWidth: '14em', margin: 0, color: '#ffffff', textShadow: '0 0 22px rgba(255,255,255,0.55), 0 2px 14px rgba(40,55,35,0.35)' }}>Every product begins with uncertainty.</p>
          </section>

          <section style={{ height: '150vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 8vw', boxSizing: 'border-box' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(22px, 2.6vw, 52px)', lineHeight: 1.25, maxWidth: 'none', whiteSpace: 'nowrap', margin: 0, textAlign: 'right', color: '#ffffff', textShadow: '0 0 22px rgba(255,255,255,0.55), 0 2px 14px rgba(40,55,35,0.35)' }}>Most people see walls. I look for openings.</p>
          </section>

          <section style={{ height: '150vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '0 8vw', boxSizing: 'border-box' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(30px, 4vw, 52px)', lineHeight: 1.25, maxWidth: '13em', margin: 0, color: '#ffffff', textShadow: '0 0 22px rgba(255,255,255,0.55), 0 2px 14px rgba(40,55,35,0.35)' }}>Research eliminates dead ends.</p>
          </section>

          <section style={{ height: '150vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 8vw', boxSizing: 'border-box' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(30px, 4vw, 52px)', lineHeight: 1.25, maxWidth: '13em', margin: 0, textAlign: 'right', color: '#ffffff', textShadow: '0 0 22px rgba(255,255,255,0.55), 0 2px 14px rgba(40,55,35,0.35)' }}>Strategy reveals the way forward.</p>
          </section>

          <section style={{ height: '150vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 8vw', boxSizing: 'border-box' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(30px, 4vw, 52px)', lineHeight: 1.25, maxWidth: '13em', margin: 0, textAlign: 'right', color: '#ffffff', textShadow: '0 0 22px rgba(255,255,255,0.55), 0 2px 14px rgba(40,55,35,0.35)' }}>Great design lights the path.</p>
          </section>

          <section style={{ height: '220vh', position: 'relative' }}>
            <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px', boxSizing: 'border-box' }}>
              <div ref={gardenRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30, opacity: 0, transform: 'translateY(28px)', transition: 'opacity 1.1s ease, transform 1.1s ease' }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 'clamp(38px, 5.6vw, 78px)', margin: 0, maxWidth: '16em', lineHeight: 1.12, color: '#ffffff', textShadow: '0 0 28px rgba(255,255,255,0.45), 0 4px 40px rgba(15,35,20,0.55)' }}>Every maze has a way out &mdash; a product people actually love.</h2>
                <button
                  onClick={() => controllerRef.current?.scrollToCases()}
                  className="cta-btn"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 56, padding: '0 46px', marginTop: 6, border: '2px solid #ffffff', borderRadius: 999, fontSize: 15, letterSpacing: '0.22em', textTransform: 'uppercase', cursor: 'pointer', color: '#ffffff', fontWeight: 500, fontFamily: "'Karla', sans-serif", backdropFilter: 'blur(6px)', background: 'rgba(180,195,140,0.25)', boxShadow: '0 0 40px rgba(255,255,255,0.3)' }}
                >
                  VIEW CASE STUDY &darr;
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Tag pile: hidden in the source design (display: none) — kept functional in case you want to re-enable it */}
      <section style={{ display: 'none', position: 'relative', zIndex: 2, background: sectionBg, borderTop: '1px solid rgba(65,77,56,0.14)', color: sectionText, padding: '110px 8vw 90px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(36px, 4.6vw, 60px)', margin: 0, lineHeight: 1.1 }}>Impactful Projects</h2>
          <p style={{ fontSize: 16, color: '#5f7a4a', margin: '16px 0 0' }}>A scattered pile of the corners I&rsquo;ve worked across &mdash; hover to send them tumbling.</p>
        </div>
        <div
          ref={pileRef}
          onMouseMove={(e) => controllerRef.current?.onPileMouseMove(e.nativeEvent)}
          onMouseLeave={() => controllerRef.current?.onPileMouseLeave()}
          style={{ position: 'relative', maxWidth: 1180, height: 420, margin: '56px auto 0', background: 'rgba(65,77,56,0.05)', border: '1px solid rgba(65,77,56,0.12)', borderRadius: 16, overflow: 'hidden' }}
        >
          {pileItems.map((item, i) =>
            item.isEmoji ? (
              <div
                key={i}
                ref={(el) => { pileRefObjects.current[i].current = el; }}
                style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderRadius: '50%', background: '#f6ecd6', border: '1px solid rgba(65,77,56,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, willChange: 'transform', cursor: 'pointer' }}
              >
                {item.label}
              </div>
            ) : (
              <div
                key={i}
                ref={(el) => { pileRefObjects.current[i].current = el; }}
                style={{ position: 'absolute', top: 0, left: 0, padding: '10px 20px', borderRadius: 999, background: '#414d38', color: '#f6ecd6', fontFamily: "'Karla', sans-serif", fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', boxShadow: '0 6px 16px rgba(65,77,56,0.18)', willChange: 'transform', cursor: 'pointer' }}
              >
                {item.label}
              </div>
            )
          )}
        </div>
      </section>

      <section ref={caseRef} id="work" style={{ position: 'relative', zIndex: 2, background: sectionBg, color: sectionText, padding: '132px 8vw 150px', boxSizing: 'border-box', scrollMarginTop: 68 }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ fontSize: 13, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#5f7a4a', fontWeight: 600 }}>Selected Work</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 'clamp(38px, 5vw, 66px)', lineHeight: 1.08, margin: '18px 0 0', maxWidth: '12em' }}>Where the paths led.</h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(19px, 2vw, 25px)', opacity: 0.72, margin: '16px 0 0', maxWidth: '26em' }}>Four mazes worth walking. Each one started as a dead end.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '72px 60px', marginTop: 74 }}>
            {PROJECT_CARDS.map((card) => (
              <Link key={card.href} href={card.href} className="case-card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: 22 }}>
                <div style={{ aspectRatio: '4 / 3', borderRadius: 8, overflow: 'hidden', background: 'rgba(65,77,56,0.06)', border: '1px solid rgba(65,77,56,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(65,77,56,0.4)', fontSize: 13 }}>
                  Add screenshot
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 30, lineHeight: 1.1, margin: 0 }}>{card.title}</h3>
                  <p style={{ fontSize: 15, lineHeight: 1.6, opacity: 0.75, margin: 0, maxWidth: '30em' }}>{card.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                    {card.tags.map((tag) => (
                      <span key={tag} style={{ fontSize: 12, padding: '6px 14px', border: '1px solid rgba(65,77,56,0.3)', borderRadius: 999 }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ position: 'relative', zIndex: 2, background: sectionBg, borderTop: '1px solid rgba(65,77,56,0.14)', color: sectionText, padding: '100px 8vw 130px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ fontSize: 13, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#5f7a4a', fontWeight: 600 }}>Just for Fun</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 'clamp(30px, 3.6vw, 44px)', lineHeight: 1.1, margin: '14px 0 0', maxWidth: '16em' }}>A side path I vibe-coded for the fun of it.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 60, alignItems: 'center', marginTop: 50 }}>
            <div style={{ aspectRatio: '4 / 3', borderRadius: 8, overflow: 'hidden', background: 'rgba(65,77,56,0.06)', border: '1px solid rgba(65,77,56,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(65,77,56,0.4)', fontSize: 13 }}>
              Add screenshot
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 12, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#5f7a4a', fontWeight: 600 }}>Vibe-Coded &middot; 2026</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 30, lineHeight: 1.1, margin: 0 }}>This 3D maze, actually</h3>
              <p style={{ fontSize: 15, lineHeight: 1.6, opacity: 0.75, margin: 0, maxWidth: '30em' }}>No brief, no deadline &mdash; just an excuse to build a hedge maze from scratch and see where it led. This is the hero you&rsquo;re scrolling through right now.</p>
              <a href="#top" className="fun-link" style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#a8762f', marginTop: 6, textDecoration: 'none' }}>See the project &rarr;</a>
            </div>
          </div>
        </div>
      </section>

      <section style={{ position: 'relative', zIndex: 2, background: sectionBg, borderTop: '1px solid rgba(65,77,56,0.14)', color: sectionText, padding: '130px 8vw', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ fontSize: 13, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#5f7a4a', fontWeight: 600 }}>Kind Words</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 'clamp(34px, 4.4vw, 58px)', lineHeight: 1.1, margin: '18px 0 0', maxWidth: '12em' }}>From people who walked the maze with me.</h2>
          <div style={{ position: 'relative', height: 480, maxWidth: 780, margin: '74px auto 0', touchAction: 'none' }}>
            {TESTIMONIALS.map((card, i) => (
              <div
                key={card.id}
                ref={(el) => { testimonialRefObjects.current[i].current = el; }}
                onMouseDown={(e) => controllerRef.current?.onCardDown(i, e.nativeEvent)}
                onTouchStart={(e) => controllerRef.current?.onCardDown(i, e.nativeEvent)}
                style={{ position: 'absolute', inset: 0, background: '#fdf9ee', borderRadius: 24, boxShadow: '0 24px 60px -20px rgba(65,77,56,0.35)', padding: '44px 40px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'grab', userSelect: 'none', willChange: 'transform' }}
              >
                <p style={{ fontFamily: "'Karla', sans-serif", fontStyle: 'normal', fontWeight: 500, fontSize: 24, lineHeight: 1.3, margin: 0 }}>{card.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 20 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{card.name}</div>
                    <div style={{ fontSize: 13, opacity: 0.65 }}>{card.title}</div>
                  </div>
                  {card.linkedin && (
                    <a
                      href={card.linkedin}
                      target="_blank"
                      rel="noopener"
                      onMouseDown={(e) => e.stopPropagation()}
                      title="View LinkedIn profile"
                      className="linkedin-chip"
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 999, background: '#0a66c2', flex: 'none', textDecoration: 'none' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" /></svg>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', fontFamily: "'Karla', sans-serif", whiteSpace: 'nowrap' }}>View profile</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 60, fontSize: 13, color: '#5f7a4a' }}>Drag a card to see the next.</div>
        </div>
      </section>

      {/* Contact: hidden in the source design (display: none) — kept functional in case you want to re-enable it */}
      <section id="contact" style={{ position: 'relative', zIndex: 2, scrollMarginTop: 68, display: 'none' }}>
        <div style={{ position: 'relative', height: 700, background: sectionBg, overflow: 'hidden' }}>
          <div ref={contactSceneRef} style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
          <div style={{ position: 'relative', zIndex: 3, display: 'flex', justifyContent: 'space-between', height: '100%', padding: '60px 8vw', gap: 50, alignItems: 'center', boxSizing: 'border-box' }}>
            <div style={{ maxWidth: 420 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: '#414d38' }}>Haopeng Liu</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 500, fontSize: 18, color: '#5f7a4a', marginTop: 8 }}>Every maze opens into something.</div>
              <a href="mailto:hello@haopengliu.com" className="email-btn" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 52, padding: '0 36px', marginTop: 26, borderRadius: 999, background: '#414d38', color: '#f6ecd6', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 500, fontSize: 20, textDecoration: 'none', boxShadow: '0 12px 32px -14px rgba(40,60,35,0.6)', cursor: 'pointer' }}>hello@haopengliu.com</a>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 32 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: '#414d38' }}>Connect</div>
                <a href="#" className="connect-link" style={{ fontSize: 14, color: '#5a6350', textDecoration: 'none', fontFamily: "'Karla', sans-serif" }}>LinkedIn</a>
                <a href="mailto:hello@haopengliu.com" className="connect-link" style={{ fontSize: 14, color: '#5a6350', textDecoration: 'none', fontFamily: "'Karla', sans-serif" }}>Email</a>
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: 28, right: '8vw', display: 'flex', alignItems: 'center', gap: 18, minHeight: 48, padding: '0 10px 0 20px', borderRadius: 999, background: 'rgba(255,252,244,0.94)', boxShadow: '0 10px 32px -14px rgba(40,60,35,0.5)' }}>
              <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5a6350', whiteSpace: 'nowrap' }}>&copy; Haopeng Liu</div>
              <div style={{ display: 'flex', gap: 7 }}>
                <a href="#" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', background: '#414d38', color: '#f6ecd6', fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>in</a>
                <a href="mailto:hello@haopengliu.com" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', background: '#414d38', color: '#f6ecd6', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>@</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <button onClick={() => controllerRef.current?.toggleAudio()} style={floatingAudioStyle}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#414d38" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: audioOn ? 1 : 0.45 }}>
          <circle cx="12" cy="12" r="10.5" />
          <path d="M9.2 10.2H7v3.6h2.2l3.1 2.6V7.6z" fill="#414d38" stroke="none" />
          <path d="M14.8 9.6c0.8 0.7 1.3 1.5 1.3 2.4s-0.5 1.7-1.3 2.4" />
          <path d="M16.3 8c1.3 1.1 2.1 2.4 2.1 4s-0.8 2.9-2.1 4" />
        </svg>
        <span>{audioOn ? 'Sound on' : 'Sound'}</span>
      </button>

      <style jsx>{`
        .cta-btn:hover { background: rgba(200, 220, 160, 0.4); box-shadow: 0 0 60px rgba(255, 255, 255, 0.5); }
        .case-card:hover { opacity: 1; }
        .fun-link:hover { color: #414d38; }
        .email-btn:hover { background: #2f3a2a; }
        .connect-link:hover { color: #414d38; }
        .linkedin-chip:hover { background: #084f96; }
      `}</style>
    </div>
  );
}
