import { useCallback, useEffect, useRef, useState } from "react";
import { projects } from "../data/projects";
import "./Carousel.css";

const COUNT = projects.length;
const STEP = (2 * Math.PI) / COUNT;
// Horizontal spread and depth of the ring are tuned independently so the
// side cards stay close to the front card while still receding in 3D.
const RADIUS_X = 310;
const RADIUS_Z = 440;
const WHEEL_THRESHOLD = 60;
const DRAG_THRESHOLD = 90;
const SPIN_COOLDOWN_MS = 400;

export default function Carousel() {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const wheelAccum = useRef(0);
  const lastSpin = useRef(0);
  const drag = useRef({ lastX: 0, accum: 0, moved: 0 });

  const spin = useCallback((dir: number) => {
    const now = performance.now();
    if (now - lastSpin.current < SPIN_COOLDOWN_MS) return;
    lastSpin.current = now;
    setActive((a) => (a + dir + COUNT) % COUNT);
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (expanded) return;
      wheelAccum.current += e.deltaY + e.deltaX;
      if (Math.abs(wheelAccum.current) >= WHEEL_THRESHOLD) {
        spin(Math.sign(wheelAccum.current));
        wheelAccum.current = 0;
      }
    },
    [expanded, spin],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (expanded || e.button !== 0) return;
      drag.current = { lastX: e.clientX, accum: 0, moved: 0 };
      setDragging(true);
    },
    [expanded],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - drag.current.lastX;
      drag.current.lastX = e.clientX;
      drag.current.accum += dx;
      drag.current.moved += Math.abs(dx);
      // Capture only once real movement starts, so plain clicks still
      // reach the cards (capturing retargets the click to the stage).
      if (drag.current.moved > 5 && !e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.setPointerCapture(e.pointerId);
      }
      if (Math.abs(drag.current.accum) >= DRAG_THRESHOLD) {
        // Dragging left pulls the next card (to the right) into front.
        spin(-Math.sign(drag.current.accum));
        drag.current.accum = 0;
      }
    },
    [dragging, spin],
  );

  const handlePointerUp = useCallback(() => setDragging(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
      if (expanded) return;
      if (e.key === "ArrowRight") spin(1);
      if (e.key === "ArrowLeft") spin(-1);
      if (e.key === "Enter") setExpanded(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded, spin]);

  return (
    <div
      className={`stage${dragging ? " dragging" : ""}`}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        className={`backdrop${expanded ? " visible" : ""}`}
        onClick={() => setExpanded(false)}
      />
      {projects.map((project, i) => {
        // Signed distance from the active card, in card slots: 0 is front,
        // negative is left of front, positive is right.
        let d = (i - active + COUNT) % COUNT;
        if (d > COUNT / 2) d -= COUNT;

        const angle = d * STEP;
        const x = Math.sin(angle) * RADIUS_X;
        const z = (Math.cos(angle) - 1) * RADIUS_Z;
        const depth = (1 - Math.cos(angle)) / 2; // 0 front, 1 back
        const isFront = d === 0;
        const isExpanded = isFront && expanded;

        return (
          <article
            key={project.id}
            className={`card${isFront ? " front" : ""}${isExpanded ? " expanded" : ""}`}
            style={{
              transform: isExpanded
                ? "translate(-50%, -50%) translate3d(0, 0, 120px)"
                : `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px)`,
              zIndex: isExpanded ? 500 : 100 + Math.round(Math.cos(angle) * 99),
              filter: isFront
                ? "none"
                : `blur(${1 + depth * 3}px) brightness(${1 - depth * 0.35})`,
            }}
            onClick={() => {
              if (drag.current.moved > 5) return; // it was a drag, not a click
              if (isFront) {
                setExpanded((v) => !v);
              } else if (!expanded) {
                spin(Math.sign(d));
              }
            }}
          >
            <div className="card-image" style={{ background: project.image }} />
            <h3 className="card-title">{project.name}</h3>
            <p className="card-desc">{project.description}</p>
          </article>
        );
      })}
      <p className="hint">scroll to spin &middot; click a card to open</p>
    </div>
  );
}
