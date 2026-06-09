/**
 * Servicio de Publicaciones - CRUD y operaciones relacionadas
 */
import supabase from './supabase';
import {
  Publicacion,
  PublicacionConAutor,
  Comentario,
  ComentarioConAutor,
  Reaccion,
  ReaccionResumen,
  CodigoReaccion,
} from '../types/database';

export const publicacionesService = {
  /**
   * Obtener publicaciones del feed general (con autor)
   */
  async obtenerFeedGeneral(limit: number = 20, offset: number = 0): Promise<PublicacionConAutor[]> {
    const { data, error } = await supabase
      .from('publicacion')
      .select(`
        *,
        autor:id_autor(*)
      `)
      .is('id_comunidad', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error obteniendo feed:', error);
      return [];
    }

    return (data ?? []).map(p => ({
      ...p,
      autor: (p.autor as any)[0],
      comentarios_count: 0,
      reacciones: [],
    }));
  },

  /**
   * Obtener publicaciones de una comunidad
   */
  async obtenerPorComunidad(
    comunidadId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<PublicacionConAutor[]> {
    const { data, error } = await supabase
      .from('publicacion')
      .select(`
        *,
        autor:id_autor(*),
        comentario(count),
        reaccion(count)
      `)
      .eq('id_comunidad', comunidadId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error obteniendo publicaciones:', error);
      return [];
    }

    return (data ?? []).map(p => ({
      ...p,
      autor: (p.autor as any)[0],
      comentarios_count: (p.comentario as any)?.[0]?.count ?? 0,
      reacciones: [],
    }));
  },

  /**
   * Obtener publicaciones de una comunidad a partir de su slug (cliente usa slugs)
   */
  async obtenerPorComunidadPorSlug(
    slug: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<PublicacionConAutor[]> {
    // Primero buscar la comunidad por slug
    const { data: comunidadData, error: comunidadErr } = await supabase
      .from('comunidad')
      .select('*')
      .eq('slug', slug)
      .limit(1)
      .maybeSingle();

    if (comunidadErr) {
      console.error('Error buscando comunidad por slug:', comunidadErr);
      return [];
    }
    if (!comunidadData) return [];

    return this.obtenerPorComunidad(comunidadData.id, limit, offset);
  },

  /**
   * Obtener publicaciones de un usuario
   */
  async obtenerPorUsuario(
    usuarioId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<PublicacionConAutor[]> {
    const { data, error } = await supabase
      .from('publicacion')
      .select(`
        *,
        autor:id_autor(*),
        comunidad:id_comunidad(*)
      `)
      .eq('id_autor', usuarioId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error obteniendo publicaciones:', error);
      return [];
    }

    return (data ?? []).map(p => ({
      ...p,
      autor: (p.autor as any)[0],
      comunidad: (p.comunidad as any)?.[0],
      comentarios_count: 0,
      reacciones: [],
    }));
  },

  /**
   * Obtener publicaciones de un usuario a partir de su username
   */
  async obtenerPorUsername(
    username: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<PublicacionConAutor[]> {
    const { data: udata, error: uerr } = await supabase
      .from('usuario')
      .select('*')
      .eq('username', username)
      .limit(1)
      .maybeSingle();

    if (uerr) {
      console.error('Error buscando usuario por username:', uerr);
      return [];
    }
    if (!udata) return [];

    return this.obtenerPorUsuario(udata.id, limit, offset);
  },

  /**
   * Crear publicación
   */
  async crear(
    autorId: string,
    contenido: string,
    comunidadId?: string
  ): Promise<Publicacion | null> {
    const { data, error } = await supabase
      .from('publicacion')
      .insert([
        {
          id_autor: autorId,
          id_comunidad: comunidadId ?? null,
          contenido,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creando publicación:', error);
      return null;
    }
    console.log("PUBLICACION CREADA", data);
    console.log("ERROR", error);
    return data;
  },

  /**
   * Actualizar publicación (solo contenido)
   */
  async actualizar(publicacionId: string, contenido: string): Promise<Publicacion | null> {
    const { data, error } = await supabase
      .from('publicacion')
      .update({ contenido })
      .eq('id', publicacionId)
      .select()
      .single();

    if (error) {
      console.error('Error actualizando publicación:', error);
      return null;
    }
    return data;
  },

  /**
   * Eliminar publicación
   */
  async eliminar(publicacionId: string): Promise<boolean> {
    const { error } = await supabase
      .from('publicacion')
      .delete()
      .eq('id', publicacionId);

    if (error) {
      console.error('Error eliminando publicación:', error);
      return false;
    }
    return true;
  },

  // =========================================================================
  // COMENTARIOS
  // =========================================================================

  /**
   * Obtener comentarios de una publicación
   */
  async obtenerComentarios(publicacionId: string): Promise<ComentarioConAutor[]> {
    const { data, error } = await supabase
      .from('comentario')
      .select(`
        *,
        autor:id_autor(*)
      `)
      .eq('id_publicacion', publicacionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error obteniendo comentarios:', error);
      return [];
    }

    return (data ?? []).map(c => ({
      ...c,
      autor: (c.autor as any)[0],
    }));
  },

  /**
   * Crear comentario
   */
  async crearComentario(
    publicacionId: string,
    autorId: string,
    contenido: string
  ): Promise<Comentario | null> {
    const { data, error } = await supabase
      .from('comentario')
      .insert([
        {
          id_publicacion: publicacionId,
          id_autor: autorId,
          contenido,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creando comentario:', error);
      return null;
    }
    return data;
  },

  /**
   * Eliminar comentario
   */
  async eliminarComentario(comentarioId: string): Promise<boolean> {
    const { error } = await supabase
      .from('comentario')
      .delete()
      .eq('id', comentarioId);

    if (error) {
      console.error('Error eliminando comentario:', error);
      return false;
    }
    return true;
  },

  // =========================================================================
  // REACCIONES
  // =========================================================================

  /**
   * Obtener reacciones a una publicación
   */
  async obtenerReacciones(publicacionId: string): Promise<ReaccionResumen[]> {
    const { data, error } = await supabase
      .from('reaccion')
      .select('tipo, id_usuario')
      .eq('id_publicacion', publicacionId);

    if (error) {
      console.error('Error obteniendo reacciones:', error);
      return [];
    }

    // Agrupar por tipo
    const resumen: Record<CodigoReaccion, ReaccionResumen> = {
      'me-importa': { tipo: 'me-importa', count: 0, usuarios: [], yo_reaccione: false },
      gracias: { tipo: 'gracias', count: 0, usuarios: [], yo_reaccione: false },
      interesante: { tipo: 'interesante', count: 0, usuarios: [], yo_reaccione: false },
      'me-alegra': { tipo: 'me-alegra', count: 0, usuarios: [], yo_reaccione: false },
    };

    (data ?? []).forEach(r => {
      const tipo: CodigoReaccion = r.tipo as any;
      resumen[tipo].count++;
      resumen[tipo].usuarios.push(r.id_usuario);
    });

    return Object.values(resumen).filter(r => r.count > 0);
  },

  /**
   * Agregar reacción
   */
  async agregarReaccion(
    publicacionId: string,
    usuarioId: string,
    tipo: CodigoReaccion
  ): Promise<Reaccion | null> {
    const { data, error } = await supabase
      .from('reaccion')
      .insert([
        {
          id_publicacion: publicacionId,
          id_usuario: usuarioId,
          tipo,
        },
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        // Unique constraint: ya tiene esta reacción
        return null;
      }
      console.error('Error agregando reacción:', error);
      return null;
    }
    return data;
  },

  /**
   * Eliminar reacción
   */
  async eliminarReaccion(
    publicacionId: string,
    usuarioId: string,
    tipo: CodigoReaccion
  ): Promise<boolean> {
    const { error } = await supabase
      .from('reaccion')
      .delete()
      .eq('id_publicacion', publicacionId)
      .eq('id_usuario', usuarioId)
      .eq('tipo', tipo);

    if (error) {
      console.error('Error eliminando reacción:', error);
      return false;
    }
    return true;
  },

  /**
   * Cambiar reacción (elimina la anterior y agrega la nueva)
   */
  async cambiarReaccion(
    publicacionId: string,
    usuarioId: string,
    tipoAnterior: CodigoReaccion,
    tipoNuevo: CodigoReaccion
  ): Promise<Reaccion | null> {
    await this.eliminarReaccion(publicacionId, usuarioId, tipoAnterior);
    return this.agregarReaccion(publicacionId, usuarioId, tipoNuevo);
  },
};
