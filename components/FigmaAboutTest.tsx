// Pixel-fidelity test: recreates the Figma "About" frame (5068:536) from the
// "Portfolio" file (1jLoIfx2YorTzOWLJSJj9I), pulled via get_design_context.
// Local-only — not wired into any real route's navigation, just
// /figma-about-test for comparison against the Figma design before it
// replaces the real /about page.

const HOLTWOOD = "var(--font-holtwood), Georgia, serif";
const ROBOTO = "var(--font-roboto), sans-serif";
const A = "/images/figma-about-test";

function TopNav() {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        top: 44,
        width: 434,
        height: 44,
        filter: "drop-shadow(0px 4px 10px #f3f3f3)",
      }}
    >
      <div style={{ position: "absolute", left: 56, top: 0, width: 322, height: 44, background: "#000", borderRadius: 40 }} />

      <a href="/" style={{ position: "absolute", left: 88, top: 12, fontFamily: ROBOTO, fontSize: 16, color: "#fff", whiteSpace: "nowrap", textDecoration: "none", cursor: "pointer" }}>Home</a>

      <a href="/#work" style={{ position: "absolute", left: 188, top: 12, fontFamily: ROBOTO, fontSize: 16, color: "#fff", whiteSpace: "nowrap", textDecoration: "none", cursor: "pointer" }}>Projects</a>

      <div style={{ position: "absolute", left: 275, top: 4, width: 99, height: 36, background: "#525252", borderRadius: 22 }} />
      <p style={{ position: "absolute", left: 303, top: 12, margin: 0, fontFamily: ROBOTO, fontSize: 16, color: "#fff", whiteSpace: "nowrap" }}>About</p>

      <div style={{ position: "absolute", left: 0, top: 0, width: 44, height: 44, background: "#000", borderRadius: 28 }}>
        <img src={`${A}/nav-logo.svg`} alt="" style={{ position: "absolute", left: 12, top: 12, width: 20, height: 20 }} />
      </div>

      <a
        href="https://drive.google.com/file/d/1MwfzURVSEyff3mysYL8Pbk28BTuZQl7e/view?usp=sharing"
        target="_blank"
        rel="noreferrer"
        style={{ position: "absolute", left: 390, top: 0, width: 44, height: 44, background: "#000", borderRadius: 28, display: "block" }}
      >
        <img src={`${A}/nav-resume-icon.svg`} alt="Resume" style={{ position: "absolute", left: 10, top: 10, width: 24, height: 24 }} />
      </a>
    </div>
  );
}

// "Group 39904" (9814:14573) — Home-absolute coordinates.
function HeroHeading() {
  return (
    <>
      <p style={{ position: "absolute", left: 427, top: 279, margin: 0, fontFamily: HOLTWOOD, fontWeight: 400, fontSize: 100, lineHeight: 1.2, color: "#000", whiteSpace: "nowrap" }}>Hi there!</p>
      <img src={`${A}/highlight-28.svg`} alt="" style={{ position: "absolute", left: 471, top: 446, width: 508, height: 48 }} />
      <p style={{ position: "absolute", left: 188, top: 399, margin: 0, fontFamily: HOLTWOOD, fontWeight: 400, fontSize: 100, lineHeight: 1.2, color: "#000", whiteSpace: "nowrap" }}>{"I’m Haopeng Liu"}</p>

      <div style={{ position: "absolute", left: 77, top: 178, width: 182.225, height: 185.318, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 147, height: 142, transform: "rotate(70.94deg)" }}>
          <img src={`${A}/leaf-072.svg`} alt="" style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 1257, top: 529, width: 105.742, height: 114.991, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 87.476, height: 99.373, transform: "rotate(11.65deg) scaleY(-1)" }}>
          <img src={`${A}/leaf-073.svg`} alt="" style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 1191, top: 170, width: 208.404, height: 241.698, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 203, height: 142, transform: "rotate(-67.7deg)" }}>
          <img src={`${A}/leaf-069.svg`} alt="" style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 77, top: 519, width: 175.669, height: 171.695, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 136, height: 142, transform: "rotate(107.07deg) scaleY(-1)" }}>
          <img src={`${A}/leaf-070.svg`} alt="" style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
    </>
  );
}

