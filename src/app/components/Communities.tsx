import { useEffect, useState } from "react";
import { Users, TrendingUp, MessageCircle, Search, Compass, Plus, X, Check } from "lucide-react";
import { useNavigate } from "react-router";
import { useWellbeing } from "../contexts/WellbeingContext";
import { useAuth } from "../contexts/AuthContext";
import { useCommunities, useSearchCommunities } from "../../hooks/useCommunities";
import { comunidadesService } from "../../services/communities";

interface CommunityData {
  id?: string;
  slug: string;
  name: string;
  description: string;
  color: string;
  members: number;
  active: number;
  newPosts: number;
  custom?: boolean;
}

const SEED_COMMUNITIES: CommunityData[] = [
  { slug: "mindfulness", name: "Mindfulness",             members: 234, active: 45, description: "Prácticas de atención plena y vida consciente", color: "emerald", newPosts: 8  },
  { slug: "lectura-consciente", name: "Lectura consciente",      members: 189, active: 32, description: "Compartimos libros que nos transforman",        color: "blue",    newPosts: 5  },
  { slug: "vida-universitaria", name: "Vida universitaria",      members: 312, active: 67, description: "Apoyo mutuo para estudiantes",                  color: "purple",  newPosts: 12 },
  { slug: "creatividad", name: "Creatividad",             members: 156, active: 21, description: "Arte, música y expresión auténtica",            color: "orange",  newPosts: 3  },
  { slug: "naturaleza", name: "Naturaleza",              members: 201, active: 38, description: "Conexión con el mundo natural",                 color: "green",   newPosts: 6  },
  { slug: "conversaciones-profundas", name: "Conversaciones profundas",members:  98, active: 14, description: "Temas que importan, sin ruido",                color: "teal",    newPosts: 2  },
];

const COLOR_OPTIONS = [
  { id: "emerald", label: "Verde",   tw: "bg-emerald-500" },
  { id: "blue",    label: "Azul",    tw: "bg-blue-500"    },
  { id: "purple",  label: "Violeta", tw: "bg-purple-500"  },
  { id: "orange",  label: "Naranja", tw: "bg-orange-500"  },
  { id: "teal",    label: "Teal",    tw: "bg-teal-500"    },
  { id: "rose",    label: "Rosa",    tw: "bg-rose-500"    },
  { id: "amber",   label: "Ámbar",   tw: "bg-amber-500"   },
  { id: "indigo",  label: "Índigo",  tw: "bg-indigo-500"  },
];

const getColorClasses = (color: string) => {
  const colors: Record<string, string> = {
    emerald: "from-emerald-400 to-emerald-600",
    blue:    "from-blue-400 to-blue-600",
    purple:  "from-purple-400 to-purple-600",
    orange:  "from-orange-400 to-orange-600",
    green:   "from-green-400 to-green-600",
    teal:    "from-teal-400 to-teal-600",
    rose:    "from-rose-400 to-rose-600",
    amber:   "from-amber-400 to-amber-600",
    indigo:  "from-indigo-400 to-indigo-600",
  };
  return colors[color] ?? "from-gray-400 to-gray-600";
};

// ─── Create community sheet ───────────────────────────────────────────────────

type CreateCommunityPayload = {
  name: string;
  description: string;
  color: string;
};

