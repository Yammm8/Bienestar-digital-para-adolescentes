import { Comment } from "../components/CommentsSheet";
import { PostData } from "../components/PostCard";

export interface MockUser {
  username: string;
  name: string;
  bio: string;
  communities: string[];
  posts: PostData[];
}

const BASE_COMMENTS: Comment[] = [
  { id: 1, author: "Luca Martín", username: "@luca_m", content: "¡Totalmente de acuerdo! Me pasó algo similar la semana pasada.", time: "Hace 1 hora" },
  { id: 2, author: "Sofía Herrera", username: "@sofia_h", content: "Gracias por compartir esto, me llegó mucho.", time: "Hace 30 min" },
];

export const MOCK_USERS: MockUser[] = [
  {
    username: "maria",
    name: "María García",
    bio: "Explorando la vida consciente, un paso a la vez 🌱",
    communities: ["Mindfulness", "Vida universitaria"],
    posts: [
      {
        id: 101,
        author: "María García",
        username: "@maria",
        time: "Hace 2 horas",
        content: "Hoy salí a caminar sin auriculares. Escuché pájaros, conversaciones, el viento. Hacía meses que no lo hacía. Recomiendo 100%.",
        community: "Mindfulness",
        initialReactions: 24,
        initialComments: BASE_COMMENTS,
      },
      {
        id: 102,
        author: "María García",
        username: "@maria",
        time: "28 Abr",
        content: "Reflexión: las mejores conversaciones suceden cuando guardamos el celular.",
        community: null,
        initialReactions: 31,
        initialComments: [],
      },
    ],
  },
  {
    username: "carlos_r",
    name: "Carlos Ruiz",
    bio: "Lector empedernido y meditador aficionado 📚",
    communities: ["Lectura consciente", "Mindfulness"],
    posts: [
      {
        id: 201,
        author: "Carlos Ruiz",
        username: "@carlos_r",
        time: "Hace 4 horas",
        content: "Terminé mi primer libro del mes 📚 'El arte de la atención' de Thich Nhat Hanh. Me ayudó a entender por qué siempre estaba distraído.",
        community: "Lectura consciente",
        initialReactions: 31,
        initialComments: [BASE_COMMENTS[0]],
      },
    ],
  },
  {
    username: "ana.t",
    name: "Ana Torres",
    bio: "Estudiante aprendiendo a estar presente en cada momento",
    communities: ["Vida universitaria", "Conversaciones profundas"],
    posts: [
      {
        id: 301,
        author: "Ana Torres",
        username: "@ana.t",
        time: "Hace 6 horas",
        content: "Mi grupo de estudio decidió reunirnos en persona en lugar de Zoom. Fue increíble ver expresiones reales y conectar de verdad.",
        community: "Vida universitaria",
        initialReactions: 18,
        initialComments: [BASE_COMMENTS[1]],
      },
    ],
  },
  {
    username: "luca_m",
    name: "Luca Martín",
    bio: "Artista y explorador del silencio creativo 🎨",
    communities: ["Creatividad", "Naturaleza"],
    posts: [
      {
        id: 401,
        author: "Luca Martín",
        username: "@luca_m",
        time: "Hace 9 horas",
        content: "Apagué las notificaciones del celular durante 3 horas mientras dibujaba. Primera vez en meses que entré en ese estado de flujo completo.",
        community: null,
        initialReactions: 42,
        initialComments: [],
      },
    ],
  },
  {
    username: "sofia_h",
    name: "Sofía Herrera",
    bio: "Buscando conexiones reales en un mundo distraído 💬",
    communities: ["Conversaciones profundas", "Mindfulness"],
    posts: [
      {
        id: 501,
        author: "Sofía Herrera",
        username: "@sofia_h",
        time: "Ayer",
        content: "Recordatorio amable: no necesitas publicar para que tu día haya valido la pena. 🌿",
        community: null,
        initialReactions: 87,
        initialComments: BASE_COMMENTS,
      },
    ],
  },
];

export function findUser(username: string): MockUser | undefined {
  return MOCK_USERS.find((u) => u.username === username);
}
