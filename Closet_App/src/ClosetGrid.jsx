import { useState, useRef } from "react";
import { Shuffle } from "lucide-react";

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

const TOPS = [
  { id: "t1", label: "WHITE LINEN SHIRT", color: "#EDE7DA", occasions: ["casual date", "fancy dinner", "work", "reading"] },
  { id: "t2", label: "STRIPED TEE", color: "#7C8BA1", occasions: ["reading", "errands", "casual date"] },
  { id: "t3", label: "BLACK SILK BLOUSE", color: "#232227", occasions: ["fancy dinner", "casual date", "work"] },
  { id: "t4", label: "SWIM TOP", color: "#3E8F82", occasions: ["swimming"] },
  { id: "t5", label: "ATHLETIC TANK", color: "#B9AFC4", occasions: ["gym", "errands"] },
  { id: "t6", label: "MUSTARD SWEATER", color: "#E3A73E", occasions: ["reading", "casual date", "errands"] },
];

const BOTTOMS = [
  { id: "b1", label: "WIDE-LEG TROUSERS", color: "#3A3745", occasions: ["fancy dinner", "work", "casual date"] },
  { id: "b2", label: "DENIM SHORTS", color: "#5B7A9D", occasions: ["reading", "errands", "casual date"] },
  { id: "b3", label: "MIDI SKIRT", color: "#C1616B", occasions: ["casual date", "fancy dinner"] },
  { id: "b4", label: "SWIM BOTTOMS", color: "#3E8F82", occasions: ["swimming"] },
  { id: "b5", label: "LEGGINGS", color: "#232227", occasions: ["gym", "errands"] },
  { id: "b6", label: "STRAIGHT JEANS", color: "#7C8BA1", occasions: ["reading", "errands", "casual date"] },
];

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
      <div
        className="w-14 h-14 shrink-0"
        style={{ backgroundColor: item.color, border: `3px solid ${c.black}`, boxShadow: `3px 3px 0px ${c.black}` }}
      />
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

export default function ClosetGrid({ onGenerate }) {
  const [occasion, setOccasion] = useState("casual date");
  const [top, setTop] = useState({ ...TOPS[0], __slot: "TOP" });
  const [bottom, setBottom] = useState({ ...BOTTOMS[0], __slot: "BOTTOM" });
  const [spinningTop, setSpinningTop] = useState(false);
  const [spinningBottom, setSpinningBottom] = useState(false);
  const [justLandedTop, setJustLandedTop] = useState(false);
  const [justLandedBottom, setJustLandedBottom] = useState(false);
  const intervalsRef = useRef([]);

  const filteredTops = TOPS.filter((t) => t.occasions.includes(occasion));
  const filteredBottoms = BOTTOMS.filter((b) => b.occasions.includes(occasion));

  const spinReel = (pool, setItem, setSpinning, setLanded, slot, duration) => {
    if (pool.length === 0) return;
    setSpinning(true);
    const id = setInterval(() => {
      const random = pool[Math.floor(Math.random() * pool.length)];
      setItem({ ...random, __slot: slot });
    }, 70);
    intervalsRef.current.push(id);

    setTimeout(() => {
      clearInterval(id);
      const final = pool[Math.floor(Math.random() * pool.length)];
      setItem({ ...final, __slot: slot });
      setSpinning(false);
      setLanded(true);
      setTimeout(() => setLanded(false), 400);
    }, duration);
  };

  const surpriseMe = () => {
    spinReel(filteredTops, setTop, setSpinningTop, setJustLandedTop, "TOP", 1000);
    spinReel(filteredBottoms, setBottom, setSpinningBottom, setJustLandedBottom, "BOTTOM", 1400);
  };

  const tryItOn = () => {
    console.log("Trying on:", top.label, "with", bottom.label);
  };

  const isSpinning = spinningTop || spinningBottom;

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

          <button
            type="button"
            onClick={onGenerate}
            className="w-full mt-3 py-2 text-xs font-bold uppercase tracking-widest transition-all active:translate-x-1 active:translate-y-1"
            style={{
              backgroundColor: c.panel,
              color: c.black,
              border: `3px solid ${c.black}`,
              boxShadow: `3px 3px 0px ${c.black}`,
            }}
          >
            ← BACK TO GENERATOR
          </button>
        </div>
      </div>
    </div>
  );
}