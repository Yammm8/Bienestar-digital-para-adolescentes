import { useWellbeing } from "../contexts/WellbeingContext";
import { Leaf, X } from "lucide-react";

// Small sticky banner shown at the top when an offline activity is running
export function ActiveActivityBanner() {
  const { activeOfflineActivity, cancelOfflineActivity } = useWellbeing();

  if (!activeOfflineActivity) return null;

  const { activity, startTime } = activeOfflineActivity;
  const elapsedMin = Math.floor((Date.now() - startTime) / 60_000);

  return (
    <div className="fixed top-0 left-0 right-0 z-40 flex justify-center px-4 pt-2 pointer-events-none">
      <div className="flex items-center gap-3 bg-emerald-600 text-white rounded-2xl px-4 py-2.5 shadow-lg pointer-events-auto max-w-sm w-full">
        <Leaf className="w-4 h-4 shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-sm">
            {activity.emoji} {activity.title}
          </span>
          {elapsedMin > 0 && (
            <span className="text-emerald-200 text-xs ml-2">· {elapsedMin} min</span>
          )}
        </div>
        <button
          onClick={cancelOfflineActivity}
          className="text-emerald-200 hover:text-white transition-colors shrink-0"
          aria-label="Cancelar actividad"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
