/**
 * Tipos TypeScript que mapean el schema PostgreSQL/Supabase
 * Generado desde: bienestar_digital_schema_v2.sql
 */

// ============================================================================
// TIPOS BASE
// ============================================================================

export type ColorComunidad = 
  | 'emerald' | 'blue' | 'purple' | 'orange'
  | 'teal' | 'rose' | 'amber' | 'indigo' | 'green';

export type CategoriaActividad = 
  | 'movimiento' | 'creatividad' | 'social'
  | 'naturaleza' | 'mindfulness' | 'aprendizaje';

export type EstadoSesion = 
  | 'en_curso' | 'pausada' | 'completada' | 'cancelada';

export type TipoNotificacion = 
  | 'reaccion' | 'comentario' | 'comunidad'
  | 'nuevo_seguidor' | 'bienestar';

export type CodigoReaccion = 
  | 'me-importa' | 'gracias' | 'interesante' | 'me-alegra';

// ============================================================================
// ENTIDADES PRINCIPALES
// ============================================================================

/**
 * Usuario - Perfil público vinculado a auth.users de Supabase
 * El email y contraseña viven en auth.users, no aquí
 */
export interface Usuario {
  id: string;                    // UUID, mismo que auth.users.id
  username: string;              // Único, validado: [a-z0-9_]{1,30}
  nombre: string;                // 1-80 caracteres
  bio?: string;                  // Máx 160 caracteres
  foto_url?: string;             // URL del avatar
  onboarded: boolean;            // TRUE después de completar onboarding
  created_at: string;            // TIMESTAMPTZ
  updated_at: string;            // TIMESTAMPTZ
}

/**
 * Configuración de Bienestar - 1:1 con usuario
 */
export interface ConfiguracionBienestar {
  id_usuario: string;            // FK a usuario.id (PK)
  limite_diario_min: number;     // 0 = sin límite. Opciones: 0, 30, 60, 120
  umbral_continuo_min: number;   // 15, 30, 45, 60
  friccion_activa: boolean;
  friccion_intensidad: number;   // 0-100
  color_fade_activo: boolean;
  text_fade_activo: boolean;
  retrasos_activos: boolean;
  recordatorios_activos: boolean;
  updated_at: string;
}

/**
 * Configuración de Privacidad - 1:1 con usuario
 */
export interface ConfiguracionPrivacidad {
  id_usuario: string;
  perfil_publico: boolean;
  publicaciones_publicas: boolean;
  aparecer_en_busqueda: boolean;
  mostrar_estadisticas: boolean;
  permitir_etiquetas: boolean;
  updated_at: string;
}

/**
 * Configuración de Notificaciones - 1:1 con usuario
 */
export interface ConfiguracionNotificaciones {
  id_usuario: string;
  notif_comentarios: boolean;
  notif_reacciones: boolean;
  notif_comunidades: boolean;
  notif_recordatorios_bienestar: boolean;
  notif_nuevos_seguidores: boolean;
  notif_resumen_diario: boolean;
  updated_at: string;
}

/**
 * Configuración de Apariencia - 1:1 con usuario
 */
export interface ConfiguracionApariencia {
  id_usuario: string;
  reducir_movimiento: boolean;
  alto_contraste: boolean;
  texto_grande: boolean;
  modo_compacto: boolean;
  updated_at: string;
}

/**
 * Comunidad
 */
export interface Comunidad {
  id: string;                    // UUID
  slug: string;                  // Único, URL-friendly
  nombre: string;                // 3-40 caracteres, único
  descripcion: string;           // 10-120 caracteres
  color: ColorComunidad;
  es_predefinida: boolean;       // FALSE excepto las 6 iniciales
  id_creador?: string;           // FK a usuario.id, NULL para predefinidas
  created_at: string;
}

/**
 * Publicación
 */
export interface Publicacion {
  id: string;                    // UUID
  id_autor: string;              // FK a usuario.id
  id_comunidad?: string;         // FK a comunidad.id, NULL = feed general
  contenido: string;             // 1-500 caracteres
  created_at: string;
}

/**
 * Comentario
 */
export interface Comentario {
  id: string;                    // UUID
  id_publicacion: string;        // FK a publicacion.id
  id_autor: string;              // FK a usuario.id
  contenido: string;             // 1-300 caracteres
  created_at: string;
}

