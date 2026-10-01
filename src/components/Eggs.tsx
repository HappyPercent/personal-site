"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Icon } from "@/components/Icons";
import styles from "./Eggs.module.css";

export const eggs = [
  { id: "branch", label: "Branch merged" },
  { id: "avatar", label: "Avatar whisperer" },
  { id: "vim", label: "Escaped Vim" },
] as const;

type EggId = (typeof eggs)[number]["id"];
const KEY = "eggs-found";

const listeners = new Set<() => void>();
const empty: ReadonlySet<EggId> = new Set();
let cache: { raw: string; set: ReadonlySet<EggId> } = { raw: "[]", set: empty };

function parse(raw: string): ReadonlySet<EggId> {
  try {
    const ids = JSON.parse(raw) as EggId[];
    return new Set(ids.filter((id) => eggs.some((e) => e.id === id)));
  } catch {
    return empty;
  }
}

function snapshot(): ReadonlySet<EggId> {
  let raw: string;
  try {
    raw = localStorage.getItem(KEY) ?? "[]";
  } catch {
    raw = cache.raw;
  }
  if (raw !== cache.raw) cache = { raw, set: parse(raw) };
  return cache.set;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function save(next: ReadonlySet<EggId>) {
  const raw = JSON.stringify([...next]);
  cache = { raw, set: next };
  try {
    localStorage.setItem(KEY, raw);
  } catch {
  }
  listeners.forEach((cb) => cb());
}

type Ctx = { found: ReadonlySet<EggId>; find: (id: EggId) => void };
const EggsContext = createContext<Ctx | null>(null);

export function useEggs(): Ctx {
  const ctx = useContext(EggsContext);
  if (!ctx) throw new Error("useEggs must be used inside EggsProvider");
  return ctx;
}

export function EggsProvider({ children }: { children: ReactNode }) {
  const found = useSyncExternalStore(subscribe, snapshot, () => empty);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const find = useCallback((id: EggId) => {
    const current = snapshot();
    if (current.has(id)) return;
    const next = new Set(current).add(id);
    save(next);
    const label = eggs.find((e) => e.id === id)?.label ?? id;
    setToast(`Easter egg found: ${label} (${next.size}/${eggs.length})`);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  const value = useMemo(() => ({ found, find }), [found, find]);

  return (
    <EggsContext.Provider value={value}>
      {children}
      <div className={styles.toast} role="status" data-show={toast !== null}>
        {toast}
      </div>
    </EggsContext.Provider>
  );
}

export function EggCounter() {
  const { found } = useEggs();
  return (
    <span className={`mono ${styles.counter}`} title="Hidden easter eggs found" data-done={found.size === eggs.length}>
      <Icon name="branch" size={18} />
      {found.size}/{eggs.length}
    </span>
  );
}

