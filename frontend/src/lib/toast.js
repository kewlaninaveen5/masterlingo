
let toasts = [];
let nextId = 1;

const listeners = new Set();
const timers = new Map();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function subscribe(listener) {
  listeners.add(listener);

  return () => listeners.delete(listener);
}

export function getToasts() {
  return toasts;
}

export function dismissToast(id) {
  const timer = timers.get(id);

  if (timer) clearTimeout(timer);
  timers.delete(id);

  toasts = toasts.filter((item) => item.id !== id);
  notifyListeners();
}

export function toast({
  title,
  content,
  duration = 5000,
}) {
  const id = nextId++;

  toasts = [...toasts, { id, title, content }];
  notifyListeners();

  if (duration > 0) {
    timers.set(
      id,
      setTimeout(() => dismissToast(id), duration)
    );
  }

  return id;
}
