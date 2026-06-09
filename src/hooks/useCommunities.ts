/**
 * Hooks personalizados para comunidades
 */

import { useState, useEffect } from 'react';
import { Comunidad, ComunidadConMembesia, Usuario } from '../types/database';
import { comunidadesService } from '../services';

/**
 * Hook para obtener todas las comunidades
 */
export function useCommunities(limit: number = 50) {
  const [comunidades, setComunidades] = useState<Comunidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await comunidadesService.obtenerTodas(limit);
        setComunidades(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching communities');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { comunidades, loading, error };
}

/**
 * Hook para obtener una comunidad por ID
 */
export function useCommunity(comunidadId: string | null) {
  const [comunidad, setComunidad] = useState<Comunidad | null>(null);
  const [loading, setLoading] = useState(!!comunidadId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!comunidadId) {
      setLoading(false);
      setComunidad(null);
      return;
    }

    const fetch = async () => {
      try {
        const data = await comunidadesService.obtenerPorId(comunidadId);
        setComunidad(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching community');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [comunidadId]);

  return { comunidad, loading, error };
}

/**
 * Hook para obtener comunidad con datos de membresía
 */
export function useCommunityWithMembership(comunidadId: string | null, usuarioId: string | null) {
  const [comunidad, setComunidad] = useState<ComunidadConMembesia | null>(null);
  const [loading, setLoading] = useState(!!comunidadId && !!usuarioId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!comunidadId || !usuarioId) {
      setLoading(false);
      setComunidad(null);
      return;
    }

    const fetch = async () => {
      try {
        const data = await comunidadesService.obtenerConMembesia(comunidadId, usuarioId);
        setComunidad(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching community');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [comunidadId, usuarioId]);

  return { comunidad, loading, error };
}

/**
 * Hook para obtener comunidades de un usuario
 */
export function useUserCommunities(usuarioId: string | null) {
  const [comunidades, setComunidades] = useState<Comunidad[]>([]);
  const [loading, setLoading] = useState(!!usuarioId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!usuarioId) {
      setLoading(false);
      return;
    }

    const fetch = async () => {
      try {
        const data = await comunidadesService.obtenerDeLusuario(usuarioId);
        setComunidades(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching communities');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [usuarioId]);

  return { comunidades, loading, error };
}

/**
 * Hook para obtener miembros de una comunidad
 */
export function useCommunityMembers(comunidadId: string | null, limit: number = 50) {
  const [miembros, setMiembros] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(!!comunidadId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!comunidadId) {
      setLoading(false);
      return;
    }

    const fetch = async () => {
      try {
        const data = await comunidadesService.obtenerMiembros(comunidadId, limit);
        setMiembros(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching members');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [comunidadId]);

  return { miembros, loading, error };
}

/**
 * Hook para buscar comunidades
 */
export function useSearchCommunities(query: string, enabled: boolean = true) {
  const [comunidades, setComunidades] = useState<Comunidad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !query.trim()) {
      setComunidades([]);
      return;
    }

    const search = async () => {
      setLoading(true);
      try {
        const data = await comunidadesService.buscar(query);
        setComunidades(data);
      } catch (err: any) {
        setError(err.message || 'Error searching communities');
      } finally {
        setLoading(false);
      }
    };

    // Debounce
    const timeout = setTimeout(() => {
      search();
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, enabled]);

  return { comunidades, loading, error };
}

/**
 * Hook para unirse/salir de comunidad
 */
export function useCommunityMembership() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unirse = async (usuarioId: string, comunidadId: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await comunidadesService.unirse(usuarioId, comunidadId);
      return success;
    } catch (err: any) {
      setError(err.message || 'Error joining community');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const salir = async (usuarioId: string, comunidadId: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await comunidadesService.salir(usuarioId, comunidadId);
      return success;
    } catch (err: any) {
      setError(err.message || 'Error leaving community');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { unirse, salir, loading, error };
}
