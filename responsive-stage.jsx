// responsive-stage.jsx
// Full-viewport responsive shell for the demo screens.
//
// The screens were designed at fixed sizes (a landscape POS at 932×430, an
// owner dashboard at 1180×820, and purpose-built portrait phone screens at
// 402×874). Rather than letterboxing them inside a fake device frame, this
// shell fills the whole browser window and:
//   • picks the landscape OR portrait design based on the viewport orientation
//     (so a phone gets the real vertical layout, desktop gets the horizontal one)
//   • scales the chosen design to fit, centered, on a matching background
//   • re-fits live on resize / rotation — fully responsive, no device chrome.

function useViewport() {
  const read = () => ({ w: window.innerWidth, h: window.innerHeight });
  const [vp, setVp] = React.useState(read);
  React.useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setVp(read()));
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      cancelAnimationFrame(raf);
    };
  }, []);
  return vp;
}

// True when the window is taller than it is wide (a phone held upright, or a
// narrow browser column). Drives the landscape↔portrait design swap.
function useIsPortrait() {
  const { w, h } = useViewport();
  return h > w;
}

// Scales a fixed design (dw×dh) to fit the viewport, centered on `bg`.
// `maxScale` keeps the landscape layouts from ballooning on very large monitors.
function FitStage({ dw, dh, bg = '#ecebe6', maxScale = Infinity, children }) {
  const { w, h } = useViewport();
  const scale = Math.min(w / dw, h / dh, maxScale);
  return (
    <div style={{
      position: 'fixed', inset: 0, background: bg, overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: dw, height: dh, flex: 'none',
        transform: `scale(${scale})`, transformOrigin: 'center center',
      }}>
        {children}
      </div>
    </div>
  );
}

// Fills the whole viewport with a fluid phone-width column (no letterboxing).
// The portrait screens are built with width/height:100%, so they stretch to
// fill this box exactly — full-screen on a phone, a centered phone column on
// wider windows. `maxWidth` keeps it phone-shaped on tablets/desktops.
function PhoneStage({ maxWidth = 560, bg = '#f4f4f0', children }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: bg, overflow: 'hidden',
      display: 'flex', justifyContent: 'center',
    }}>
      <div style={{ width: '100%', maxWidth, height: '100%', position: 'relative', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

// Background that matches the app, so any fit margins blend in.
function themeBg() {
  const themes = window.FAST_THEMES || {};
  return (themes.sage || { bg: '#f4f4f0' }).bg;
}

Object.assign(window, { useViewport, useIsPortrait, FitStage, PhoneStage, themeBg });
