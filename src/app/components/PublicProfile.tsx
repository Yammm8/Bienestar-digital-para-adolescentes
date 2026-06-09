import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, User, UserCheck, UserPlus, AlertCircle } from "lucide-react";
import { useWellbeing } from "../contexts/WellbeingContext";
import { loadPosts, sortPostsByNewest } from "../data/posts";
import { publicacionesService } from "../../services/publications";
import { usuariosService } from "../../services/users";
import { PostCard, PostData } from "./PostCard";

export function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { followingUsers, followUser, unfollowUser } = useWellbeing();
  const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false);
  const [profile, setProfile] = useState<any | null>(null);
  const [userPosts, setUserPosts] = useState<PostData[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const isFollowing = username ? followingUsers.includes(username) : false;

  useEffect(() => {
    (async () => {
      setLoadingProfile(true);
      if (!username) {
        setProfile(null);
        setUserPosts([]);
        setLoadingProfile(false);
        return;
      }

      const foundUser = await usuariosService.obtenerPorUsername(username);
      if (!foundUser) {
        setProfile(null);
        setUserPosts([]);
        setLoadingProfile(false);
        return;
      }

      setProfile(foundUser);
      const local = loadPosts().filter(
        (post) => post.username.toLowerCase() === `@${username.toLowerCase()}`
      );

      try {
        const server = await publicacionesService.obtenerPorUsername(username);
        const mapped = server.map((p) => ({
          id: p.id as any,
          author: p.autor?.nombre ?? "",
          username: p.autor ? `@${p.autor.username}` : "",
          time: p.created_at ?? "",
          createdAt: p.created_at,
          content: p.contenido,
          community: p.comunidad?.nombre ?? null,
          initialReactions: p.reacciones?.length ?? 0,
          initialComments: [],
        }));

        const seen = new Set<string | number>();
        const merged = [...mapped, ...local].filter((m) => {
          if (seen.has(String(m.id))) return false;
          seen.add(String(m.id));
          return true;
        });

        setUserPosts(sortPostsByNewest(merged));
      } catch (err) {
        setUserPosts(sortPostsByNewest(local));
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, [username]);

  if (loadingProfile) {
    return (
      <div className="min-h-full max-w-md mx-auto flex items-center justify-center p-8 text-center">
        <p className="text-gray-500">Cargando perfil…</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-full max-w-md mx-auto flex flex-col items-center justify-center p-8 text-center gap-4">
        <AlertCircle className="w-14 h-14 text-gray-300" strokeWidth={1.5} />
        <h2>Perfil no encontrado</h2>
        <p className="text-gray-500 text-sm">
          Este usuario no existe o su cuenta fue eliminada.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-emerald-500 text-white px-6 py-3 rounded-2xl hover:bg-emerald-600 transition-colors"
        >
          Volver
        </button>
      </div>
    );
  }

  const handleFollowToggle = () => {
    if (isFollowing) {
      setShowUnfollowConfirm(true);
    } else {
      followUser(profile.username);
    }
  };

  const handleConfirmUnfollow = () => {
    unfollowUser(profile.username);
    setShowUnfollowConfirm(false);
  };

  return (
    <div className="min-h-full max-w-md mx-auto pb-6">
      <div className="bg-gradient-to-r from-blue-400 to-teal-500 p-4 text-white">
        <button
          onClick={() => navigate(-1)}
          className="text-white/90 hover:text-white mb-4 flex items-center gap-1"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Atrás</span>
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-white mb-0.5">{profile.nombre}</h2>
            <p className="text-white/80 text-sm">@{profile.username}</p>
          </div>
        </div>

        <p className="text-white/90 text-sm mb-4">{profile.bio ?? 'No hay biografía disponible.'}</p>

        <button
          onClick={handleFollowToggle}
          className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-colors ${
            isFollowing
              ? "bg-white/20 text-white hover:bg-white/30"
              : "bg-white text-gray-900 hover:bg-white/90"
          }`}
        >
          {isFollowing ? (
            <>
              <UserCheck className="w-4 h-4" />
              Siguiendo
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Seguir
            </>
          )}
        </button>
      </div>

      <div className="p-4 space-y-5">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-blue-800 text-sm">
            ✨ Aquí ves las publicaciones públicas de este usuario, ordenadas de la más reciente a la más antigua.
          </p>
        </div>

        {userPosts.length > 0 && (
          <div>
            <h3 className="mb-3">Publicaciones recientes</h3>
            <div className="rounded-2xl overflow-hidden border border-gray-100 divide-y divide-gray-100">
              {userPosts.map((post) => (
                <PostCard key={post.id} post={post} showCommunityTag />
              ))}
            </div>
          </div>
        )}

        {userPosts.length === 0 && (
          <div className="bg-gray-50 rounded-2xl p-6 text-center">
            <p className="text-gray-500 text-sm">Aún no hay publicaciones.</p>
          </div>
        )}

        {isFollowing && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
            <p className="text-emerald-800 text-sm">
              🔔 Si sigues a {profile.nombre}, sus publicaciones aparecerán en tu feed.
            </p>
          </div>
        )}
      </div>

      {showUnfollowConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowUnfollowConfirm(false)} />
          <div className="relative bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full">
            <h3 className="mb-2">¿Dejar de seguir a {profile.nombre}?</h3>
            <p className="text-gray-600 text-sm mb-6">
              Sus publicaciones dejarán de aparecer en tu feed. Siempre puedes volver a seguirle.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUnfollowConfirm(false)}
                className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmUnfollow}
                className="flex-1 py-3 rounded-2xl bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Dejar de seguir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
