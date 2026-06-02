import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Users, Bell, BellOff, MoreHorizontal, PlusCircle } from "lucide-react";
import { useState } from "react";
import { PostCard, PostData } from "./PostCard";
import { Comment } from "./CommentsSheet";

const BASE_COMMENTS: Comment[] = [
  { id: 1, author: "Luca Martín", username: "@luca_m", content: "¡Totalmente de acuerdo!", time: "Hace 1 hora" },
  { id: 2, author: "Sofía Herrera", username: "@sofia_h", content: "Gracias por compartir esto.", time: "Hace 30 min" },
];

const COMMUNITY_DATA: Record<
  string,
  { name: string; description: string; members: number; color: string; posts: PostData[] }
> = {
  mindfulness: {
    name: "Mindfulness",
    description: "Prácticas de atención plena y vida consciente",
    members: 234,
    color: "emerald",
    posts: [
      { id: 1, author: "María García", username: "@maria", time: "Hace 2 horas", content: "Hoy salí a caminar sin auriculares. Escuché pájaros, conversaciones, el viento. Hacía meses que no lo hacía. Recomiendo 100%.", community: "Mindfulness", initialReactions: 24, initialComments: BASE_COMMENTS },
      { id: 2, author: "Carlos Ruiz", username: "@carlos_r", time: "Hace 4 horas", content: "¿Alguien más siente que meditar por la mañana cambia completamente su día? Llevo una semana haciéndolo y noto muchísima diferencia.", community: "Mindfulness", initialReactions: 31, initialComments: [BASE_COMMENTS[0]] },
      { id: 3, author: "Ana Torres", username: "@ana.t", time: "Hace 6 horas", content: "Practicando el estar presente en cada comida, sin pantallas. Es increíble cómo cambia la experiencia cuando realmente saboreas cada bocado.", community: "Mindfulness", initialReactions: 18, initialComments: [BASE_COMMENTS[1]] },
    ],
  },
  "lectura-consciente": {
    name: "Lectura consciente",
    description: "Compartimos libros que nos transforman",
    members: 189,
    color: "blue",
    posts: [
      { id: 4, author: "Luca Martín", username: "@luca_m", time: "Hace 1 hora", content: "Terminé 'El arte de la atención' de Thich Nhat Hanh. Me ayudó a entender por qué siempre estaba distraído. Muy recomendado.", community: "Lectura consciente", initialReactions: 31, initialComments: BASE_COMMENTS },
      { id: 5, author: "Sofía Herrera", username: "@sofia_h", time: "Hace 5 horas", content: "Recomendación del mes: 'Stolen Focus' de Johann Hari. Cambia cómo ves el diseño de las apps y el sistema que nos mantiene distraídos.", community: "Lectura consciente", initialReactions: 45, initialComments: [] },
    ],
  },
  "vida-universitaria": {
    name: "Vida universitaria",
    description: "Apoyo mutuo para estudiantes",
    members: 312,
    color: "purple",
    posts: [
      { id: 6, author: "Ana Torres", username: "@ana.t", time: "Hace 3 horas", content: "Mi grupo de estudio decidió reunirnos en persona en lugar de Zoom. Fue increíble ver expresiones reales y conectar de verdad.", community: "Vida universitaria", initialReactions: 18, initialComments: [BASE_COMMENTS[1]] },
    ],
  },
  creatividad: { name: "Creatividad", description: "Arte, música y expresión auténtica", members: 156, color: "orange", posts: [] },
  naturaleza: { name: "Naturaleza", description: "Conexión con el mundo natural", members: 201, color: "green", posts: [] },
  "conversaciones-profundas": { name: "Conversaciones profundas", description: "Temas que importan, sin ruido", members: 98, color: "teal", posts: [] },
};

const COLOR_CLASSES: Record<string, string> = {
  emerald: "from-emerald-400 to-emerald-600",
  blue: "from-blue-400 to-blue-600",
  purple: "from-purple-400 to-purple-600",
  orange: "from-orange-400 to-orange-600",
  green: "from-green-400 to-green-600",
  teal: "from-teal-400 to-teal-600",
};

export function CommunityDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [notificationsActive, setNotificationsActive] = useState(true);

  const community = slug ? COMMUNITY_DATA[slug] : null;

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

  const gradient = COLOR_CLASSES[community.color] ?? "from-gray-400 to-gray-600";

  return (
    <div className="min-h-full max-w-md mx-auto">
      <div className={`bg-gradient-to-r ${gradient} text-white p-4`}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate("/communities")} className="text-white/90 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button className="text-white/90 hover:text-white">
            <MoreHorizontal className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4">
          <h1 className="text-white mb-1">{community.name}</h1>
          <p className="text-white/90 text-sm mb-2">{community.description}</p>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <Users className="w-4 h-4" />
            <span>{community.members} miembros</span>
          </div>
        </div>

        <button
          onClick={() => setNotificationsActive(!notificationsActive)}
          className={`w-full py-2 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm ${
            notificationsActive
              ? "bg-white/20 text-white hover:bg-white/30"
              : "bg-white text-gray-900 hover:bg-white/90"
          }`}
        >
          {notificationsActive ? (
            <><BellOff className="w-4 h-4" /> Silenciar notificaciones</>
          ) : (
            <><Bell className="w-4 h-4" /> Activar notificaciones</>
          )}
        </button>
      </div>

      <div className="bg-blue-50 border-b border-blue-100 p-3">
        <p className="text-blue-800 text-xs">
          💡 Espacio seguro para compartir experiencias. Las notificaciones llegan agrupadas cada hora.
        </p>
      </div>

      {community.posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
          <PlusCircle className="w-14 h-14 text-gray-300 mb-5" strokeWidth={1.2} />
          <h3 className="mb-2">Todavía no hay publicaciones</h3>
          <p className="text-gray-500 text-sm mb-6">
            ¡Sé el primero en compartir algo en {community.name}!
          </p>
          <button
            onClick={() => navigate("/create")}
            className="bg-emerald-500 text-white px-6 py-3 rounded-2xl hover:bg-emerald-600 transition-colors"
          >
            Crear publicación
          </button>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-100">
            {community.posts.map((post) => (
              <PostCard key={post.id} post={post} showCommunityTag={false} />
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-5 m-4 rounded-2xl text-center">
            <p className="text-gray-700 mb-1">✨ Estás al día con {community.name}</p>
            <p className="text-gray-500 text-sm">Vuelve más tarde para ver nuevo contenido</p>
          </div>
        </>
      )}
    </div>
  );
}
