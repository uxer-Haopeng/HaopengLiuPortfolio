import Image from 'next/image';

export default function CaseStudyFooter() {
  return (
    <section style={{ position: 'relative', marginTop: 80, background: '#f3f3f3', borderRadius: '40px 40px 0 0', padding: '48px 24px 40px', textAlign: 'center', overflow: 'hidden' }}>
      <Image src="/images/case-studies/shared/flower-row.png" alt="" width={1337} height={96} style={{ width: '100%', maxWidth: 1337, height: 'auto', margin: '0 auto 24px' }} />

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <Image
          src="/images/case-studies/shared/highlight-contact.svg"
          alt=""
          width={540}
          height={53}
          style={{ position: 'absolute', left: '50%', top: '55%', transform: 'translate(-50%, -50%) rotate(-3.5deg)', width: '115%', height: 'auto', zIndex: 0 }}
        />
        <h2
          style={{
            fontFamily: 'var(--font-holtwood), serif', fontWeight: 400, fontSize: 'clamp(32px, 5vw, 60px)',
            color: '#000', position: 'relative', zIndex: 1, margin: 0,
          }}
        >
          Keep in touch
        </h2>
      </div>
      <p style={{ fontFamily: 'var(--font-roboto), sans-serif', fontSize: 20, margin: '16px auto 0', maxWidth: 480 }}>
        Always ready for awesome conversations!
        <br />
        <span style={{ fontWeight: 200 }}>Shoot me an Email, drop me a line on LinkedIn, or chat over coffee and boba :)</span>
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 32 }}>
        <a
          href="mailto:hello@haopengliu.com"
          title="Email"
          style={{ width: 44, height: 44, borderRadius: 28, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Image src="/images/case-studies/shared/email-icon.svg" alt="" width={20} height={20} />
        </a>
        <a
          href="https://www.linkedin.com/in/haopeng-liu/"
          target="_blank"
          rel="noopener"
          title="LinkedIn"
          style={{ width: 44, height: 44, borderRadius: 28, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Image src="/images/case-studies/shared/linkedin-icon.svg" alt="" width={20} height={20} />
        </a>
      </div>
    </section>
  );
}
