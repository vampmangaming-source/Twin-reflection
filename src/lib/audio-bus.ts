// Tiny event bus for coordinating background music and card players.
type Handler = (payload?: unknown) => void;

const listeners: Record<string, Set<Handler>> = {};

export const AudioBus = {
  on(event: string, fn: Handler) {
    (listeners[event] ??= new Set()).add(fn);
    return () => listeners[event]?.delete(fn);
  },
  emit(event: string, payload?: unknown) {
    listeners[event]?.forEach((fn) => fn(payload));
  },
};

export const AUDIO_EVENTS = {
  START_BACKGROUND: "bg:start",
  FADE_OUT_BACKGROUND: "bg:fadeout",
  FADE_IN_BACKGROUND: "bg:fadein",
  CARD_PLAY: "card:play", // payload = card id string
} as const;
