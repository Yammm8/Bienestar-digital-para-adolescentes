import { useNavigate } from "react-router";
import {
  Clock,
  Heart,
  Users,
  Eye,
  TrendingDown,
  Settings,
  Lightbulb,
  Target,
  ChevronDown,
  BarChart2,
  Leaf,
  ChevronUp,
  Timer,
} from "lucide-react";
import { useState } from "react";
import * as Switch from "@radix-ui/react-switch";
import * as Slider from "@radix-ui/react-slider";
import { useWellbeing } from "../contexts/WellbeingContext";

function WeeklyBars({
  data,
  limitMinutes,
}: {
  data: { day: string; minutes: number }[];
  limitMinutes: number;
}) {
  const maxVal = Math.max(...data.map((d) => d.minutes), limitMinutes || 0, 1);
  const chartH = 110;
  const barW = 28;
  const gap = 8;
  const totalW = data.length * (barW + gap) - gap;
  const limitY = limitMinutes > 0 ? chartH - (limitMinutes / maxVal) * chartH : null;

  return (
    <div>
      <svg
        viewBox={`0 0 ${totalW} ${chartH + 20}`}
        width="100%"
        style={{ overflow: "visible" }}
      >
        {/* Reference line */}
        {limitY !== null && (
          <line
            x1={0} y1={limitY}
            x2={totalW} y2={limitY}
            stroke="#f97316"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
        )}

        {data.map((d, i) => {
          const barH = Math.max(2, (d.minutes / maxVal) * chartH);
          const x = i * (barW + gap);
          const y = chartH - barH;
          const fill =
            limitMinutes > 0 && d.minutes > limitMinutes
              ? "#ef4444"
              : limitMinutes > 0 && d.minutes >= limitMinutes * 0.8
              ? "#f97316"
              : "#10b981";
          return (
            <g key={d.day}>
              <rect x={x} y={y} width={barW} height={barH} rx={4} ry={4} fill={fill} />
              <text
                x={x + barW / 2}
                y={chartH + 14}
                textAnchor="middle"
                fontSize={10}
                fill="#9ca3af"
              >
                {d.day}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const LIMIT_OPTIONS = [
  { label: "Sin límite", value: 0 },
  { label: "30 min", value: 30 },
  { label: "1 hora", value: 60 },
  { label: "2 horas", value: 120 },
];

const CONTINUOUS_OPTIONS = [
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "60 min", value: 60 },
];

export function Wellbeing() {
  const navigate = useNavigate();
  const {
    todayMinutes,
    continuousMinutes,
    weeklyData,
    settings,
    updateSettings,
    frictionLevel,
    isAtLimit,
  } = useWellbeing();

  const [showFrictionSettings, setShowFrictionSettings] = useState(false);
  const [showLimitSettings, setShowLimitSettings] = useState(false);
  const [showContinuousSettings, setShowContinuousSettings] = useState(false);

  const limitMinutes = settings.dailyLimit;
  const progressPercent =
    limitMinutes > 0 ? Math.min(100, (todayMinutes / limitMinutes) * 100) : null;

  const progressColor =
    progressPercent === null
      ? "bg-emerald-500"
      : progressPercent >= 100
      ? "bg-red-500"
      : progressPercent >= 80
      ? "bg-orange-400"
      : "bg-emerald-500";

  const formatMinutes = (m: number) =>
    m >= 60 ? `${Math.floor(m / 60)}h ${m % 60 > 0 ? `${m % 60}m` : ""}`.trim() : `${m} min`;

  return (
    <div className="min-h-full max-w-md mx-auto pb-6">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 p-4">
        <div className="flex items-center justify-between mb-1">
          <h1>Panel de Bienestar</h1>
          <button
            onClick={() => setShowFrictionSettings(!showFrictionSettings)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
        <p className="text-gray-600 text-sm">Transparencia total sobre tu uso</p>
      </div>

      {/* Friction conscious settings panel */}
      {showFrictionSettings && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200 p-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-purple-600" />
              <h3>Fricción consciente</h3>
            </div>

            <p className="text-gray-600 text-sm mb-4">
              La interfaz se degrada progresivamente conforme a tu tiempo de uso, invitándote a reflexionar.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="text-sm">Activar fricción consciente</h4>
                  <p className="text-gray-600 text-xs">Degradación progresiva según uso</p>
                </div>
                <Switch.Root
                  className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-emerald-500 transition-colors"
                  checked={settings.frictionEnabled}
                  onCheckedChange={(v) => updateSettings({ frictionEnabled: v })}
                >
                  <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-sm transition-transform translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
                </Switch.Root>
              </div>

              {settings.frictionEnabled && (
                <>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm">Intensidad</h4>
                      <span className="text-sm text-gray-600">{settings.frictionIntensity}%</span>
                    </div>
                    <Slider.Root
                      className="relative flex items-center select-none touch-none w-full h-5"
                      value={[settings.frictionIntensity]}
                      onValueChange={([v]) => updateSettings({ frictionIntensity: v })}
                      max={100}
                      min={0}
                      step={10}
                    >
                      <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                        <Slider.Range className="absolute bg-purple-500 rounded-full h-full" />
                      </Slider.Track>
                      <Slider.Thumb
                        className="block w-5 h-5 bg-white shadow-md rounded-full border-2 border-purple-500 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        aria-label="Intensidad de fricción"
                      />
                    </Slider.Root>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Sutil</span>
                      <span>Intenso</span>
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-gray-200 pt-4">
                    {[
                      {
                        key: "colorFadeEnabled" as const,
                        label: "Colores apagados",
                        desc: "Reduce saturación gradualmente",
                        checked: settings.colorFadeEnabled,
                      },
                      {
                        key: "textFadeEnabled" as const,
                        label: "Texto menos legible",
                        desc: "Reduce contraste del texto",
                        checked: settings.textFadeEnabled,
                      },
                      {
                        key: "delaysEnabled" as const,
                        label: "Delays en carga",
                        desc: "Pausas sutiles al cargar contenido",
                        checked: settings.delaysEnabled,
                      },
                      {
                        key: "remindersEnabled" as const,
                        label: "Mensajes reflexivos",
                        desc: "Sugerencias amables de pausa",
                        checked: settings.remindersEnabled,
                      },
                    ].map(({ key, label, desc, checked }) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm">{label}</h4>
                          <p className="text-gray-600 text-xs">{desc}</p>
                        </div>
                        <Switch.Root
                          className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-emerald-500 transition-colors"
                          checked={checked}
                          onCheckedChange={(v) => updateSettings({ [key]: v })}
                        >
                          <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-sm transition-transform translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
                        </Switch.Root>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 bg-purple-50 border border-purple-100 rounded-xl p-3">
              <p className="text-purple-800 text-xs">
                💡 <strong>¿Cómo funciona?</strong> La fricción se activa al llegar al 80% de tu límite diario y se intensifica hasta el 100%. No bloquea el acceso, sino que invita a reflexionar.
              </p>
            </div>

            {frictionLevel > 0 && (
              <div className="mt-3 bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center gap-2">
                <span className="text-orange-600 text-sm">
                  ⚡ Fricción activa ({Math.round(frictionLevel * 100)}%)
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Today's usage card */}
        <div
          className={`rounded-3xl p-6 text-white shadow-lg ${
            isAtLimit
              ? "bg-gradient-to-r from-red-400 to-red-500"
              : "bg-gradient-to-r from-emerald-400 to-green-500"
          }`}
        >
          <Clock className="w-8 h-8 mb-3" />
          <div className="text-4xl mb-1">{formatMinutes(todayMinutes)}</div>
          <div className="text-white/90 mb-3">Tiempo de hoy</div>

          {progressPercent !== null && (
            <div className="mb-3">
              <div className="flex justify-between text-white/80 text-xs mb-1">
                <span>0</span>
                <span>Límite: {formatMinutes(limitMinutes)}</span>
              </div>
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-white/80 text-xs mt-1 text-right">
                {Math.round(progressPercent)}% del límite
              </p>
            </div>
          )}

          <p className="text-white/80 text-sm">
            {isAtLimit
              ? "⚠️ Alcanzaste tu límite diario"
              : progressPercent !== null && progressPercent >= 80
              ? "🔔 Te estás acercando a tu límite"
              : "✨ Uso consciente y equilibrado"}
          </p>
        </div>

        {/* Daily limit configuration */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => setShowLimitSettings(!showLimitSettings)}
            className="w-full flex items-center justify-between p-5"
          >
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-emerald-600" />
              <div className="text-left">
                <h3>Límite diario</h3>
                <p className="text-gray-600 text-sm">
                  {limitMinutes === 0 ? "Sin límite configurado" : formatMinutes(limitMinutes)}
                </p>
              </div>
            </div>
            {showLimitSettings ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {showLimitSettings && (
            <div className="px-5 pb-5 grid grid-cols-2 gap-2 border-t border-gray-100 pt-4">
              {LIMIT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateSettings({ dailyLimit: opt.value })}
                  className={`py-3 rounded-xl border-2 text-sm transition-colors ${
                    limitMinutes === opt.value
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "bg-white border-gray-200 text-gray-700 hover:border-emerald-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Continuous threshold configuration (UC-21) */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => setShowContinuousSettings(!showContinuousSettings)}
            className="w-full flex items-center justify-between p-5"
          >
            <div className="flex items-center gap-3">
              <Timer className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <h3>Recordatorio de pausa</h3>
                <p className="text-gray-600 text-sm">
                  Aviso tras {settings.continuousThreshold} min seguidos
                  {continuousMinutes > 0 && (
                    <span className="ml-2 text-blue-500">· {continuousMinutes} min ahora</span>
                  )}
                </p>
              </div>
            </div>
            {showContinuousSettings ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          {showContinuousSettings && (
            <div className="px-5 pb-5 grid grid-cols-2 gap-2 border-t border-gray-100 pt-4">
              {CONTINUOUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateSettings({ continuousThreshold: opt.value })}
                  className={`py-3 rounded-xl border-2 text-sm transition-colors ${
                    settings.continuousThreshold === opt.value
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-white border-gray-200 text-gray-700 hover:border-blue-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Weekly chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="mb-4">Esta semana</h3>
          <WeeklyBars data={weeklyData} limitMinutes={limitMinutes} />
          <p className="text-gray-600 text-sm mt-1 text-center">
            Promedio:{" "}
            {formatMinutes(
              Math.round(weeklyData.reduce((a, d) => a + d.minutes, 0) / weeklyData.length)
            )}/día
          </p>
          {limitMinutes > 0 && (
            <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 justify-center">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> Dentro del límite
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-red-500 inline-block" /> Sobre el límite
              </span>
            </div>
          )}
        </div>

        {/* How the network works */}
        {/* Metrics link */}
        <button
          onClick={() => navigate("/metrics")}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl p-4 flex items-center justify-between hover:opacity-90 transition-opacity shadow-sm"
        >
          <div className="flex items-center gap-3">
            <BarChart2 className="w-6 h-6" />
            <div className="text-left">
              <p className="text-sm">Ver métricas detalladas</p>
              <p className="text-white/80 text-xs">Heatmap, radar, tendencias y más</p>
            </div>
          </div>
          <span className="text-white/80 text-xl leading-none">›</span>
        </button>

        <button
          onClick={() => navigate("/activities")}
          className="w-full bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-2xl p-4 flex items-center justify-between hover:opacity-90 transition-opacity shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Leaf className="w-6 h-6" />
            <div className="text-left">
              <p className="text-sm">Actividades offline</p>
              <p className="text-white/80 text-xs">24 ideas para desconectarte bien</p>
            </div>
          </div>
          <span className="text-white/80 text-xl leading-none">›</span>
        </button>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <Eye className="w-6 h-6 text-blue-600" />
            <h3>Cómo funciona esta red</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Feed actualizado cada 30 minutos (no infinito)</li>
            <li>• Sin algoritmos, todo es cronológico</li>
            <li>• Notificaciones agrupadas por hora</li>
            <li>• No rastreamos tu actividad fuera de aquí</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <Heart className="w-6 h-6 text-emerald-600 mb-2" />
            <div className="text-2xl text-gray-900">89%</div>
            <div className="text-gray-600 text-sm">Interacciones positivas</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            <div className="text-2xl text-gray-900">3</div>
            <div className="text-gray-600 text-sm">Comunidades activas</div>
          </div>
        </div>

        {/* vs traditional networks */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-6 h-6 text-purple-600" />
            <h3>Impacto vs redes tradicionales</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: "Tiempo de uso", change: "-75%", pct: 25, color: "bg-emerald-500" },
              { label: "Ansiedad reportada", change: "-60%", pct: 40, color: "bg-blue-500" },
              { label: "Conexiones significativas", change: "+120%", pct: 100, color: "bg-purple-500" },
            ].map(({ label, change, pct, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{label}</span>
                  <span className={pct === 100 ? "text-purple-600" : pct <= 40 ? "text-blue-600" : "text-emerald-600"}>
                    {change}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-xs mt-3">
            * Datos de usuarios comparando con su experiencia previa
          </p>
        </div>

        {/* Today suggestion */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5">
          <h4 className="mb-2">🌱 Sugerencia de hoy</h4>
          <p className="text-gray-700 text-sm">
            {isAtLimit
              ? "Alcanzaste tu límite. ¿Qué tal hacer una pausa? Tu feed estará aquí cuando vuelvas."
              : `Has estado ${formatMinutes(todayMinutes)} hoy. ¿Qué tal si tomas un descanso y vuelves más tarde?`}
          </p>
          <button className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-orange-600 transition-colors">
            Recordármelo en 2 horas
          </button>
        </div>
      </div>
    </div>
  );
}
