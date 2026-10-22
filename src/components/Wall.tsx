"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from "react";
import { MAX_NOTE_LENGTH, NOTE_SIZE, WORLD } from "@/lib/wall-rules";
import type { Note } from "@/lib/wall-store";
import styles from "./Wall.module.css";

type Pan = { x: number; y: number };
type View = { w: number; h: number };
/** The part of the view no overlay covers: `top` px down from the view's top edge, `w` by `h`. */
type Area = View & { top: number };
type Spot = { x: number; y: number };

export function clampPan(pan: Pan, view: View, scale = 1): Pan {
  const clamp = (v: number, viewSize: number, worldSize: number) =>
    worldSize <= viewSize ? (viewSize - worldSize) / 2 : Math.min(0, Math.max(viewSize - worldSize, v));
  return { x: clamp(pan.x, view.w, WORLD.w * scale), y: clamp(pan.y, view.h, WORLD.h * scale) };
}

/** Pan that puts a world point (cx, cy) in the middle of the open area. */
function panTo(cx: number, cy: number, view: View, open: Area, scale: number): Pan {
  return clampPan({ x: open.w / 2 - cx * scale, y: open.top + open.h / 2 - cy * scale }, view, scale);
}

/** Pan that puts a note (top-left at x, y) in the middle of the open part of the view. */
export function centerOn(x: number, y: number, view: View, open: Area = { ...view, top: 0 }, scale = 1): Pan {
  return panTo(x + NOTE_SIZE.w / 2, y + NOTE_SIZE.h / 2, view, open, scale);
}

// Zoomed out any further, note text drops below a readable size.
export const MIN_SCALE = 0.6;
const FIT_MARGIN = 48;

/**
 * Zoom and pan for the first look: every note in the open area when that fits at MIN_SCALE or larger.
 * When it doesn't, frame the window that holds the most notes, preferring newer ones on a tie.
 */
export function fitAll(notes: Spot[], view: View, open: Area = { ...view, top: 0 }): { pan: Pan; scale: number } {
  if (notes.length === 0) return { pan: centerOn((WORLD.w - NOTE_SIZE.w) / 2, (WORLD.h - NOTE_SIZE.h) / 2, view, open), scale: 1 };
  const left = Math.min(...notes.map((n) => n.x)) - FIT_MARGIN;
  const top = Math.min(...notes.map((n) => n.y)) - FIT_MARGIN;
  const right = Math.max(...notes.map((n) => n.x)) + NOTE_SIZE.w + FIT_MARGIN;
  const bottom = Math.max(...notes.map((n) => n.y)) + NOTE_SIZE.h + FIT_MARGIN;
  const fit = Math.min(open.w / (right - left), open.h / (bottom - top));
  if (fit >= MIN_SCALE) {
    const scale = Math.min(1, fit);
    return { pan: panTo((left + right) / 2, (top + bottom) / 2, view, open, scale), scale };
  }
  // A window of the open area's size in world units, centred on each note in turn.
  const halfW = open.w / MIN_SCALE / 2;
  const halfH = open.h / MIN_SCALE / 2;
  const centre = (n: Spot) => ({ x: n.x + NOTE_SIZE.w / 2, y: n.y + NOTE_SIZE.h / 2 });
  let best = centre(notes[notes.length - 1]);
  let bestCount = 0;
  for (const n of [...notes].reverse()) {
    const c = centre(n);
    const count = notes.filter((m) => {
      const o = centre(m);
      return Math.abs(o.x - c.x) <= halfW - NOTE_SIZE.w / 2 && Math.abs(o.y - c.y) <= halfH - NOTE_SIZE.h / 2;
    }).length;
    if (count > bestCount) {
      best = c;
      bestCount = count;
    }
  }
  return { pan: panTo(best.x, best.y, view, open, MIN_SCALE), scale: MIN_SCALE };
}

const sizeOf = (el: HTMLElement): View => ({ w: el.clientWidth, h: el.clientHeight });

// Notes are framed below the header and, on phones, above the form that spans the bottom of the screen.
function openArea(view: HTMLElement, header: HTMLElement | null, form: HTMLElement | null): Area {
  const size = sizeOf(view);
  const top = header?.offsetHeight ?? 0;
  const bottom = form && form.offsetWidth >= size.w * 0.6 ? form.offsetTop : size.h;
  return { top, w: size.w, h: Math.max(NOTE_SIZE.h, bottom - top) };
}