// "Group 39916" (9814:14631) — Home-absolute coordinates.
function ShoreToScreenHeading() {
  return (
    <>
      <p style={{ position: "absolute", left: 384, top: 861, margin: 0, fontFamily: HOLTWOOD, fontWeight: 400, fontSize: 60, lineHeight: 1.2, color: "#000", whiteSpace: "nowrap" }}>Shore to screen</p>
      <img src={`${A}/flower-018.svg`} alt="" style={{ position: "absolute", left: 336, top: 881, width: 32, height: 31 }} />
      <img src={`${A}/icon-ph-desktop.svg`} alt="" style={{ position: "absolute", left: 1055, top: 872, width: 50, height: 50 }} />
      <p style={{ position: "absolute", left: "50%", top: 953, margin: 0, transform: "translateX(-50%)", fontFamily: ROBOTO, fontWeight: 200, fontSize: 20, lineHeight: 1.2, color: "#000", whiteSpace: "nowrap" }}>
        My voyage into user experience design.
      </p>
    </>
  );
}

// Rectangle 216 (9814:14586/87/88) — bordered intro paragraph box.
function IntroTextBox() {
  return (
    <div style={{ position: "absolute", left: 32, top: 1097, width: 668, height: 528, border: "2px solid #f3f3f3", borderRadius: 40, boxSizing: "border-box" }}>
      <div style={{ position: "absolute", left: 27, top: 60, width: 613, fontFamily: ROBOTO, fontWeight: 400, fontSize: 20, lineHeight: 1.2, color: "#000" }}>
        <p style={{ margin: 0 }}>
          {"🇨🇳 As I was growing up in the coastal city of Qingdao in China, the ocean's vastness symbolized the endless possibilities of life. I always had a strong desire to explore the world and set my own path."}
          <br />
          <br />
          {"🇺🇸 Upon moving to Seattle, another city by the sea, I found myself drawn to the parallels between the ocean's expanse and the digital landscape. "}
        </p>
        <p style={{ margin: 0 }}>&nbsp;</p>
        <p style={{ margin: 0 }}>
          {"🌊 Like a seasoned sailor, I guide users through the intricate waters of digital experiences, ensuring smooth navigation and delightful discoveries along the way. My coastal upbringing laid the foundation for my career in UX design. "}
          <br />
          <br />
          {"🎨 Just as I once charted my course through the tides of Qingdao and Seattle, I now chart paths for users, weaving empathy and creativity into meaningful journeys in the vast sea of UX design, ensuring they reach their destination smoothly and enjoyably."}
        </p>
      </div>
    </div>
  );
}

// Two masked photos (9814:14565 / 9814:14568) + Seattle/Qingdao captions.
function OceanPhotos() {
  return (
    <>
      <div style={{ position: "absolute", left: 740, top: 1377, width: 668, height: 240, borderRadius: 40, overflow: "hidden" }}>
        <img src={`${A}/photo-ocean-birds.png`} alt="" style={{ position: "absolute", left: -7, top: -132, width: 987, height: 555, objectFit: "cover", transform: "scaleX(-1)" }} />
      </div>
      <div style={{ position: "absolute", left: 740, top: 1097, width: 668, height: 240, borderRadius: 40, overflow: "hidden" }}>
        <img src={`${A}/photo-ocean-sunset.jpg`} alt="" style={{ position: "absolute", left: -1, top: -59, width: 669, height: 426, objectFit: "cover" }} />
      </div>

      <p style={{ position: "absolute", left: 1324, top: 1395, margin: 0, fontFamily: ROBOTO, fontWeight: 200, fontSize: 20, lineHeight: 1.2, color: "#fff", whiteSpace: "nowrap" }}>Seattle</p>
      <p style={{ position: "absolute", left: 1311, top: 1115, margin: 0, fontFamily: ROBOTO, fontWeight: 200, fontSize: 20, lineHeight: 1.2, color: "#fff", whiteSpace: "nowrap" }}>Qingdao</p>
    </>
  );
}

