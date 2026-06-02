import { useNavigate } from "react-router";
import { useWellbeing } from "../contexts/WellbeingContext";
import { Leaf, X, Sparkles } from "lucide-react";

const OFFLINE_SUGGESTIONS = [
  { emoji: "🚶", text: "Da una vuelta corta por tu espacio" },
  { emoji: "💧", text: "Bebe un vaso de agua" },
  { emoji: "🧘", text: "Respira profundo cinco veces" },
  { emoji: "👀", text: "Mira a lo lejos por la ventana un minuto" },
  { emoji: "🤸", text: "Estira los brazos y mueve el cuello" },
  { emoji: "📖", text: "Lee una página de un libro en papel" },
  { emoji: "🌿", text: "Sal a tomar un poco de aire fresco" },
  { emoji: "😊", text: "Escribe tres cosas por las que estás agradecido" },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// Pick a stable suggestion based on the break start (no re-renders change it)
const suggestion = OFFLINE_SUGGESTIONS[Math.floor(Math.random() * OFFLINE_SUGGESTIONS.length)];

export function BreakScreen() {
  const navigate = useNavigate();
  const { breakSecondsRemaining, cancelBreak } = useWellbeing();

  const minutes = Math.floor(breakSecondsRemaining / 60);
  const seconds = breakSecondsRemaining % 60;

  const isEnding = breakSecondsRemaining <= 10 && breakSecondsRemaining > 0;
  const isDone = breakSecondsRemaining === 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 via-emerald-50 to-blue-50 px-8">
      {/* Top label */}
      <div className="flex items-center gap-2 mb-10 text-emerald-700">
        <Leaf className="w-5 h-5" />
        <span className="text-sm">Descanso activo</span>
      </div>

      {/* Countdown */}
      <div className="mb-8 relative flex items-center justify-center">
        <svg className="w-52 h-52 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="#d1fae5" strokeWidth="6" />
          {breakSecondsRemaining > 0 && (
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke={isEnding ? "#f97316" : "#10b981"}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 44}`}
              strokeDashoffset={`${2 * Math.PI * 44 * (1 - breakSecondsRemaining / (Math.ceil(breakSecondsRemaining / 60) * 60 || 1))}`}
              style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
            />
          )}
        </svg>
        <div className="absolute text-center">
          {isDone ? (
            <div className="text-emerald-600">
              <span className="text-5xl">✓</span>
            </div>
          ) : (
            <>
              <div className={`text-5xl tabular-nums ${isEnding ? "text-orange-500" : "text-emerald-700"}`}>
                {pad(minutes)}:{pad(seconds)}
              </div>
              <div className="text-emerald-500 text-sm mt-1">restantes</div>
            </>
          )}
        </div>
      </div>

      {/* Activity suggestion */}
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 mb-10 max-w-xs text-center shadow-sm">
        <div className="text-4xl mb-3">{suggestion.emoji}</div>
        <p className="text-gray-700">{suggestion.text}</p>
      </div>

      {isDone ? (
        <div className="text-center space-y-3">
          <p className="text-emerald-700 mb-2">¡Descanso completado! 🎉</p>
          <button
            onClick={cancelBreak}
            className="w-full bg-emerald-500 text-white px-8 py-3 rounded-2xl hover:bg-emerald-600 transition-colors"
          >
            Volver a la app
          </button>
          <button
            onClick={() => { cancelBreak(); navigate("/activities"); }}
            className="w-full border border-emerald-300 text-emerald-700 px-8 py-3 rounded-2xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Ver más actividades offline
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => { cancelBreak(); navigate("/activities"); }}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm bg-white/60 px-4 py-2 rounded-xl transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Explorar actividades offline
          </button>
          <button
            onClick={cancelBreak}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-sm"
          >
            <X className="w-4 h-4" />
            Cancelar pausa
          </button>
        </div>
      )}
    </div>
  );
}
