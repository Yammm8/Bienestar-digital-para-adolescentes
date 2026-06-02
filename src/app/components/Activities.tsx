import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft, Play, Check, Timer, Leaf, Sparkles,
  Footprints, Palette, Users, TreePine, Brain, BookOpen,
} from "lucide-react";
import { useWellbeing } from "../contexts/WellbeingContext";
import { ACTIVITIES, todayChallenge, type Activity, type ActivityCategory } from "../data/activities";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = "todos" | ActivityCategory;

const CATEGORIES: { id: Category; label: string; icon: React.ElementType }[] = [
  { id: "todos",       label: "Todos",       icon: Sparkles   },
  { id: "movimiento",  label: "Movimiento",  icon: Footprints },
  { id: "creatividad", label: "Creatividad", icon: Palette    },
  { id: "social",      label: "Social",      icon: Users      },
  { id: "naturaleza",  label: "Naturaleza",  icon: TreePine   },
  { id: "mindfulness", label: "Mindfulness", icon: Brain      },
  { id: "aprendizaje", label: "Aprender",    icon: BookOpen   },
];

// ─── Activity card ─────────────────────────────────────────────────────────────

function ActivityCard({
  activity,
  completed,
  isActive,
  blockStart,
  onStart,
  onToggleDone,
}: {
  activity: Activity;
  completed: boolean;
  isActive: boolean;
  blockStart: boolean;
  onStart: () => void;
  onToggleDone: () => void;
}) {
  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm transition-all ${completed ? "opacity-60" : ""} ${isActive ? "ring-2 ring-emerald-400" : ""}`}>
      <div className="flex items-start gap-3">
        <div className="text-3xl leading-none mt-0.5 flex-shrink-0">{activity.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`text-sm ${completed ? "line-through text-gray-400" : ""}`}>
              {activity.title}
            </h4>
            <span className="text-xs text-gray-400 flex-shrink-0 flex items-center gap-1">
              <Timer className="w-3 h-3" />
              {activity.duration} min
            </span>
          </div>
          <p className="text-gray-600 text-xs leading-relaxed mb-2">{activity.description}</p>
          <p className="text-emerald-600 text-xs">{activity.benefit}</p>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        {!completed && (
          isActive ? (
            <span className="flex-1 bg-emerald-50 text-emerald-700 py-2 rounded-xl text-sm flex items-center justify-center gap-1">
              <Play className="w-4 h-4" /> En curso…
            </span>
          ) : (
            <button
              onClick={onStart}
              disabled={blockStart}
              className="flex-1 bg-emerald-500 text-white py-2 rounded-xl text-sm hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              Iniciar
            </button>
          )
        )}
        <button
          onClick={onToggleDone}
          className={`flex items-center justify-center gap-1 py-2 rounded-xl text-sm transition-colors ${
            completed
              ? "flex-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              : "px-4 border border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600"
          }`}
        >
          <Check className="w-4 h-4" />
          {completed ? "Hecha ✓" : "Ya la hice"}
        </button>
      </div>
    </div>
  );
}

// ─── Main screen ───────────────────────────────────────────────────────────────

export function Activities() {
  const navigate = useNavigate();
  const { startOfflineActivity, activeOfflineActivity } = useWellbeing();
  const [activeCategory, setActiveCategory] = useState<Category>("todos");
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());

  const filtered = activeCategory === "todos"
    ? ACTIVITIES
    : ACTIVITIES.filter((a) => a.category === activeCategory);

  const completedToday = ACTIVITIES.filter((a) => completedIds.has(a.id));
  const offlineMinutes = completedToday.reduce((sum, a) => sum + a.duration, 0);

  const toggleDone = (id: number) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleStart = (activity: Activity) => {
    if (activeOfflineActivity) return; // block if one already running
    startOfflineActivity(activity);
  };

  return (
    <>
      <div className="min-h-full max-w-md mx-auto pb-8">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 p-4">
          <div className="flex items-center gap-3 mb-1">
            <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1>Actividades offline</h1>
          </div>
          <p className="text-gray-500 text-sm pl-9">Tiempo real, fuera de la pantalla</p>
        </div>

        {/* Offline time banner */}
        {offlineMinutes > 0 && (
          <div className="mx-4 mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl px-5 py-4 flex items-center gap-4 text-white shadow-sm">
            <Leaf className="w-8 h-8 flex-shrink-0" />
            <div>
              <p className="text-sm text-white/80">Tiempo offline hoy</p>
              <p className="text-2xl">
                {offlineMinutes >= 60
                  ? `${Math.floor(offlineMinutes / 60)}h ${offlineMinutes % 60 > 0 ? `${offlineMinutes % 60}m` : ""}`
                  : `${offlineMinutes} min`}
              </p>
              <p className="text-xs text-white/70">
                {completedToday.length} {completedToday.length === 1 ? "actividad completada" : "actividades completadas"}
              </p>
            </div>
          </div>
        )}

        <div className="p-4 space-y-5">
          {/* Daily challenge */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3>Desafío de hoy</h3>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-4xl leading-none">{todayChallenge.emoji}</span>
              <div className="flex-1">
                <h4 className="mb-1">{todayChallenge.title}</h4>
                <p className="text-gray-600 text-sm mb-2">{todayChallenge.description}</p>
                <p className="text-purple-600 text-xs mb-3">{todayChallenge.benefit}</p>
                <div className="flex gap-2">
                  {!completedIds.has(todayChallenge.id) && (
                    activeOfflineActivity?.activity.id === todayChallenge.id ? (
                      <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-sm">
                        <Play className="w-4 h-4" /> En curso…
                      </span>
                    ) : (
                      <button
                        onClick={() => handleStart(todayChallenge)}
                        disabled={!!activeOfflineActivity}
                        className="flex items-center gap-1 bg-purple-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-purple-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Play className="w-4 h-4" />
                        Iniciar ({todayChallenge.duration} min)
                      </button>
                    )
                  )}
                  <button
                    onClick={() => toggleDone(todayChallenge.id)}
                    className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm transition-colors ${
                      completedIds.has(todayChallenge.id)
                        ? "bg-purple-100 text-purple-700"
                        : "border border-purple-200 text-purple-600"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    {completedIds.has(todayChallenge.id) ? "¡Hecha!" : "Ya la hice"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Category filter */}
          <div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveCategory(id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm flex-shrink-0 transition-colors ${
                    activeCategory === id
                      ? "bg-emerald-500 text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Activity grid */}
          <div className="space-y-3">
            {filtered.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                completed={completedIds.has(activity.id)}
                isActive={activeOfflineActivity?.activity.id === activity.id}
                blockStart={!!activeOfflineActivity && activeOfflineActivity.activity.id !== activity.id}
                onStart={() => handleStart(activity)}
                onToggleDone={() => toggleDone(activity.id)}
              />
            ))}
          </div>

          {/* Completed today log */}
          {completedToday.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="mb-3">Completadas hoy</h3>
              <div className="space-y-2">
                {completedToday.map((a) => (
                  <div key={a.id} className="flex items-center gap-3">
                    <span className="text-xl">{a.emoji}</span>
                    <span className="text-gray-700 text-sm flex-1">{a.title}</span>
                    <span className="text-emerald-600 text-xs bg-emerald-50 px-2 py-0.5 rounded-full">
                      {a.duration} min
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info card */}
          <div className="bg-gradient-to-r from-teal-50 to-green-50 border border-teal-100 rounded-2xl p-5">
            <h4 className="mb-2">🌱 ¿Por qué actividades offline?</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              Cada minuto que pasas haciendo algo real —caminar, crear, conectar— fortalece tu atención, mejora tu estado de ánimo y reduce la dependencia del scroll automático.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
