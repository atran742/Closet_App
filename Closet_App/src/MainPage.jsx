import React, { useState, useRef } from "react";
import ReactDOM from "react-dom/client";
import { Shuffle } from "lucide-react";
import { closetItems } from "./data/closetItems";
import { generateOutfits, isValidForOccasion } from "./lib/generateOutfits";
import ClosetGrid from "./ClosetGrid";
import TryOnOverlay from "./Tryonoverlay.jsx";
import "./index.css"; 

const c = {
  bg: "#0A0A1A",
  grid: "rgba(0,229,255,0.14)",
  panel: "#FFFFFF",
  ink: "#111111",
  inkMuted: "#5A5A6E",
  pink: "#FF3EA5",
  cyan: "#00E5FF",
  lime: "#B4FF39",
  yellow: "#FFE94D",
  black: "#0A0A0A",
};

const OCCASIONS = ["reading", "casual date", "fancy dinner", "swimming", "gym", "work", "errands"];

// Turns an id like "top-white-linen-shirt" into "White linen shirt"
// for items that don't have an explicit `name` yet.
function prettify(id) {
  const words = id.split("-").slice(1); // drop the category prefix
  const text = words.join(" ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function toDisplay(item, slot) {
  return {
    ...item,
    __slot: slot,
    label: (item.name || prettify(item.id)).toUpperCase(),
    color: item.primaryColor?.hex || "#888888",
  };
}

const PLACEHOLDER = { id: "placeholder", label: "NO ITEMS YET", color: "#888888", photoUrl: null };

const bevel = (pressed) => ({
  border: `3px solid ${c.black}`,
  boxShadow: pressed ? "none" : `4px 4px 0px ${c.black}`,
  transform: pressed ? "translate(4px, 4px)" : "none",
});

function PixelChip({ label, active, onClick, color = c.cyan }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-all"
      style={{
        fontFamily: "'Courier New', monospace",
        backgroundColor: active ? color : c.panel,
        color: c.black,
        ...bevel(active),
      }}
    >
      {label}
    </button>
  );
}

function Reel({ item, spinning, justLanded }) {
  return (
    <div
      className="flex items-center gap-4 p-4"
      style={{
        backgroundColor: c.panel,
        border: `3px solid ${c.black}`,
        filter: spinning ? "brightness(1.3) contrast(1.1)" : "none",
        animation: justLanded ? "pixelLand 380ms steps(4)" : "none",
      }}
    >
      {item.photoUrl ? (
        <img
          src={item.photoUrl}
          alt={item.label}
          className="w-14 h-14 shrink-0 object-cover"
          style={{ border: `3px solid ${c.black}`, boxShadow: `3px 3px 0px ${c.black}` }}
        />
      ) : (
        <div
          className="w-14 h-14 shrink-0"
          style={{ backgroundColor: item.color, border: `3px solid ${c.black}`, boxShadow: `3px 3px 0px ${c.black}` }}
        />
      )}
      <div>
        <p
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: c.pink, fontFamily: "'Courier New', monospace" }}
        >
          {item.__slot}
        </p>
        <p className="text-sm font-bold uppercase" style={{ color: c.ink, fontFamily: "'Courier New', monospace" }}>
          {item.label}
        </p>
      </div>
    </div>
  );
}