// "Group 39912" (9814:14590) — Home-absolute coordinates.
function BeneathSurfaceHeading() {
  return (
    <>
      <img src={`${A}/flower-037.svg`} alt="" style={{ position: "absolute", left: 1018, top: 1947, width: 43, height: 33 }} />
      <img src={`${A}/line-5.svg`} alt="" style={{ position: "absolute", left: 386, top: 1902.67, width: 221.307, height: 39 }} />
      <p style={{ position: "absolute", left: 328, top: 1857, margin: 0, fontFamily: HOLTWOOD, fontWeight: 400, fontSize: 60, lineHeight: 1.2, color: "#000", whiteSpace: "nowrap" }}>Beneath</p>
      <p style={{ position: "absolute", left: 505, top: 1926, margin: 0, fontFamily: HOLTWOOD, fontWeight: 400, fontSize: 60, lineHeight: 1.2, color: "#000", whiteSpace: "nowrap" }}> the surface</p>
      <p style={{ position: "absolute", left: "50%", top: 2018, margin: 0, transform: "translateX(-50%)", fontFamily: ROBOTO, fontWeight: 200, fontSize: 20, lineHeight: 1.2, color: "#000", whiteSpace: "nowrap" }}>
        The essence of me is...
      </p>
    </>
  );
}

function PersonalityCard({
  left, top, width, height, bg, iconBg, iconBorder, iconBgLeft, icon, iconLeft, title, desc,
}: {
  left: number; top: number; width: number; height: number; bg: string; iconBg: string; iconBorder?: string;
  iconBgLeft: number; icon: string; iconLeft: number; title: string; desc: string[];
}) {
  return (
    <div style={{ position: "absolute", left, top, width, height, background: bg, borderRadius: 40, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: iconBgLeft, top: 20, width: 80, height: 80, background: iconBg, border: iconBorder ? `1px solid ${iconBorder}` : undefined, borderRadius: 12, boxSizing: "border-box" }} />
      <img src={`${A}/${icon}`} alt="" style={{ position: "absolute", left: iconLeft, top: 38, width: 44, height: 44, objectFit: "cover" }} />
      <p style={{ position: "absolute", left: "50%", top: 132, width: 212, margin: 0, transform: "translateX(-50%)", fontFamily: ROBOTO, fontWeight: 700, fontSize: 40, lineHeight: 1.2, color: "#fff", textAlign: "center" }}>{title}</p>
      <div style={{ position: "absolute", left: "50%", top: 260, width: 212, transform: "translateX(-50%)", fontFamily: ROBOTO, fontWeight: 200, fontSize: 20, lineHeight: 1.2, color: "#f3f3f3", textAlign: "center" }}>
        {desc.map((d, i) => (
          <p key={i} style={{ margin: 0 }}>{d}</p>
        ))}
      </div>
    </div>
  );
}

// "Group 39915" (9814:14599) — 5 personality cards, Home-absolute coordinates.
function PersonalityCards() {
  return (
    <>
      <PersonalityCard left={32} top={2042} width={259} height={492} bg="#63bd71" iconBg="#abf0b6" iconBorder="#63bd71" iconBgLeft={89} icon="icon-puzzle-piece.png" iconLeft={107} title="Problem solver" desc={["adaptable", "resourceful", "proactive"]} />
      <PersonalityCard left={1149} top={2042} width={259} height={492} bg="#63bd71" iconBg="#abf0b6" iconBgLeft={89} icon="icon-battery.png" iconLeft={107} title="Life-long learner" desc={["persistent", "agile", "curious"]} />
      <PersonalityCard left={311} top={2116} width={259} height={418} bg="#f3b421" iconBg="#fee2a1" iconBorder="#f3b421" iconBgLeft={86} icon="icon-handshake.png" iconLeft={104} title="Team player" desc={["trustworthy", "flexible", "collaborative"]} />
      <PersonalityCard left={590} top={2162} width={260} height={372} bg="#ed2e2c" iconBg="#ffaba9" iconBorder="#ec0300" iconBgLeft={86} icon="icon-rocket.png" iconLeft={104} title="Creative thinker" desc={["innovative", "visionary", "outside-the-box"]} />
      <PersonalityCard left={870} top={2116} width={259} height={418} bg="#f2b629" iconBg="#fee2a1" iconBorder="#f3b421" iconBgLeft={86} icon="icon-ear.png" iconLeft={104} title="Active listener" desc={["empathetic", "attentive", "supportive"]} />
    </>
  );
}

