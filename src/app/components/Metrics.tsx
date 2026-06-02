import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, TrendingDown, TrendingUp, Flame, Moon, Clock, BarChart2 } from "lucide-react";
import { useWellbeing } from "../contexts/WellbeingContext";

// ─── Mock data ────────────────────────────────────────────────────────────────

const WEEKLY_COMPARISON = [
  { day: "Lun", thisWeek: 52, lastWeek: 68 },
  { day: "Mar", thisWeek: 38, lastWeek: 71 },
  { day: "Mié", thisWeek: 41, lastWeek: 55 },
  { day: "Jue", thisWeek: 35, lastWeek: 62 },
  { day: "Vie", thisWeek: 48, lastWeek: 74 },
  { day: "Sáb", thisWeek: 55, lastWeek: 80 },
  { day: "Hoy", thisWeek: 45, lastWeek: 69 },
];

const MONTHLY_TREND = [
  { week: "Sem 1", minutes: 420 },
  { week: "Sem 2", minutes: 385 },
  { week: "Sem 3", minutes: 340 },
  { week: "Sem 4", minutes: 314 },
];

const HOURLY_PATTERN = [
  { hour: "6h",  minutes: 2 },
  { hour: "7h",  minutes: 5 },
  { hour: "8h",  minutes: 12 },
  { hour: "9h",  minutes: 8 },
  { hour: "10h", minutes: 6 },
  { hour: "11h", minutes: 4 },
  { hour: "12h", minutes: 9 },
  { hour: "13h", minutes: 11 },
  { hour: "14h", minutes: 7 },
  { hour: "15h", minutes: 5 },
  { hour: "16h", minutes: 6 },
  { hour: "17h", minutes: 8 },
  { hour: "18h", minutes: 13 },
  { hour: "19h", minutes: 18 },
  { hour: "20h", minutes: 22 },
  { hour: "21h", minutes: 19 },
  { hour: "22h", minutes: 14 },
  { hour: "23h", minutes: 6 },
];

const COMMUNITY_DISTRIBUTION = [
  { name: "Mindfulness",    value: 38, color: "#10b981" },
  { name: "Lectura",        value: 27, color: "#3b82f6" },
  { name: "Universitaria",  value: 22, color: "#a855f7" },
  { name: "General",        value: 13, color: "#f59e0b" },
];

const WELLNESS_RADAR = [
  { axis: "Atención",    value: 72 },
  { axis: "Descanso",    value: 65 },
  { axis: "Conexión",    value: 80 },
  { axis: "Creatividad", value: 58 },
  { axis: "Movimiento",  value: 70 },
  { axis: "Reflexión",   value: 75 },
];

