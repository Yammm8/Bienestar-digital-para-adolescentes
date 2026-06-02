import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Heart, Layers, Bell, Clock, Users,
  ArrowRight, ArrowLeft, Check, Sparkles,
} from "lucide-react";
import { useWellbeing } from "../contexts/WellbeingContext";
import { useAuth } from "../contexts/AuthContext";
import logo from "../../imports/Bienestar_digital_logo.png";

// ─── Data ─────────────────────────────────────────────────────────────────────

const LIMIT_OPTIONS = [
  { label: "30 min", value: 30, desc: "Uso muy moderado" },
  { label: "1 hora", value: 60, desc: "Equilibrio recomendado" },
  { label: "2 horas", value: 120, desc: "Uso moderado" },
];

const COMMUNITY_OPTIONS = [
  { name: "Mindfulness",              emoji: "🧘", desc: "Atención plena y vida consciente" },
  { name: "Lectura consciente",       emoji: "📚", desc: "Libros que nos transforman"       },
  { name: "Vida universitaria",       emoji: "🎓", desc: "Apoyo mutuo para estudiantes"     },
  { name: "Creatividad",              emoji: "🎨", desc: "Arte, música y expresión auténtica"},
  { name: "Naturaleza",               emoji: "🌿", desc: "Conexión con el mundo natural"    },
  { name: "Conversaciones profundas", emoji: "💬", desc: "Temas que importan, sin ruido"    },
];

// ─── Small helpers ────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-emerald-500" : "bg-gray-300"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-6" : "translate-x-0"}`}
      />
    </button>
  );
}

// ─── Step views ───────────────────────────────────────────────────────────────

