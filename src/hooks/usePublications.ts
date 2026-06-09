/**
 * Hooks personalizados para publicaciones
 */

import { useState, useEffect } from 'react';
import { PublicacionConAutor, Comentario, ComentarioConAutor } from '../types/database';
import { publicacionesService } from '../services';

/**
 * Hook para obtener feed general
 */
export function useFeedGeneral(limit: number = 20) {
  const [publicaciones, setPublicaciones] = useState<PublicacionConAutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);

  const fetch = async () => {
    try {
      const data = await publicacionesService.obtenerFeedGeneral(limit, offset);
      if (offset === 0) {
        setPublicaciones(data);
      } else {
        setPublicaciones(prev => [...prev, ...data]);
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [offset]);

  const loadMore = () => setOffset(prev => prev + limit);

  return { publicaciones, loading, error, loadMore };
}

/**
 * Hook para obtener publicaciones de una comunidad
 */
export function useCommunityPublications(comunidadId: string | null, limit: number = 20) {
  const [publicaciones, setPublicaciones] = useState<PublicacionConAutor[]>([]);
  const [loading, setLoading] = useState(!!comunidadId);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);

  const fetch = async () => {
    if (!comunidadId) return;

    try {
      const data = await publicacionesService.obtenerPorComunidad(comunidadId, limit, offset);
      if (offset === 0) {
        setPublicaciones(data);
      } else {
        setPublicaciones(prev => [...prev, ...data]);
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching publications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [comunidadId, offset]);

  const loadMore = () => setOffset(prev => prev + limit);

  return { publicaciones, loading, error, loadMore };
}

/**
 * Hook para obtener publicaciones de un usuario
 */
export function useUserPublications(usuarioId: string | null, limit: number = 20) {
  const [publicaciones, setPublicaciones] = useState<PublicacionConAutor[]>([]);
  const [loading, setLoading] = useState(!!usuarioId);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);

  const fetch = async () => {
    if (!usuarioId) return;

    try {
      const data = await publicacionesService.obtenerPorUsuario(usuarioId, limit, offset);
      if (offset === 0) {
        setPublicaciones(data);
      } else {
        setPublicaciones(prev => [...prev, ...data]);
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching publications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [usuarioId, offset]);

  const loadMore = () => setOffset(prev => prev + limit);

  return { publicaciones, loading, error, loadMore };
}

/**
 * Hook para obtener comentarios de una publicación
 */
export function useComentarios(publicacionId: string | null) {
  const [comentarios, setComentarios] = useState<ComentarioConAutor[]>([]);
  const [loading, setLoading] = useState(!!publicacionId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!publicacionId) {
      setComentarios([]);
      setLoading(false);
      return;
    }

    const fetch = async () => {
      try {
        const data = await publicacionesService.obtenerComentarios(publicacionId);
        setComentarios(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching comments');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [publicacionId]);

  return { comentarios, loading, error };
}

/**
 * Hook para crear publicación
 */
export function useCreatePublicacion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crear = async (autorId: string, contenido: string, comunidadId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const pub = await publicacionesService.crear(autorId, contenido, comunidadId);
      return { success: !!pub, publicacion: pub };
    } catch (err: any) {
      setError(err.message || 'Error creating publication');
      return { success: false, publicacion: null };
    } finally {
      setLoading(false);
    }
  };

  return { crear, loading, error };
}

/**
 * Hook para crear comentario
 */
export function useCreateComentario() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crear = async (publicacionId: string, autorId: string, contenido: string) => {
    setLoading(true);
    setError(null);
    try {
      const comentario = await publicacionesService.crearComentario(publicacionId, autorId, contenido);
      return { success: !!comentario, comentario };
    } catch (err: any) {
      setError(err.message || 'Error creating comment');
      return { success: false, comentario: null };
    } finally {
      setLoading(false);
    }
  };

  return { crear, loading, error };
}
