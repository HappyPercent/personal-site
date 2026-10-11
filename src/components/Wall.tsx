"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from "react";
import { MAX_NOTE_LENGTH, WORLD } from "@/lib/wall-rules";
import type { Note } from "@/lib/wall-store";
import styles from "./Wall.module.css";

type Pan = { x: number; y: number };
type View = { w: number; h: number };

export function clampPan(pan: Pan, view: View): Pan {
  const clamp = (v: number, viewSize: number, worldSize: number) =>
    worldSize <= viewSize ? (viewSize - worldSize) / 2 : Math.min(0, Math.max(viewSize - worldSize, v));
  return { x: clamp(pan.x, view.w, WORLD.w), y: clamp(pan.y, view.h, WORLD.h) };
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
  const viewRef = useRef<HTMLDivElement>(null);
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
    const fit = () => setPan((p) => clampPan(p, sizeOf(el)));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    drag.current = { px: e.clientX, py: e.clientY, start: pan };
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
        const view = sizeOf(el);
        setPan(clampPan({ x: view.w / 2 - note.x - 110, y: view.h / 2 - note.y - 85 }, view));
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
        <ul className={styles.world} style={{ width: WORLD.w, height: WORLD.h, transform: `translate(${pan.x}px, ${pan.y}px)` }}>
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
          placeholder="Say hi, or a joke about tabs vs spaces"
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
