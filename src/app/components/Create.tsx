import { useState } from "react";
import { useNavigate } from "react-router";
import { Image, Smile, MapPin, Users, Send, Globe, CheckCircle } from "lucide-react";
import { useWellbeing } from "../contexts/WellbeingContext";
import { useAuth } from "../contexts/AuthContext";
import { addPost } from "../data/posts";
import { useCreatePublicacion } from "../../hooks/usePublications";

const MAX_LENGTH = 500;
const WARN_THRESHOLD = 450;

export function Create() {
  const { joinedCommunities } = useWellbeing();
  const [content, setContent] = useState("");
  const [shareLocation, setShareLocation] = useState<"general" | "community">("general");
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [published, setPublished] = useState(false);

  const remaining = MAX_LENGTH - content.length;
  const isOverLimit = content.length > MAX_LENGTH;
  const isNearLimit = content.length >= WARN_THRESHOLD && !isOverLimit;

  const counterColor = isOverLimit
    ? "text-red-600"
    : isNearLimit
    ? "text-orange-500"
    : "text-gray-500";

  const { user } = useAuth();
  const navigate = useNavigate();
  const { crear, loading: creating } = useCreatePublicacion();

  const canPublish =
    content.trim().length > 0 &&
    !isOverLimit &&
    (shareLocation === "general" || !!selectedCommunity);

  const handlePublish = () => {
    if (!canPublish) return;

    const authorName = user?.nombre ?? "Tú";
    const authorUsername = user?.username ? `@${user.username}` : "@tu_usuario";

    // Primero intentar guardar en la BD si hay usuario autenticado
    (async () => {
      const newPost = {
        id: Date.now(),
        author: authorName,
        username: authorUsername,
        time: "Ahora",
        content: content.trim(),
        community: shareLocation === "community" ? selectedCommunity || null : null,
        initialReactions: 0,
        initialComments: [],
        createdAt: new Date().toISOString(),
      };

      if (user?.id) {
        const res = await crear(user.id, content.trim(), shareLocation === "community" ? selectedCommunity || undefined : undefined);
        if (res.success && res.publicacion) {
          console.log("Publicación guardada en BD:", res.publicacion);
          addPost({
            ...newPost,
            synced: true,
            remoteId: res.publicacion.id,
            createdAt: res.publicacion.created_at,
          });
        } else {
          console.warn("No se pudo guardar en BD, se guarda solo localmente");
          addPost({ ...newPost, synced: false });
        }
      } else {
        // Usuario no autenticado -> persistencia local
        addPost({ ...newPost, synced: false });
      }

      setPublished(true);
      setTimeout(() => {
        setContent("");
        setShareLocation("general");
        setSelectedCommunity("");
        setPublished(false);
        navigate("/");
      }, 900);
    })();
  };

  return (
    <div className="min-h-full max-w-md mx-auto bg-white">
      <div className="border-b border-gray-200 p-4">
        <h1>Crear publicación</h1>
        <p className="text-gray-600 text-sm mt-1">
          Comparte algo significativo con la comunidad
        </p>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-2">
            ¿Qué quieres compartir?
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe algo auténtico, reflexivo o inspirador..."
            className={`w-full min-h-[200px] p-4 border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
              isOverLimit
                ? "border-red-400 focus:ring-red-400"
                : "border-gray-200 focus:ring-emerald-500"
            }`}
          />
          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-2">
              <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                <Image className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors">
                <Smile className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors">
                <MapPin className="w-5 h-5" />
              </button>
            </div>
            <div className="text-right">
              <span className={`text-sm tabular-nums ${counterColor}`}>
                {content.length}/{MAX_LENGTH}
              </span>
              {isOverLimit && (
                <p className="text-red-600 text-xs mt-0.5">
                  Excediste el límite por {-remaining} caracteres
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-2">
            ¿Dónde quieres compartir?
          </label>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => {
                setShareLocation("general");
                setSelectedCommunity("");
              }}
              className={`flex-1 p-3 rounded-xl border transition-colors flex items-center justify-center gap-2 ${
                shareLocation === "general"
                  ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                  : "bg-white border-gray-200 text-gray-700"
              }`}
            >
              <Globe className="w-4 h-4" />
              Feed General
            </button>
            <button
              onClick={() => setShareLocation("community")}
              className={`flex-1 p-3 rounded-xl border transition-colors flex items-center justify-center gap-2 ${
                shareLocation === "community"
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "bg-white border-gray-200 text-gray-700"
              }`}
            >
              <Users className="w-4 h-4" />
              Comunidad
            </button>
          </div>

          {shareLocation === "community" && (
            joinedCommunities.length > 0 ? (
              <select
                value={selectedCommunity}
                onChange={(e) => setSelectedCommunity(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Selecciona una comunidad...</option>
                {joinedCommunities.map((community) => (
                  <option key={community} value={community}>
                    {community}
                  </option>
                ))}
              </select>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800">
                Todavía no perteneces a ninguna comunidad. Únete a una desde la sección Comunidades.
              </div>
            )
          )}
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
          <h4 className="text-sm text-blue-900 mb-2">💡 Consejos para publicar</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Comparte experiencias reales y auténticas</li>
            <li>• Evita comparaciones o competencia</li>
            <li>• Contribuye algo útil o inspirador</li>
          </ul>
        </div>

        <button
          onClick={handlePublish}
          disabled={!canPublish}
          className="w-full bg-emerald-500 text-white py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {published ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Publicado
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Publicar
            </>
          )}
        </button>
      </div>
    </div>
  );
}
