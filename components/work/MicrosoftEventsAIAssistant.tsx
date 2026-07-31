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
const IMG_BASE = '/images/case-studies/ms-ai-assistant';

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

function FlowStat({ value, label, style }: { value: string; label: string; style: React.CSSProperties }) {
  return (
    <div style={{ position: 'absolute', background: '#fffcf2', border: `1px solid ${GOLD}`, borderRadius: 10, padding: '14px 18px', boxShadow: '4px 4px 5px rgba(209,155,8,0.1)', display: 'flex', gap: 10, alignItems: 'flex-start', ...style }}>
      <span style={{ ...heading, fontSize: 'clamp(18px, 2.2vw, 32px)', color: GOLD, whiteSpace: 'nowrap' }}>{value}</span>
      <span style={{ ...body, fontSize: 'clamp(10px, 1.1vw, 16px)', color: '#000', maxWidth: 140 }}>{label}</span>
    </div>
  );
}

function DecisionCardView({ card, kind }: { card: ComparisonCard; kind: 'problem' | 'solution' }) {
  return (
    <div style={{ flex: '1 1 400px', minWidth: 280, position: 'relative', background: '#fbfbfb', borderRadius: 10, overflow: 'hidden', aspectRatio: '564 / 546' }}>
      <Image src={card.image} alt="" fill style={{ objectFit: 'cover' }} sizes="(max-width: 900px) 100vw, 564px" />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '5.5% 5.3% 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h4 style={{ ...heading, fontSize: 20 }}>{kind === 'problem' ? card.tag : card.title}</h4>
        <p style={{ ...body, fontSize: 16 }}>{card.body}</p>
      </div>
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
          <Image src={`${IMG_BASE}/hero-collage.png`} alt="Microsoft Events AI Assistant collage" fill style={{ objectFit: 'cover' }} sizes="100vw" priority />
        </div>
        <p style={{ ...body, fontSize: 16, textAlign: 'center', maxWidth: 615, margin: '32px auto 0' }}>
          <strong>Disclaimer</strong>
          <br />
          <span style={{ fontWeight: 300 }}>{HERO.disclaimer}</span>
        </p>
      </section>

      {/* Overview bento */}
      <section style={{ maxWidth: 1240, margin: '40px auto 0', padding: '0 24px' }}>
        <div className="ms-bento" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          {/* Left: Challenge + Solution */}
          <div style={{ flex: '321 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 24, background: 'linear-gradient(180deg, #88d8fa 0%, #d2f066 100%)', borderRadius: 10, padding: 24, color: '#fff' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ ...body, fontWeight: 300, fontSize: 20, color: '#fff' }}>Challenge</span>
              <span style={{ ...body, fontWeight: 500, fontSize: 24, color: '#fff' }}>{OVERVIEW.challenge}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ ...body, fontWeight: 300, fontSize: 20, color: '#fff' }}>Solution</span>
              <span style={{ ...body, fontWeight: 500, fontSize: 24, color: '#fff' }}>{OVERVIEW.solution}</span>
            </div>
          </div>

          {/* Middle: Role / Deliverable / Team */}
          <div style={{ flex: '476 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#b9fac9', borderRadius: 10, padding: 24 }}>
              <span style={{ ...body, fontWeight: 300, fontSize: 20, color: '#219b24', display: 'block', marginBottom: 8 }}>Role</span>
              <span style={{ ...body, fontWeight: 500, fontSize: 20, color: '#219b24' }}>{OVERVIEW.role}</span>
            </div>
            <div style={{ background: '#88d8fa', borderRadius: 10, padding: 24 }}>
              <span style={{ ...body, fontWeight: 300, fontSize: 20, color: '#fff', display: 'block', marginBottom: 8 }}>Deliverable</span>
              <ul style={{ ...body, fontWeight: 500, fontSize: 16, color: '#fff', margin: 0, paddingLeft: 20 }}>
                {OVERVIEW.deliverables.map((d) => <li key={d}>{d}</li>)}
              </ul>
            </div>
            <div style={{ background: '#89ea8b', borderRadius: 10, padding: 24 }}>
              <span style={{ ...body, fontWeight: 300, fontSize: 20, color: '#fff', display: 'block', marginBottom: 8 }}>Team</span>
              <ul style={{ ...body, fontWeight: 500, fontSize: 16, color: '#fff', margin: 0, paddingLeft: 20 }}>
                {OVERVIEW.team.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </div>
          </div>

          {/* Right: compound quick-stats */}
          <div style={{ flex: '327 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 15 }}>
            <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', background: '#ffff8c', aspectRatio: '327 / 343' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '44.02%', background: '#d7d72d', padding: '6.7% 7.3% 0', boxSizing: 'border-box' }}>
                <div style={{ ...heading, fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 700, color: '#fff' }}>{OVERVIEW.quickStats[0].value}</div>
                <div style={{ ...body, fontSize: 'clamp(14px, 1.5vw, 20px)', fontWeight: 500, color: '#fff' }}>{OVERVIEW.quickStats[0].label}</div>
              </div>
              <div style={{ position: 'absolute', top: '44.02%', left: 0, right: 0, height: '31.78%', background: '#ecec54', padding: '6% 7.3% 0', boxSizing: 'border-box' }}>
                <div style={{ ...heading, fontSize: 'clamp(20px, 2.4vw, 32px)', fontWeight: 700, color: '#a3b409' }}>{OVERVIEW.quickStats[2].value}</div>
                <div style={{ ...body, fontSize: 'clamp(14px, 1.5vw, 20px)', fontWeight: 500, color: '#a3b409' }}>{OVERVIEW.quickStats[2].label}</div>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '23.96%', padding: '7% 7.3% 0', boxSizing: 'border-box' }}>
                <div style={{ ...heading, fontSize: 'clamp(20px, 2.4vw, 32px)', fontWeight: 700, color: '#cadf08' }}>{OVERVIEW.quickStats[1].value}</div>
                <div style={{ ...body, fontSize: 'clamp(14px, 1.5vw, 20px)', fontWeight: 500, color: '#cadf08' }}>{OVERVIEW.quickStats[1].label}</div>
              </div>
            </div>
            <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', background: '#eaffef', aspectRatio: '327 / 235', flex: 1 }}>
              <div style={{ position: 'absolute', bottom: 0, left: '3.98%', width: '62.08%', height: '31.1%', background: '#61d0ff', borderRadius: '4px 4px 0 0', padding: '6% 0 0 5.4%', boxSizing: 'border-box' }}>
                <div style={{ ...heading, fontSize: 'clamp(18px, 2vw, 32px)', fontWeight: 700, color: '#fff' }}>{OVERVIEW.quickStats[3].value}</div>
                <div style={{ ...body, fontSize: 'clamp(12px, 1.3vw, 20px)', fontWeight: 500, color: '#fff' }}>{OVERVIEW.quickStats[3].label}</div>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: '50.46%', width: '49.54%', height: '88.09%', background: '#58a8f8', borderRadius: '4px 0 10px 0', padding: '4.3% 0 0 8.6%', boxSizing: 'border-box' }}>
                <div style={{ ...heading, fontSize: 'clamp(18px, 2vw, 32px)', fontWeight: 700, color: '#fff' }}>{OVERVIEW.quickStats[4].value}</div>
                <div style={{ ...body, fontSize: 'clamp(12px, 1.3vw, 20px)', fontWeight: 500, color: '#fff' }}>{OVERVIEW.quickStats[4].label}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section style={{ maxWidth: 1240, margin: '96px auto 0', padding: '0 24px', textAlign: 'center' }}>
        <h2 style={{ ...heading, fontSize: 'clamp(28px, 4vw, 40px)', maxWidth: 960, margin: '0 auto' }}>{PROBLEM.title}</h2>
        <p style={{ ...body, fontSize: 20, maxWidth: 1172, margin: '24px auto 0' }}>{PROBLEM.body}</p>
      </section>

      {/* Problem funnel chart (desktop) */}
      <section className="ms-problem-chart" style={{ maxWidth: 1440, margin: '48px auto 0', padding: '0 24px' }}>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1440 / 582.9371' }}>
          <div style={{ position: 'absolute', left: '-24.51%', top: '0%', width: '41.6%', height: '99.35%' }}>
            <Image src={`${IMG_BASE}/problem-flow-bg.svg`} alt="" fill style={{ objectFit: 'fill' }} />
          </div>
          <div style={{ position: 'absolute', left: '17.19%', top: '19.56%', width: '23.3%', height: '31.31%' }}>
            <Image src={`${IMG_BASE}/problem-flow-2.svg`} alt="" fill style={{ objectFit: 'fill' }} />
          </div>
          <div style={{ position: 'absolute', left: '17.26%', top: '38.77%', width: '23.23%', height: '28.48%' }}>
            <Image src={`${IMG_BASE}/problem-flow-4.svg`} alt="" fill style={{ objectFit: 'fill' }} />
          </div>
          <div style={{ position: 'absolute', left: '17.36%', top: '57.98%', width: '23.13%', height: '42.02%' }}>
            <Image src={`${IMG_BASE}/problem-flow-1.svg`} alt="" fill style={{ objectFit: 'fill' }} />
          </div>
          <div style={{ position: 'absolute', left: '39.69%', top: '28.65%', width: '22.47%', height: '34.31%' }}>
            <Image src={`${IMG_BASE}/problem-flow-3.svg`} alt="" fill style={{ objectFit: 'fill' }} />
          </div>
          <div style={{ position: 'absolute', left: '63.61%', top: '28.22%', width: '16.77%', height: '4.03%' }}>
            <Image src={`${IMG_BASE}/problem-flow-line-1.svg`} alt="" fill style={{ objectFit: 'fill' }} />
          </div>
          <div style={{ position: 'absolute', left: '63.61%', top: '32.34%', width: '16.88%', height: '1.97%' }}>
            <Image src={`${IMG_BASE}/problem-flow-line-2.svg`} alt="" fill style={{ objectFit: 'fill' }} />
          </div>

          <div style={{ position: 'absolute', left: '15.35%', top: '30.88%', width: '2.22%', height: '68.63%', background: '#fff1cc', borderRadius: 6 }} />
          <div style={{ position: 'absolute', left: '61.39%', top: '21.96%', width: '2.22%', height: '5.32%', background: '#eee', borderRadius: 6 }} />
          <div style={{ position: 'absolute', left: '61.39%', top: '28.65%', width: '2.22%', height: '34.31%', background: '#fff1cc', borderRadius: 6 }} />
          <div style={{ position: 'absolute', left: '80.07%', top: '28.14%', width: '2.22%', height: '3.43%', background: '#fff1cc', borderRadius: 6 }} />
          <div style={{ position: 'absolute', left: '80.07%', top: '32.25%', width: '2.22%', height: '2.06%', background: '#fff1cc', borderRadius: 6 }} />
          <div style={{ position: 'absolute', left: '80.07%', top: '35%', width: '2.22%', height: '29.34%', background: '#eee', borderRadius: 6 }} />

          <FlowStat value="255k" label="# of registered attendees" style={{ left: '16.46%', top: '73.07%' }} />
          <FlowStat value="50k" label="# of chatbot users" style={{ left: '39.38%', top: '51.47%' }} />
          <FlowStat value="81k" label="# of questions answered" style={{ left: '62.5%', top: '45.82%' }} />
          <FlowStat value="2.6k" label="Answers liked" style={{ left: '81.6%', top: '16.81%' }} />
          <FlowStat value="1.4k" label="Answers disliked" style={{ left: '81.6%', top: '32.77%' }} />
        </div>
      </section>

      {/* Problem stats (mobile fallback) */}
      <section className="ms-problem-simple" style={{ maxWidth: 1240, margin: '48px auto 0', padding: '0 24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 20 }}>
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
              <DecisionCardView card={pair.problem} kind="problem" />
              <DecisionCardView card={pair.solution} kind="solution" />
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
        <div className="ms-stats-row" style={{ display: 'flex', flexWrap: 'wrap', gap: 17, marginTop: 24 }}>
          {USABILITY_STATS.stats.map((s) => (
            <div key={s.label} style={{ background: '#fffcf2', border: `1px solid ${GOLD}`, borderRadius: 10, padding: 20, width: 280, height: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 8 }}>
              <span style={{ ...heading, fontSize: 60 }}>{s.value}</span>
              <span style={{ ...body, fontSize: 20 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Impact stats */}
      <section style={{ maxWidth: 1240, margin: '64px auto 0', padding: '0 24px 96px' }}>
        <div className="ms-impact-headers" style={{ display: 'flex', gap: 17, marginBottom: 8 }}>
          <h4 style={{ ...heading, fontSize: 20, flex: '1 1 577px' }}>For attendees:</h4>
          <h4 style={{ ...heading, fontSize: 20, flex: '1 1 577px' }}>For business:</h4>
        </div>
        <div className="ms-stats-row" style={{ display: 'flex', flexWrap: 'wrap', gap: 17 }}>
          {[...IMPACT_STATS.attendees, ...IMPACT_STATS.business].map((s) => (
            <div key={s.label} style={{ background: GOLD, borderRadius: 10, padding: 20, width: 280, height: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 16 }}>
              <div>
                <div style={{ ...heading, fontSize: 60, color: '#fff' }}>{s.value}</div>
                <div style={{ ...body, fontSize: 20, fontWeight: 700, color: '#fff' }}>{s.label}</div>
              </div>
              <div style={{ ...body, fontSize: 16, color: '#fff3d6' }}>{s.caption}</div>
            </div>
          ))}
        </div>
      </section>

      <CaseStudyFooter />

      <style jsx>{`
        @media (max-width: 900px) {
          .ms-bento { flex-direction: column; }
          .ms-problem-chart { display: none; }
          .ms-impact-headers { flex-direction: column; gap: 0; }
          .ms-stats-row { justify-content: center; }
        }
        @media (min-width: 901px) {
          .ms-problem-simple { display: none; }
        }
      `}</style>
    </div>
  );
}
