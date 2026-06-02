import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import {
  User, Lock, Bell, Database, Palette, Info, LogOut, Trash2,
  ChevronRight, ChevronDown, Shield, Eye, EyeOff, Download,
  AlertTriangle, Check, ArrowLeft, Edit, Camera,
} from "lucide-react";

type Section = "account" | "privacy" | "notifications" | "data" | "appearance" | "about" | null;

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-emerald-500" : "bg-gray-200"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}

interface SectionHeaderProps {
  label: string;
  open: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  description?: string;
}

function SectionHeader({ label, open, onToggle, icon, description }: SectionHeaderProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
    >
      <span className="text-emerald-600">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-gray-900">{label}</div>
        {description && <div className="text-xs text-gray-500 mt-0.5">{description}</div>}
      </div>
      {open ? (
        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
      ) : (
        <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
      )}
    </button>
  );
}

export function SettingsAccount() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [openSection, setOpenSection] = useState<Section>("account");

  // Account
  const [displayName, setDisplayName] = useState("María García");
  const [username, setUsername] = useState("maria");
  const [bio, setBio] = useState("Explorando la vida consciente, un paso a la vez 🌱");
  const [email, setEmail] = useState("maria@ejemplo.com");
  const [editingAccount, setEditingAccount] = useState(false);
  const [savedAccount, setSavedAccount] = useState(false);

  // Privacy
  const [profilePublic, setProfilePublic] = useState(true);
  const [postsPublic, setPostsPublic] = useState(true);
  const [searchable, setSearchable] = useState(true);
  const [showUsageStats, setShowUsageStats] = useState(false);
  const [allowTagging, setAllowTagging] = useState(true);

  // Notifications
  const [notifComments, setNotifComments] = useState(true);
  const [notifReactions, setNotifReactions] = useState(false);
  const [notifCommunity, setNotifCommunity] = useState(true);
  const [notifWellbeing, setNotifWellbeing] = useState(true);
  const [notifNewPosts, setNotifNewPosts] = useState(false);
  const [notifDigest, setNotifDigest] = useState(true);

  // Appearance
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [compactMode, setCompactMode] = useState(false);

  // Danger zone
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [dataDownloaded, setDataDownloaded] = useState(false);

  const toggle = (s: Section) => setOpenSection((prev) => (prev === s ? null : s));

  const saveAccount = () => {
    setEditingAccount(false);
    setSavedAccount(true);
    setTimeout(() => setSavedAccount(false), 2000);
  };

  return (
    <div className="min-h-full max-w-md mx-auto pb-8 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1">Configuración</h1>
        {savedAccount && (
          <span className="flex items-center gap-1 text-emerald-600 text-sm">
            <Check className="w-4 h-4" /> Guardado
          </span>
        )}
      </div>

      <div className="p-4 space-y-3">

        {/* ── ACCOUNT ── */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <SectionHeader
            label="Cuenta"
            description="Nombre, foto, bio y email"
            icon={<User className="w-5 h-5" />}
            open={openSection === "account"}
            onToggle={() => toggle("account")}
          />
          {openSection === "account" && (
            <div className="px-4 pb-4 space-y-4 border-t border-gray-50">
              {/* Avatar */}
              <div className="flex flex-col items-center pt-4 pb-2">
                <div className="relative mb-3">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-emerald-500" />
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow">
                    <Camera className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
                <span className="text-xs text-gray-500">Toca para cambiar la foto</span>
              </div>

              {editingAccount ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Nombre visible</label>
                    <input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Nombre de usuario</label>
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-300">
                      <span className="pl-3 text-gray-400 text-sm">@</span>
                      <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
                        className="flex-1 px-2 py-2 text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Biografía</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      maxLength={160}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    />
                    <div className="text-right text-xs text-gray-400">{bio.length}/160</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setEditingAccount(false)}
                      className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={saveAccount}
                      className="flex-1 bg-emerald-500 text-white py-2 rounded-xl text-sm hover:bg-emerald-600 transition-colors"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Nombre</span>
                      <span className="text-gray-800">{displayName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Usuario</span>
                      <span className="text-gray-800">@{username}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Email</span>
                      <span className="text-gray-800">{email}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500 block mb-1">Bio</span>
                      <span className="text-gray-800">{bio}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingAccount(true)}
                    className="w-full flex items-center justify-center gap-2 border border-emerald-200 text-emerald-700 py-2 rounded-xl text-sm hover:bg-emerald-50 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Editar información
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── PRIVACY ── */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <SectionHeader
            label="Privacidad"
            description="Quién puede ver tu contenido"
            icon={<Lock className="w-5 h-5" />}
            open={openSection === "privacy"}
            onToggle={() => toggle("privacy")}
          />
          {openSection === "privacy" && (
            <div className="px-4 pb-4 space-y-4 border-t border-gray-50 pt-3">
              <SettingRow
                label="Perfil público"
                description="Cualquiera puede ver tu perfil"
                value={profilePublic}
                onChange={setProfilePublic}
                icon={<Eye className="w-4 h-4" />}
              />
              <SettingRow
                label="Publicaciones públicas"
                description="Tus posts son visibles sin seguirte"
                value={postsPublic}
                onChange={setPostsPublic}
                icon={<Eye className="w-4 h-4" />}
              />
              <SettingRow
                label="Aparecer en búsquedas"
                description="Tu perfil puede encontrarse"
                value={searchable}
                onChange={setSearchable}
                icon={<Shield className="w-4 h-4" />}
              />
              <SettingRow
                label="Compartir estadísticas de uso"
                description="Otros pueden ver tu tiempo de bienestar"
                value={showUsageStats}
                onChange={setShowUsageStats}
                icon={<Eye className="w-4 h-4" />}
              />
              <SettingRow
                label="Permitir etiquetas"
                description="Otros pueden mencionarte en posts"
                value={allowTagging}
                onChange={setAllowTagging}
                icon={<Shield className="w-4 h-4" />}
              />
              {!profilePublic && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm text-amber-800">
                  Tu perfil es privado. Solo tus contactos aprobados pueden ver tu contenido.
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── NOTIFICATIONS ── */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <SectionHeader
            label="Notificaciones"
            description="Qué avisos quieres recibir"
            icon={<Bell className="w-5 h-5" />}
            open={openSection === "notifications"}
            onToggle={() => toggle("notifications")}
          />
          {openSection === "notifications" && (
            <div className="px-4 pb-4 space-y-4 border-t border-gray-50 pt-3">
              <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-800">
                Las notificaciones están diseñadas para ser útiles, no adictivas. Nunca usamos
                notificaciones para generar ansiedad o FOMO.
              </div>
              <SettingRow
                label="Comentarios en tus posts"
                value={notifComments}
                onChange={setNotifComments}
              />
              <SettingRow
                label="Reacciones"
                description="Solo un resumen diario, sin conteo en tiempo real"
                value={notifReactions}
                onChange={setNotifReactions}
              />
              <SettingRow
                label="Actividad en comunidades"
                description="Nuevos posts en tus comunidades"
                value={notifCommunity}
                onChange={setNotifCommunity}
              />
              <SettingRow
                label="Recordatorios de bienestar"
                description="Pausas y límites de tiempo"
                value={notifWellbeing}
                onChange={setNotifWellbeing}
              />
              <SettingRow
                label="Nuevas publicaciones de contactos"
                description="Aviso inmediato (consume más atención)"
                value={notifNewPosts}
                onChange={setNotifNewPosts}
              />
              <SettingRow
                label="Resumen semanal"
                description="Un correo con tu actividad de la semana"
                value={notifDigest}
                onChange={setNotifDigest}
              />
            </div>
          )}
        </div>

        {/* ── DATA ── */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <SectionHeader
            label="Datos y transparencia"
            description="Tus datos, tus derechos"
            icon={<Database className="w-5 h-5" />}
            open={openSection === "data"}
            onToggle={() => toggle("data")}
          />
          {openSection === "data" && (
            <div className="px-4 pb-4 space-y-4 border-t border-gray-50 pt-3">
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-sm text-emerald-900 space-y-1.5">
                <p className="font-medium">Qué recopilamos</p>
                <ul className="list-disc list-inside space-y-1 text-emerald-800">
                  <li>Tiempo de uso dentro de la app</li>
                  <li>Contenido que publicas (solo tú puedes borrarlo)</li>
                  <li>Comunidades a las que te unes</li>
                  <li>Configuración de bienestar</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700 space-y-1">
                <p className="font-medium text-gray-800">Lo que NO hacemos</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>No vendemos tus datos a terceros</li>
                  <li>No creamos perfiles psicológicos para publicidad</li>
                  <li>No rastreamos tu actividad fuera de la app</li>
                  <li>No usamos tus datos para manipular tu comportamiento</li>
                </ul>
              </div>

              <button
                onClick={() => { setDataDownloaded(true); setTimeout(() => setDataDownloaded(false), 3000); }}
                className="w-full flex items-center justify-center gap-2 border border-emerald-200 text-emerald-700 py-3 rounded-xl text-sm hover:bg-emerald-50 transition-colors"
              >
                {dataDownloaded ? (
                  <><Check className="w-4 h-4" /> Descarga preparada</>
                ) : (
                  <><Download className="w-4 h-4" /> Descargar mis datos</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* ── APPEARANCE ── */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <SectionHeader
            label="Apariencia y accesibilidad"
            description="Ajusta la experiencia visual"
            icon={<Palette className="w-5 h-5" />}
            open={openSection === "appearance"}
            onToggle={() => toggle("appearance")}
          />
          {openSection === "appearance" && (
            <div className="px-4 pb-4 space-y-4 border-t border-gray-50 pt-3">
              <SettingRow
                label="Reducir movimiento"
                description="Menos animaciones en la interfaz"
                value={reduceMotion}
                onChange={setReduceMotion}
              />
              <SettingRow
                label="Alto contraste"
                description="Mejora la legibilidad del texto"
                value={highContrast}
                onChange={setHighContrast}
              />
              <SettingRow
                label="Texto grande"
                description="Aumenta el tamaño de letra base"
                value={largeText}
                onChange={setLargeText}
              />
              <SettingRow
                label="Modo compacto"
                description="Más contenido en pantalla"
                value={compactMode}
                onChange={setCompactMode}
              />
              <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500">
                Modo oscuro próximamente. Usaremos el modo del sistema operativo cuando esté disponible.
              </div>
            </div>
          )}
        </div>

        {/* ── ABOUT ── */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <SectionHeader
            label="Sobre la app"
            description="Principios éticos y versión"
            icon={<Info className="w-5 h-5" />}
            open={openSection === "about"}
            onToggle={() => toggle("about")}
          />
          {openSection === "about" && (
            <div className="px-4 pb-4 space-y-4 border-t border-gray-50 pt-3">
              <div className="text-center py-3">
                <div className="text-3xl mb-2">🌱</div>
                <div className="text-gray-800 mb-0.5">Red Social Ética</div>
                <div className="text-gray-500 text-sm">Versión 1.0.0-beta</div>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <Principle
                  emoji="⏳"
                  title="Tiempo consciente"
                  body="Diseñada para que uses la app menos, no más. Las métricas te muestran tu uso real."
                />
                <Principle
                  emoji="🚫"
                  title="Sin algoritmos manipuladores"
                  body="El feed es cronológico. No hay sistema de recomendación que maximice tu tiempo de pantalla."
                />
                <Principle
                  emoji="🫂"
                  title="Conexión real"
                  body="No mostramos conteos de seguidores ni likes acumulados. Las conexiones se valoran por su profundidad."
                />
                <Principle
                  emoji="🔒"
                  title="Privacidad por diseño"
                  body="Tus datos son tuyos. No hay publicidad personalizada ni venta de información."
                />
                <Principle
                  emoji="🌿"
                  title="Para adolescentes"
                  body="Diseñada específicamente para jóvenes de 14–17 años, en colaboración con expertos en bienestar digital."
                />
              </div>
              <div className="border-t border-gray-100 pt-3 text-center">
                <p className="text-xs text-gray-400">
                  Hecho con intención · Código abierto · Sin inversores de riesgo
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── DANGER ZONE ── */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-gray-50">
            <span className="text-sm text-gray-500">Zona de peligro</span>
          </div>

          {/* Logout */}
          {!showLogoutConfirm ? (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <LogOut className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">Cerrar sesión</span>
            </button>
          ) : (
            <div className="px-4 py-3 space-y-2">
              <p className="text-sm text-gray-700">¿Seguro que quieres cerrar sesión?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => { logout(); navigate("/login"); }}
                  className="flex-1 bg-gray-600 text-white py-2 rounded-xl text-sm hover:bg-gray-700"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}

          {/* Delete account */}
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 transition-colors border-t border-gray-50"
            >
              <Trash2 className="w-5 h-5 text-red-400" />
              <span className="text-red-600">Eliminar cuenta</span>
            </button>
          ) : (
            <div className="px-4 py-3 space-y-2 border-t border-gray-50">
              <div className="flex items-start gap-2 bg-red-50 rounded-xl p-3">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">
                  Esta acción es <strong>permanente e irreversible</strong>. Se eliminarán todos tus posts, datos y membresías en comunidades.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  className="flex-1 bg-red-500 text-white py-2 rounded-xl text-sm hover:bg-red-600 transition-colors"
                >
                  Eliminar cuenta
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

interface SettingRowProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  icon?: React.ReactNode;
}

function SettingRow({ label, description, value, onChange, icon }: SettingRowProps) {
  return (
    <div className="flex items-center gap-3">
      {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
      <div className="flex-1 min-w-0">
        <div className="text-sm text-gray-800">{label}</div>
        {description && <div className="text-xs text-gray-500 mt-0.5">{description}</div>}
      </div>
      <Toggle checked={value} onChange={onChange} />
    </div>
  );
}

interface PrincipleProps {
  emoji: string;
  title: string;
  body: string;
}

function Principle({ emoji, title, body }: PrincipleProps) {
  return (
    <div className="flex gap-3">
      <span className="text-xl shrink-0">{emoji}</span>
      <div>
        <p className="text-gray-800 mb-0.5">{title}</p>
        <p className="text-gray-600 text-xs">{body}</p>
      </div>
    </div>
  );
}
