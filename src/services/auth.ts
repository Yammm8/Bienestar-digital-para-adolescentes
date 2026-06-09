/**
 * Servicio de Autenticación - integración con Supabase Auth
 */
import supabase from './supabase';
import { Usuario } from '../types/database';

export interface SignUpData {
  email: string;
  password: string;
  nombre: string;
  username: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  usuario?: Usuario;
  error?: string;
}

export const authService = {
  /**
   * Registrar nuevo usuario
   * Supabase Auth crea el usuario en auth.users,
   * y el trigger handle_new_auth_user crea public.usuario
   */
  async signup(data: SignUpData): Promise<AuthResponse> {
    try {
      const { email, password, nombre, username } = data;

      console.log("SIGNUP DATA", {
        nombre,
        username,
        email,
        password,
        emailJSON: JSON.stringify(email),
    });

      // Registrar en Supabase Auth con metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre,
            username,
          },
        },
      });

      if (authError) {
        console.error('Error en signup:', authError);
        return {
          success: false,
          message: 'Error en el registro',
          error: authError.message,
        };
      }

      if (!authData.user) {
        return {
          success: false,
          message: 'Error desconocido en el registro',
        };
      }

      return {
        success: true,
        message: 'Registro exitoso. Revisa tu email para confirmar.',
      };
    } catch (error: any) {
      console.error('Error en signup:', error);
      return {
        success: false,
        message: 'Error en el registro',
        error: error.message,
      };
    }
  },

  /**
   * Iniciar sesión
   */
  async signin(data: SignInData): Promise<AuthResponse> {
    try {
      const { email, password } = data;

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('Error en signin:', authError);
        return {
          success: false,
          message: 'Error en el login',
          error: authError.message,
        };
      }

      if (!authData.user) {
        return {
          success: false,
          message: 'Error desconocido en el login',
        };
      }

      // Obtener perfil del usuario
      const { data: usuario, error: userError } = await supabase
        .from('usuario')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (userError) {
        console.error('Error obteniendo perfil:', userError);
        return {
          success: false,
          message: 'Error obteniendo perfil',
          error: userError.message,
        };
      }

      return {
        success: true,
        message: 'Login exitoso',
        usuario,
      };
    } catch (error: any) {
      console.error('Error en signin:', error);
      return {
        success: false,
        message: 'Error en el login',
        error: error.message,
      };
    }
  },

  /**
   * Obtener usuario autenticado actual
   */
  async getCurrentUser(): Promise<{ auth: any; profile: Usuario | null } | null> {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return null;

      const { data: profile } = await supabase
        .from('usuario')
        .select('*')
        .eq('id', authUser.id)
        .single();

      return { auth: authUser, profile: profile ?? null };
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      return null;
    }
  },

  /**
   * Cerrar sesión
   */
  async signout(): Promise<boolean> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error en signout:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error en signout:', error);
      return false;
    }
  },

  /**
   * Obtener sesión actual
   */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error obteniendo sesión:', error);
        return null;
      }
      return data.session;
    } catch (error) {
      console.error('Error obteniendo sesión:', error);
      return null;
    }
  },

  /**
   * Escuchar cambios de autenticación
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },

  /**
   * Cambiar contraseña
   */
  async changePassword(newPassword: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return {
          success: false,
          message: 'Error al cambiar contraseña',
          error: error.message,
        };
      }

      return {
        success: true,
        message: 'Contraseña actualizada',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Error al cambiar contraseña',
        error: error.message,
      };
    }
  },

  /**
   * Actualizar perfil del usuario
   */
  async updateUser(userId: string, updates: Partial<any>): Promise<any | null> {
    try {
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
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      return null;
    }
  },

  /**
   * Enviar email para recuperar contraseña
   */
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        return {
          success: false,
          message: 'Error enviando email',
          error: error.message,
        };
      }

      return {
        success: true,
        message: 'Email de recuperación enviado',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Error enviando email',
        error: error.message,
      };
    }
  },
};