function OutfitGenerator({ onViewCloset }) {
  const [occasion, setOccasion] = useState("casual date");

  const allTops = closetItems.filter((i) => i.category === "top");
  const allBottoms = closetItems.filter((i) => i.category === "bottom");

  const [top, setTop] = useState(() => toDisplay(allTops[0] || PLACEHOLDER, "TOP"));
  const [bottom, setBottom] = useState(() => toDisplay(allBottoms[0] || PLACEHOLDER, "BOTTOM"));
  const [spinningTop, setSpinningTop] = useState(false);
  const [spinningBottom, setSpinningBottom] = useState(false);
  const [justLandedTop, setJustLandedTop] = useState(false);
  const [justLandedBottom, setJustLandedBottom] = useState(false);
  const intervalsRef = useRef([]);

  const filteredTops = allTops.filter((t) => isValidForOccasion(t, occasion));
  const filteredBottoms = allBottoms.filter((b) => isValidForOccasion(b, occasion));

  const spinReel = (pool, setItem, setSpinning, setLanded, slot, duration, finalItem) => {
    if (pool.length === 0) return;
    setSpinning(true);
    const id = setInterval(() => {
      const random = pool[Math.floor(Math.random() * pool.length)];
      setItem(toDisplay(random, slot));
    }, 70);
    intervalsRef.current.push(id);

    setTimeout(() => {
      clearInterval(id);
      setItem(toDisplay(finalItem, slot));
      setSpinning(false);
      setLanded(true);
      setTimeout(() => setLanded(false), 400);
    }, duration);
  };

  const surpriseMe = () => {
    const pool = generateOutfits(allTops, allBottoms, occasion);
    if (pool.length === 0) return;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    spinReel(filteredTops, setTop, setSpinningTop, setJustLandedTop, "TOP", 1000, chosen.top);
    spinReel(filteredBottoms, setBottom, setSpinningBottom, setJustLandedBottom, "BOTTOM", 1400, chosen.bottom);
  };

  const [tryingOn, setTryingOn] = useState(false);
  const tryItOn = () => setTryingOn(true);

  const isSpinning = spinningTop || spinningBottom;

  if (tryingOn) {
    return <TryOnOverlay top={top} bottom={bottom} onClose={() => setTryingOn(false)} />;
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6"
      style={{
        backgroundColor: c.bg,
        backgroundImage: `linear-gradient(${c.grid} 1px, transparent 1px), linear-gradient(90deg, ${c.grid} 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
      }}
    >
      <style>{`
        @keyframes pixelLand {
          0% { transform: scale(1.15); }
          50% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        @keyframes blink { 50% { opacity: 0; } }
        .blinker { animation: blink 1s step-end infinite; }
      `}</style>

      <div className="w-full max-w-md" style={{ fontFamily: "'Courier New', monospace" }}>
        {/* Title bar */}
        <div
          className="flex items-center justify-between px-3 py-2"
          style={{
            background: `linear-gradient(90deg, ${c.pink}, ${c.cyan})`,
            border: `3px solid ${c.black}`,
            borderBottom: "none",
          }}
        >
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: c.black }}>
            THE_CLOSET.EXE<span className="blinker">_</span>
          </span>
          <div className="flex gap-1.5">
            <div className="w-3 h-3" style={{ backgroundColor: c.yellow, border: `2px solid ${c.black}` }} />
            <div className="w-3 h-3" style={{ backgroundColor: c.lime, border: `2px solid ${c.black}` }} />
            <div className="w-3 h-3" style={{ backgroundColor: c.pink, border: `2px solid ${c.black}` }} />
          </div>
        </div>

        {/* Body panel */}
        <div style={{ backgroundColor: c.panel, border: `3px solid ${c.black}`, borderTop: "none" }} className="p-5">
          {/* <button
            type="button"
            onClick={onViewCloset}
            className="inline-block mb-4 px-3 py-1.5 text-xs font-bold uppercase tracking-wide"
            style={{
              fontFamily: "'Courier New', monospace",
              backgroundColor: c.panel,
              color: c.black,
              border: `3px solid ${c.black}`,
              boxShadow: `3px 3px 0px ${c.black}`,
            }}
          >
            VIEW CLOSET
          </button> */}

          <p className="text-xs font-bold uppercase tracking-wide mb-4" style={{ color: c.inkMuted }}>
            &gt; SELECT OCCASION:
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {OCCASIONS.map((o) => (
              <PixelChip key={o} label={o} active={occasion === o} onClick={() => setOccasion(o)} color={c.yellow} />
            ))}
          </div>

          <div className="space-y-3 mb-6">
            <Reel item={top} spinning={spinningTop} justLanded={justLandedTop} />
            <Reel item={bottom} spinning={spinningBottom} justLanded={justLandedBottom} />
          </div>

          {filteredTops.length === 0 || filteredBottoms.length === 0 ? (
            <p className="text-xs font-bold mb-4" style={{ color: c.pink, fontFamily: "'Courier New', monospace" }}>
              ! NOT ENOUGH ITEMS TAGGED FOR "{occasion.toUpperCase()}"
            </p>
          ) : null}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={surpriseMe}
              disabled={isSpinning}
              className="flex-1 py-3 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest transition-all active:translate-x-1 active:translate-y-1"
              style={{
                backgroundColor: isSpinning ? c.inkMuted : c.lime,
                color: c.black,
                border: `3px solid ${c.black}`,
                boxShadow: isSpinning ? "none" : `4px 4px 0px ${c.black}`,
              }}
            >
              <Shuffle size={16} />
              {isSpinning ? "SPINNING..." : "SURPRISE ME"}
            </button>

            <button
              type="button"
              onClick={tryItOn}
              className="py-3 px-4 text-sm font-bold uppercase tracking-widest transition-all active:translate-x-1 active:translate-y-1"
              style={{
                backgroundColor: c.cyan,
                color: c.black,
                border: `3px solid ${c.black}`,
                boxShadow: `4px 4px 0px ${c.black}`,
              }}
            >
              TRY IT ON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Root just tracks which screen is showing — plain state, no router.
// This file is the entry point (index.html loads it directly), so it
// mounts itself at the bottom instead of relying on a separate main.jsx.
function Root() {
  const [screen, setScreen] = useState("generate");

  if (screen === "closet") {
    return <ClosetGrid onGenerate={() => setScreen("generate")} />;
  }
  return <OutfitGenerator onViewCloset={() => setScreen("closet")} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

export default OutfitGenerator;