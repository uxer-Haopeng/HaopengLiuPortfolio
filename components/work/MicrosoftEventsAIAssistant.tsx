'use client';

import Image from 'next/image';
import CaseStudyNav from '../CaseStudyNav';
import CaseStudyFooter from '../CaseStudyFooter';
import {
  HERO, OVERVIEW, PROBLEM, RESEARCH, STRATEGY, HMW, DECISIONS, REFLECTION, USABILITY_STATS, IMPACT_STATS,
  type ComparisonCard,
} from '@/lib/caseStudies/msAiAssistant';

const GOLD = '#fb0';
const INK = '#232f3e';

const heading: React.CSSProperties = {
  fontFamily: 'var(--font-roboto), sans-serif',
  fontWeight: 700,
  color: INK,
  margin: 0,
  lineHeight: 1.2,
};

const body: React.CSSProperties = {
  fontFamily: 'var(--font-roboto), sans-serif',
  fontWeight: 400,
  color: INK,
  lineHeight: 1.5,
};

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ background: '#fffcf2', border: `1px solid ${GOLD}`, borderRadius: 10, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 4, minWidth: 160, boxShadow: '4px 4px 5px rgba(209,155,8,0.1)' }}>
      <span style={{ ...heading, fontSize: 32, color: GOLD }}>{value}</span>
      <span style={{ ...body, fontSize: 15 }}>{label}</span>
    </div>
  );
}

