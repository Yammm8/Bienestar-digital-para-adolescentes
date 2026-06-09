/**
 * Servicio de configuración del usuario
 * Cubre: perfil, privacidad, notificaciones y apariencia
 */
import supabase from './supabase';
import {
  Usuario,
  ConfiguracionPrivacidad,
  ConfiguracionNotificaciones,
  ConfiguracionApariencia,
} from '../types/database';

// ─── Perfil ────────────────────────────────────────────────────────────────

export const perfilService = {
  async obtener(usuarioId: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('id', usuarioId)
      .single();
    if (error) { console.error('Error obteniendo perfil:', error); return null; }
    return data;
  },

  async actualizar(
    usuarioId: string,
    campos: Partial<Pick<Usuario, 'nombre' | 'username' | 'bio' | 'foto_url'>>
  ): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('usuario')
      .update({ ...campos, updated_at: new Date().toISOString() })
      .eq('id', usuarioId)
      .select()
      .single();
    if (error) { console.error('Error actualizando perfil:', error); return null; }
    return data;
  },
};

// ─── Privacidad ────────────────────────────────────────────────────────────

export const privacidadService = {
  async obtener(usuarioId: string): Promise<ConfiguracionPrivacidad | null> {
    const { data, error } = await supabase
      .from('configuracion_privacidad')
      .select('*')
      .eq('id_usuario', usuarioId)
      .single();
    if (error) { console.error('Error obteniendo privacidad:', error); return null; }
    return data;
  },

  async actualizar(
    usuarioId: string,
    campos: Partial<Omit<ConfiguracionPrivacidad, 'id_usuario' | 'updated_at'>>
  ): Promise<ConfiguracionPrivacidad | null> {
    const { data, error } = await supabase
      .from('configuracion_privacidad')
      .update({ ...campos, updated_at: new Date().toISOString() })
      .eq('id_usuario', usuarioId)
      .select()
      .single();
    if (error) { console.error('Error actualizando privacidad:', error); return null; }
    return data;
  },
};

// ─── Notificaciones ────────────────────────────────────────────────────────

export const notificacionesConfigService = {
  async obtener(usuarioId: string): Promise<ConfiguracionNotificaciones | null> {
    const { data, error } = await supabase
      .from('configuracion_notificaciones')
      .select('*')
      .eq('id_usuario', usuarioId)
      .single();
    if (error) { console.error('Error obteniendo notificaciones config:', error); return null; }
    return data;
  },

  async actualizar(
    usuarioId: string,
    campos: Partial<Omit<ConfiguracionNotificaciones, 'id_usuario' | 'updated_at'>>
  ): Promise<ConfiguracionNotificaciones | null> {
    const { data, error } = await supabase
      .from('configuracion_notificaciones')
      .update({ ...campos, updated_at: new Date().toISOString() })
      .eq('id_usuario', usuarioId)
      .select()
      .single();
    if (error) { console.error('Error actualizando notificaciones config:', error); return null; }
    return data;
  },
};

// ─── Apariencia ────────────────────────────────────────────────────────────

export const aparienciaService = {
  async obtener(usuarioId: string): Promise<ConfiguracionApariencia | null> {
    const { data, error } = await supabase
      .from('configuracion_apariencia')
      .select('*')
      .eq('id_usuario', usuarioId)
      .single();
    if (error) { console.error('Error obteniendo apariencia:', error); return null; }
    return data;
  },

  async actualizar(
    usuarioId: string,
    campos: Partial<Omit<ConfiguracionApariencia, 'id_usuario' | 'updated_at'>>
  ): Promise<ConfiguracionApariencia | null> {
    const { data, error } = await supabase
      .from('configuracion_apariencia')
      .update({ ...campos, updated_at: new Date().toISOString() })
      .eq('id_usuario', usuarioId)
      .select()
      .single();
    if (error) { console.error('Error actualizando apariencia:', error); return null; }
    return data;
  },
};