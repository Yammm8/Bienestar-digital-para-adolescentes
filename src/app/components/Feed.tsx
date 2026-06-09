import { useState, useEffect } from "react";
import { Heart, Users, Bell } from "lucide-react";
import { useNavigate } from "react-router";
import { useWellbeing } from "../contexts/WellbeingContext";
import { PostCard, PostData } from "./PostCard";
import { loadPosts, sortPostsByNewest } from "../data/posts";
import { useFeedGeneral } from "../../hooks/usePublications";
import { publicacionesService } from "../../services/publications";

export function Feed() {
  const [filterType, setFilterType] = useState<"all" | "communities">("all");
  const { joinedCommunities } = useWellbeing();
  const navigate = useNavigate();
  const { publicaciones: serverPosts, loading } = useFeedGeneral();
  const [visiblePosts, setVisiblePosts] = useState<PostData[]>([]);

  // Build visible posts depending on filter: combine local + server
  useEffect(() => {
    const local = loadPosts();

    if (filterType === "all") {
      // show server general posts (mapped) + local general posts
      const serverMapped = (serverPosts ?? []).map((p) => ({
        id: p.id as any,
        author: p.autor?.nombre ?? "",
        username: p.autor ? `@${p.autor.username}` : "",
        time: p.created_at ?? "",
        content: p.contenido,
        community: null,
        initialReactions: p.reacciones?.length ?? 0,
        initialComments: [],
      }));
      const localGeneral = local.filter((p) => !p.community);
      setVisiblePosts([...localGeneral, ...serverMapped]);
      return;
    }

    // communities: fetch posts from joined communities (server + local)
    (async () => {
      const localCommunity = local.filter((p) => p.community && joinedCommunities.includes(p.community));
      const serverAccum: PostData[] = [];
      await Promise.all(
        joinedCommunities.map(async (slug) => {
          try {
            const res = await publicacionesService.obtenerPorComunidadPorSlug(slug);
            res.forEach((p) =>
              serverAccum.push({
                id: p.id as any,
                author: p.autor?.nombre ?? "",
                username: p.autor ? `@${p.autor.username}` : "",
                time: p.created_at ?? "",
                content: p.contenido,
                community: p.comunidad?.nombre ?? slug,
                initialReactions: p.reacciones?.length ?? 0,
                initialComments: [],
              })
            );
          } catch (err) {
            console.warn("Error cargando comunidad:", slug, err);
          }
        })
      );

      // merge, dedupe by id
      const merged = [...localCommunity, ...serverAccum];
      const seen = new Set<string | number>();
      const dedup = merged.filter((m) => {
        if (seen.has(String(m.id))) return false;
        seen.add(String(m.id));
        return true;
      });
      setVisiblePosts(dedup);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, serverPosts, joinedCommunities]);

  return (
    <div className="min-h-full max-w-md mx-auto">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 pt-4 pb-1">
          <h1>Feed</h1>
          <button
            onClick={() => navigate("/notifications")}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
        <div className="px-4 pb-3">
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filterType === "all" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              General
            </button>
            <button
              onClick={() => setFilterType("communities")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filterType === "communities" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              Mis comunidades
            </button>
          </div>
          <p className="text-gray-500 text-xs">📅 Cronológico · Sin algoritmos · Actualizado cada 30 min</p>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4 mb-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-emerald-700 font-medium">Comparte algo auténtico hoy.</p>
              <p className="text-xs text-emerald-600">Tu voz hace que la feed se sienta real.</p>
            </div>
            <button
              onClick={() => navigate("/create")}
              className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 transition-colors"
            >
              Crear publicación
            </button>
          </div>
        </div>
      </div>

      {visiblePosts.length === 0 ? (
        <EmptyState filterType={filterType} onExplore={() => navigate("/communities")} />
      ) : (
        <>
          <div className="divide-y divide-gray-100">
            {visiblePosts.map((post) => (
              <PostCard key={post.id} post={post} showCommunityTag />
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-6 m-4 rounded-2xl text-center">
            <p className="text-gray-700 mb-1">✨ Estás al día con las publicaciones</p>
            <p className="text-gray-500 text-sm">
              Vuelve en 30 minutos para ver contenido nuevo, o explora tus comunidades.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState({
  filterType,
  onExplore,
}: {
  filterType: "all" | "communities";
  onExplore: () => void;
}) {
  if (filterType === "communities") {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
        <Users className="w-16 h-16 text-gray-300 mb-6" strokeWidth={1.2} />
        <h3 className="mb-2">Todavía no perteneces a ninguna comunidad</h3>
        <p className="text-gray-500 text-sm mb-6">
          Únete a comunidades para ver publicaciones de personas con intereses similares.
        </p>
        <button
          onClick={onExplore}
          className="bg-emerald-500 text-white px-6 py-3 rounded-2xl hover:bg-emerald-600 transition-colors"
        >
          Explorar comunidades
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <Heart className="w-16 h-16 text-gray-300 mb-6" strokeWidth={1.2} />
      <h3 className="mb-2">Aún no hay publicaciones</h3>
      <p className="text-gray-500 text-sm mb-6">
        Sé el primero en compartir algo significativo, o explora comunidades.
      </p>
      <button
        onClick={onExplore}
        className="bg-emerald-500 text-white px-6 py-3 rounded-2xl hover:bg-emerald-600 transition-colors"
      >
        Explorar comunidades
      </button>
    </div>
  );
}
