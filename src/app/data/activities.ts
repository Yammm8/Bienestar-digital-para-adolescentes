export type ActivityCategory =
  | "movimiento"
  | "creatividad"
  | "social"
  | "naturaleza"
  | "mindfulness"
  | "aprendizaje";

export interface Activity {
  id: number;
  category: ActivityCategory;
  emoji: string;
  title: string;
  duration: number; // minutes
  description: string;
  benefit: string;
}

export const ACTIVITIES: Activity[] = [
  // Movimiento
  { id: 1,  category: "movimiento",   emoji: "🚶", title: "Caminata corta",           duration: 15, description: "Sal a caminar sin auriculares. Observa tu entorno.",              benefit: "Reduce el estrés · Aclara la mente"           },
  { id: 2,  category: "movimiento",   emoji: "🤸", title: "Estiramientos",             duration: 10, description: "Mueve el cuello, hombros y espalda. Libera tensión acumulada.",  benefit: "Mejora la postura · Activa la circulación"    },
  { id: 3,  category: "movimiento",   emoji: "💃", title: "Baile libre",               duration: 10, description: "Pon música que te guste y muévete sin pensar.",                  benefit: "Libera endorfinas · Eleva el estado de ánimo" },
  { id: 4,  category: "movimiento",   emoji: "🧘", title: "Yoga básico",               duration: 20, description: "Posturas simples para conectar cuerpo y mente.",                 benefit: "Flexibilidad · Calma el sistema nervioso"     },
  // Creatividad
  { id: 5,  category: "creatividad",  emoji: "✏️", title: "Dibujo libre",              duration: 15, description: "Sin objetivo, solo papel y lápiz. Deja que la mano fluya.",       benefit: "Activa el pensamiento creativo"               },
  { id: 6,  category: "creatividad",  emoji: "📓", title: "Diario personal",           duration: 10, description: "Escribe lo que sientes o lo que viviste hoy.",                   benefit: "Procesa emociones · Claridad mental"          },
  { id: 7,  category: "creatividad",  emoji: "🎵", title: "Tocar un instrumento",      duration: 15, description: "Aunque sea un par de acordes o melodías simples.",                benefit: "Concentración · Expresión emocional"          },
  { id: 8,  category: "creatividad",  emoji: "🍳", title: "Cocinar algo nuevo",        duration: 30, description: "Elige una receta sencilla y cocina sin distracciones.",          benefit: "Habilidad práctica · Satisfacción inmediata"  },
  // Social
  { id: 9,  category: "social",       emoji: "📞", title: "Llamar a alguien",          duration: 10, description: "Sin texto, sin stories. Una llamada real a alguien importante.", benefit: "Fortalece vínculos · Sensación de conexión"   },
  { id: 10, category: "social",       emoji: "☕", title: "Tomar café en persona",     duration: 30, description: "Queda con alguien sin llevar el celular en la mano.",             benefit: "Conexión profunda · Conversación real"        },
  { id: 11, category: "social",       emoji: "✉️", title: "Carta a mano",              duration: 15, description: "Escribe una carta o nota a alguien. Sin enviar por mensaje.",    benefit: "Gratitud · Conexión analógica"                },
  { id: 12, category: "social",       emoji: "🎲", title: "Juego de mesa",             duration: 45, description: "Propón jugar algo con quienes tengas cerca.",                    benefit: "Diversión real · Risas sin pantallas"         },
  // Naturaleza
  { id: 13, category: "naturaleza",   emoji: "🌿", title: "Cuidar plantas",            duration: 5,  description: "Riega tus plantas y observa su estado.",                         benefit: "Mindfulness · Conexión con lo vivo"           },
  { id: 14, category: "naturaleza",   emoji: "☀️", title: "Tomar el sol",              duration: 10, description: "Siéntate al sol sin teléfono. Cierra los ojos.",                 benefit: "Vitamina D · Regulación del ritmo circadiano" },
  { id: 15, category: "naturaleza",   emoji: "🦋", title: "Observar el entorno",       duration: 10, description: "Sal y observa: pájaros, árboles, cielo, personas.",              benefit: "Descanso visual · Presencia plena"            },
  { id: 16, category: "naturaleza",   emoji: "🌙", title: "Mirar el cielo nocturno",   duration: 10, description: "Apaga las luces y observa estrellas o la luna.",                 benefit: "Perspectiva · Calma profunda"                 },
  // Mindfulness
  { id: 17, category: "mindfulness",  emoji: "🫁", title: "Respiración 4-7-8",         duration: 5,  description: "Inhala 4 seg, retén 7, exhala 8. Repite 4 veces.",              benefit: "Reduce la ansiedad al instante"               },
  { id: 18, category: "mindfulness",  emoji: "🙏", title: "Gratitud",                  duration: 5,  description: "Escribe 3 cosas por las que estás agradecido hoy.",              benefit: "Bienestar emocional · Reencuadre positivo"    },
  { id: 19, category: "mindfulness",  emoji: "🍵", title: "Té consciente",             duration: 10, description: "Prepara y bebe una taza de té sin hacer nada más.",              benefit: "Presente · Pausa real del día"                },
  { id: 20, category: "mindfulness",  emoji: "😴", title: "Descanso sin pantallas",    duration: 20, description: "Acuéstate, cierra los ojos. Nada de scroll.",                   benefit: "Recuperación cognitiva · Descanso real"       },
  // Aprendizaje
  { id: 21, category: "aprendizaje",  emoji: "📚", title: "Leer un libro físico",      duration: 20, description: "Un libro de papel. Sin interrupciones.",                         benefit: "Vocabulario · Concentración profunda"         },
  { id: 22, category: "aprendizaje",  emoji: "🧩", title: "Puzzle o crucigrama",       duration: 15, description: "Activa tu mente con un reto analógico.",                        benefit: "Concentración · Satisfacción gradual"         },
  { id: 23, category: "aprendizaje",  emoji: "🌍", title: "5 palabras en otro idioma", duration: 10, description: "Aprende vocabulario nuevo sin apps, solo tarjetas o papel.",     benefit: "Plasticidad cerebral · Logro pequeño"         },
  { id: 24, category: "aprendizaje",  emoji: "🎧", title: "Escucha activa",            duration: 20, description: "Pon un podcast y escucha sin hacer nada más en paralelo.",       benefit: "Atención sostenida · Aprendizaje real"        },
];