/**
 * Reacción a publicación
 * Mapeo de emojis:
 *  'me-importa'  → 🤍 "Me importa"
 *  'gracias'     → 🙏 "Gracias"
 *  'interesante' → 💡 "Interesante"
 *  'me-alegra'   → 😊 "Me alegra"
 */
export interface Reaccion {
  id: string;                    // UUID
  id_publicacion: string;        // FK
  id_usuario: string;            // FK
  tipo: CodigoReaccion;
  created_at: string;
}

/**
 * Actividad - Catálogo de 24 actividades offline (solo lectura)
 */
export interface Actividad {
  id: string;                    // UUID
  titulo: string;                // Ej: "Caminata corta"
  categoria: CategoriaActividad;
  emoji: string;                 // Ej: "🚶"
  duracion_min: number;          // Minutos sugeridos
  descripcion: string;           // Descripción corta
  beneficio: string;             // Ej: "Reduce el estrés · Aclara la mente"
}

/**
 * Sesión de Actividad - Una sesión offline registrada
 */
export interface SesionActividad {
  id: string;                    // UUID
  id_usuario: string;            // FK
  id_actividad: string;          // FK
  inicio_at: string;             // TIMESTAMPTZ del inicio
  pausa_at?: string;             // TIMESTAMPTZ si está pausada, NULL si corre
  pausa_ms_total: number;        // Milisegundos acumulados en pausa
  estado: EstadoSesion;
  tiempo_registrado_min?: number; // Minutos confirmados al completar
  created_at: string;
  updated_at: string;
}

/**
 * Registro de Uso Diario - Un registro por usuario por día
 */
export interface RegistroUsoDiario {
  id_usuario: string;
  fecha: string;                 // DATE (YYYY-MM-DD)
  minutos_en_app: number;
  minutos_offline: number;       // Actividades offline completadas
  updated_at: string;
}

/**
 * Registro de Uso Horario - Fuente del heatmap (7 días × 24 horas)
 */
export interface RegistroUsoHorario {
  id_usuario: string;
  fecha: string;                 // DATE
  hora: number;                  // 0-23
  minutos: number;
}

/**
 * Notificación
 */
export interface Notificacion {
  id: string;                    // UUID
  id_destinatario: string;       // FK a usuario.id
  tipo: TipoNotificacion;
  id_referencia?: string;        // UUID polimórfico (publ, comentario, usuario)
  tipo_referencia?: string;      // 'publicacion' | 'comentario' | 'usuario' | NULL
  mensaje: string;
  leida: boolean;
  fecha_evento: string;          // TIMESTAMPTZ
  fecha_agrupacion: string;      // TIMESTAMPTZ truncada a hora
}

/**
 * Relación M:N: Usuario ↔ Comunidad
 */
export interface UsuarioComunidad {
  id_usuario: string;
  id_comunidad: string;
  notificaciones_activas: boolean;
  joined_at: string;
}

/**
 * Relación M:N: Usuario sigue Usuario
 */
export interface Seguimiento {
  id_seguidor: string;           // Usuario que sigue
  id_seguido: string;            // Usuario siendo seguido
  followed_at: string;
}

// ============================================================================
// TIPOS COMPUESTOS (para respuestas de API)
// ============================================================================

/**
 * Publicación con datos del autor (para feed)
 */
export interface PublicacionConAutor extends Publicacion {
  autor: Usuario;
  comunidad?: Comunidad;
  comentarios_count: number;
  reacciones: ReaccionResumen[];
}

/**
 * Resumen de reacciones a una publicación
 */
export interface ReaccionResumen {
  tipo: CodigoReaccion;
  count: number;
  usuarios: string[];           // Usernames de quienes reaccionaron
  yo_reaccione: boolean;         // Si el usuario actual reaccionó con este tipo
}

/**
 * Comentario con datos del autor
 */
export interface ComentarioConAutor extends Comentario {
  autor: Usuario;
}

/**
 * Comunidad con datos de membresía del usuario actual
 */
export interface ComunidadConMembesia extends Comunidad {
  soy_miembro: boolean;
  miembros_count: number;
  publicaciones_count: number;
}

/**
 * Usuario con información de relación (seguimiento, mutuo, etc)
 */
export interface UsuarioConRelacion extends Usuario {
  yo_sigo: boolean;
  me_sigue: boolean;
  es_mutual: boolean;
  comunidades_en_comun: number;
  publicaciones_count: number;
  seguidores_count: number;
  siguiendo_count: number;
}
