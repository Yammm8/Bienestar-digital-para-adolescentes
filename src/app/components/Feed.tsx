import { useState } from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal, User, Filter } from "lucide-react";

export function Feed() {
  const [filterType, setFilterType] = useState<"all" | "communities">("all");

  const posts = [
    {
      id: 1,
      author: "María García",
      username: "@maria",
      time: "Hace 2 horas",
      content: "Hoy salí a caminar sin auriculares. Escuché pájaros, conversaciones, el viento. Hacía meses que no lo hacía. Recomiendo 100%.",
      reactions: 24,
      comments: 8,
      community: "Mindfulness",
    },
    {
      id: 2,
      author: "Carlos Ruiz",
      username: "@carlos_r",
      time: "Hace 4 horas",
      content: "Terminé mi primer libro del mes 📚 'El arte de la atención' de Thich Nhat Hanh. Me ayudó a entender por qué siempre estaba distraído.",
      reactions: 31,
      comments: 12,
      community: "Lectura consciente",
    },
    {
      id: 3,
      author: "Ana Torres",
      username: "@ana.t",
      time: "Hace 6 horas",
      content: "Mi grupo de estudio decidió reunirnos en persona en lugar de Zoom. Fue increíble ver expresiones reales y conectar de verdad.",
      reactions: 18,
      comments: 5,
      community: "Vida universitaria",
    },
  ];

  return (
    <div className="min-h-full max-w-md mx-auto">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4 flex items-center justify-between">
          <h1>Feed</h1>
          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
            <Filter className="w-5 h-5" />
          </button>
        </div>
        <div className="px-4 pb-3">
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filterType === "all"
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              General
            </button>
            <button
              onClick={() => setFilterType("communities")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filterType === "communities"
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Mis comunidades
            </button>
          </div>
          <p className="text-gray-600 text-sm">
            📅 Cronológico · Sin algoritmos · Actualizado cada 30 min
          </p>
        </div>
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
                <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full mb-2">
                  {post.community}
                </span>
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
          ✨ Estás al día con las publicaciones
        </p>
        <p className="text-gray-600 text-sm">
          Vuelve en 30 minutos para ver contenido nuevo, o explora tus comunidades.
        </p>
      </div>
    </div>
  );
}