// Community → preferred activity category
export const COMMUNITY_CATEGORY_MAP: Record<string, ActivityCategory> = {
  "Mindfulness":              "mindfulness",
  "Lectura consciente":       "aprendizaje",
  "Naturaleza":               "naturaleza",
  "Creatividad":              "creatividad",
  "Conversaciones profundas": "social",
  "Vida universitaria":       "movimiento",
};

export const DAILY_CHALLENGE_IDS = [6, 17, 1, 9, 13, 21, 3];

export const todayChallenge =
  ACTIVITIES.find((a) => a.id === DAILY_CHALLENGE_IDS[new Date().getDay()]) ?? ACTIVITIES[0];

// Pick a suggested activity based on joined communities. Falls back to generic short ones.
export function pickSuggestedActivity(joinedCommunities: string[]): Activity {
  const preferredCategories = joinedCommunities
    .map((c) => COMMUNITY_CATEGORY_MAP[c])
    .filter(Boolean) as ActivityCategory[];

  const pool = preferredCategories.length > 0
    ? ACTIVITIES.filter((a) => preferredCategories.includes(a.category) && a.duration <= 20)
    : ACTIVITIES.filter((a) => ["movimiento", "mindfulness"].includes(a.category) && a.duration <= 15);

  const candidates = pool.length > 0 ? pool : ACTIVITIES.filter((a) => a.duration <= 10);
  // Use minute-of-day for a stable-ish pick that changes each visit
  const idx = Math.floor(Date.now() / 60000) % candidates.length;
  return candidates[idx];
}
