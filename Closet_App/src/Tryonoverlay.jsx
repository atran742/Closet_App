import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";



const BASE_PHOTO = "/Other_pics/sim_character.webp"; // adjust to wherever your base photo actually lives

const DEFAULT_TOP = { top: 18, left: 28, width: 44, height: 30 };
const DEFAULT_BOTTOM = { top: 45, left: 26, width: 48, height: 40 };


function loadSaved(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
 
// A draggable, resizable box used to position one garment over the photo.
// Drag anywhere on the box to move it; drag the corner handle to resize.
function DraggableBox({ box, setBox, containerRef, trashRef, onTrash, label, color, children }) {
  const dragState = useRef(null);
 
  const toPercent = (px, total) => (px / total) * 100;
 
  const isOverTrash = (clientX, clientY) => {
    if (!trashRef.current) return false;
    const rect = trashRef.current.getBoundingClientRect();
    return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
  };
 
  const onDragMove = (e) => {
    if (!dragState.current || !containerRef.current) return;
    dragState.current.lastClientX = e.clientX;
    dragState.current.lastClientY = e.clientY;
    const rect = containerRef.current.getBoundingClientRect();
    const dxPct = toPercent(e.clientX - dragState.current.startX, rect.width);
    const dyPct = toPercent(e.clientY - dragState.current.startY, rect.height);
    const start = dragState.current.box;
 
    if (dragState.current.mode === "move") {
      setBox({
        ...start,
        left: Math.min(Math.max(start.left + dxPct, 0), 100 - start.width),
        top: Math.min(Math.max(start.top + dyPct, 0), 100 - start.height),
      });
    } else {
      setBox({
        ...start,
        width: Math.min(Math.max(start.width + dxPct, 5), 100 - start.left),
        height: Math.min(Math.max(start.height + dyPct, 5), 100 - start.top),
      });
    }
  };
 
  const onDragEnd = () => {
    const wasMove = dragState.current?.mode === "move";
    const droppedOnTrash =
      wasMove && dragState.current && isOverTrash(dragState.current.lastClientX, dragState.current.lastClientY);
    dragState.current = null;
    window.removeEventListener("mousemove", onDragMove);
    window.removeEventListener("mouseup", onDragEnd);
    if (droppedOnTrash) onTrash();
  };
 
  const startDrag = (mode) => (e) => {
    e.stopPropagation();
    dragState.current = { mode, startX: e.clientX, startY: e.clientY, lastClientX: e.clientX, lastClientY: e.clientY, box: { ...box } };
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup", onDragEnd);
  };
 
  return (
    <div
      onMouseDown={startDrag("move")}
      className="absolute cursor-move"
      style={{
        top: `${box.top}%`,
        left: `${box.left}%`,
        width: `${box.width}%`,
        height: `${box.height}%`,
        zIndex: label === "TOP" ? 2 : 1,
        border: `2px dashed ${color}`,
      }}
    >
      {children}
      <span
        className="absolute -top-5 left-0 text-[9px] font-bold uppercase px-1"
        style={{ backgroundColor: color, color: "#0A0A0A", fontFamily: "'Courier New', monospace" }}
      >
        {label}
      </span>
      <div
        onMouseDown={startDrag("resize")}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        style={{ backgroundColor: color, border: "2px solid #0A0A0A" }}
      />
    </div>
  );
}
 
export default function TryOnOverlay({ top, bottom, onClose }) {
  const containerRef = useRef(null);
  const trashRef = useRef(null);
  const [topBox, setTopBox] = useState(() => loadSaved("tryOnTopRegion", DEFAULT_TOP));
  const [bottomBox, setBottomBox] = useState(() => loadSaved("tryOnBottomRegion", DEFAULT_BOTTOM));
  const [editMode, setEditMode] = useState(true);
  const [hiddenTop, setHiddenTop] = useState(false);
  const [hiddenBottom, setHiddenBottom] = useState(false);
 
  // A new outfit (different top/bottom) should start fully visible again —
  // hiding is a per-look choice, not a permanent setting.
  useEffect(() => {
    setHiddenTop(false);
    setHiddenBottom(false);
  }, [top?.id, bottom?.id]);
 
  useEffect(() => {
    localStorage.setItem("tryOnTopRegion", JSON.stringify(topBox));
  }, [topBox]);
 
  useEffect(() => {
    localStorage.setItem("tryOnBottomRegion", JSON.stringify(bottomBox));
  }, [bottomBox]);
 
  const boxStyle = (box) => ({
    top: `${box.top}%`,
    left: `${box.left}%`,
    width: `${box.width}%`,
    height: `${box.height}%`,
  });
 
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6"
      style={{ backgroundColor: "#0A0A1A" }}
    >
      <div className="w-full max-w-md" style={{ fontFamily: "'Courier New', monospace" }}>
        <div className="flex justify-between items-center mb-2">
          <button
            type="button"
            onClick={() => setEditMode((e) => !e)}
            className="px-3 py-1.5 text-xs font-bold uppercase"
            style={{ backgroundColor: "#FFE94D", border: "2px solid #0A0A0A" }}
          >
            {editMode ? "DONE ADJUSTING" : "ADJUST POSITIONS"}
          </button>
 
          {editMode && (
            <div
              ref={trashRef}
              className="p-2"
              title="Drag a garment here to hide it"
              style={{ backgroundColor: "#FF3EA5", border: "2px solid #0A0A0A" }}
            >
              <Trash2 size={16} color="#0A0A0A" />
            </div>
          )}
 
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-bold uppercase"
            style={{ backgroundColor: "#FF3EA5", border: "2px solid #0A0A0A" }}
          >
            CLOSE
          </button>
        </div>
 
        <div
          ref={containerRef}
          className="relative w-full"
          style={{ border: "3px solid #0A0A0A", boxShadow: "4px 4px 0px #0A0A0A" }}
        >
          <img src={BASE_PHOTO} alt="you" className="w-full block" draggable={false} />
 
          {editMode ? (
            <>
              {!hiddenTop && (
                <DraggableBox
                  box={topBox}
                  setBox={setTopBox}
                  containerRef={containerRef}
                  trashRef={trashRef}
                  onTrash={() => setHiddenTop(true)}
                  label="TOP"
                  color="#00E5FF"
                >
                  {top?.photoUrl && (
                    <img src={top.photoUrl} alt="" className="w-full h-full object-contain opacity-80" draggable={false} />
                  )}
                </DraggableBox>
              )}
              {!hiddenBottom && (
                <DraggableBox
                  box={bottomBox}
                  setBox={setBottomBox}
                  containerRef={containerRef}
                  trashRef={trashRef}
                  onTrash={() => setHiddenBottom(true)}
                  label="BOTTOM"
                  color="#B4FF39"
                >
                  {bottom?.photoUrl && (
                    <img src={bottom.photoUrl} alt="" className="w-full h-full object-contain opacity-80" draggable={false} />
                  )}
                </DraggableBox>
              )}
            </>
          ) : (
            <>
              {!hiddenTop && top?.photoUrl && (
                <img
                  src={top.photoUrl}
                  alt={top.label || "top"}
                  className="absolute object-contain"
                  style={{ ...boxStyle(topBox), zIndex: 2 }}
                />
              )}
              {!hiddenBottom && bottom?.photoUrl && (
                <img
                  src={bottom.photoUrl}
                  alt={bottom.label || "bottom"}
                  className="absolute object-contain"
                  style={{ ...boxStyle(bottomBox), zIndex: 1 }}
                />
              )}
            </>
          )}
        </div>
 
        {(hiddenTop || hiddenBottom) && (
          <div className="flex gap-2 mt-2">
            {hiddenTop && (
              <button
                type="button"
                onClick={() => setHiddenTop(false)}
                className="px-2 py-1 text-[10px] font-bold uppercase"
                style={{ backgroundColor: "#00E5FF", border: "2px solid #0A0A0A" }}
              >
                + SHOW TOP
              </button>
            )}
            {hiddenBottom && (
              <button
                type="button"
                onClick={() => setHiddenBottom(false)}
                className="px-2 py-1 text-[10px] font-bold uppercase"
                style={{ backgroundColor: "#B4FF39", border: "2px solid #0A0A0A" }}
              >
                + SHOW BOTTOM
              </button>
            )}
          </div>
        )}
 
        {editMode && (
          <p className="text-[10px] mt-2" style={{ color: "#B9AFC4" }}>
            Drag a box to move it, drag its bottom-right corner to resize, or drag it onto the trash icon to hide it.
            Positions save automatically for next time.
          </p>
        )}
      </div>
    </div>
  );
}