// "Group 39911" (9814:14644) — Home-absolute coordinates.
function BeyondPixelsHeading() {
  return (
    <>
      <p style={{ position: "absolute", left: 388, top: 3142, margin: 0, fontFamily: HOLTWOOD, fontWeight: 400, fontSize: 60, lineHeight: 1.2, color: "#000", whiteSpace: "nowrap" }}>Beyond</p>
      <p style={{ position: "absolute", left: 634, top: 3208, margin: 0, fontFamily: HOLTWOOD, fontWeight: 400, fontSize: 60, lineHeight: 1.2, color: "#000", whiteSpace: "nowrap" }}>the</p>
      <img src={`${A}/flower-039.svg`} alt="" style={{ position: "absolute", left: 717, top: 3163, width: 49, height: 34 }} />
      <p style={{ position: "absolute", left: 797, top: 3208, margin: 0, fontFamily: HOLTWOOD, fontWeight: 400, fontSize: 60, lineHeight: 1.2, color: "#000", whiteSpace: "nowrap" }}>pixels</p>
      <div style={{ position: "absolute", left: 577, top: 3177.66, width: 164.018, height: 149.008, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 148.485, height: 75.217, transform: "rotate(-36.67deg)" }}>
          <img src={`${A}/line-9.svg`} alt="" style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
      <p style={{ position: "absolute", left: "50%", top: 3324.66, margin: 0, transform: "translateX(-50%)", fontFamily: ROBOTO, fontWeight: 200, fontSize: 20, lineHeight: 1.2, color: "#000", whiteSpace: "nowrap" }}>
        {"When I'm not in front of the screen, I'm..."}
      </p>
    </>
  );
}

function Circle({ left, top, size, imgs }: { left: number; top: number; size: number; imgs: string[] }) {
  return (
    <div style={{ position: "absolute", left, top, width: size, height: size, borderRadius: "50%", overflow: "hidden" }}>
      {imgs.map((src, i) => (
        <img key={i} src={`${A}/${src}`} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      ))}
    </div>
  );
}

// Circular photo collage scattered around "Beyond the pixels" — Home-absolute coordinates.
function PhotoCollage() {
  return (
    <>
      <Circle left={1085} top={2774} size={254} imgs={["collage-img6109-fill.jpg"]} />
      <Circle left={-41} top={3304} size={254} imgs={["collage-img9510-fill.png"]} />
      <Circle left={128} top={3123} size={150} imgs={["collage-img6118-fill.jpg"]} />
      <Circle left={224} top={3208} size={84} imgs={["collage-shot342-fill.png", "collage-shot344-fill.png"]} />
      <Circle left={542} top={3474} size={128} imgs={["collage-shot346-fill.png"]} />
      <Circle left={1181} top={3239} size={188} imgs={["collage-tm-fill.jpg"]} />
      <Circle left={9} top={2941} size={155} imgs={["collage-shot337-fill.png"]} />
      <Circle left={1275} top={2963} size={215} imgs={["collage-img9509-fill.png"]} />
      <Circle left={1052} top={3049} size={93} imgs={["collage-img9509-fill.png", "collage-3lq-fill.jpg"]} />
      <Circle left={1029} top={3387} size={86} imgs={["collage-shot355-fill.png"]} />
      <Circle left={233} top={2822} size={222} imgs={["collage-shot349-fill.png"]} />
      <Circle left={655.45} top={2922.13} size={164.555} imgs={["collage-shot354-fill.png"]} />
      <Circle left={293} top={3362} size={162} imgs={["collage-img9507-fill.png"]} />
      <Circle left={591} top={2877} size={112} imgs={["collage-shot350-fill.png"]} />
      <Circle left={841} top={3399} size={188} imgs={["collage-e3e4-fill.jpg"]} />
    </>
  );
}

