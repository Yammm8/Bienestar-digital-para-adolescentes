import { useState } from "react";
import { Search as SearchIcon, User, Users, UserPlus, UserCheck } from "lucide-react";
import { useNavigate } from "react-router";
import { useWellbeing } from "../contexts/WellbeingContext";
import { MOCK_USERS } from "../data/mockUsers";

const ALL_COMMUNITIES = [
  { name: "Mindfulness", members: 234, description: "Prácticas de atención plena y vida consciente", color: "emerald" },
  { name: "Lectura consciente", members: 189, description: "Compartimos libros que nos transforman", color: "blue" },
  { name: "Vida universitaria", members: 312, description: "Apoyo mutuo para estudiantes", color: "purple" },
  { name: "Creatividad", members: 156, description: "Arte, música y expresión auténtica", color: "orange" },
  { name: "Naturaleza", members: 201, description: "Conexión con el mundo natural", color: "green" },
  { name: "Conversaciones profundas", members: 98, description: "Temas que importan, sin ruido", color: "teal" },
];

const COMMUNITY_COLORS: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-700",
  blue: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  orange: "bg-orange-100 text-orange-700",
  green: "bg-green-100 text-green-700",
  teal: "bg-teal-100 text-teal-700",
};

export function Search() {
  const navigate = useNavigate();
  const { followingUsers, followUser, unfollowUser, joinedCommunities, joinCommunity, leaveCommunity } = useWellbeing();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"users" | "communities">("users");

  const q = query.toLowerCase().trim();

  const filteredUsers = q
    ? MOCK_USERS.filter(
        (u) => u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q)
      )
    : MOCK_USERS;

  const filteredCommunities = q
    ? ALL_COMMUNITIES.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      )
    : ALL_COMMUNITIES;

  return (
    <div className="min-h-full max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 p-4">
        <h1 className="mb-3">Buscar</h1>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar personas o comunidades..."
            autoFocus
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setTab("users")}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === "users"
                ? "bg-emerald-500 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Usuarios
          </button>
          <button
            onClick={() => setTab("communities")}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === "communities"
                ? "bg-emerald-500 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Comunidades
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Users tab */}
        {tab === "users" && (
          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <EmptyResults query={query} type="usuarios" />
            ) : (
              filteredUsers.map((user) => {
                const isFollowing = followingUsers.includes(user.username);
                return (
                  <div
                    key={user.username}
                    className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3"
                  >
                    <button
                      onClick={() => navigate(`/users/${user.username}`)}
                      className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity"
                    >
                      <User className="w-6 h-6 text-white" />
                    </button>

                    <button
                      onClick={() => navigate(`/users/${user.username}`)}
                      className="flex-1 text-left min-w-0"
                    >
                      <p className="text-sm text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">@{user.username}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{user.bio}</p>
                    </button>

                    <button
                      onClick={() =>
                        isFollowing ? unfollowUser(user.username) : followUser(user.username)
                      }
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm transition-colors flex-shrink-0 ${
                        isFollowing
                          ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          : "bg-emerald-500 text-white hover:bg-emerald-600"
                      }`}
                    >
                      {isFollowing ? (
                        <UserCheck className="w-4 h-4" />
                      ) : (
                        <UserPlus className="w-4 h-4" />
                      )}
                      <span>{isFollowing ? "Siguiendo" : "Seguir"}</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Communities tab */}
        {tab === "communities" && (
          <div className="space-y-3">
            {filteredCommunities.length === 0 ? (
              <EmptyResults query={query} type="comunidades" />
            ) : (
              filteredCommunities.map((community) => {
                const slug = community.name.toLowerCase().replace(/\s+/g, "-");
                const isMember = joinedCommunities.includes(community.name);
                const colorClass = COMMUNITY_COLORS[community.color] ?? "bg-gray-100 text-gray-700";
                return (
                  <div
                    key={community.name}
                    className="bg-white rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => navigate(`/communities/${slug}`)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}
                      >
                        <Users className="w-6 h-6" />
                      </button>

                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => navigate(`/communities/${slug}`)}
                          className="text-left w-full"
                        >
                          <p className="text-sm text-gray-900">{community.name}</p>
                          <p className="text-xs text-gray-500">{community.members} miembros</p>
                          <p className="text-xs text-gray-400 mt-0.5">{community.description}</p>
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          isMember
                            ? leaveCommunity(community.name)
                            : joinCommunity(community.name)
                        }
                        className={`px-3 py-1.5 rounded-xl text-sm flex-shrink-0 transition-colors ${
                          isMember
                            ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            : "bg-emerald-500 text-white hover:bg-emerald-600"
                        }`}
                      >
                        {isMember ? "Salir" : "Unirse"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyResults({ query, type }: { query: string; type: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <SearchIcon className="w-12 h-12 text-gray-300 mb-4" strokeWidth={1.5} />
      <p className="text-gray-600 mb-1">
        No se encontraron {type} para <strong>"{query}"</strong>
      </p>
      <p className="text-gray-400 text-sm">Intenta con otro término de búsqueda</p>
    </div>
  );
}
