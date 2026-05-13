import { Clock, Heart, Users, Eye, TrendingDown, Settings, Lightbulb } from "lucide-react";
import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts";
import { useState } from "react";
import * as Switch from "@radix-ui/react-switch";
import * as Slider from "@radix-ui/react-slider";

export function Wellbeing() {
  const [showSettings, setShowSettings] = useState(false);
  const [frictionEnabled, setFrictionEnabled] = useState(true);
  const [frictionIntensity, setFrictionIntensity] = useState([50]);
  const [colorFadeEnabled, setColorFadeEnabled] = useState(true);
  const [textFadeEnabled, setTextFadeEnabled] = useState(false);
  const [delaysEnabled, setDelaysEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  const todayMinutes = 45;
  const weeklyData = [
    { day: "L", minutes: 52 },
    { day: "M", minutes: 38 },
    { day: "M", minutes: 41 },
    { day: "J", minutes: 35 },
    { day: "V", minutes: 48 },
    { day: "S", minutes: 55 },
    { day: "D", minutes: 45 },
  ];

  return (
    <div className="min-h-full max-w-md mx-auto pb-6">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 p-4">
        <div className="flex items-center justify-between mb-1">
          <h1>Panel de Bienestar</h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
        <p className="text-gray-600 text-sm">
          Transparencia total sobre tu uso
        </p>
      </div>

      {showSettings && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200 p-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-purple-600" />
              <h3>Fricción consciente</h3>
            </div>

            <p className="text-gray-600 text-sm mb-4">
              La interfaz se degrada progresivamente conforme a tu tiempo de uso, generando una fricción sutil que te invita a reflexionar.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="text-sm">Activar fricción consciente</h4>
                  <p className="text-gray-600 text-xs">Degradación progresiva según uso</p>
                </div>
                <Switch.Root
                  className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-emerald-500 transition-colors"
                  checked={frictionEnabled}
                  onCheckedChange={setFrictionEnabled}
                >
                  <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-sm transition-transform translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
                </Switch.Root>
              </div>

              {frictionEnabled && (
                <>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm">Intensidad</h4>
                      <span className="text-sm text-gray-600">{frictionIntensity[0]}%</span>
                    </div>
                    <Slider.Root
                      className="relative flex items-center select-none touch-none w-full h-5"
                      value={frictionIntensity}
                      onValueChange={setFrictionIntensity}
                      max={100}
                      min={0}
                      step={10}
                    >
                      <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                        <Slider.Range className="absolute bg-purple-500 rounded-full h-full" />
                      </Slider.Track>
                      <Slider.Thumb
                        className="block w-5 h-5 bg-white shadow-md rounded-full border-2 border-purple-500 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        aria-label="Friction intensity"
                      />
                    </Slider.Root>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Sutil</span>
                      <span>Intenso</span>
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm">Colores apagados</h4>
                        <p className="text-gray-600 text-xs">Reduce saturación gradualmente</p>
                      </div>
                      <Switch.Root
                        className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-emerald-500 transition-colors"
                        checked={colorFadeEnabled}
                        onCheckedChange={setColorFadeEnabled}
                      >
                        <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-sm transition-transform translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
                      </Switch.Root>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm">Texto menos legible</h4>
                        <p className="text-gray-600 text-xs">Reduce contraste del texto</p>
                      </div>
                      <Switch.Root
                        className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-emerald-500 transition-colors"
                        checked={textFadeEnabled}
                        onCheckedChange={setTextFadeEnabled}
                      >
                        <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-sm transition-transform translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
                      </Switch.Root>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm">Delays en carga</h4>
                        <p className="text-gray-600 text-xs">Pausas sutiles al cargar contenido</p>
                      </div>
                      <Switch.Root
                        className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-emerald-500 transition-colors"
                        checked={delaysEnabled}
                        onCheckedChange={setDelaysEnabled}
                      >
                        <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-sm transition-transform translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
                      </Switch.Root>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm">Mensajes reflexivos</h4>
                        <p className="text-gray-600 text-xs">Sugerencias amables de pausa</p>
                      </div>
                      <Switch.Root
                        className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-emerald-500 transition-colors"
                        checked={remindersEnabled}
                        onCheckedChange={setRemindersEnabled}
                      >
                        <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-sm transition-transform translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
                      </Switch.Root>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 bg-purple-50 border border-purple-100 rounded-xl p-3">
              <p className="text-purple-800 text-xs">
                💡 <strong>¿Cómo funciona?</strong> Después de cierto tiempo de uso, la app empezará a degradarse sutilmente. No es un bloqueo, sino una invitación a reflexionar sobre tu tiempo aquí.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 space-y-4">
        <div className="bg-gradient-to-r from-emerald-400 to-green-500 rounded-3xl p-6 text-white shadow-lg">
          <Clock className="w-8 h-8 mb-3" />
          <div className="text-4xl mb-1">{todayMinutes} min</div>
          <div className="text-white/90">Tiempo de hoy</div>
          <p className="text-white/80 text-sm mt-3">
            ✨ Uso consciente y equilibrado
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="mb-4">Esta semana</h3>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <Bar dataKey="minutes" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-gray-600 text-sm mt-3 text-center">
            Promedio: 45 min/día (diseñado para 30-60 min)
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <Eye className="w-6 h-6 text-blue-600" />
            <h3>Cómo funciona esta red</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Feed actualizado cada 30 minutos (no infinito)</li>
            <li>• Máximo 20 publicaciones por día en tu feed</li>
            <li>• Solo 3 publicaciones propias al día</li>
            <li>• Sin algoritmos, todo es cronológico</li>
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

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-6 h-6 text-purple-600" />
            <h3>Impacto vs redes tradicionales</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Tiempo de uso</span>
                <span className="text-emerald-600">-75%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: "25%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Ansiedad reportada</span>
                <span className="text-blue-600">-60%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: "40%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Conexiones significativas</span>
                <span className="text-purple-600">+120%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: "100%" }} />
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-xs mt-3">
            * Datos de usuarios comparando con su experiencia previa
          </p>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5">
          <h4 className="mb-2">🌱 Sugerencia de hoy</h4>
          <p className="text-gray-700 text-sm">
            Has estado 45 minutos hoy. ¿Qué tal si tomas un descanso y vuelves más tarde? Tu feed estará aquí.
          </p>
          <button className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-orange-600 transition-colors">
            Recordármelo en 2 horas
          </button>
        </div>
      </div>
    </div>
  );
}
