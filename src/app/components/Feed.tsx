import { useState } from "react";
import { Heart, Users, Bell } from "lucide-react";
import { useNavigate } from "react-router";
import { useWellbeing } from "../contexts/WellbeingContext";
import { PostCard, PostData } from "./PostCard";
import { Comment } from "./CommentsSheet";

const BASE_COMMENTS: Comment[] = [
  { id: 1, author: "Luca Martín", username: "@luca_m", content: "¡Totalmente de acuerdo! Me pasó algo similar.", time: "Hace 1 hora" },
  { id: 2, author: "Sofía Herrera", username: "@sofia_h", content: "Gracias por compartir esto.", time: "Hace 30 min" },
];

const ALL_POSTS: PostData[] = [
  {
    id: 1,
    author: "María García",
    username: "@maria",
    time: "Hace 2 horas",
    content: "Hoy salí a caminar sin auriculares. Escuché pájaros, conversaciones, el viento. Hacía meses que no lo hacía. Recomiendo 100%.",
    community: "Mindfulness",
    initialReactions: 24,
    initialComments: BASE_COMMENTS,
  },
  {
    id: 2,
    author: "Carlos Ruiz",
    username: "@carlos_r",
    time: "Hace 4 horas",
    content: "Terminé mi primer libro del mes 📚 'El arte de la atención' de Thich Nhat Hanh. Me ayudó a entender por qué siempre estaba distraído.",
    community: "Lectura consciente",
    initialReactions: 31,
    initialComments: [BASE_COMMENTS[0]],
  },
  {
    id: 3,
    author: "Ana Torres",
    username: "@ana.t",
    time: "Hace 6 horas",
    content: "Mi grupo de estudio decidió reunirnos en persona en lugar de Zoom. Fue increíble ver expresiones reales y conectar de verdad.",
    community: "Vida universitaria",
    initialReactions: 18,
    initialComments: [BASE_COMMENTS[1]],
  },
  {
    id: 4,
    author: "Luca Martín",
    username: "@luca_m",
    time: "Hace 9 horas",
    content: "Apagué las notificaciones del celular durante 3 horas mientras dibujaba. Primera vez en meses que entré en ese estado de flujo completo.",
    community: null,
    initialReactions: 42,
    initialComments: [],
  },
  {
    id: 5,
    author: "Sofía Herrera",
    username: "@sofia_h",
    time: "Ayer",
    content: "Recordatorio amable: no necesitas publicar para que tu día haya valido la pena. 🌿",
    community: null,
    initialReactions: 87,
    initialComments: BASE_COMMENTS,
  },
];

export function Feed() {
  const [filterType, setFilterType] = useState<"all" | "communities">("all");
  const { joinedCommunities } = useWellbeing();
  const navigate = useNavigate();

  const posts =
    filterType === "communities"
      ? ALL_POSTS.filter((p) => p.community && joinedCommunities.includes(p.community))
      : ALL_POSTS;

  return (
    <div className="min-h-full max-w-md mx-auto">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 pt-4 pb-1">
          <h1>Feed</h1>
          <button
            onClick={() => navigate("/notifications")}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
        <div className="px-4 pb-3">
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filterType === "all" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              General
            </button>
            <button
              onClick={() => setFilterType("communities")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filterType === "communities" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              Mis comunidades
            </button>
          </div>
          <p className="text-gray-500 text-xs">📅 Cronológico · Sin algoritmos · Actualizado cada 30 min</p>
        </div>
      </div>

      {posts.length === 0 ? (
        <EmptyState filterType={filterType} onExplore={() => navigate("/communities")} />
      ) : (
        <>
          <div className="divide-y divide-gray-100">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} showCommunityTag />
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-6 m-4 rounded-2xl text-center">
            <p className="text-gray-700 mb-1">✨ Estás al día con las publicaciones</p>
            <p className="text-gray-500 text-sm">
              Vuelve en 30 minutos para ver contenido nuevo, o explora tus comunidades.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState({
  filterType,
  onExplore,
}: {
  filterType: "all" | "communities";
  onExplore: () => void;
}) {
  if (filterType === "communities") {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
        <Users className="w-16 h-16 text-gray-300 mb-6" strokeWidth={1.2} />
        <h3 className="mb-2">Todavía no perteneces a ninguna comunidad</h3>
        <p className="text-gray-500 text-sm mb-6">
          Únete a comunidades para ver publicaciones de personas con intereses similares.
        </p>
        <button
          onClick={onExplore}
          className="bg-emerald-500 text-white px-6 py-3 rounded-2xl hover:bg-emerald-600 transition-colors"
        >
          Explorar comunidades
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <Heart className="w-16 h-16 text-gray-300 mb-6" strokeWidth={1.2} />
      <h3 className="mb-2">Aún no hay publicaciones</h3>
      <p className="text-gray-500 text-sm mb-6">
        Sé el primero en compartir algo significativo, o explora comunidades.
      </p>
      <button
        onClick={onExplore}
        className="bg-emerald-500 text-white px-6 py-3 rounded-2xl hover:bg-emerald-600 transition-colors"
      >
        Explorar comunidades
      </button>
    </div>
  );
}