export function Wall({ initialNotes, initialTotal }: { initialNotes: Note[]; initialTotal: number }) {
  const [notes, setNotes] = useState(initialNotes);
  const [total, setTotal] = useState(initialTotal);
  const [live, setLive] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [pan, setPan] = useState<Pan>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [glide, setGlide] = useState(false);
  const [scale, setScale] = useState(1);
  const viewRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  // What the view keeps framed until the visitor pans by hand: every note on load, then a just-posted one.
  const focus = useRef<"all" | { x: number; y: number } | null>("all");
  const scaleRef = useRef(1);
  const initialRef = useRef(initialNotes);
  const drag = useRef<{ px: number; py: number; start: Pan } | null>(null);

  function addOnce(note: Note) {
    setNotes((cur) => (cur.some((n) => n.id === note.id) ? cur : [...cur, note]));
  }

  useEffect(() => {
    const source = new EventSource("/api/wall/stream");
    source.onopen = () => setLive(true);
    source.onerror = () => setLive(false);
    source.addEventListener("note", (e) => {
      const note = JSON.parse((e as MessageEvent<string>).data) as Note;
      setNotes((cur) => {
        if (cur.some((n) => n.id === note.id)) return cur;
        setTotal((t) => t + 1);
        return [...cur, note];
      });
    });
    return () => source.close();
  }, []);

  useEffect(() => {
    const el = viewRef.current;
    if (!el) return;
    // Sizes can change after first paint (late styles, rotation), so keep re-fitting.
    const fit = () => {
      const view = sizeOf(el);
      const open = openArea(el, headerRef.current, formRef.current);
      const f = focus.current;
      if (f === "all") {
        const framed = fitAll(initialRef.current, view, open);
        scaleRef.current = framed.scale;
        setScale(framed.scale);
        setPan(framed.pan);
        return;
      }
      const s = scaleRef.current;
      setPan((p) => (f ? centerOn(f.x, f.y, view, open, s) : clampPan(p, view, s)));
    };
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    drag.current = { px: e.clientX, py: e.clientY, start: pan };
    focus.current = null;
    setGlide(false);
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    const el = viewRef.current;
    if (!d || !el) return;
    setPan(clampPan({ x: d.start.x + e.clientX - d.px, y: d.start.y + e.clientY - d.py }, sizeOf(el), scale));
  }

  function endDrag() {
    drag.current = null;
    setDragging(false);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/wall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = (await res.json()) as { error?: string; note?: Note; total?: number };
      if (!res.ok || !data.note) {
        setError(data.error ?? "The wall didn't take that note. Try again in a moment.");
        return;
      }
      const note = data.note;
      addOnce(note);
      if (data.total !== undefined) setTotal(data.total);
      setText("");
      const el = viewRef.current;
      if (el) {
        focus.current = note;
        setGlide(true);
        setPan(centerOn(note.x, note.y, sizeOf(el), openArea(el, headerRef.current, formRef.current), scale));
      }
    } catch {
      setError("Could not reach the wall. Try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className={styles.page}>
      <header ref={headerRef} className={styles.header}>
        <Link href="/" className={styles.logo}>
          andrey<span className="accent">.</span>erofteev <span className={`mono dim ${styles.sub}`}>/ the wall</span>
        </Link>
        <div className={`mono ${styles.status}`} role="status">
          <span className={styles.dot} data-live={live} aria-hidden="true">
            ●
          </span>
          {live ? "live" : "offline"} · {total} {total === 1 ? "note" : "notes"}
        </div>
      </header>

      <div
        ref={viewRef}
        className={styles.view}
        data-dragging={dragging}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <ul className={styles.world} data-glide={glide} onTransitionEnd={() => setGlide(false)} style={{ width: WORLD.w, height: WORLD.h, transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }}>
          {notes.map((n) => (
            <li key={n.id} className={styles.note} style={{ left: n.x, top: n.y, background: n.color, transform: `rotate(${n.r}deg)` }}>
              {n.text}
              <div className={`mono ${styles.by}`}>
                visitor · {new Date(n.createdAt).toLocaleDateString("en", { month: "short", day: "numeric" })}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <form ref={formRef} className={styles.form} onSubmit={submit}>
        <label htmlFor="note-text" className={styles.formTitle}>
          Leave a note
        </label>
        <textarea
          id="note-text"
          rows={3}
          maxLength={MAX_NOTE_LENGTH}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Say hello"
        />
        <div className={styles.formRow}>
          <span className={`mono dim ${styles.count}`}>
            {text.length} / {MAX_NOTE_LENGTH}
          </span>
          <button type="submit" className={styles.stick} disabled={sending || text.trim() === ""}>
            Stick it
          </button>
        </div>
        <div className={styles.error} role="alert">
          {error}
        </div>
      </form>

      <div className={`mono dim ${styles.hint}`}>drag to pan · notes are moderated, and slightly crooked</div>
    </main>
  );
}
