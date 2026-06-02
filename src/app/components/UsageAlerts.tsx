import { useState } from "react";
import { X, Clock, Coffee, AlertTriangle } from "lucide-react";
import { useWellbeing } from "../contexts/WellbeingContext";

const BREAK_OPTIONS = [
  { label: "5 min", minutes: 5 },
  { label: "15 min", minutes: 15 },
  { label: "30 min", minutes: 30 },
];

function formatMinsLeft(todayMinutes: number, dailyLimit: number) {
  const left = Math.max(0, dailyLimit - todayMinutes);
  return left === 1 ? "1 minuto" : `${left} minutos`;
}

// ─── Break duration picker (shared) ─────────────────────────────────────────
function BreakPicker({
  onSelect,
  onCancel,
  title,
  subtitle,
}: {
  onSelect: (minutes: number) => void;
  onCancel: () => void;
  title: string;
  subtitle: string;
}) {
  const [custom, setCustom] = useState("");

  const handleCustom = () => {
    const val = parseInt(custom, 10);
    if (val > 0) onSelect(val);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-t-3xl w-full max-w-md shadow-2xl p-6 pb-8">
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="flex items-center gap-3 mb-1">
          <Coffee className="w-5 h-5 text-emerald-600" />
          <h3>{title}</h3>
        </div>
        <p className="text-gray-500 text-sm mb-5">{subtitle}</p>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {BREAK_OPTIONS.map(({ label, minutes }) => (
            <button
              key={minutes}
              onClick={() => onSelect(minutes)}
              className="py-3 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="number"
            min={1}
            max={120}
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Minutos personalizados..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleCustom}
            disabled={!custom || parseInt(custom) <= 0}
            className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-emerald-600 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
          >
            OK
          </button>
        </div>

        <button
          onClick={onCancel}
          className="w-full py-3 rounded-2xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors text-sm"
        >
          Continuar sin pausar
        </button>
      </div>
    </div>
  );
}

// ─── 80% approaching alert (dismissible top banner) ─────────────────────────
function ApproachingLimitBanner() {
  const { todayMinutes, settings, dismissApproachingAlert, startBreak } = useWellbeing();
  const [showPicker, setShowPicker] = useState(false);

  const minsLeft = formatMinsLeft(todayMinutes, settings.dailyLimit);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40 max-w-md mx-auto">
        <div className="mx-3 mt-3 bg-amber-400 rounded-2xl px-4 py-3 shadow-lg flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-900 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-amber-900 text-sm">
              <strong>Te quedan {minsLeft}</strong> de tu límite diario.
            </p>
            <button
              onClick={() => setShowPicker(true)}
              className="text-amber-800 text-xs underline mt-0.5"
            >
              Tomar un descanso
            </button>
          </div>
          <button onClick={dismissApproachingAlert} className="text-amber-800 hover:text-amber-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showPicker && (
        <BreakPicker
          title="Tomar un descanso"
          subtitle="¿Cuánto tiempo quieres desconectarte?"
          onSelect={(m) => { startBreak(m); setShowPicker(false); dismissApproachingAlert(); }}
          onCancel={() => { setShowPicker(false); dismissApproachingAlert(); }}
        />
      )}
    </>
  );
}

// ─── 100% limit reached modal ────────────────────────────────────────────────
function AtLimitModal() {
  const { todayMinutes, settings, dismissAtLimitAlert, startBreak } = useWellbeing();
  const [showPicker, setShowPicker] = useState(false);
  const overBy = Math.max(0, todayMinutes - settings.dailyLimit);

  if (showPicker) {
    return (
      <BreakPicker
        title="Tomar un descanso"
        subtitle="¿Cuánto tiempo quieres desconectarte?"
        onSelect={(m) => { startBreak(m); dismissAtLimitAlert(); }}
        onCancel={dismissAtLimitAlert}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-orange-500" />
          </div>
        </div>

        <h3 className="text-center mb-2">Alcanzaste tu límite diario</h3>
        <p className="text-gray-500 text-sm text-center mb-1">
          Tu límite era <strong>{settings.dailyLimit} min</strong>.
        </p>
        {overBy > 0 && (
          <p className="text-orange-500 text-xs text-center mb-5">
            Llevas {overBy} {overBy === 1 ? "minuto" : "minutos"} extra.
          </p>
        )}

        <div className="space-y-3">
          <button
            onClick={() => setShowPicker(true)}
            className="w-full bg-emerald-500 text-white py-3 rounded-2xl hover:bg-emerald-600 transition-colors"
          >
            🌿 Tomar un descanso
          </button>
          <button
            onClick={dismissAtLimitAlert}
            className="w-full border border-gray-200 text-gray-600 py-3 rounded-2xl hover:bg-gray-50 transition-colors text-sm"
          >
            Continuar con uso consciente
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Continuous use reminder modal (UC-21) ──────────────────────────────────
function ContinuousReminderModal() {
  const { continuousMinutes, settings, dismissContinuousReminder, startBreak } = useWellbeing();
  const [showPicker, setShowPicker] = useState(false);

  if (showPicker) {
    return (
      <BreakPicker
        title="Tomar un descanso"
        subtitle="¿Cuánto tiempo quieres desconectarte?"
        onSelect={(m) => { startBreak(m); dismissContinuousReminder(); }}
        onCancel={dismissContinuousReminder}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full">
        <div className="text-4xl text-center mb-4">🧘</div>
        <h3 className="text-center mb-2">
          Llevas {continuousMinutes} min seguidos
        </h3>
        <p className="text-gray-500 text-sm text-center mb-6">
          {settings.continuousThreshold >= 30
            ? "¿Qué tal si estiras un poco antes de continuar?"
            : "Una pequeña pausa puede hacer mucho bien."}
        </p>

        <div className="space-y-3">
          <button
            onClick={() => setShowPicker(true)}
            className="w-full bg-emerald-500 text-white py-3 rounded-2xl hover:bg-emerald-600 transition-colors"
          >
            ☕ Tomar un descanso
          </button>
          <button
            onClick={dismissContinuousReminder}
            className="w-full border border-gray-200 text-gray-600 py-3 rounded-2xl hover:bg-gray-50 transition-colors text-sm"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function UsageAlerts() {
  const { showApproachingAlert, showAtLimitAlert, showContinuousReminder } = useWellbeing();

  // Priority: at-limit > continuous reminder > approaching
  if (showAtLimitAlert) return <AtLimitModal />;
  if (showContinuousReminder) return <ContinuousReminderModal />;
  if (showApproachingAlert) return <ApproachingLimitBanner />;
  return null;
}

// ─── Quick-pause trigger (exported for Layout) ───────────────────────────────
export function QuickPauseButton() {
  const { startBreak } = useWellbeing();
  const [showPicker, setShowPicker] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowPicker(true)}
        title="Tomar un descanso"
        className="fixed bottom-20 right-4 z-30 w-12 h-12 bg-emerald-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-600 active:scale-95 transition-all"
      >
        <Coffee className="w-5 h-5" />
      </button>

      {showPicker && (
        <BreakPicker
          title="Tomar un descanso"
          subtitle="¿Cuánto tiempo quieres desconectarte?"
          onSelect={(m) => { startBreak(m); setShowPicker(false); }}
          onCancel={() => setShowPicker(false)}
        />
      )}
    </>
  );
}
