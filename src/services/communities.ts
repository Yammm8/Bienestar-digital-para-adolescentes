/**
 * Servicio de Comunidades - CRUD y operaciones relacionadas
 */
import supabase from './supabase';
import { Comunidad, ComunidadConMembesia, Usuario } from '../types/database';

export const comunidadesService = {
  /**
   * Obtener todas las comunidades
   */
  async obtenerTodas(limit: number = 50): Promise<Comunidad[]> {
    const { data, error } = await supabase
      .from('comunidad')
      .select('*')
      .order('nombre', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error obteniendo comunidades:', error);
      return [];
    }
    return data ?? [];
  },

  /**
   * Obtener comunidad por ID
   */
  async obtenerPorId(comunidadId: string): Promise<Comunidad | null> {
    const { data, error } = await supabase
      .from('comunidad')
      .select('*')
      .eq('id', comunidadId)
      .single();

    if (error) {
      console.error('Error obteniendo comunidad:', error);
      return null;
    }
    return data;
  },

  /**
   * Obtener comunidad por slug
   */
  async obtenerPorSlug(slug: string): Promise<Comunidad | null> {
    const { data, error } = await supabase
      .from('comunidad')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error obteniendo comunidad:', error);
      return null;
    }
    return data;
  },

  /**
   * Obtener comunidad con datos de membresía del usuario actual
   */
  async obtenerConMembesia(
    comunidadId: string,
    usuarioId: string
  ): Promise<ComunidadConMembesia | null> {
    const comunidad = await this.obtenerPorId(comunidadId);
    if (!comunidad) return null;

    // Verificar si es miembro
    const { data: miembro } = await supabase
      .from('usuario_comunidad')
      .select('*')
      .eq('id_usuario', usuarioId)
      .eq('id_comunidad', comunidadId)
      .single();

    // Contar miembros y publicaciones
    const [{ count: miembros }, { count: publicaciones }] = await Promise.all([
      supabase
        .from('usuario_comunidad')
        .select('*', { count: 'exact' })
        .eq('id_comunidad', comunidadId),
      supabase
        .from('publicacion')
        .select('*', { count: 'exact' })
        .eq('id_comunidad', comunidadId),
    ]);

    return {
      ...comunidad,
      soy_miembro: !!miembro,
      miembros_count: miembros ?? 0,
      publicaciones_count: publicaciones ?? 0,
    };
  },

  /**
   * Crear comunidad
   */
  async crear(
    nombre: string,
    slug: string,
    descripcion: string,
    creadorId: string,
    color?: string
  ): Promise<Comunidad | null> {
    const { data, error } = await supabase
      .from('comunidad')
      .insert([
        {
          nombre,
          slug,
          descripcion,
          id_creador: creadorId,
          color: color ?? 'emerald',
          es_predefinida: false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creando comunidad:', error);
      return null;
    }

    // Agregar creador como miembro
    await this.unirse(creadorId, data.id);

    return data;
  },

  /**
   * Actualizar comunidad (solo creador puede)
   */
  async actualizar(
    comunidadId: string,
    updates: Partial<Comunidad>
  ): Promise<Comunidad | null> {
    const { data, error } = await supabase
      .from('comunidad')
      .update(updates)
      .eq('id', comunidadId)
      .select()
      .single();

    if (error) {
      console.error('Error actualizando comunidad:', error);
      return null;
    }
    return data;
  },

  /**
   * Eliminar comunidad (solo creador puede)
   */
  async eliminar(comunidadId: string): Promise<boolean> {
    const { error } = await supabase
      .from('comunidad')
      .delete()
      .eq('id', comunidadId);

    if (error) {
      console.error('Error eliminando comunidad:', error);
      return false;
    }
    return true;
  },

  // =========================================================================
  // MEMBRESÍA
  // =========================================================================

  /**
   * Unirse a una comunidad
   */
  async unirse(usuarioId: string, comunidadId: string): Promise<boolean> {
    const { error } = await supabase.from('usuario_comunidad').insert([
      {
        id_usuario: usuarioId,
        id_comunidad: comunidadId,
        notificaciones_activas: true,
      },
    ]);

    if (error) {
      if (error.code === '23505') {
        // Ya es miembro
        return true;
      }
      console.error('Error uniéndose a comunidad:', error);
      return false;
    }
    return true;
  },

  /**
   * Salir de una comunidad
   */
  async salir(usuarioId: string, comunidadId: string): Promise<boolean> {
    const { error } = await supabase
      .from('usuario_comunidad')
      .delete()
      .eq('id_usuario', usuarioId)
      .eq('id_comunidad', comunidadId);

    if (error) {
      console.error('Error saliendo de comunidad:', error);
      return false;
    }
    return true;
  },

  /**
   * Obtener comunidades del usuario
   */
  async obtenerDeLusuario(usuarioId: string): Promise<Comunidad[]> {
    const { data, error } = await supabase
      .from('usuario_comunidad')
      .select('comunidad:id_comunidad(*)')
      .eq('id_usuario', usuarioId);

    if (error) {
      console.error('Error obteniendo comunidades:', error);
      return [];
    }

    return (data ?? [])
      .map(uc => (uc.comunidad as any))
      .filter(Boolean);
  },

  /**
   * Obtener miembros de una comunidad
   */
  async obtenerMiembros(comunidadId: string, limit: number = 50): Promise<Usuario[]> {
    const { data, error } = await supabase
      .from('usuario_comunidad')
      .select('usuario:id_usuario(*)')
      .eq('id_comunidad', comunidadId)
      .limit(limit);

    if (error) {
      console.error('Error obteniendo miembros:', error);
      return [];
    }

    return (data ?? [])
      .map(uc => (uc.usuario as any))
      .filter(Boolean);
  },

  /**
   * Alternar notificaciones de comunidad
   */
  async alternarNotificaciones(
    usuarioId: string,
    comunidadId: string,
    activas: boolean
  ): Promise<boolean> {
    const { error } = await supabase
      .from('usuario_comunidad')
      .update({ notificaciones_activas: activas })
      .eq('id_usuario', usuarioId)
      .eq('id_comunidad', comunidadId);

    if (error) {
      console.error('Error actualizando notificaciones:', error);
      return false;
    }
    return true;
  },

  /**
   * Buscar comunidades
   */
  async buscar(query: string, limit: number = 20): Promise<Comunidad[]> {
    const { data, error } = await supabase
      .from('comunidad')
      .select('*')
      .or(`nombre.ilike.%${query}%,descripcion.ilike.%${query}%`)
      .limit(limit);

    if (error) {
      console.error('Error buscando comunidades:', error);
      return [];
    }
    return data ?? [];
  },
};
