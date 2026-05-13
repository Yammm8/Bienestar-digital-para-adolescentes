import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Users, Bell, BellOff, MoreHorizontal, Heart, MessageCircle, Share2, User } from "lucide-react";
import { useState } from "react";

export function CommunityDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(true);

  const communityData: Record<string, { name: string; description: string; members: number; color: string }> = {
    "mindfulness": {
      name: "Mindfulness",
      description: "Prácticas de atención plena y vida consciente",
      members: 234,
      color: "emerald",
    },
    "lectura-consciente": {
      name: "Lectura consciente",
      description: "Compartimos libros que nos transforman",
      members: 189,
      color: "blue",
    },
    "vida-universitaria": {
      name: "Vida universitaria",
      description: "Apoyo mutuo para estudiantes",
      members: 312,
      color: "purple",
    },
  };

  const community = slug ? communityData[slug] : null;

  const posts = [
    {
      id: 1,
      author: "María García",
      username: "@maria",
      time: "Hace 2 horas",
      content: "Hoy salí a caminar sin auriculares. Escuché pájaros, conversaciones, el viento. Hacía meses que no lo hacía. Recomiendo 100%.",
      reactions: 24,
      comments: 8,
    },
    {
      id: 2,
      author: "Carlos Ruiz",
      username: "@carlos_r",
      time: "Hace 4 horas",
      content: "¿Alguien más siente que meditar por la mañana cambia completamente su día? Llevo una semana haciéndolo y noto muchísima diferencia.",
      reactions: 31,
      comments: 12,
    },
    {
      id: 3,
      author: "Ana Torres",
      username: "@ana.t",
      time: "Hace 6 horas",
      content: "Practicando el estar presente en cada comida, sin pantallas. Es increíble cómo cambia la experiencia cuando realmente saboreas cada bocado.",
      reactions: 18,
      comments: 5,
    },
  ];

  if (!community) {
    return (
      <div className="min-h-full max-w-md mx-auto flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="mb-4">Comunidad no encontrada</h2>
          <button
            onClick={() => navigate("/communities")}
            className="bg-emerald-500 text-white px-6 py-3 rounded-xl hover:bg-emerald-600 transition-colors"
          >
            Volver a comunidades
          </button>
        </div>
      </div>
    );
  }

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: "from-emerald-400 to-emerald-600",
      blue: "from-blue-400 to-blue-600",
      purple: "from-purple-400 to-purple-600",
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="min-h-full max-w-md mx-auto">
      <div className={`bg-gradient-to-r ${getColorClasses(community.color)} text-white p-4`}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate("/communities")} className="text-white/90 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button className="text-white/90 hover:text-white">
            <MoreHorizontal className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4">
          <h1 className="text-white mb-2">{community.name}</h1>
          <p className="text-white/90 text-sm mb-3">{community.description}</p>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <Users className="w-4 h-4" />
            <span>{community.members} miembros</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-colors ${
              isFollowing
                ? "bg-white/20 text-white hover:bg-white/30"
                : "bg-white text-gray-900 hover:bg-white/90"
            }`}
          >
            {isFollowing ? (
              <>
                <BellOff className="w-4 h-4" />
                Silenciar
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                Seguir
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border-b border-blue-100 p-4">
        <p className="text-blue-800 text-sm">
          💡 Esta comunidad es un espacio seguro para compartir experiencias y aprender juntos. Mantén las conversaciones respetuosas y constructivas.
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h4 className="text-sm">{post.author}</h4>
                    <p className="text-gray-500 text-xs">{post.username}</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>

            <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
              <span>{post.time}</span>
            </div>

            <div className="flex items-center gap-6 pt-2 border-t border-gray-100">
              <button className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors">
                <Heart className="w-5 h-5" />
                <span className="text-sm">{post.reactions}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">{post.comments}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors ml-auto">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-6 m-4 rounded-2xl text-center">
        <p className="text-gray-700 mb-2">
          ✨ Estás al día con las publicaciones de {community.name}
        </p>
        <p className="text-gray-600 text-sm">
          Vuelve más tarde para ver nuevo contenido
        </p>
      </div>
    </div>
  );
}
