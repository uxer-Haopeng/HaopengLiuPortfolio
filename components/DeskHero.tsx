'use client';

import { useEffect, useRef, useState } from 'react';
import DeskSceneController from '@/lib/deskScene/DeskSceneController';

type Garden = 'color' | 'clay' | 'painterly';
type TimeOfDay = 'day' | 'dusk' | 'night';

export default function DeskHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const portfolioRef = useRef<HTMLDivElement | null>(null);
  const enterCueRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<DeskSceneController | null>(null);

  const [garden, setGarden] = useState<Garden>('color');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');

  useEffect(() => {
    document.documentElement.classList.add('desk-scene-active');
    document.body.classList.add('desk-scene-active');

    const controller = new DeskSceneController();
    controllerRef.current = controller;
    controller.mount({
      canvasEl: canvasRef.current,
      portfolioEl: portfolioRef.current,
      enterCueEl: enterCueRef.current,
      hintEl: hintRef.current,
      loadingEl: loadingRef.current,
    });

    return () => {
      controller.unmount();
      controllerRef.current = null;
      document.documentElement.classList.remove('desk-scene-active');
      document.body.classList.remove('desk-scene-active');
      document.body.removeAttribute('data-time');
    };
  }, []);

  const chooseGarden = (value: Garden) => {
    setGarden(value);
    controllerRef.current?.applyTweaks({ garden: value });
  };
  const chooseTime = (value: TimeOfDay) => {
    setTimeOfDay(value);
    controllerRef.current?.applyTweaks({ timeOfDay: value });
  };

  return (
    <div className="desk-scene-root">
      <canvas id="scene" ref={canvasRef} />

      <div id="enterCue" ref={enterCueRef}>
        <span>
          DRAG TO ORBIT <span style={{ letterSpacing: '0.22em' }}>&bull;</span>{' '}
          <span style={{ letterSpacing: '0.22em' }}>scroll to enter</span>
        </span>
        <span className="chev" />
      </div>
      <div id="loading" ref={loadingRef}>
        <div className="spinner" />
        <div>sculpting the desk&hellip;</div>
      </div>

      {/* PORTFOLIO — revealed by diving into the monitor screen */}
      <main id="portfolio" ref={portfolioRef} data-screen-label="Portfolio">
        <button
          id="backToDesk"
          className="pf-back pf-back-floating"
          title="Back to desk"
          onClick={() => controllerRef.current?.backToDesk()}
        >
          <svg viewBox="0 0 24 24" width={24} height={24} style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <iframe
          id="framer-embed"
          src="https://haopeng.framer.website/"
          title="Haopeng &middot; Portfolio"
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </main>

      {/* End-user scene settings (garden + time of day) — always visible, one click to change */}
      <div id="sceneSettingsDock">
        <div className="ss-dock-body">
          <div className="ss-group">
            <h4>Scene</h4>
            <div className="ss-options" data-group="garden">
              <button
                type="button"
                className={`ss-option${garden === 'color' ? ' active' : ''}`}
                title="Low-poly color"
                onClick={() => chooseGarden('color')}
              >
                <svg viewBox="0 0 24 24">
                  <defs>
                    <linearGradient id="gemGrad" x1="0" y1="0" x2="0.9" y2="1">
                      <stop offset="0" stopColor="#f2ece0" />
                      <stop offset="1" stopColor="#b7a68c" />
                    </linearGradient>
                  </defs>
                  <path d="M12 3 21 8.5 12 21 3 8.5 12 3Z" fill="url(#gemGrad)" />
                  <path d="M12 3 21 8.5 3 8.5 12 3Z" fill="#ffffff" opacity={0.4} />
                  <path d="M12 3v18M3 8.5h18" stroke="#8b8072" strokeWidth={0.8} opacity={0.5} />
                </svg>
                Color
              </button>
              <button
                type="button"
                className={`ss-option${garden === 'clay' ? ' active' : ''}`}
                title="Sculpted clay"
                onClick={() => chooseGarden('clay')}
              >
                <svg viewBox="0 0 24 24">
                  <defs>
                    <radialGradient id="clayGrad" cx="35%" cy="28%" r="75%">
                      <stop offset="0" stopColor="#f5efe4" />
                      <stop offset="0.6" stopColor="#dccdb6" />
                      <stop offset="1" stopColor="#b7a48b" />
                    </radialGradient>
                  </defs>
                  <path d="M4 15c0-4 3-9 8-9s8 5 8 9-4 5-8 5-8-1-8-5z" fill="url(#clayGrad)" />
                  <ellipse cx={9.5} cy={9} rx={2.6} ry={1.8} fill="#fff" opacity={0.4} />
                </svg>
                Clay
              </button>
              <button
                type="button"
                className={`ss-option${garden === 'painterly' ? ' active' : ''}`}
                title="Soft painterly"
                onClick={() => chooseGarden('painterly')}
              >
                <svg viewBox="0 0 24 24">
                  <defs>
                    <linearGradient id="paintGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#e9ddc9" />
                      <stop offset="1" stopColor="#a89b86" />
                    </linearGradient>
                  </defs>
                  <path d="M4 20c3-1 3-4 1-6-2-2-1-6 2-7 4-1.5 8 1 9 5 .8 3.2-1 6-4 6-2 0-2-2-3.5-2S8 20 4 20Z" fill="url(#paintGrad)" />
                  <circle cx={9} cy={9} r={1} fill="#fff" opacity={0.7} />
                </svg>
                Paint
              </button>
            </div>
          </div>
          <div className="ss-divider" />
          <div className="ss-group">
            <h4>Time of day</h4>
            <div className="ss-options" data-group="timeOfDay">
              <button
                type="button"
                className={`ss-option${timeOfDay === 'day' ? ' active' : ''}`}
                title="Day"
                onClick={() => chooseTime('day')}
              >
                <svg viewBox="0 0 24 24">
                  <defs>
                    <radialGradient id="sunGrad" cx="35%" cy="30%" r="70%">
                      <stop offset="0" stopColor="#f7f1e2" />
                      <stop offset="0.55" stopColor="#ddcdae" />
                      <stop offset="1" stopColor="#b6a487" />
                    </radialGradient>
                  </defs>
                  <g stroke="#a89c8a" strokeWidth={1.8} strokeLinecap="round">
                    <path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
                  </g>
                  <circle cx={12} cy={12} r={4.6} fill="url(#sunGrad)" />
                  <ellipse cx={10.5} cy={10.3} rx={1.6} ry={1.1} fill="#fff" opacity={0.55} />
                </svg>
                Day
              </button>
              <button
                type="button"
                className={`ss-option${timeOfDay === 'dusk' ? ' active' : ''}`}
                title="Dusk"
                onClick={() => chooseTime('dusk')}
              >
                <svg viewBox="0 0 24 24">
                  <defs>
                    <linearGradient id="duskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#d9cdb9" />
                      <stop offset="1" stopColor="#9c8f7a" />
                    </linearGradient>
                  </defs>
                  <path d="M12 4v4M6.5 8.5l1.4 1.4M17.5 8.5l-1.4 1.4" stroke="#a89c8a" strokeWidth={1.6} strokeLinecap="round" />
                  <path d="M6 17a6 6 0 0 1 12 0Z" fill="url(#duskGrad)" />
                  <path d="M4 17h16" stroke="#8b8072" strokeWidth={1.7} strokeLinecap="round" />
                  <path d="M2 20h20" stroke="#8b8072" strokeWidth={1.6} strokeLinecap="round" opacity={0.45} />
                </svg>
                Dusk
              </button>
              <button
                type="button"
                className={`ss-option${timeOfDay === 'night' ? ' active' : ''}`}
                title="Night"
                onClick={() => chooseTime('night')}
              >
                <svg viewBox="0 0 24 24">
                  <defs>
                    <radialGradient id="moonGrad" cx="30%" cy="30%" r="80%">
                      <stop offset="0" stopColor="#f2eee4" />
                      <stop offset="0.6" stopColor="#cfc4b0" />
                      <stop offset="1" stopColor="#a3947c" />
                    </radialGradient>
                  </defs>
                  <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" fill="url(#moonGrad)" />
                  <circle cx={17.2} cy={6.2} r={0.7} fill="#fff" opacity={0.85} />
                  <circle cx={20.2} cy={10.2} r={0.45} fill="#fff" opacity={0.6} />
                </svg>
                Night
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
