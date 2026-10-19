"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from "react";
import { MAX_NOTE_LENGTH, NOTE_SIZE, WORLD } from "@/lib/wall-rules";
import type { Note } from "@/lib/wall-store";
import styles from "./Wall.module.css";

type Pan = { x: number; y: number };
type View = { w: number; h: number };

export function clampPan(pan: Pan, view: View): Pan {
  const clamp = (v: number, viewSize: number, worldSize: number) =>
    worldSize <= viewSize ? (viewSize - worldSize) / 2 : Math.min(0, Math.max(viewSize - worldSize, v));
  return { x: clamp(pan.x, view.w, WORLD.w), y: clamp(pan.y, view.h, WORLD.h) };
}

/** Pan that puts a note (top-left at x, y) in the middle of the view. */
export function centerOn(x: number, y: number, view: View): Pan {
  return clampPan({ x: view.w / 2 - x - NOTE_SIZE.w / 2, y: view.h / 2 - y - NOTE_SIZE.h / 2 }, view);
}

const sizeOf = (el: HTMLElement): View => ({ w: el.clientWidth, h: el.clientHeight });

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
  const viewRef = useRef<HTMLDivElement>(null);
  // The spot kept in the middle of the view until the visitor pans by hand.
  // New notes cluster around the middle of the world, so start there.
  const focus = useRef<{ x: number; y: number } | null>({ x: (WORLD.w - NOTE_SIZE.w) / 2, y: (WORLD.h - NOTE_SIZE.h) / 2 });
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
      const f = focus.current;
      setPan((p) => (f ? centerOn(f.x, f.y, view) : clampPan(p, view)));
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
    setPan(clampPan({ x: d.start.x + e.clientX - d.px, y: d.start.y + e.clientY - d.py }, sizeOf(el)));
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
        setError(data.error ?? "Something went wrong.");
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
        setPan(centerOn(note.x, note.y, sizeOf(el)));
      }
    } catch {
      setError("Could not reach the wall. Try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
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
        <ul className={styles.world} data-glide={glide} onTransitionEnd={() => setGlide(false)} style={{ width: WORLD.w, height: WORLD.h, transform: `translate(${pan.x}px, ${pan.y}px)` }}>
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

      <form className={styles.form} onSubmit={submit}>
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
