import { useParams, useNavigate } from "react-router";
import { ArrowLeft, User, UserCheck, UserPlus, Users, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useWellbeing } from "../contexts/WellbeingContext";
import { findUser } from "../data/mockUsers";
import { PostCard } from "./PostCard";

export function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { followingUsers, followUser, unfollowUser, joinedCommunities } = useWellbeing();
  const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false);

  const user = username ? findUser(username) : undefined;
  const isFollowing = username ? followingUsers.includes(username) : false;

  const sharedCommunities = user
    ? user.communities.filter((c) => joinedCommunities.includes(c))
    : [];

  if (!user) {
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
      followUser(user.username);
    }
  };

  const handleConfirmUnfollow = () => {
    unfollowUser(user.username);
    setShowUnfollowConfirm(false);
  };

  return (
    <div className="min-h-full max-w-md mx-auto pb-6">
      {/* Header */}
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
            <h2 className="text-white mb-0.5">{user.name}</h2>
            <p className="text-white/80 text-sm">@{user.username}</p>
          </div>
        </div>

        <p className="text-white/90 text-sm mb-4">{user.bio}</p>

        {/* Follow button */}
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
        {/* No vanity metrics notice */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-blue-800 text-sm">
            ✨ Este perfil no muestra seguidores ni likes totales. Solo lo que importa: sus publicaciones y comunidades.
          </p>
        </div>

        {/* Shared communities */}
        {sharedCommunities.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-emerald-600" />
              <h4 className="text-sm text-gray-700">
                Comunidades en común ({sharedCommunities.length})
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {sharedCommunities.map((c) => (
                <span
                  key={c}
                  className="bg-emerald-50 text-emerald-700 text-sm px-3 py-1 rounded-full"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* All communities */}
        {sharedCommunities.length < user.communities.length && (
          <div>
            <h4 className="text-sm text-gray-500 mb-2">Otras comunidades</h4>
            <div className="flex flex-wrap gap-2">
              {user.communities
                .filter((c) => !sharedCommunities.includes(c))
                .map((c) => (
                  <span
                    key={c}
                    className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full"
                  >
                    {c}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Recent posts */}
        {user.posts.length > 0 && (
          <div>
            <h3 className="mb-3">Publicaciones recientes</h3>
            <div className="rounded-2xl overflow-hidden border border-gray-100 divide-y divide-gray-100">
              {user.posts.map((post) => (
                <PostCard key={post.id} post={post} showCommunityTag />
              ))}
            </div>
          </div>
        )}

        {user.posts.length === 0 && (
          <div className="bg-gray-50 rounded-2xl p-6 text-center">
            <p className="text-gray-500 text-sm">Aún no hay publicaciones.</p>
          </div>
        )}

        {/* Grouped notifications notice */}
        {isFollowing && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
            <p className="text-emerald-800 text-sm">
              🔔 Las publicaciones de {user.name} aparecerán en tu feed. Recibirás notificaciones de su actividad en el resumen horario.
            </p>
          </div>
        )}
      </div>

      {/* Unfollow confirmation dialog */}
      {showUnfollowConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowUnfollowConfirm(false)} />
          <div className="relative bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full">
            <h3 className="mb-2">¿Dejar de seguir a {user.name}?</h3>
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
