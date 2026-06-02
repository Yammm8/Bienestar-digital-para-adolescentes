import { User, Settings, Edit, Heart, MessageCircle, Users, Clock, Leaf } from "lucide-react";
import { useNavigate } from "react-router";
import { useWellbeing } from "../contexts/WellbeingContext";

export function Profile() {
  const navigate = useNavigate();
  const { todayMinutes, weeklyData, joinedCommunities, offlineTotalMinutes } = useWellbeing();

  const weeklyTotal = weeklyData.reduce((sum, d) => sum + d.minutes, 0);
  const offlineMinutes = offlineTotalMinutes;

  const formatMinutes = (m: number) =>
    m >= 60 ? `${Math.floor(m / 60)}h ${m % 60 > 0 ? `${m % 60}m` : ""}`.trim() : `${m}m`;

  const userPosts = [
    {
      id: 1,
      content: "Hoy salí a caminar sin auriculares. Escuché pájaros, conversaciones, el viento...",
      reactions: 24,
      comments: 8,
      community: "Mindfulness",
      date: "28 Abr",
    },
    {
      id: 2,
      content: "Reflexión: las mejores conversaciones suceden cuando guardamos el celular.",
      reactions: 31,
      comments: 12,
      community: "Conversaciones profundas",
      date: "25 Abr",
    },
  ];

  const communityEmojis: Record<string, string> = {
    Mindfulness: "🧘",
    "Lectura consciente": "📚",
    "Vida universitaria": "🎓",
    Creatividad: "🎨",
    Naturaleza: "🌿",
    "Conversaciones profundas": "💬",
  };

  return (
    <div className="min-h-full max-w-md mx-auto pb-6">
      <div className="bg-gradient-to-r from-emerald-400 to-teal-500 p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white">Perfil</h1>
          <button onClick={() => navigate("/settings")} className="text-white/90 hover:text-white">
            <Settings className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-white mb-1">María García</h2>
            <p className="text-white/80 text-sm">@maria</p>
          </div>
        </div>

        <p className="text-white/90 mb-4">
          Explorando la vida consciente, un paso a la vez 🌱
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/settings")}
            className="bg-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar perfil
          </button>
        </div>
      </div>

      <div className="p-4 -mt-6">
        {/* Stats card — no vanity metrics */}
        <div className="bg-white rounded-2xl p-5 shadow-lg mb-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl text-gray-900 mb-1">{joinedCommunities.length}</div>
              <div className="text-gray-600 text-sm">comunidades</div>
            </div>
            <div>
              <div className="text-2xl text-gray-900 mb-1">{userPosts.length}</div>
              <div className="text-gray-600 text-sm">publicaciones</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span className="text-2xl text-gray-900">{formatMinutes(weeklyTotal)}</span>
              </div>
              <div className="text-gray-600 text-sm">uso esta semana</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Leaf className="w-4 h-4 text-teal-600" />
                <span className="text-2xl text-gray-900">{formatMinutes(offlineMinutes)}</span>
              </div>
              <div className="text-gray-600 text-sm">tiempo desconectado</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
          <h4 className="text-sm text-blue-900 mb-2">✨ Sin métricas de vanidad</h4>
          <p className="text-sm text-blue-800">
            No mostramos seguidores ni likes totales. Lo que importa son las conexiones reales y tu bienestar.
          </p>
        </div>

        <h3 className="mb-4">Tus publicaciones</h3>
        <div className="space-y-4">
          {userPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="mb-3">
                <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full mb-2">
                  {post.community}
                </span>
                <p className="text-gray-800">{post.content}</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{post.date}</span>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{post.reactions}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {joinedCommunities.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 mt-6">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-6 h-6 text-purple-600" />
              <h4>Tus comunidades</h4>
            </div>
            <div className="space-y-2">
              {joinedCommunities.map((name) => (
                <div key={name} className="bg-white rounded-lg px-3 py-2 text-sm">
                  {communityEmojis[name] ?? "🌐"} {name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
