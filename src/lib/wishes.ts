export type Wish = {
  id: string;
  text: string;
  createdAt: number;
};

// Permanent wishes: keyed by sister. Persisted in localStorage so lanterns
// remain after refresh and across visits. Falls back to in-memory during SSR.
const memory = new Map<string, Wish[]>();

function storageKey(who: string) {
  return `wishes:${who}`;
}

function safeLoad(who: string): Wish[] {
  if (typeof window === "undefined") return memory.get(who) ?? [];
  try {
    const raw = window.localStorage.getItem(storageKey(who));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (w): w is Wish =>
        w && typeof w.id === "string" && typeof w.text === "string" && typeof w.createdAt === "number",
    );
  } catch {
    return [];
  }
}

function safeSave(who: string, list: Wish[]) {
  memory.set(who, list);
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(who), JSON.stringify(list));
  } catch {
    // storage full / disabled — silently keep in-memory copy
  }
}

export function loadWishes(who: string): Wish[] {
  return safeLoad(who);
}

export function saveWishes(who: string, list: Wish[]) {
  safeSave(who, list);
}

export function addWish(who: string, text: string): Wish | null {
  const trimmed = text.trim().replace(/\s+/g, " ").slice(0, 280);
  if (!trimmed) return null;
  const wish: Wish = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text: trimmed,
    createdAt: Date.now(),
  };
  const list = [...safeLoad(who), wish];
  safeSave(who, list);
  return wish;
}