// Heatmap: 7 days × 4 time blocks
const HEATMAP_DAYS = ["L", "M", "X", "J", "V", "S", "D"];
const HEATMAP_SLOTS = ["Mañana\n6-12h", "Tarde\n12-17h", "Noche\n17-22h", "Noche\n22-24h"];
const HEATMAP_DATA = [
  [5, 12, 28, 8],
  [3, 8, 22, 5],
  [6, 14, 30, 9],
  [2, 9, 18, 4],
  [4, 11, 25, 12],
  [8, 18, 32, 14],
  [10, 16, 20, 6],
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(m: number) {
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60 > 0 ? `${m % 60}m` : ""}`.trim();
}

function heatColor(val: number, max: number) {
  const ratio = val / max;
  if (ratio < 0.25) return "bg-emerald-100";
  if (ratio < 0.5)  return "bg-yellow-200";
  if (ratio < 0.75) return "bg-orange-300";
  return "bg-red-400";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  trend,
  color = "emerald",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down" | "neutral";
  color?: string;
}) {
  const iconColors: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-600",
    blue:    "bg-blue-100 text-blue-600",
    purple:  "bg-purple-100 text-purple-600",
    amber:   "bg-amber-100 text-amber-600",
    red:     "bg-red-100 text-red-600",
  };
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-3 ${iconColors[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-xl text-gray-900">{value}</p>
      {sub && (
        <div className="flex items-center gap-1 mt-0.5">
          {trend === "down" && <TrendingDown className="w-3 h-3 text-emerald-500" />}
          {trend === "up"   && <TrendingUp   className="w-3 h-3 text-red-400" />}
          <p className="text-xs text-gray-500">{sub}</p>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3">{children}</h3>;
}

// ─── Main component ───────────────────────────────────────────────────────────

// ─── Custom bar charts (avoids recharts null-key warnings) ────────────────────

function WeeklyComparisonBars({
  data,
  limitMinutes,
}: {
  data: { day: string; thisWeek: number; lastWeek: number }[];
  limitMinutes: number;
}) {
  const maxVal = Math.max(...data.flatMap((d) => [d.thisWeek, d.lastWeek]), limitMinutes || 0, 1);
  const H = 140;
  const barW = 14;
  const barGap = 3;
  const groupGap = 8;
  const groupW = barW * 2 + barGap;
  const totalW = data.length * (groupW + groupGap) - groupGap;
  const limitY = limitMinutes > 0 ? H - (limitMinutes / maxVal) * H : null;

  return (
    <svg viewBox={`0 0 ${totalW} ${H + 18}`} width="100%" style={{ overflow: "visible" }}>
      {limitY !== null && (
        <line x1={0} y1={limitY} x2={totalW} y2={limitY}
          stroke="#f97316" strokeWidth="1.5" strokeDasharray="4 3" />
      )}
      {data.map((d, i) => {
        const x = i * (groupW + groupGap);
        const lastH = Math.max(2, (d.lastWeek / maxVal) * H);
        const thisH = Math.max(2, (d.thisWeek / maxVal) * H);
        return (
          <g key={d.day}>
            <rect x={x} y={H - lastH} width={barW} height={lastH} rx={3} ry={3} fill="#e5e7eb" />
            <rect x={x + barW + barGap} y={H - thisH} width={barW} height={thisH} rx={3} ry={3} fill="#10b981" />
            <text x={x + groupW / 2} y={H + 14} textAnchor="middle" fontSize={9} fill="#9ca3af">{d.day}</text>
          </g>
        );
      })}
    </svg>
  );
}

function HourlyBars({ data }: { data: { hour: string; minutes: number }[] }) {
  const maxVal = Math.max(...data.map((d) => d.minutes), 1);
  const H = 100;
  const barW = 11;
  const gap = 3;
  const totalW = data.length * (barW + gap) - gap;

  return (
    <svg viewBox={`0 0 ${totalW} ${H + 16}`} width="100%" style={{ overflow: "visible" }}>
      {data.map((d, i) => {
        const barH = Math.max(2, (d.minutes / maxVal) * H);
        const x = i * (barW + gap);
        const fill = d.minutes >= 18 ? "#ef4444" : d.minutes >= 12 ? "#f97316" : "#10b981";
        return (
          <g key={d.hour}>
            <rect x={x} y={H - barH} width={barW} height={barH} rx={3} ry={3} fill={fill} />
            {i % 3 === 0 && (
              <text x={x + barW / 2} y={H + 12} textAnchor="middle" fontSize={8} fill="#9ca3af">{d.hour}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function MonthlyAreaChart({ data }: { data: { week: string; minutes: number }[] }) {
  const W = 300;
  const H = 120;
  const padL = 36;
  const padB = 20;
  const padR = 8;
  const padT = 8;
  const maxVal = Math.max(...data.map((d) => d.minutes), 1);
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const xs = data.map((_, i) => padL + (i / (data.length - 1)) * chartW);
  const ys = data.map((d) => padT + (1 - d.minutes / maxVal) * chartH);

  const linePts = xs.map((x, i) => `${x},${ys[i]}`).join(" ");
  const areaPts = `${xs[0]},${padT + chartH} ${linePts} ${xs[xs.length - 1]},${padT + chartH}`;

  // y-axis labels
  const yTicks = [0, 0.5, 1].map((t) => ({
    y: padT + (1 - t) * chartH,
    label: fmt(Math.round(maxVal * t)),
  }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* grid lines */}
      {yTicks.map((t) => (
        <line key={t.label} x1={padL} y1={t.y} x2={W - padR} y2={t.y} stroke="#f3f4f6" strokeWidth={1} />
      ))}
      {/* y labels */}
      {yTicks.map((t) => (
        <text key={t.label} x={padL - 4} y={t.y + 4} textAnchor="end" fontSize={9} fill="#9ca3af">{t.label}</text>
      ))}
      {/* area fill */}
      <polygon points={areaPts} fill="url(#mg)" />
      {/* line */}
      <polyline points={linePts} fill="none" stroke="#10b981" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      {/* dots + x labels */}
      {data.map((d, i) => (
        <g key={d.week}>
          <circle cx={xs[i]} cy={ys[i]} r={4} fill="#10b981" />
          <text x={xs[i]} y={H - 4} textAnchor="middle" fontSize={10} fill="#9ca3af">{d.week}</text>
        </g>
      ))}
    </svg>
  );
}

function WellnessRadar({ data }: { data: { axis: string; value: number }[] }) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 80;
  const n = data.length;
  const levels = 4;

  const angleOf = (i: number) => (Math.PI / 2) - (2 * Math.PI * i) / n;
  const ptAt = (i: number, radius: number) => ({
    x: cx + radius * Math.cos(angleOf(i)),
    y: cy - radius * Math.sin(angleOf(i)),
  });

  // Grid polygons
  const gridPolygons = Array.from({ length: levels }, (_, l) => {
    const rr = r * ((l + 1) / levels);
    return Array.from({ length: n }, (_, i) => ptAt(i, rr))
      .map((p) => `${p.x},${p.y}`)
      .join(" ");
  });

  // Spokes
  const spokes = Array.from({ length: n }, (_, i) => ptAt(i, r));

  // Data polygon
  const dataPts = data.map((d, i) => ptAt(i, (d.value / 100) * r));
  const dataPolygon = dataPts.map((p) => `${p.x},${p.y}`).join(" ");

  // Label positions (slightly beyond the grid)
  const labelPts = Array.from({ length: n }, (_, i) => ptAt(i, r + 18));

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%">
      {/* grid */}
      {gridPolygons.map((pts, l) => (
        <polygon key={l} points={pts} fill="none" stroke="#e5e7eb" strokeWidth={1} />
      ))}
      {/* spokes */}
      {spokes.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e5e7eb" strokeWidth={1} />
      ))}
      {/* data area */}
      <polygon points={dataPolygon} fill="#10b981" fillOpacity={0.18} stroke="#10b981" strokeWidth={2} strokeLinejoin="round" />
      {/* dots */}
      {dataPts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#10b981" />
      ))}
      {/* labels */}
      {data.map((d, i) => {
        const lp = labelPts[i];
        return (
          <text key={d.axis} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle" fontSize={10} fill="#6b7280">
            {d.axis}
          </text>
        );
      })}
    </svg>
  );
}

function DonutChart({
  data,
  size,
}: {
  data: { name: string; value: number; color: string }[];
  size: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.445;
  const innerR = size * 0.29;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const gap = 2; // degrees between segments

  let angle = 90;
  const segments = data.map((d) => {
    const sweep = (d.value / total) * 360 - gap;
    const startRad = (angle * Math.PI) / 180;
    const endRad = ((angle + sweep) * Math.PI) / 180;
    const x1 = cx + outerR * Math.cos(startRad);
    const y1 = cy - outerR * Math.sin(startRad);
    const x2 = cx + outerR * Math.cos(endRad);
    const y2 = cy - outerR * Math.sin(endRad);
    const ix1 = cx + innerR * Math.cos(endRad);
    const iy1 = cy - innerR * Math.sin(endRad);
    const ix2 = cx + innerR * Math.cos(startRad);
    const iy2 = cy - innerR * Math.sin(startRad);
    const large = sweep > 180 ? 1 : 0;
    const path = `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${large} 0 ${x2} ${y2} L ${ix1} ${iy1} A ${innerR} ${innerR} 0 ${large} 1 ${ix2} ${iy2} Z`;
    angle += sweep + gap;
    return { ...d, path };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      {segments.map((s) => (
        <path key={s.name} d={s.path} fill={s.color} />
      ))}
    </svg>
  );
}

export function Metrics() {
  const navigate = useNavigate();
  const { settings } = useWellbeing();
  const [period, setPeriod] = useState<"week" | "month">("week");

  const limitMinutes = settings.dailyLimit;

  // Weekly totals
  const thisWeekTotal = WEEKLY_COMPARISON.reduce((s, d) => s + d.thisWeek, 0);
  const lastWeekTotal = WEEKLY_COMPARISON.reduce((s, d) => s + d.lastWeek, 0);
  const weekChange = Math.round(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100);

  const bestDay = [...WEEKLY_COMPARISON].sort((a, b) => a.thisWeek - b.thisWeek)[0];
  const peakHour = [...HOURLY_PATTERN].sort((a, b) => b.minutes - a.minutes)[0];

  // Heatmap max for colour scaling
  const heatMax = Math.max(...HEATMAP_DATA.flat());


  return (
    <div className="min-h-full max-w-md mx-auto pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 p-4">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => navigate("/wellbeing")} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1>Métricas</h1>
        </div>
        <p className="text-gray-500 text-sm pl-9">Visualización detallada de tus hábitos</p>
      </div>

      {/* Period selector */}
      <div className="px-4 pt-4">
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl mb-6">
          {(["week", "month"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                period === p ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
              }`}
            >
              {p === "week" ? "Esta semana" : "Este mes"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={Clock}
            color="emerald"
            label="Total esta semana"
            value={fmt(thisWeekTotal)}
            sub={`${Math.abs(weekChange)}% vs sem. anterior`}
            trend={weekChange < 0 ? "down" : "up"}
          />
          <StatCard
            icon={BarChart2}
            color="blue"
            label="Promedio diario"
            value={fmt(Math.round(thisWeekTotal / 7))}
            sub={limitMinutes > 0 ? `límite: ${fmt(limitMinutes)}` : "sin límite"}
          />
          <StatCard
            icon={Flame}
            color="amber"
            label="Mejor día"
            value={bestDay.day}
            sub={fmt(bestDay.thisWeek)}
            trend="neutral"
          />
          <StatCard
            icon={Moon}
            color="purple"
            label="Hora pico"
            value={peakHour.hour}
            sub={`${peakHour.minutes} min en prom.`}
          />
        </div>

        {/* Weekly comparison */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <SectionTitle>Esta semana vs anterior</SectionTitle>
          <WeeklyComparisonBars data={WEEKLY_COMPARISON} limitMinutes={limitMinutes} />
          <div className="flex items-center gap-4 mt-2 justify-center text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-gray-200 inline-block" /> Sem. anterior
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Esta semana
            </span>
          </div>
          <div className={`mt-4 rounded-xl p-3 flex items-center gap-2 ${weekChange < 0 ? "bg-emerald-50" : "bg-orange-50"}`}>
            {weekChange < 0
              ? <TrendingDown className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              : <TrendingUp   className="w-4 h-4 text-orange-500 flex-shrink-0" />
            }
            <p className={`text-sm ${weekChange < 0 ? "text-emerald-800" : "text-orange-800"}`}>
              {weekChange < 0
                ? `Usaste ${Math.abs(weekChange)}% menos que la semana pasada. ¡Muy bien!`
                : `Usaste ${weekChange}% más que la semana pasada.`
              }
            </p>
          </div>
        </div>

        {/* Monthly trend */}
        {period === "month" && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <SectionTitle>Tendencia del mes</SectionTitle>
            <MonthlyAreaChart data={MONTHLY_TREND} />
          </div>
        )}

        {/* Hourly pattern */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <SectionTitle>Patrón horario</SectionTitle>
          <p className="text-gray-500 text-xs mb-4">¿En qué momento del día más usas la red?</p>
          <HourlyBars data={HOURLY_PATTERN} />
          <div className="flex items-center justify-center gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Normal</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-orange-400 inline-block" /> Moderado</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-400 inline-block" /> Pico</span>
          </div>
        </div>

        {/* Heatmap */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <SectionTitle>Heatmap semanal</SectionTitle>
          <p className="text-gray-500 text-xs mb-4">Intensidad de uso por día y franja horaria</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-gray-400 font-normal text-left pb-2 pr-2 w-16"></th>
                  {HEATMAP_DAYS.map((d) => (
                    <th key={d} className="text-gray-500 font-medium pb-2 text-center">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HEATMAP_SLOTS.map((slot, si) => (
                  <tr key={slot}>
                    <td className="text-gray-400 pr-2 py-1 leading-tight whitespace-pre-line text-left align-middle"
                        style={{ fontSize: "10px" }}>{slot}</td>
                    {HEATMAP_DAYS.map((_, di) => (
                      <td key={di} className="py-1 px-0.5">
                        <div
                          className={`w-full aspect-square rounded-md ${heatColor(HEATMAP_DATA[di][si], heatMax)}`}
                          title={`${HEATMAP_DATA[di][si]} min`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-2 mt-3 justify-end text-xs text-gray-400">
            <span>Menos</span>
            <span className="w-3 h-3 rounded bg-emerald-100 inline-block" />
            <span className="w-3 h-3 rounded bg-yellow-200 inline-block" />
            <span className="w-3 h-3 rounded bg-orange-300 inline-block" />
            <span className="w-3 h-3 rounded bg-red-400 inline-block" />
            <span>Más</span>
          </div>
        </div>

        {/* Community distribution */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <SectionTitle>Tiempo por comunidad</SectionTitle>
          <div className="flex items-center gap-4">
            <DonutChart data={COMMUNITY_DISTRIBUTION} size={130} />
            <div className="flex-1 space-y-2">
              {COMMUNITY_DISTRIBUTION.map((entry) => (
                <div key={entry.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm text-gray-700 truncate max-w-[90px]">{entry.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wellness radar */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <SectionTitle>Radar de bienestar</SectionTitle>
          <p className="text-gray-500 text-xs mb-3">Autoevaluación semanal basada en tu actividad</p>
          <WellnessRadar data={WELLNESS_RADAR} />
          <p className="text-center text-xs text-gray-400 mt-1">
            Escala 0–100 · Actualizado con tu actividad
          </p>
        </div>

        {/* Insight card */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-5">
          <h4 className="mb-3">🔍 Insight de la semana</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Tu uso pico es entre las <strong>20h–21h</strong>. Considera un recordatorio de descanso antes.</li>
            <li>• Los <strong>sábados</strong> usas un 22% más que entre semana.</li>
            <li>• Tu <strong>racha actual</strong>: 4 días bajo el límite diario. ¡Sigue así!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
