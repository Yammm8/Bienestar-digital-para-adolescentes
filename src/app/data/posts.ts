import { PostData } from "../components/PostCard";
import { MOCK_USERS } from "./mockUsers";
import { publicacionesService } from "../../services/publications";
import { comunidadesService } from "../../services/communities";

const STORAGE_KEY = "wb_posts";

const seedPosts = (): PostData[] => MOCK_USERS.flatMap((user) => user.posts);

export function loadPosts(): PostData[] {
  if (typeof window === "undefined") return seedPosts();

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      savePosts(seedPosts());
      return seedPosts();
    }

    return JSON.parse(stored) as PostData[];
  } catch (error) {
    console.error("Error cargando publicaciones mock:", error);
    return seedPosts();
  }
}

export function savePosts(posts: PostData[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export function addPost(post: PostData) {
  const createdAt = post.createdAt ?? new Date().toISOString();
  const posts = loadPosts();
  const next = [{ ...post, createdAt, synced: post.synced ?? false }, ...posts];
  savePosts(next);
  return next;
}

export function sortPostsByNewest(posts: PostData[]) {
  return [...posts].sort((a, b) => {
    const aTime = a.createdAt ? Date.parse(a.createdAt) : typeof a.id === "number" ? a.id : 0;
    const bTime = b.createdAt ? Date.parse(b.createdAt) : typeof b.id === "number" ? b.id : 0;
    return bTime - aTime;
  });
}

function toCommunitySlug(name: string | null | undefined) {
  if (!name) return null;
  return name.toLowerCase().replace(/\s+/g, "-");
}

export async function syncPendingPostsToDb(autorId: string, username: string): Promise<number> {
  const posts = loadPosts();
  const normalizedUsername = `@${username}`.toLowerCase();
  let syncedCount = 0;

  const updatedPosts = await Promise.all(
    posts.map(async (post) => {
      if (post.synced || post.username.toLowerCase() !== normalizedUsername) {
        return post;
      }

      let communityId: string | undefined;
      if (post.community) {
        const slug = toCommunitySlug(post.community);
        if (slug) {
          const community = await comunidadesService.obtenerPorSlug(slug);
          communityId = community?.id ?? undefined;
        }
      }

      const publicacion = await publicacionesService.crear(
        autorId,
        post.content,
        communityId
      );

      if (!publicacion) {
        return post;
      }

      syncedCount += 1;
      return {
        ...post,
        id: publicacion.id,
        remoteId: publicacion.id,
        createdAt: publicacion.created_at,
        time: "Ahora",
        synced: true,
      } as PostData;
    })
  );

  if (syncedCount > 0) {
    savePosts(updatedPosts);
  }

  return syncedCount;
}