function StepWelcome() {
  return (
    <div className="flex flex-col items-center text-center">
      <img src={logo} alt="Bienestar Digital" className="w-24 h-24 mb-6 drop-shadow-lg" />
      <h1 className="mb-4 text-gray-900">Bienvenido a Bienestar Digital</h1>
      <p className="text-gray-600 leading-relaxed mb-6">
        Una red social diseñada para cuidar tu tiempo y bienestar. Sin algoritmos manipuladores, sin métricas de vanidad — solo conexiones reales y consciencia digital.
      </p>
      <div className="w-full space-y-3">
        {[
          { icon: "📵", text: "Sin notificaciones constantes — resumen horario" },
          { icon: "⏱️", text: "Límites de tiempo que tú controlas" },
          { icon: "🌱", text: "Fricción suave para reducir el uso automático" },
          { icon: "🤝", text: "Comunidades pequeñas con conversaciones reales" },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-3 bg-white/70 rounded-2xl px-4 py-3 text-left">
            <span className="text-xl flex-shrink-0">{item.icon}</span>
            <span className="text-gray-700 text-sm">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepFriction({
  frictionEnabled,
  setFrictionEnabled,
  colorFadeEnabled,
  setColorFadeEnabled,
}: {
  frictionEnabled: boolean;
  setFrictionEnabled: (v: boolean) => void;
  colorFadeEnabled: boolean;
  setColorFadeEnabled: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
        <Layers className="w-8 h-8 text-purple-500" strokeWidth={1.5} />
      </div>
      <h1 className="mb-3 text-gray-900">Fricción consciente</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-6">
        Conforme pasa el tiempo, la interfaz se degrada sutilmente — los colores se apagan, el texto pierde contraste. No es un bloqueo, es una invitación amable a pausar.
      </p>
      <div className="w-full space-y-3">
        <div className="bg-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm">
          <div className="text-left">
            <p className="text-gray-800 text-sm">Activar fricción consciente</p>
            <p className="text-gray-500 text-xs mt-0.5">Recomendado para uso moderado</p>
          </div>
          <Toggle checked={frictionEnabled} onChange={setFrictionEnabled} />
        </div>
        {frictionEnabled && (
          <div className="bg-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm">
            <div className="text-left">
              <p className="text-gray-800 text-sm">Degradación de color</p>
              <p className="text-gray-500 text-xs mt-0.5">La saturación baja gradualmente</p>
            </div>
            <Toggle checked={colorFadeEnabled} onChange={setColorFadeEnabled} />
          </div>
        )}
        <div className="bg-purple-50 rounded-2xl px-4 py-3 text-left">
          <p className="text-purple-700 text-xs leading-relaxed">
            La fricción no te bloquea ni te juzga. Solo hace visible lo que normalmente es invisible: el tiempo que pasa mientras haces scroll.
          </p>
        </div>
      </div>
    </div>
  );
}

function StepNotifications({
  remindersEnabled,
  setRemindersEnabled,
  continuousThreshold,
  setContinuousThreshold,
}: {
  remindersEnabled: boolean;
  setRemindersEnabled: (v: boolean) => void;
  continuousThreshold: number;
  setContinuousThreshold: (v: number) => void;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
        <Bell className="w-8 h-8 text-blue-500" strokeWidth={1.5} />
      </div>
      <h1 className="mb-3 text-gray-900">Notificaciones con intención</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-6">
        Las notificaciones se agrupan y llegan en un resumen por hora — no como interrupciones constantes. Tu atención vale demasiado para fragmentarla.
      </p>
      <div className="w-full space-y-3">
        <div className="bg-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm">
          <div className="text-left">
            <p className="text-gray-800 text-sm">Recordatorios de descanso</p>
            <p className="text-gray-500 text-xs mt-0.5">Aviso cuando llevas mucho tiempo continuo</p>
          </div>
          <Toggle checked={remindersEnabled} onChange={setRemindersEnabled} />
        </div>
        {remindersEnabled && (
          <div className="bg-white rounded-2xl px-5 py-4 shadow-sm">
            <p className="text-gray-700 text-sm text-left mb-3">Recordarme después de:</p>
            <div className="flex gap-2">
              {[15, 30, 45, 60].map((min) => (
                <button
                  key={min}
                  onClick={() => setContinuousThreshold(min)}
                  className={`flex-1 py-2 rounded-xl text-sm transition-colors ${
                    continuousThreshold === min
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {min}m
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="bg-blue-50 rounded-2xl px-4 py-3 text-left">
          <p className="text-blue-700 text-xs leading-relaxed">
            Puedes cambiar estas preferencias en cualquier momento desde Ajustes → Bienestar.
          </p>
        </div>
      </div>
    </div>
  );
}

function StepTimeLimit({
  selectedLimit,
  setSelectedLimit,
}: {
  selectedLimit: number | null;
  setSelectedLimit: (v: number | null) => void;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
        <Clock className="w-8 h-8 text-orange-500" strokeWidth={1.5} />
      </div>
      <h1 className="mb-3 text-gray-900">¿Cuánto tiempo al día?</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-6">
        Establece un límite diario según tus objetivos personales. La app te avisará cuando te acerques a él — sin bloquearte, solo recordándote.
      </p>
      <div className="w-full space-y-3">
        {LIMIT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSelectedLimit(opt.value)}
            className={`w-full py-3.5 px-5 rounded-2xl border-2 transition-all flex items-center justify-between ${
              selectedLimit === opt.value
                ? "bg-orange-500 border-orange-500 text-white"
                : "bg-white border-gray-200 text-gray-700 hover:border-orange-300"
            }`}
          >
            <span className="text-sm">{opt.label}</span>
            <span className={`text-xs ${selectedLimit === opt.value ? "text-orange-100" : "text-gray-400"}`}>
              {opt.desc}
            </span>
            {selectedLimit === opt.value && <Check className="w-4 h-4 flex-shrink-0" />}
          </button>
        ))}
        <button
          onClick={() => setSelectedLimit(null)}
          className={`w-full py-3 rounded-2xl border-2 transition-colors text-sm ${
            selectedLimit === null
              ? "bg-gray-100 border-gray-400 text-gray-700"
              : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"
          }`}
        >
          Lo configuro más tarde
        </button>
      </div>
    </div>
  );
}

function StepCommunities({
  selected,
  toggle,
}: {
  selected: string[];
  toggle: (name: string) => void;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6">
        <Users className="w-8 h-8 text-teal-500" strokeWidth={1.5} />
      </div>
      <h1 className="mb-2 text-gray-900">Elige tus comunidades</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-5">
        Únete a espacios que reflejen tus intereses genuinos. Puedes cambiarlos en cualquier momento.
      </p>
      <div className="w-full space-y-2">
        {COMMUNITY_OPTIONS.map((c) => {
          const isSelected = selected.includes(c.name);
          return (
            <button
              key={c.name}
              onClick={() => toggle(c.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left transition-all ${
                isSelected
                  ? "border-teal-400 bg-teal-50"
                  : "border-gray-200 bg-white hover:border-teal-200"
              }`}
            >
              <span className="text-2xl flex-shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 text-sm">{c.name}</p>
                <p className="text-gray-500 text-xs truncate">{c.desc}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                isSelected ? "bg-teal-500 border-teal-500" : "border-gray-300"
              }`}>
                {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </div>
            </button>
          );
        })}
      </div>
      {selected.length === 0 && (
        <p className="text-gray-400 text-xs mt-3">Selecciona al menos una para personalizar tu experiencia</p>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const STEP_GRADIENTS = [
  "from-emerald-50 via-teal-50 to-blue-50",
  "from-purple-50 via-blue-50 to-indigo-50",
  "from-blue-50 via-cyan-50 to-teal-50",
  "from-orange-50 via-amber-50 to-yellow-50",
  "from-teal-50 via-green-50 to-emerald-50",
];

export function Onboarding() {
  const navigate = useNavigate();
  const { updateSettings, joinCommunity } = useWellbeing();
  const { completeOnboarding } = useAuth();

  const [step, setStep] = useState(0);
  const TOTAL_STEPS = 5;

  // Step 1 — friction
  const [frictionEnabled, setFrictionEnabled] = useState(true);
  const [colorFadeEnabled, setColorFadeEnabled] = useState(true);

  // Step 2 — notifications
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [continuousThreshold, setContinuousThreshold] = useState(30);

  // Step 3 — time limit
  const [selectedLimit, setSelectedLimit] = useState<number | null>(60);

  // Step 4 — communities
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>([]);

  const toggleCommunity = (name: string) => {
    setSelectedCommunities((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const canAdvance = step !== 4 || selectedCommunities.length > 0;

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      // Apply all settings
      updateSettings({
        frictionEnabled,
        colorFadeEnabled,
        remindersEnabled,
        continuousThreshold,
        dailyLimit: selectedLimit ?? 60,
        delaysEnabled: frictionEnabled,
      });
      selectedCommunities.forEach((c) => joinCommunity(c));
      completeOnboarding();
      navigate("/");
    }
  };

  const isLast = step === TOTAL_STEPS - 1;

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br ${STEP_GRADIENTS[step]} transition-all duration-500`}>
      {/* Top progress bar */}
      <div className="flex gap-1.5 px-6 pt-6 pb-2">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? "bg-emerald-500" : "bg-gray-200"}`}
          />
        ))}
      </div>

      {/* Step label */}
      <div className="flex items-center justify-between px-6 pb-2">
        <span className="text-xs text-gray-400">{step + 1} de {TOTAL_STEPS}</span>
        {!isLast && (
          <button
            onClick={() => { completeOnboarding(); navigate("/"); }}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Omitir todo
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 max-w-md mx-auto w-full">
        {step === 0 && <StepWelcome />}
        {step === 1 && (
          <StepFriction
            frictionEnabled={frictionEnabled}
            setFrictionEnabled={setFrictionEnabled}
            colorFadeEnabled={colorFadeEnabled}
            setColorFadeEnabled={setColorFadeEnabled}
          />
        )}
        {step === 2 && (
          <StepNotifications
            remindersEnabled={remindersEnabled}
            setRemindersEnabled={setRemindersEnabled}
            continuousThreshold={continuousThreshold}
            setContinuousThreshold={setContinuousThreshold}
          />
        )}
        {step === 3 && (
          <StepTimeLimit
            selectedLimit={selectedLimit}
            setSelectedLimit={setSelectedLimit}
          />
        )}
        {step === 4 && (
          <StepCommunities
            selected={selectedCommunities}
            toggle={toggleCommunity}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="px-6 pb-8 pt-3 max-w-md mx-auto w-full space-y-2">
        <button
          onClick={handleNext}
          disabled={!canAdvance}
          className="w-full bg-emerald-500 text-white py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-600 active:scale-[0.98] transition-all disabled:bg-gray-200 disabled:text-gray-400"
        >
          {isLast ? (
            <>
              <Sparkles className="w-5 h-5" />
              ¡Empezar!
            </>
          ) : (
            <>
              Siguiente
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="w-full text-gray-500 py-2.5 flex items-center justify-center gap-1 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Atrás
          </button>
        )}
      </div>
    </div>
  );
}
