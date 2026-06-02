import { useState, useEffect, useRef } from "react";
import { Leaf, Pause, Play, Maximize2, X, ChevronDown } from "lucide-react";
import { useWellbeing } from "../contexts/WellbeingContext";

function useElapsedSeconds(
  startTime: number,
  totalPausedMs: number,
  pausedAt: number | null
): number {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const pausedNow = pausedAt !== null ? Date.now() - pausedAt : 0;
  return Math.floor((Date.now() - startTime - totalPausedMs - pausedNow) / 1000);
}

function formatTime(seconds: number): string {
  const m = Math.floor(Math.abs(seconds) / 60);
  const s = Math.abs(seconds) % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ─── Minimized sticky banner ────────────────────────────────────────────────

function MiniBanner() {
  const {
    activeOfflineActivity,
    pauseOfflineActivity,
    resumeOfflineActivity,
    expandActivityOverlay,
    cancelOfflineActivity,
  } = useWellbeing();

  if (!activeOfflineActivity) return null;
  const { activity, startTime, totalPausedMs, pausedAt } = activeOfflineActivity;
  const elapsed = useElapsedSeconds(startTime, totalPausedMs, pausedAt);
  const totalSecs = activity.duration * 60;
  const remaining = totalSecs - elapsed;
  const isPaused = pausedAt !== null;
  const done = remaining <= 0;

  return (
    <div className="fixed top-0 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <div
        className="mt-2 mx-3 bg-emerald-600 text-white rounded-2xl shadow-lg px-3 py-2 flex items-center gap-2 pointer-events-auto max-w-sm w-full"
        style={{ backdropFilter: "blur(8px)" }}
      >
        <span className="text-base leading-none flex-shrink-0">{activity.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white/80 truncate">{activity.title}</p>
          <p className="text-sm tabular-nums">
            {done ? "¡Completada!" : isPaused ? "En pausa" : formatTime(Math.max(0, remaining))}
            {!done && !isPaused && <span className="text-white/60 text-xs ml-1">restantes</span>}
          </p>
        </div>
        <button
          onClick={isPaused ? resumeOfflineActivity : pauseOfflineActivity}
          className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors flex-shrink-0"
        >
          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={expandActivityOverlay}
          className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors flex-shrink-0"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={cancelOfflineActivity}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Full-screen overlay ─────────────────────────────────────────────────────

function FullOverlay() {
  const {
    activeOfflineActivity,
    pauseOfflineActivity,
    resumeOfflineActivity,
    minimizeActivityOverlay,
    cancelOfflineActivity,
    confirmOfflineActivity,
    setReturnElapsedMinutes,
  } = useWellbeing();

  if (!activeOfflineActivity) return null;
  const { activity, startTime, totalPausedMs, pausedAt } = activeOfflineActivity;
  const elapsed = useElapsedSeconds(startTime, totalPausedMs, pausedAt);
  const totalSecs = activity.duration * 60;
  const remaining = totalSecs - elapsed;
  const isPaused = pausedAt !== null;
  const done = remaining <= 0;

  const progress = Math.min(1, elapsed / totalSecs);
  const r = 44;
  const circumference = 2 * Math.PI * r;

  const handleComplete = () => {
    const mins = Math.max(1, Math.round(elapsed / 60));
    setReturnElapsedMinutes(mins);
    confirmOfflineActivity(mins);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-50 px-8">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-4">
        <button
          onClick={minimizeActivityOverlay}
          className="flex items-center gap-1.5 text-emerald-700 bg-white/60 rounded-xl px-3 py-1.5 text-sm hover:bg-white/80 transition-colors"
        >
          <ChevronDown className="w-4 h-4" />
          Minimizar
        </button>
        <div className="flex items-center gap-1.5 text-emerald-700">
          <Leaf className="w-4 h-4" />
          <span className="text-sm">Actividad offline</span>
        </div>
        <button
          onClick={cancelOfflineActivity}
          className="text-gray-400 hover:text-gray-600 bg-white/60 rounded-xl p-1.5 hover:bg-white/80 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Activity name */}
      <div className="flex items-center gap-2 mb-8 text-emerald-700">
        <span className="text-2xl">{activity.emoji}</span>
        <span className="text-base">{activity.title}</span>
      </div>

      {/* Ring timer */}
      <div className="relative flex items-center justify-center mb-8">
        <svg className="w-52 h-52 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#d1fae5" strokeWidth="6" />
          <circle
            cx="50" cy="50" r={r}
            fill="none"
            stroke={done ? "#10b981" : isPaused ? "#6ee7b7" : "#059669"}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div className="absolute text-center">
          {done ? (
            <span className="text-5xl text-emerald-600">✓</span>
          ) : (
            <>
              <div className="text-5xl tabular-nums text-emerald-700">
                {formatTime(Math.max(0, remaining))}
              </div>
              <div className="text-emerald-500 text-sm mt-1">
                {isPaused ? "en pausa" : "restantes"}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-5 mb-8 max-w-xs text-center shadow-sm">
        <p className="text-gray-700 text-sm leading-relaxed">{activity.description}</p>
        <p className="text-emerald-600 text-xs mt-2">{activity.benefit}</p>
      </div>

      {/* Controls */}
      {!done && (
        <button
          onClick={isPaused ? resumeOfflineActivity : pauseOfflineActivity}
          className="bg-emerald-500 text-white px-8 py-3 rounded-2xl hover:bg-emerald-600 transition-colors mb-3 flex items-center gap-2"
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          {isPaused ? "Reanudar" : "Pausar"}
        </button>
      )}

      {done ? (
        <button
          onClick={handleComplete}
          className="bg-emerald-500 text-white px-10 py-3 rounded-2xl hover:bg-emerald-600 transition-colors"
        >
          ¡Completada! 🎉
        </button>
      ) : (
        <button
          onClick={cancelOfflineActivity}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm mt-1"
        >
          <X className="w-4 h-4" /> Cancelar actividad
        </button>
      )}
    </div>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export function ActiveActivityOverlay() {
  const { activeOfflineActivity, activityMinimized } = useWellbeing();
  if (!activeOfflineActivity) return null;
  return activityMinimized ? <MiniBanner /> : <FullOverlay />;
}
