import { useState } from "react";
import { Image, Smile, MapPin, Users, Send, Globe } from "lucide-react";

export function Create() {
  const [content, setContent] = useState("");
  const [shareLocation, setShareLocation] = useState<"general" | "community">("general");
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const maxLength = 500;

  const communities = [
    "Mindfulness",
    "Lectura consciente",
    "Vida universitaria",
    "Creatividad",
    "Naturaleza",
    "Conversaciones profundas",
  ];

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
              className="w-full min-h-[200px] p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              maxLength={maxLength}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-500 text-sm">
                {content.length}/{maxLength}
              </span>
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
              <select
                value={selectedCommunity}
                onChange={(e) => setSelectedCommunity(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Selecciona una comunidad...</option>
                {communities.map((community) => (
                  <option key={community} value={community}>
                    {community}
                  </option>
                ))}
              </select>
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
            disabled={!content.trim() || (shareLocation === "community" && !selectedCommunity)}
            className="w-full bg-emerald-500 text-white py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            Publicar
          </button>
        </div>
    </div>
  );
}
