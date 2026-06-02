import { useEffect, useState } from "react";
import { Timer, Leaf, X } from "lucide-react";
import { useWellbeing } from "../contexts/WellbeingContext";

const AUTO_DISMISS_SECS = 10;

// Trigger label shown on the card
function triggerLabel(isPaused: boolean, frictionLevel: number, isAtLimit: boolean): string {
  if (isAtLimit) return "Alcanzaste tu límite diario";
  if (frictionLevel >= 1) return "Llevas mucho tiempo conectado";
  if (isPaused) return "Momento de pausa";
  return "Momento de descanso";
}

export function ActivitySuggestionCard() {
  const {
    showActivitySuggestion,
    suggestedActivity,
    startOfflineActivity,
    dismissActivitySuggestion,
    isPaused,
    frictionLevel,
    isAtLimit,
    joinedCommunities,
  } = useWellbeing();

  const [countdown, setCountdown] = useState(AUTO_DISMISS_SECS);

  // Reset and tick countdown each time the card appears
  useEffect(() => {
    if (!showActivitySuggestion) return;
    setCountdown(AUTO_DISMISS_SECS);
    const interval = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showActivitySuggestion]);

  // Dismiss when countdown reaches 0 — separate effect to avoid setState-in-updater
  useEffect(() => {
    if (countdown === 0 && showActivitySuggestion) {
      dismissActivitySuggestion();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  if (!showActivitySuggestion || !suggestedActivity) return null;

  const hasInterests = joinedCommunities.length > 0;

  return (
    // Overlay: sits above BreakScreen (z-50)
    <div className="fixed inset-0 z-[60] flex items-end justify-center pb-24 px-4 pointer-events-none">
      {/* Card */}
      <div
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
        style={{ animation: "slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}
      >
        {/* Top strip */}
        <div className="bg-gradient-to-r from-emerald-400 to-teal-500 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Leaf className="w-4 h-4" />
            <span className="text-sm">{triggerLabel(isPaused, frictionLevel, isAtLimit)}</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Countdown ring */}
            <div className="relative w-7 h-7 flex items-center justify-center">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 28 28">
                <circle cx="14" cy="14" r="11" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
                <circle
                  cx="14" cy="14" r="11"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 11}`}
                  strokeDashoffset={`${2 * Math.PI * 11 * (1 - countdown / AUTO_DISMISS_SECS)}`}
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <span className="text-white text-xs tabular-nums">{countdown}</span>
            </div>
            <button
              onClick={dismissActivitySuggestion}
              className="text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 pt-4 pb-5">
          {!hasInterests && (
            <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mb-3">
              Completa tu perfil para recibir sugerencias personalizadas
            </p>
          )}

          <div className="flex items-start gap-4 mb-4">
            <span className="text-5xl leading-none">{suggestedActivity.emoji}</span>
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-900 mb-0.5">{suggestedActivity.title}</h3>
              <p className="text-gray-600 text-sm leading-snug">{suggestedActivity.description}</p>
              <div className="flex items-center gap-1 mt-2">
                <Timer className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 text-xs">{suggestedActivity.duration} min</span>
                <span className="text-gray-300 mx-1">·</span>
                <span className="text-gray-500 text-xs">{suggestedActivity.benefit}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => startOfflineActivity(suggestedActivity)}
              className="flex-1 bg-emerald-500 text-white py-3 rounded-2xl hover:bg-emerald-600 transition-colors text-sm"
            >
              Vamos 🚀
            </button>
            <button
              onClick={dismissActivitySuggestion}
              className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-2xl hover:bg-gray-50 transition-colors text-sm"
            >
              Ahora no
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
