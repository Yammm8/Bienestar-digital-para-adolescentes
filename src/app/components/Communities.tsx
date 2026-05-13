import { Users, TrendingUp, MessageCircle, Settings, Search } from "lucide-react";
import { useNavigate } from "react-router";

export function Communities() {
  const navigate = useNavigate();

  const myCommunities = [
    {
      name: "Mindfulness",
      members: 234,
      active: 45,
      description: "Prácticas de atención plena y vida consciente",
      color: "emerald",
      newPosts: 8,
    },
    {
      name: "Lectura consciente",
      members: 189,
      active: 32,
      description: "Compartimos libros que nos transforman",
      color: "blue",
      newPosts: 5,
    },
    {
      name: "Vida universitaria",
      members: 312,
      active: 67,
      description: "Apoyo mutuo para estudiantes",
      color: "purple",
      newPosts: 12,
    },
  ];

  const suggested = [
    {
      name: "Creatividad",
      members: 156,
      description: "Arte, música y expresión auténtica",
      color: "orange",
    },
    {
      name: "Naturaleza",
      members: 201,
      description: "Conexión con el mundo natural",
      color: "green",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: "from-emerald-400 to-emerald-600",
      blue: "from-blue-400 to-blue-600",
      purple: "from-purple-400 to-purple-600",
      orange: "from-orange-400 to-orange-600",
      green: "from-green-400 to-green-600",
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="min-h-full max-w-md mx-auto pb-6">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 p-4">
        <h1 className="mb-1">Mis Comunidades</h1>
        <p className="text-gray-600 text-sm">
          Grupos pequeños, conexiones profundas
        </p>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar comunidades..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        <h3 className="mb-4">Tus comunidades</h3>
        <div className="space-y-4 mb-8">
          {myCommunities.map((community) => (
            <div key={community.name} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${getColorClasses(community.color)}`} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="mb-1">{community.name}</h4>
                    <p className="text-gray-600 text-sm">{community.description}</p>
                  </div>
                  {community.newPosts > 0 && (
                    <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
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

                <button
                  onClick={() => navigate(`/communities/${community.name.toLowerCase().replace(/\s+/g, '-')}`)}
                  className="w-full bg-gray-50 text-gray-700 py-2 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Ver publicaciones
                </button>
              </div>
            </div>
          ))}
        </div>

        <h3 className="mb-4">Descubre comunidades</h3>
        <div className="space-y-3">
          {suggested.map((community) => (
            <div key={community.name} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-12 h-12 bg-gradient-to-br ${getColorClasses(community.color)} rounded-full flex items-center justify-center`}>
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm">{community.name}</h4>
                  <p className="text-gray-600 text-xs">{community.members} miembros</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">{community.description}</p>
              <button className="w-full bg-emerald-500 text-white py-2 rounded-xl hover:bg-emerald-600 transition-colors">
                Unirse
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
