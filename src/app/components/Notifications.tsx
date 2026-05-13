import { Heart, MessageCircle, UserPlus, Users, Settings } from "lucide-react";

export function Notifications() {
  const notifications = [
    {
      id: 1,
      type: "reaction",
      icon: Heart,
      color: "emerald",
      message: "A 12 personas les gustó tu publicación sobre mindfulness",
      time: "Hace 3 horas",
      unread: true,
    },
    {
      id: 2,
      type: "comment",
      icon: MessageCircle,
      color: "blue",
      message: "Ana Torres comentó en tu publicación",
      preview: "Me encantó lo que compartiste, yo también lo intento...",
      time: "Hace 5 horas",
      unread: true,
    },
    {
      id: 3,
      type: "community",
      icon: Users,
      color: "purple",
      message: "8 publicaciones nuevas en Lectura consciente",
      time: "Hace 6 horas",
      unread: false,
    },
    {
      id: 4,
      type: "follow",
      icon: UserPlus,
      color: "teal",
      message: "Carlos Ruiz comenzó a seguirte",
      time: "Ayer",
      unread: false,
    },
  ];

  const getIconColor = (color: string) => {
    const colors = {
      emerald: "bg-emerald-100 text-emerald-600",
      blue: "bg-blue-100 text-blue-600",
      purple: "bg-purple-100 text-purple-600",
      teal: "bg-teal-100 text-teal-600",
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="min-h-full max-w-md mx-auto pb-6">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 p-4">
        <div className="flex items-center justify-between mb-1">
          <h1>Notificaciones</h1>
          <button className="text-gray-500 hover:text-gray-700">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-600 text-sm">
          Agrupadas y entregadas cada hora
        </p>
      </div>

      <div className="p-4">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
          <h4 className="text-sm text-blue-900 mb-2">🔔 Notificaciones conscientes</h4>
          <p className="text-sm text-blue-800">
            No enviamos notificaciones en tiempo real. Las agrupamos cada hora para que no interrumpan tu día.
          </p>
        </div>

        <div className="space-y-1">
          {notifications.map((notif) => {
            const Icon = notif.icon;
            return (
              <div
                key={notif.id}
                className={`p-4 rounded-xl transition-colors ${
                  notif.unread
                    ? "bg-emerald-50 border border-emerald-100"
                    : "bg-white border border-gray-100"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(notif.color)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm mb-1">{notif.message}</p>
                    {notif.preview && (
                      <p className="text-gray-600 text-xs mb-2 italic">
                        "{notif.preview}"
                      </p>
                    )}
                    <p className="text-gray-500 text-xs">{notif.time}</p>
                  </div>
                  {notif.unread && (
                    <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <button className="text-emerald-600 hover:text-emerald-700 text-sm">
            Marcar todas como leídas
          </button>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 mt-6">
          <h4 className="mb-2">⚙️ Personaliza tus notificaciones</h4>
          <p className="text-gray-700 text-sm mb-3">
            Decide qué notificaciones quieres recibir y con qué frecuencia.
          </p>
          <button className="bg-purple-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-purple-600 transition-colors">
            Configurar
          </button>
        </div>
      </div>
    </div>
  );
}