const FOOTER_FLOWERS: { file: string; left: number; width: number; transform?: string }[] = [
  { file: "flower-056", left: 55, width: 102.284 },
  { file: "flower-057", left: 201.28, width: 85.959 },
  { file: "flower-063", left: 331.24, width: 83.207 },
  { file: "flower-065", left: 458.45, width: 81.008, transform: "rotate(180deg) scaleY(-1)" },
  { file: "flower-059", left: 583.46, width: 77.262 },
  { file: "flower-path", left: 733.5, width: 57, transform: "rotate(-25deg)" },
  { file: "flower-060", left: 805.72, width: 56.988 },
  { file: "flower-061", left: 906.71, width: 81.008 },
  { file: "flower-062", left: 1031.72, width: 81.489 },
  { file: "flower-058", left: 1157.21, width: 81.858 },
  { file: "flower-055", left: 1283.06, width: 102.428 },
];

// "Group 15" (9814:14521) — bottom footer block, Home-absolute coordinates.
function Footer() {
  return (
    <div style={{ position: "absolute", left: 32, top: 3871, width: 1376, height: 440, background: "#f3f3f3", borderTopLeftRadius: 40, borderTopRightRadius: 40, overflow: "hidden" }}>
      {FOOTER_FLOWERS.map((f) => (
        <img key={f.file} src={`${A}/${f.file}.svg`} alt="" style={{ position: "absolute", left: f.left, top: 358, width: f.width, height: 80, transform: f.transform }} />
      ))}

      <div style={{ position: "absolute", left: "50%", top: 33, width: 541.657, height: 85.84, transform: "translateX(-50%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 539.432, height: 52.828, transform: "rotate(-3.52deg) scaleY(-1)" }}>
          <img src={`${A}/highlight-25.svg`} alt="" style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
      <p style={{ position: "absolute", left: "50%", top: 40.45, margin: 0, transform: "translateX(-50%)", fontFamily: HOLTWOOD, fontWeight: 400, fontSize: 60, lineHeight: 1.5, color: "#000", whiteSpace: "nowrap" }}>
        Keep in touch
      </p>
      <div style={{ position: "absolute", left: "50%", top: 130.45, transform: "translateX(-50%)", fontFamily: ROBOTO, fontWeight: 400, fontSize: 20, lineHeight: 1.5, color: "#000", textAlign: "center" }}>
        <p style={{ margin: 0, whiteSpace: "nowrap" }}>Always ready for awesome conversations!</p>
        <p style={{ margin: 0, fontWeight: 200, whiteSpace: "nowrap" }}>{"Shoot me an Email, drop me a line on LinkedIn, or chat over coffee and boba :)"}</p>
      </div>

      <div style={{ position: "absolute", left: 666, top: 210.45, width: 44, height: 44, background: "#000", borderRadius: 28 }}>
        <img src={`${A}/icon-email-unread.svg`} alt="" style={{ position: "absolute", left: 10, top: 10, width: 24, height: 24 }} />
      </div>
      <a href="https://www.linkedin.com/in/haopeng-liu/" target="_blank" rel="noreferrer" style={{ position: "absolute", left: 730, top: 210.45, width: 44, height: 44, background: "#000", borderRadius: 28, display: "block" }}>
        <img src={`${A}/icon-linkedin-solid.svg`} alt="" style={{ position: "absolute", left: 10, top: 10, width: 24, height: 24 }} />
      </a>
    </div>
  );
}

export default function FigmaAboutTest() {
  return (
    <div style={{ background: "#fff", padding: "40px 0" }}>
      <div style={{ position: "relative", width: 1440, height: 4311, margin: "0 auto", background: "#fff", overflow: "hidden" }}>
        <HeroHeading />
        <ShoreToScreenHeading />
        <IntroTextBox />
        <OceanPhotos />
        <BeneathSurfaceHeading />
        <PersonalityCards />
        <BeyondPixelsHeading />
        <PhotoCollage />
        <Footer />
        <TopNav />
      </div>
    </div>
  );
}
