import { useState } from "react";
import { useNavigate } from "react-router";
import { Leaf, Check, X, Edit2 } from "lucide-react";
import { useWellbeing } from "../contexts/WellbeingContext";

export function OfflineReturnConfirm() {
  const navigate = useNavigate();
  const {
    showReturnConfirm,
    returnElapsedMinutes,
    setReturnElapsedMinutes,
    activeOfflineActivity,
    confirmOfflineActivity,
    declineReturnConfirm,
  } = useWellbeing();

  const [editingTime, setEditingTime] = useState(false);
  const [inputValue, setInputValue] = useState("");

  if (!showReturnConfirm || !activeOfflineActivity) return null;

  const { activity } = activeOfflineActivity;

  const handleConfirm = () => {
    confirmOfflineActivity(returnElapsedMinutes);
    navigate("/", { replace: true });
  };

  const handleDecline = () => {
    declineReturnConfirm();
    navigate("/", { replace: true });
  };

  const startEdit = () => {
    setInputValue(String(returnElapsedMinutes));
    setEditingTime(true);
  };

  const commitEdit = () => {
    const val = parseInt(inputValue, 10);
    if (!isNaN(val) && val > 0) {
      setReturnElapsedMinutes(val);
    }
    setEditingTime(false);
  };

  const formatTime = (m: number) =>
    m >= 60
      ? `${Math.floor(m / 60)}h ${m % 60 > 0 ? `${m % 60}m` : ""}`.trim()
      : `${m} min`;

  return (
    <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 via-emerald-50 to-blue-50 px-6">
      {/* Icon */}
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
        <Leaf className="w-10 h-10 text-emerald-500" />
      </div>

      {/* Heading */}
      <h2 className="text-gray-900 text-center mb-2">¡Bienvenido de vuelta!</h2>
      <p className="text-gray-500 text-center text-sm mb-8">
        Detectamos que estuviste fuera de la pantalla
      </p>

      {/* Time display */}
      <div className="bg-white rounded-3xl shadow-lg px-8 py-6 mb-6 w-full max-w-xs text-center">
        <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Tiempo fuera</div>

        {editingTime ? (
          <div className="flex items-center justify-center gap-2 mb-2">
            <input
              autoFocus
              type="number"
              min="1"
              max="480"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => e.key === "Enter" && commitEdit()}
              className="w-20 text-center border border-emerald-300 rounded-xl px-2 py-1 text-2xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
            <span className="text-gray-500">min</span>
          </div>
        ) : (
          <button
            onClick={startEdit}
            className="flex items-center justify-center gap-2 mx-auto mb-2 group"
          >
            <span className="text-4xl text-emerald-600">{formatTime(returnElapsedMinutes)}</span>
            <Edit2 className="w-4 h-4 text-gray-300 group-hover:text-emerald-400 transition-colors" />
          </button>
        )}

        <p className="text-gray-500 text-sm mt-1">
          ¿Los dedicaste a{" "}
          <span className="text-gray-800">
            {activity.emoji} {activity.title}
          </span>
          ?
        </p>
      </div>

      {/* Activity reminder */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-5 py-3 mb-8 w-full max-w-xs">
        <p className="text-gray-600 text-sm text-center leading-relaxed">
          {activity.description}
        </p>
        <p className="text-emerald-600 text-xs text-center mt-1">{activity.benefit}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={handleConfirm}
          className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white py-3.5 rounded-2xl hover:bg-emerald-600 transition-colors"
        >
          <Check className="w-5 h-5" />
          Sí, lo hice
        </button>
        <button
          onClick={handleDecline}
          className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 py-3.5 rounded-2xl hover:bg-gray-50 transition-colors"
        >
          <X className="w-4 h-4" />
          No fue así
        </button>
      </div>
    </div>
  );
}
