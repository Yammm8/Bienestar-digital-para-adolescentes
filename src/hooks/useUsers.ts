/**
 * Hooks personalizados para queries comunes
 */

import { useState, useEffect } from 'react';
import { Usuario, UsuarioConRelacion } from '../types/database';
import { usuariosService } from '../services';

/**
 * Hook para obtener usuario actual
 */
export function useCurrentUser() {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await usuariosService.obtenerActual();
        setUser(currentUser);
      } catch (err: any) {
        setError(err.message || 'Error fetching user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
}

/**
 * Hook para obtener usuario por ID
 */
export function useUser(userId: string | null) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(!!userId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      try {
        const fetchedUser = await usuariosService.obtenerPorId(userId);
        setUser(fetchedUser);
      } catch (err: any) {
        setError(err.message || 'Error fetching user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
}

/**
 * Hook para obtener usuario con relaciones (seguimiento, etc)
 */
export function useUserWithRelation(userId: string | null, currentUserId: string | null) {
  const [user, setUser] = useState<UsuarioConRelacion | null>(null);
  const [loading, setLoading] = useState(!!userId && !!currentUserId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !currentUserId) {
      setLoading(false);
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      try {
        const fetchedUser = await usuariosService.obtenerConRelacion(userId, currentUserId);
        setUser(fetchedUser);
      } catch (err: any) {
        setError(err.message || 'Error fetching user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, currentUserId]);

  return { user, loading, error };
}

/**
 * Hook para buscar usuarios
 */
export function useSearchUsers(query: string, enabled: boolean = true) {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setUsers([]);
      return;
    }

    const searchUsers = async () => {
      setLoading(true);
      try {
        const results = await usuariosService.buscar(query);
        setUsers(results);
      } catch (err: any) {
        setError(err.message || 'Error searching users');
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(() => {
      searchUsers();
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, enabled]);

  return { users, loading, error };
}

/**
 * Hook para obtener seguidores de un usuario
 */
export function useSeguidores(userId: string | null) {
  const [seguidores, setSeguidores] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(!!userId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchSeguidores = async () => {
      try {
        const data = await usuariosService.obtenerSeguidores(userId);
        setSeguidores(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching followers');
      } finally {
        setLoading(false);
      }
    };

    fetchSeguidores();
  }, [userId]);

  return { seguidores, loading, error };
}

/**
 * Hook para obtener usuarios que sigue
 */
export function useSiguiendo(userId: string | null) {
  const [siguiendo, setSiguiendo] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(!!userId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchSiguiendo = async () => {
      try {
        const data = await usuariosService.obtenerSiguiendo(userId);
        setSiguiendo(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching following');
      } finally {
        setLoading(false);
      }
    };

    fetchSiguiendo();
  }, [userId]);

  return { siguiendo, loading, error };
}
