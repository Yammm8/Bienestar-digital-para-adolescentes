/**
 * Servicio de Usuarios - CRUD y relaciones
 */
import supabase from './supabase';
import { Usuario, UsuarioConRelacion, Seguimiento } from '../types/database';

export const usuariosService = {
  /**
   * Obtener usuario actual (autenticado)
   */
  async obtenerActual(): Promise<Usuario | null> {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return null;

    const { data, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (error) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }
    return data;
  },

  /**
   * Obtener usuario por ID
   */
  async obtenerPorId(userId: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }
    return data;
  },

  /**
   * Obtener usuario por username
   */
  async obtenerPorUsername(username: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('username', username)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error obteniendo usuario:', error);
    }
    return data ?? null;
  },

  /**
   * Buscar usuarios por nombre o username
   */
  async buscar(query: string, limit: number = 10): Promise<Usuario[]> {
    const trimmed = query.trim();
    const builder = supabase.from('usuario').select('*').limit(limit);

    const queryBuilder = trimmed
      ? builder.or(`nombre.ilike.%${trimmed}%,username.ilike.%${trimmed}%`)
      : builder.order('nombre', { ascending: true });

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error buscando usuarios:', error);
      return [];
    }
    return data ?? [];
  },

  /**
   * Actualizar perfil de usuario
   */
  async actualizar(userId: string, updates: Partial<Usuario>): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('usuario')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error actualizando usuario:', error);
      return null;
    }
    return data;
  },

  /**
   * Obtener usuario con información de relación (sigue/seguidor)
   */
  async obtenerConRelacion(usuarioId: string, usuarioActualId: string): Promise<UsuarioConRelacion | null> {
    const usuario = await this.obtenerPorId(usuarioId);
    if (!usuario) return null;

    // Contar seguidores, siguiendo, publicaciones
    const [{ count: seguidores }, { count: siguiendo }, { count: publicaciones }] = await Promise.all([
      supabase.from('seguimiento').select('*', { count: 'exact' }).eq('id_seguido', usuarioId),
      supabase.from('seguimiento').select('*', { count: 'exact' }).eq('id_seguidor', usuarioId),
      supabase.from('publicacion').select('*', { count: 'exact' }).eq('id_autor', usuarioId),
    ]);

    // Verificar si yo sigo a este usuario
    const { data: yoSigo } = await supabase
      .from('seguimiento')
      .select('*')
      .eq('id_seguidor', usuarioActualId)
      .eq('id_seguido', usuarioId)
      .single();

    // Verificar si este usuario me sigue
    const { data: meSigue } = await supabase
      .from('seguimiento')
      .select('*')
      .eq('id_seguidor', usuarioId)
      .eq('id_seguido', usuarioActualId)
      .single();

    // Comunidades en común
    const { count: comunes } = await supabase
      .from('usuario_comunidad')
      .select('*', { count: 'exact' })
      .in('id_usuario', [usuarioId, usuarioActualId])
      .groupBy('id_comunidad')
      .having('count(*) > 1');

    return {
      ...usuario,
      yo_sigo: !!yoSigo,
      me_sigue: !!meSigue,
      es_mutual: !!yoSigo && !!meSigue,
      comunidades_en_comun: comunes ?? 0,
      publicaciones_count: publicaciones ?? 0,
      seguidores_count: seguidores ?? 0,
      siguiendo_count: siguiendo ?? 0,
    };
  },

  /**
   * Seguir a un usuario
   */
  async seguir(idSeguidor: string, idSeguido: string): Promise<Seguimiento | null> {
    const { data, error } = await supabase
      .from('seguimiento')
      .insert([{ id_seguidor: idSeguidor, id_seguido: idSeguido }])
      .select()
      .single();

    if (error) {
      console.error('Error siguiendo usuario:', error);
      return null;
    }
    return data;
  },

  /**
   * Dejar de seguir a un usuario
   */
  async dejarSeguir(idSeguidor: string, idSeguido: string): Promise<boolean> {
    const { error } = await supabase
      .from('seguimiento')
      .delete()
      .eq('id_seguidor', idSeguidor)
      .eq('id_seguido', idSeguido);

    if (error) {
      console.error('Error dejando de seguir:', error);
      return false;
    }
    return true;
  },

  /**
   * Obtener lista de seguidores
   */
  async obtenerSeguidores(userId: string, limit: number = 50): Promise<Usuario[]> {
    const { data, error } = await supabase
      .from('seguimiento')
      .select('usuario:id_seguidor(*)')
      .eq('id_seguido', userId)
      .limit(limit);

    if (error) {
      console.error('Error obteniendo seguidores:', error);
      return [];
    }
    return data?.map(s => (s.usuario as any)) ?? [];
  },

  /**
   * Obtener lista de usuarios que sigue
   */
  async obtenerSiguiendo(userId: string, limit: number = 50): Promise<Usuario[]> {
    const { data, error } = await supabase
      .from('seguimiento')
      .select('usuario:id_seguido(*)')
      .eq('id_seguidor', userId)
      .limit(limit);

    if (error) {
      console.error('Error obteniendo siguiendo:', error);
      return [];
    }
    return data?.map(s => (s.usuario as any)) ?? [];
  },
};
