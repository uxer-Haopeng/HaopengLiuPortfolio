/* app.jsx — customer-facing Tweaks panel, bridged to the Three.js scene. */
const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "garden": "clay",
  "timeOfDay": "day",
  "deskColor": "#ece4d9",
  "depthBlur": true,
  "autoRotate": false
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Push current tweaks to the scene whenever they change. The scene also
  // reads window.__tweaks on init, so order-of-load doesn't matter.
  useEffect(() => {
    window.__tweaks = t;
    if (window.__applyTweaks) window.__applyTweaks(t);
    window.dispatchEvent(new CustomEvent("tweakschange", { detail: t }));
  }, [t]);

  return (
    <TweaksPanel title="Customize this scene">
      <TweakSection label="Scene" />
      <TweakSelect
        label="Garden"
        value={t.garden}
        options={[
          { value: "clay", label: "Sculpted clay" },
          { value: "color", label: "Low-poly color" },
          { value: "painterly", label: "Soft painterly" },
        ]}
        onChange={(v) => setTweak("garden", v)}
      />
      <TweakRadio
        label="Time of day"
        value={t.timeOfDay}
        options={["day", "dusk", "night"]}
        onChange={(v) => setTweak("timeOfDay", v)}
      />

      <TweakSection label="Look" />
      <TweakColor
        label="Desk color"
        value={t.deskColor}
        options={["#ece4d9", "#e7d6bf", "#dcddd4", "#ecd9d2", "#d7ddcb"]}
        onChange={(v) => setTweak("deskColor", v)}
      />
      <TweakToggle
        label="Depth blur"
        value={t.depthBlur}
        onChange={(v) => setTweak("depthBlur", v)}
      />

      <TweakSection label="Motion" />
      <TweakToggle
        label="Auto-rotate desk"
        value={t.autoRotate}
        onChange={(v) => setTweak("autoRotate", v)}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("tweaks-root")).render(<App />);
