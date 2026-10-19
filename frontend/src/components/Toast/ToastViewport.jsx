
import { useSyncExternalStore } from "react";
import { getToasts, subscribe } from "../../lib/toast";


export default function ToastViewport() {
  const toasts = useSyncExternalStore(
    subscribe,
    getToasts
  );

  return (
    <div
      className="toast toast-end toast-bottom z-[9999]"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((item) => (
        <div
          key={item.id}
          className="alert alert-info shadow-lg"
        >
          <div className="flex-1">
            <div>
              <h3 className="font-bold">
                {item.title}
              </h3>
              <div className="text-sm">
                {item.content}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            aria-label="Dismiss notification"
            onClick={() => dismissToast(item.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
