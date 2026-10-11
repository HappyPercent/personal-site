import { EventEmitter } from "node:events";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { placeNote } from "./wall-rules";

export type Note = {
  id: number;
  text: string;
  x: number;
  y: number;
  r: number;
  color: string;
  createdAt: number;
};

type Store = { db: DatabaseSync; events: EventEmitter };

const globalStore = globalThis as typeof globalThis & { __wall?: Store };

function open(): Store {
  const file = process.env.WALL_DB ?? "data/wall.db";
  if (file !== ":memory:") mkdirSync(dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      x INTEGER NOT NULL,
      y INTEGER NOT NULL,
      r REAL NOT NULL,
      color TEXT NOT NULL,
      hidden INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );
  `);
  const events = new EventEmitter();
  events.setMaxListeners(0);
  return { db, events };
}

function store(): Store {
  return (globalStore.__wall ??= open());
}

type Row = { id: number; text: string; x: number; y: number; r: number; color: string; created_at: number };
const toNote = (row: Row): Note => ({
  id: row.id,
  text: row.text,
  x: row.x,
  y: row.y,
  r: row.r,
  color: row.color,
  createdAt: row.created_at,
});

export function listNotes(limit = 200): Note[] {
  const rows = store()
    .db.prepare("SELECT * FROM notes WHERE hidden = 0 ORDER BY id DESC LIMIT ?")
    .all(limit) as Row[];
  return rows.map(toNote).reverse();
}

export function countNotes(): number {
  const row = store().db.prepare("SELECT COUNT(*) AS n FROM notes WHERE hidden = 0").get() as { n: number };
  return row.n;
}

export function addNote(text: string): Note {
  const { db, events } = store();
  const p = placeNote();
  const createdAt = Date.now();
  const res = db
    .prepare("INSERT INTO notes (text, x, y, r, color, created_at) VALUES (?, ?, ?, ?, ?, ?)")
    .run(text, p.x, p.y, p.r, p.color, createdAt);
  const note: Note = { id: Number(res.lastInsertRowid), text, ...p, createdAt };
  events.emit("note", note);
  return note;
}

export function onNote(cb: (note: Note) => void): () => void {
  const { events } = store();
  events.on("note", cb);
  return () => events.off("note", cb);
}