function CreateCommunitySheet({
  onClose,
  onCreate,
  existingNames,
}: {
  onClose: () => void;
  onCreate: (payload: CreateCommunityPayload) => void;
  existingNames: string[];
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("emerald");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const trimmedName = name.trim();
  const trimmedDesc = description.trim();
  const nameTaken = existingNames.some(
    (n) => n.toLowerCase() === trimmedName.toLowerCase()
  );
  const canCreate =
    trimmedName.length >= 3 &&
    trimmedName.length <= 40 &&
    trimmedDesc.length >= 10 &&
    trimmedDesc.length <= 120 &&
    !nameTaken;

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const handleSubmit = () => {
    if (!canCreate) return;
    onCreate({ name: trimmedName, description: trimmedDesc, color });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={handleClose}
      />

      {/* Sheet — fixed height, no scroll needed */}
      <div
        className="relative bg-white rounded-t-3xl shadow-2xl transition-transform duration-200 ease-out"
        style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h3 className="text-gray-900">Nueva comunidad</h3>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 pt-4 pb-2 space-y-4">
          {/* Color preview accent */}
          <div className={`h-1 rounded-full bg-gradient-to-r ${getColorClasses(color)} transition-all duration-300`} />

          {/* Name field */}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1.5">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Fotografía analógica"
              maxLength={40}
              className={`w-full px-4 py-3 border rounded-2xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent ${
                nameTaken ? "border-red-300 focus:ring-red-400" : "border-gray-200 focus:ring-emerald-500"
              }`}
            />
            {nameTaken && <p className="text-xs text-red-500 mt-1 pl-1">Este nombre ya existe</p>}
          </div>

          {/* Description field */}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1.5">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="¿De qué trata este espacio?"
              rows={2}
              maxLength={120}
              style={{ resize: "none" }}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-300 text-right mt-1">{trimmedDesc.length}/120</p>
          </div>

          {/* Color row */}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">Color</label>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  title={c.label}
                  className={`w-8 h-8 rounded-full ${c.tw} flex items-center justify-center flex-shrink-0 transition-all ${
                    color === c.id ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "opacity-50 hover:opacity-80"
                  }`}
                >
                  {color === c.id && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-5 pb-8 pt-4">
          <button
            onClick={handleSubmit}
            disabled={!canCreate}
            className="w-full bg-emerald-500 text-white py-3.5 rounded-2xl text-sm hover:bg-emerald-600 active:scale-[0.98] transition-all disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Crear comunidad
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export function Communities() {
  const navigate = useNavigate();
  const { joinedCommunities, joinCommunity, leaveCommunity } = useWellbeing();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [customCommunities, setCustomCommunities] = useState<CommunityData[]>([]);
  const { comunidades: serverCommunities } = useCommunities();
  const { comunidades: searchResults, loading: loadingSearch } = useSearchCommunities(query, query.trim().length > 0);
  const searchActive = query.trim().length > 0;

  const serverItems: CommunityData[] = serverCommunities.map((community) => ({
    id: community.id,
    slug: community.slug,
    name: community.nombre,
    description: community.descripcion,
    color: community.color,
    members: 0,
    active: 0,
    newPosts: 0,
  }));

  const fallbackItems = serverItems.length > 0 ? serverItems : SEED_COMMUNITIES;
  const allCommunities = [...customCommunities, ...fallbackItems];
  const allNames = allCommunities.map((c) => c.name);

  const myCommunities = allCommunities.filter((c) => joinedCommunities.includes(c.name));
  const discoverCommunities = query.trim()
    ? [...customCommunities, ...searchResults.map((community) => ({
        id: community.id,
        slug: community.slug,
        name: community.nombre,
        description: community.descripcion,
        color: community.color,
        members: 0,
        active: 0,
        newPosts: 0,
      }))]
    : allCommunities;

  const filtered = discoverCommunities.filter(
    (c) => !joinedCommunities.includes(c.name)
  );

  const handleToggleMembership = (name: string) => {
    joinedCommunities.includes(name) ? leaveCommunity(name) : joinCommunity(name);
  };

  const slugify = (name: string) =>
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleCreate = async ({ name, description, color }: { name: string; description: string; color: string }) => {
    if (!user?.id) {
      const created: CommunityData = {
        id: undefined,
        slug: slugify(name),
        name,
        description,
        color,
        members: 1,
        active: 0,
        newPosts: 0,
        custom: true,
      };
      setCustomCommunities((prev) => [created, ...prev]);
      joinCommunity(created.name);
      setShowCreate(false);
      return;
    }

    const slug = slugify(name);
    const createdCommunity = await comunidadesService.crear(name, slug, description, user.id, color);
    if (createdCommunity) {
      const created: CommunityData = {
        id: createdCommunity.id,
        slug: createdCommunity.slug,
        name: createdCommunity.nombre,
        description: createdCommunity.descripcion,
        color: createdCommunity.color,
        members: 1,
        active: 0,
        newPosts: 0,
        custom: true,
      };
      setCustomCommunities((prev) => [created, ...prev]);
      joinCommunity(created.name);
      setShowCreate(false);
      navigate(`/communities/${created.slug}`);
    } else {
      // Fallback local creation if DB create fails.
      const fallback: CommunityData = {
        id: undefined,
        slug,
        name,
        description,
        color,
        members: 1,
        active: 0,
        newPosts: 0,
        custom: true,
      };
      setCustomCommunities((prev) => [fallback, ...prev]);
      joinCommunity(fallback.name);
      setShowCreate(false);
    }
  };

  return (
    <>
      <div className="min-h-full max-w-md mx-auto pb-6">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 p-4">
          <div className="flex items-center justify-between mb-1">
            <h1>Mis Comunidades</h1>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5 bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-sm hover:bg-emerald-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Crear
            </button>
          </div>
          <p className="text-gray-600 text-sm">Grupos pequeños, conexiones profundas</p>
        </div>

        <div className="p-4">
          {/* Search */}
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar comunidades..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
            />
          </div>

          {/* My communities */}
          <h3 className="mb-4">Tus comunidades</h3>

          {myCommunities.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-6 text-center mb-8">
              <Compass className="w-10 h-10 text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-gray-600 text-sm mb-3">
                Todavía no te has unido a ninguna comunidad.
              </p>
              <p className="text-gray-500 text-xs">
                Explora las sugerencias de abajo o crea la tuya propia.
              </p>
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {myCommunities.map((community) => (
                <div key={community.slug ?? community.name} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${getColorClasses(community.color)}`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4>{community.name}</h4>
                          {community.custom && (
                            <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
                              Tuya
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">{community.description}</p>
                      </div>
                      {community.newPosts > 0 && (
                        <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0">
                          {community.newPosts}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{community.members}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        <span>{community.active} activos</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/communities/${community.slug ?? community.name.toLowerCase().replace(/\s+/g, "-")}`)
                        }
                        className="flex-1 bg-gray-50 text-gray-700 py-2 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Ver publicaciones
                      </button>
                      <button
                        onClick={() => handleToggleMembership(community.name)}
                        className="px-4 py-2 rounded-xl text-sm border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors"
                      >
                        Salir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Discover */}
          <h3 className="mb-4">Descubre comunidades</h3>

          {searchActive && loadingSearch ? (
            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <p className="text-gray-500 text-sm">Buscando comunidades...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <p className="text-gray-500 text-sm">
                {query.trim()
                  ? "No hay comunidades que coincidan con tu búsqueda."
                  : "Ya eres miembro de todas las comunidades disponibles. 🎉"}
              </p>
              {query.trim() && (
                <button
                  onClick={() => setShowCreate(true)}
                  className="mt-3 text-emerald-600 text-sm underline underline-offset-2"
                >
                  ¿Crear "{query.trim()}"?
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((community) => (
                <div key={community.slug ?? community.name} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${getColorClasses(community.color)} rounded-full flex items-center justify-center flex-shrink-0`}
                    >
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm">{community.name}</h4>
                      <p className="text-gray-600 text-xs">{community.members} miembros</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{community.description}</p>
                  <button
                    onClick={() => handleToggleMembership(community.name)}
                    className="w-full bg-emerald-500 text-white py-2 rounded-xl hover:bg-emerald-600 transition-colors"
                  >
                    Unirse
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreate && (
        <CreateCommunitySheet
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
          existingNames={allNames}
        />
      )}
    </>
  );
}