function ComparisonCardView({ card, kind }: { card: ComparisonCard; kind: 'problem' | 'solution' }) {
  return (
    <div style={{ flex: '1 1 380px', background: '#fbfbfb', border: '1px solid #ccc', borderRadius: 10, overflow: 'hidden', minWidth: 300 }}>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span style={{ ...body, fontSize: 13, fontWeight: 700, color: kind === 'solution' ? GOLD : '#b04b3f', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {card.tag}
        </span>
        <h4 style={{ ...heading, fontSize: 20 }}>{card.title}</h4>
        <p style={{ ...body, fontSize: 15 }}>{card.body}</p>
      </div>
      <div style={{ position: 'relative', aspectRatio: '564 / 235', width: '100%' }}>
        <Image src={card.image} alt="" fill style={{ objectFit: 'cover' }} sizes="(max-width: 800px) 100vw, 564px" />
      </div>
      {card.caption && (
        <p style={{ ...body, fontSize: 12, color: '#9f9f9f', padding: '10px 24px 18px', fontStyle: 'italic' }}>{card.caption}</p>
      )}
    </div>
  );
}

export default function MicrosoftEventsAIAssistant() {
  return (
    <div style={{ background: '#fff', color: INK, overflowX: 'hidden' }}>
      <CaseStudyNav />

      {/* Hero */}
      <section style={{ maxWidth: 1240, margin: '0 auto', padding: '120px 24px 40px' }}>
        <h1 style={{ ...heading, fontSize: 40, color: GOLD, whiteSpace: 'pre-line', marginBottom: 24 }}>{HERO.title}</h1>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1377 / 622', borderRadius: 24, overflow: 'hidden' }}>
          <Image src="/images/case-studies/ms-ai-assistant/hero-collage.png" alt="Microsoft Events AI Assistant collage" fill style={{ objectFit: 'cover' }} sizes="100vw" priority />
        </div>
        <p style={{ ...body, fontSize: 16, textAlign: 'center', maxWidth: 615, margin: '32px auto 0' }}>
          <strong>Disclaimer</strong>
          <br />
          <span style={{ fontWeight: 200 }}>{HERO.disclaimer}</span>
        </p>
      </section>

      {/* Overview */}
      <section style={{ maxWidth: 1240, margin: '40px auto 0', padding: '0 24px' }}>
        <div className="ms-overview-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'linear-gradient(180deg, #8dd8f5 0%, #d4f26e 100%)', borderRadius: 20, padding: 24, flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ ...body, fontWeight: 200, fontSize: 20, color: INK }}>Challenge</span>
              <span style={{ ...body, fontWeight: 500, fontSize: 24, color: INK }}>{OVERVIEW.challenge}</span>
            </div>
            <div style={{ background: '#c1f5d0', borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ ...body, fontWeight: 200, fontSize: 20, color: INK }}>Solution</span>
              <span style={{ ...body, fontWeight: 500, fontSize: 24, color: INK }}>{OVERVIEW.solution}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#eafce0', borderRadius: 20, padding: 24 }}>
              <span style={{ ...body, fontWeight: 200, fontSize: 20, color: '#219b24', display: 'block' }}>Role</span>
              <span style={{ ...body, fontWeight: 500, fontSize: 20, color: '#219b24' }}>{OVERVIEW.role}</span>
            </div>
            <div style={{ background: '#8dd8f5', borderRadius: 20, padding: 24 }}>
              <span style={{ ...body, fontWeight: 200, fontSize: 20, color: INK, display: 'block', marginBottom: 8 }}>Deliverable</span>
              <ul style={{ ...body, fontWeight: 500, fontSize: 16, color: INK, margin: 0, paddingLeft: 20 }}>
                {OVERVIEW.deliverables.map((d) => <li key={d}>{d}</li>)}
              </ul>
            </div>
            <div style={{ background: '#fdfd8f', borderRadius: 20, padding: 24 }}>
              <span style={{ ...body, fontWeight: 200, fontSize: 20, color: INK, display: 'block', marginBottom: 8 }}>Team</span>
              <ul style={{ ...body, fontWeight: 500, fontSize: 16, color: INK, margin: 0, paddingLeft: 20 }}>
                {OVERVIEW.team.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#e6fced', borderRadius: 20, padding: 24, flex: 1 }}>
              <div style={{ ...heading, fontSize: 40, fontWeight: 600, color: INK }}>{OVERVIEW.quickStats[0].value}</div>
              <div style={{ ...body, fontSize: 20, fontWeight: 500, color: INK }}>{OVERVIEW.quickStats[0].label}</div>
            </div>
            <div style={{ background: INK, borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {OVERVIEW.quickStats.slice(1).map((s, i) => (
                <div key={s.label}>
                  <div style={{ ...heading, fontSize: 26, fontWeight: 600, color: i === 0 ? '#cadf08' : i === 1 ? '#a3b409' : '#fff' }}>{s.value}</div>
                  <div style={{ ...body, fontSize: 15, fontWeight: 500, color: '#fff' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section style={{ maxWidth: 1240, margin: '96px auto 0', padding: '0 24px', textAlign: 'center' }}>
        <h2 style={{ ...heading, fontSize: 'clamp(28px, 4vw, 40px)', maxWidth: 900, margin: '0 auto' }}>{PROBLEM.title}</h2>
        <p style={{ ...body, fontSize: 20, maxWidth: 1000, margin: '24px auto 0' }}>{PROBLEM.body}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 20, marginTop: 48 }}>
          {PROBLEM.stats.map((s) => <StatCard key={s.label} value={s.value} label={s.label} />)}
        </div>
      </section>

      {/* Research */}
      <section style={{ maxWidth: 1240, margin: '96px auto 0', padding: '0 24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {RESEARCH.cards.map((c) => (
            <div key={c.title} style={{ flex: '1 1 480px', minWidth: 320, background: '#fff', border: '1px solid #eee', borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '558 / 235' }}>
                <Image src={c.image} alt="" fill style={{ objectFit: 'cover' }} sizes="(max-width: 800px) 100vw, 574px" />
              </div>
              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ ...heading, fontSize: 20 }}>{c.title}</h3>
                <p style={{ ...body, fontSize: 16 }}>{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Strategy */}
      <section style={{ maxWidth: 1240, margin: '96px auto 0', padding: '0 24px', textAlign: 'center' }}>
        <h2 style={{ ...heading, fontSize: 'clamp(28px, 4vw, 40px)', maxWidth: 950, margin: '0 auto' }}>{STRATEGY.title}</h2>
        <p style={{ ...body, fontSize: 20, maxWidth: 1000, margin: '24px auto 0' }}>{STRATEGY.body}</p>
      </section>

      {/* HMW banner */}
      <section style={{ maxWidth: 1440, margin: '80px auto 0', padding: '0 24px' }}>
        <div style={{ background: `linear-gradient(0deg, ${GOLD} 0%, #fff1cc 100%)`, borderRadius: 20, padding: '40px 24px', textAlign: 'center' }}>
          <p style={{ ...body, fontSize: 16, color: '#fff', margin: 0 }}>{HMW.kicker}</p>
          <p style={{ ...body, fontWeight: 400, fontSize: 'clamp(22px, 3.5vw, 32px)', color: '#fff', margin: '8px auto 0', maxWidth: 750 }}>
            <strong style={{ fontWeight: 700 }}>HMW</strong> {HMW.title}
          </p>
        </div>
      </section>

      {/* Design decisions */}
      {DECISIONS.map((decision) => (
        <section key={decision.label} style={{ maxWidth: 1240, margin: '96px auto 0', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ display: 'inline-block', border: `1px solid ${GOLD}`, borderRadius: 10, padding: '8px 16px', color: GOLD, fontFamily: 'var(--font-roboto), sans-serif', fontSize: 20 }}>
              {decision.label}
            </span>
            <h2 style={{ ...heading, fontSize: 'clamp(28px, 4vw, 40px)', marginTop: 16 }}>{decision.title}</h2>
          </div>
          {decision.pairs.map((pair, i) => (
            <div key={i} style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 24, border: '1px solid #ccc', borderRadius: 10, padding: 20 }}>
              <ComparisonCardView card={pair.problem} kind="problem" />
              <ComparisonCardView card={pair.solution} kind="solution" />
            </div>
          ))}
        </section>
      ))}

      {/* Reflection */}
      <section style={{ maxWidth: 1240, margin: '96px auto 0', padding: '0 24px', textAlign: 'center' }}>
        <h2 style={{ ...heading, fontSize: 'clamp(28px, 4vw, 40px)', maxWidth: 950, margin: '0 auto' }}>{REFLECTION.title}</h2>
        <p style={{ ...body, fontSize: 20, maxWidth: 1050, margin: '24px auto 0' }}>{REFLECTION.body}</p>
      </section>

      {/* Usability stats */}
      <section style={{ maxWidth: 1240, margin: '64px auto 0', padding: '0 24px' }}>
        <h3 style={{ ...heading, fontSize: 20 }}>{USABILITY_STATS.kicker}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 17, marginTop: 24 }}>
          {USABILITY_STATS.stats.map((s) => (
            <div key={s.label} style={{ background: '#fffcf2', border: `1px solid ${GOLD}`, borderRadius: 10, padding: 20, width: 240, minHeight: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 8 }}>
              <span style={{ ...heading, fontSize: 60 }}>{s.value}</span>
              <span style={{ ...body, fontSize: 15 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Impact stats */}
      <section style={{ maxWidth: 1240, margin: '64px auto 0', padding: '0 24px 96px' }}>
        <div className="ms-impact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <h4 style={{ ...heading, fontSize: 20, marginBottom: 16 }}>For attendees:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {IMPACT_STATS.attendees.map((s) => (
                <div key={s.label} style={{ background: GOLD, borderRadius: 10, padding: 20, flex: '1 1 200px', minWidth: 180, color: '#fff', textAlign: 'center' }}>
                  <div style={{ ...heading, fontSize: 44, color: '#fff' }}>{s.value}</div>
                  <div style={{ ...body, fontSize: 18, fontWeight: 700, color: '#fff' }}>{s.label}</div>
                  <div style={{ ...body, fontSize: 14, color: '#fff3d6', marginTop: 8 }}>{s.caption}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ ...heading, fontSize: 20, marginBottom: 16 }}>For business:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {IMPACT_STATS.business.map((s) => (
                <div key={s.label} style={{ background: GOLD, borderRadius: 10, padding: 20, flex: '1 1 200px', minWidth: 180, color: '#fff', textAlign: 'center' }}>
                  <div style={{ ...heading, fontSize: 44, color: '#fff' }}>{s.value}</div>
                  <div style={{ ...body, fontSize: 18, fontWeight: 700, color: '#fff' }}>{s.label}</div>
                  <div style={{ ...body, fontSize: 14, color: '#fff3d6', marginTop: 8 }}>{s.caption}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CaseStudyFooter />

      <style jsx>{`
        @media (max-width: 900px) {
          .ms-overview-grid { grid-template-columns: 1fr !important; }
          .ms-impact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
