import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import {
  User, Lock, Bell, Database, Palette, Info, LogOut, Trash2,
  ChevronRight, ChevronDown, Shield, Eye, Download,
  AlertTriangle, Check, ArrowLeft, Edit, Camera, Loader2,
} from "lucide-react";
import {
  perfilService,
  privacidadService,
  notificacionesConfigService,
  aparienciaService,
} from "../../services/settings";
import type {
  ConfiguracionPrivacidad,
  ConfiguracionNotificaciones,
  ConfiguracionApariencia,
} from "../../types/database";

type Section = "account" | "privacy" | "notifications" | "data" | "appearance" | "about" | null;

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
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

function SectionHeader({
  label, open, onToggle, icon, description,
}: {
  label: string; open: boolean; onToggle: () => void;
  icon: React.ReactNode; description?: string;
}) {
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
      {open
        ? <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        : <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />}
    </button>
  );
}

function SettingRow({
  label, description, value, onChange, icon, saving,
}: {
  label: string; description?: string; value: boolean;
  onChange: (v: boolean) => void; icon?: React.ReactNode; saving?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
      <div className="flex-1 min-w-0">
        <div className="text-sm text-gray-800">{label}</div>
        {description && <div className="text-xs text-gray-500 mt-0.5">{description}</div>}
      </div>
      {saving
        ? <Loader2 className="w-4 h-4 text-gray-300 animate-spin" />
        : <Toggle checked={value} onChange={onChange} />}
    </div>
  );
}

export function SettingsAccount() {
  const navigate = useNavigate();
  const { user, authUser, logout, updateUserProfile, isLoading: authLoading } = useAuth();
  const [openSection, setOpenSection] = useState<Section>("account");
  const [loggingOut, setLoggingOut] = useState(false);

  // ── Estado de carga global ──────────────────────────────────────────────
  const [loadingSettings, setLoadingSettings] = useState(true);

  // ── Cuenta ──────────────────────────────────────────────────────────────
  const [displayName, setDisplayName] = useState(user?.nombre ?? "");
  const [username, setUsername]       = useState(user?.username ?? "");
  const [bio, setBio]                 = useState(user?.bio ?? "");
  const [email]                       = useState(authUser?.email ?? "");
  const [editingAccount, setEditingAccount] = useState(false);
  const [savingAccount, setSavingAccount]   = useState(false);
  const [savedAccount, setSavedAccount]     = useState(false);
  const [accountError, setAccountError]     = useState<string | null>(null);

  // ── Privacidad ──────────────────────────────────────────────────────────
  const [privacy, setPrivacy]         = useState<ConfiguracionPrivacidad | null>(null);
  const [savingPrivacy, setSavingPrivacy] = useState<keyof ConfiguracionPrivacidad | null>(null);

  // ── Notificaciones ──────────────────────────────────────────────────────
  const [notif, setNotif]             = useState<ConfiguracionNotificaciones | null>(null);
  const [savingNotif, setSavingNotif] = useState<keyof ConfiguracionNotificaciones | null>(null);

  // ── Apariencia ──────────────────────────────────────────────────────────
  const [apariencia, setApariencia]   = useState<ConfiguracionApariencia | null>(null);
  const [savingApar, setSavingApar]   = useState<keyof ConfiguracionApariencia | null>(null);

  // ── Danger zone ─────────────────────────────────────────────────────────
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [dataDownloaded, setDataDownloaded]       = useState(false);

  const toggle = (s: Section) => setOpenSection((prev) => (prev === s ? null : s));

  // ── Cargar todas las configs al montar ──────────────────────────────────
  useEffect(() => {
    if (!user?.id) return;
    const userId = user.id;

    Promise.all([
      privacidadService.obtener(userId),
      notificacionesConfigService.obtener(userId),
      aparienciaService.obtener(userId),
    ]).then(([priv, notifData, apar]) => {
      if (priv)      setPrivacy(priv);
      if (notifData) setNotif(notifData);
      if (apar)      setApariencia(apar);
    }).finally(() => setLoadingSettings(false));
  }, [user?.id]);

  // Sincronizar campos de cuenta si el user del contexto cambia
  useEffect(() => {
    setDisplayName(user?.nombre ?? "");
    setUsername(user?.username ?? "");
    setBio(user?.bio ?? "");
  }, [user]);

  // ── Guardar perfil ──────────────────────────────────────────────────────
  const saveAccount = async () => {
    if (!user?.id) return;
    setSavingAccount(true);
    setAccountError(null);
    const updated = await perfilService.actualizar(user.id, {
      nombre: displayName.trim(),
      username: username.trim(),
      bio: bio.trim() || undefined,
    });
    setSavingAccount(false);
    if (updated) {
      updateUserProfile(updated);
      setEditingAccount(false);
      setSavedAccount(true);
      setTimeout(() => setSavedAccount(false), 2000);
    } else {
      setAccountError("No se pudo guardar. Verifica que el nombre de usuario no esté en uso.");
    }
  };

  // ── Helper: actualizar un toggle de privacidad ──────────────────────────
  const updatePrivacy = useCallback(async (
    campo: keyof Omit<ConfiguracionPrivacidad, 'id_usuario' | 'updated_at'>,
    valor: boolean
  ) => {
    if (!user?.id || !privacy) return;
    setPrivacy((prev) => prev ? { ...prev, [campo]: valor } : prev); // optimistic
    setSavingPrivacy(campo);
    const updated = await privacidadService.actualizar(user.id, { [campo]: valor });
    setSavingPrivacy(null);
    if (updated) setPrivacy(updated);
    else setPrivacy((prev) => prev ? { ...prev, [campo]: !valor } : prev); // revert
  }, [user?.id, privacy]);

  // ── Helper: actualizar un toggle de notificaciones ──────────────────────
  const updateNotif = useCallback(async (
    campo: keyof Omit<ConfiguracionNotificaciones, 'id_usuario' | 'updated_at'>,
    valor: boolean
  ) => {
    if (!user?.id || !notif) return;
    setNotif((prev) => prev ? { ...prev, [campo]: valor } : prev);
    setSavingNotif(campo);
    const updated = await notificacionesConfigService.actualizar(user.id, { [campo]: valor });
    setSavingNotif(null);
    if (updated) setNotif(updated);
    else setNotif((prev) => prev ? { ...prev, [campo]: !valor } : prev);
  }, [user?.id, notif]);

  // ── Helper: actualizar un toggle de apariencia ──────────────────────────
  const updateApariencia = useCallback(async (
    campo: keyof Omit<ConfiguracionApariencia, 'id_usuario' | 'updated_at'>,
    valor: boolean
  ) => {
    if (!user?.id || !apariencia) return;
    setApariencia((prev) => prev ? { ...prev, [campo]: valor } : prev);
    setSavingApar(campo);
    const updated = await aparienciaService.actualizar(user.id, { [campo]: valor });
    setSavingApar(null);
    if (updated) setApariencia(updated);
    else setApariencia((prev) => prev ? { ...prev, [campo]: !valor } : prev);
  }, [user?.id, apariencia]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Error en logout:", err);
      setShowLogoutConfirm(false);
    } finally {
      setLoggingOut(false);
    }
  };

  if (loadingSettings && !privacy) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
      </div>
    );
  }

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

        {/* ── CUENTA ── */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <SectionHeader
            label="Cuenta" description="Nombre, foto, bio y email"
            icon={<User className="w-5 h-5" />}
            open={openSection === "account"} onToggle={() => toggle("account")}
          />
          {openSection === "account" && (
            <div className="px-4 pb-4 space-y-4 border-t border-gray-50">
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
                      disabled
                      className="w-full border border-gray-100 bg-gray-50 rounded-xl px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1">El email se cambia desde Supabase Auth.</p>
                  </div>
                  {accountError && (
                    <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2">{accountError}</p>
                  )}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => { setEditingAccount(false); setAccountError(null); }}
                      className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={saveAccount}
                      disabled={savingAccount}
                      className="flex-1 bg-emerald-500 text-white py-2 rounded-xl text-sm hover:bg-emerald-600 disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {savingAccount && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      Guardar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Nombre</span>
                      <span className="text-gray-800">{displayName || "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Usuario</span>
                      <span className="text-gray-800">@{username || "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Email</span>
                      <span className="text-gray-800">{email || "—"}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500 block mb-1">Bio</span>
                      <span className="text-gray-800">{bio || <span className="text-gray-400 italic">Sin bio aún</span>}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingAccount(true)}
                    className="w-full flex items-center justify-center gap-2 border border-emerald-200 text-emerald-700 py-2 rounded-xl text-sm hover:bg-emerald-50 transition-colors"
                  >
                    <Edit className="w-4 h-4" /> Editar información
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── PRIVACIDAD ── */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <SectionHeader
            label="Privacidad" description="Quién puede ver tu contenido"
            icon={<Lock className="w-5 h-5" />}
            open={openSection === "privacy"} onToggle={() => toggle("privacy")}
          />
          {openSection === "privacy" && (
            <div className="px-4 pb-4 space-y-4 border-t border-gray-50 pt-3">
              {!privacy ? (
                <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 text-gray-300 animate-spin" /></div>
              ) : (
                <>
                  <SettingRow
                    label="Perfil público"
                    description="Cualquiera puede ver tu perfil"
                    value={privacy.perfil_publico}
                    onChange={(v) => updatePrivacy('perfil_publico', v)}
                    saving={savingPrivacy === 'perfil_publico'}
                    icon={<Eye className="w-4 h-4" />}
                  />
                  <SettingRow
                    label="Publicaciones públicas"
                    description="Tus posts son visibles en el feed general"
                    value={privacy.publicaciones_publicas}
                    onChange={(v) => updatePrivacy('publicaciones_publicas', v)}
                    saving={savingPrivacy === 'publicaciones_publicas'}
                    icon={<Eye className="w-4 h-4" />}
                  />
                  <SettingRow
                    label="Aparecer en búsquedas"
                    description="Tu perfil puede encontrarse"
                    value={privacy.aparecer_en_busqueda}
                    onChange={(v) => updatePrivacy('aparecer_en_busqueda', v)}
                    saving={savingPrivacy === 'aparecer_en_busqueda'}
                    icon={<Shield className="w-4 h-4" />}
                  />
                  <SettingRow
                    label="Compartir estadísticas de uso"
                    description="Otros pueden ver tu tiempo de bienestar"
                    value={privacy.mostrar_estadisticas}
                    onChange={(v) => updatePrivacy('mostrar_estadisticas', v)}
                    saving={savingPrivacy === 'mostrar_estadisticas'}
                    icon={<Eye className="w-4 h-4" />}
                  />
                  <SettingRow
                    label="Permitir etiquetas"
                    description="Otros pueden mencionarte en posts"
                    value={privacy.permitir_etiquetas}
                    onChange={(v) => updatePrivacy('permitir_etiquetas', v)}
                    saving={savingPrivacy === 'permitir_etiquetas'}
                    icon={<Shield className="w-4 h-4" />}
                  />
                  {!privacy.perfil_publico && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm text-amber-800">
                      Tu perfil es privado. Tus publicaciones no aparecerán en el feed de otros usuarios.
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* ── NOTIFICACIONES ── */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <SectionHeader
            label="Notificaciones" description="Qué avisos quieres recibir"
            icon={<Bell className="w-5 h-5" />}
            open={openSection === "notifications"} onToggle={() => toggle("notifications")}
          />
          {openSection === "notifications" && (
            <div className="px-4 pb-4 space-y-4 border-t border-gray-50 pt-3">
              <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-800">
                Las notificaciones están diseñadas para ser útiles, no adictivas.
              </div>
              {!notif ? (
                <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 text-gray-300 animate-spin" /></div>
              ) : (
                <>
                  <SettingRow
                    label="Comentarios en tus posts"
                    value={notif.notif_comentarios}
                    onChange={(v) => updateNotif('notif_comentarios', v)}
                    saving={savingNotif === 'notif_comentarios'}
                  />
                  <SettingRow
                    label="Reacciones"
                    description="Solo un resumen diario, sin conteo en tiempo real"
                    value={notif.notif_reacciones}
                    onChange={(v) => updateNotif('notif_reacciones', v)}
                    saving={savingNotif === 'notif_reacciones'}
                  />
                  <SettingRow
                    label="Actividad en comunidades"
                    description="Nuevos posts en tus comunidades"
                    value={notif.notif_comunidades}
                    onChange={(v) => updateNotif('notif_comunidades', v)}
                    saving={savingNotif === 'notif_comunidades'}
                  />
                  <SettingRow
                    label="Recordatorios de bienestar"
                    description="Pausas y límites de tiempo"
                    value={notif.notif_recordatorios_bienestar}
                    onChange={(v) => updateNotif('notif_recordatorios_bienestar', v)}
                    saving={savingNotif === 'notif_recordatorios_bienestar'}
                  />
                  <SettingRow
                    label="Nuevos seguidores"
                    value={notif.notif_nuevos_seguidores}
                    onChange={(v) => updateNotif('notif_nuevos_seguidores', v)}
                    saving={savingNotif === 'notif_nuevos_seguidores'}
                  />
                  <SettingRow
                    label="Resumen semanal"
                    description="Un correo con tu actividad de la semana"
                    value={notif.notif_resumen_diario}
                    onChange={(v) => updateNotif('notif_resumen_diario', v)}
                    saving={savingNotif === 'notif_resumen_diario'}
                  />
                </>
              )}
            </div>
          )}
        </div>

        {/* ── DATOS ── */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <SectionHeader
            label="Datos y transparencia" description="Tus datos, tus derechos"
            icon={<Database className="w-5 h-5" />}
            open={openSection === "data"} onToggle={() => toggle("data")}
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
                {dataDownloaded
                  ? <><Check className="w-4 h-4" /> Descarga preparada</>
                  : <><Download className="w-4 h-4" /> Descargar mis datos</>}
              </button>
            </div>
          )}
        </div>

        {/* ── APARIENCIA ── */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <SectionHeader
            label="Apariencia y accesibilidad" description="Ajusta la experiencia visual"
            icon={<Palette className="w-5 h-5" />}
            open={openSection === "appearance"} onToggle={() => toggle("appearance")}
          />
          {openSection === "appearance" && (
            <div className="px-4 pb-4 space-y-4 border-t border-gray-50 pt-3">
              {!apariencia ? (
                <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 text-gray-300 animate-spin" /></div>
              ) : (
                <>
                  <SettingRow
                    label="Reducir movimiento" description="Menos animaciones en la interfaz"
                    value={apariencia.reducir_movimiento}
                    onChange={(v) => updateApariencia('reducir_movimiento', v)}
                    saving={savingApar === 'reducir_movimiento'}
                  />
                  <SettingRow
                    label="Alto contraste" description="Mejora la legibilidad del texto"
                    value={apariencia.alto_contraste}
                    onChange={(v) => updateApariencia('alto_contraste', v)}
                    saving={savingApar === 'alto_contraste'}
                  />
                  <SettingRow
                    label="Texto grande" description="Aumenta el tamaño de letra base"
                    value={apariencia.texto_grande}
                    onChange={(v) => updateApariencia('texto_grande', v)}
                    saving={savingApar === 'texto_grande'}
                  />
                  <SettingRow
                    label="Modo compacto" description="Más contenido en pantalla"
                    value={apariencia.modo_compacto}
                    onChange={(v) => updateApariencia('modo_compacto', v)}
                    saving={savingApar === 'modo_compacto'}
                  />
                  <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500">
                    Modo oscuro próximamente. Usaremos el modo del sistema operativo cuando esté disponible.
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* ── SOBRE LA APP ── */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <SectionHeader
            label="Sobre la app" description="Principios éticos y versión"
            icon={<Info className="w-5 h-5" />}
            open={openSection === "about"} onToggle={() => toggle("about")}
          />
          {openSection === "about" && (
            <div className="px-4 pb-4 space-y-4 border-t border-gray-50 pt-3">
              <div className="text-center py-3">
                <div className="text-3xl mb-2">🌱</div>
                <div className="text-gray-800 mb-0.5">Red Social Ética</div>
                <div className="text-gray-500 text-sm">Versión 1.0.0-beta</div>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                {[
                  { emoji: "⏳", title: "Tiempo consciente", body: "Diseñada para que uses la app menos, no más." },
                  { emoji: "🚫", title: "Sin algoritmos manipuladores", body: "El feed es cronológico, sin sistema de recomendación." },
                  { emoji: "🫂", title: "Conexión real", body: "No mostramos conteos de seguidores ni likes acumulados." },
                  { emoji: "🔒", title: "Privacidad por diseño", body: "Tus datos son tuyos. Sin publicidad personalizada." },
                  { emoji: "🌿", title: "Para adolescentes", body: "Diseñada para jóvenes de 14–17 años." },
                ].map(({ emoji, title, body }) => (
                  <div key={title} className="flex gap-3">
                    <span className="text-xl shrink-0">{emoji}</span>
                    <div>
                      <p className="text-gray-800 mb-0.5">{title}</p>
                      <p className="text-gray-600 text-xs">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 text-center">
                <p className="text-xs text-gray-400">Hecho con intención · Sin inversores de riesgo</p>
              </div>
            </div>
          )}
        </div>

        {/* ── ZONA DE PELIGRO ── */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-gray-50">
            <span className="text-sm text-gray-500">Zona de peligro</span>
          </div>
          {!showLogoutConfirm ? (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              disabled={loggingOut || authLoading}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <LogOut className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">Cerrar sesión</span>
            </button>
          ) : (
            <div className="px-4 py-3 space-y-2">
              <p className="text-sm text-gray-700">¿Seguro que quieres cerrar sesión?</p>
              <div className="flex gap-2">
                <button onClick={() => setShowLogoutConfirm(false)} disabled={loggingOut}
                  className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm hover:bg-gray-50 disabled:opacity-50">
                  Cancelar
                </button>
                <button onClick={handleLogout} disabled={loggingOut}
                  className="flex-1 bg-gray-600 text-white py-2 rounded-xl text-sm hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center gap-2">
                  {loggingOut
                    ? <><span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Cerrando...</>
                    : "Cerrar sesión"}
                </button>
              </div>
            </div>
          )}
          {!showDeleteConfirm ? (
            <button onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 transition-colors border-t border-gray-50">
              <Trash2 className="w-5 h-5 text-red-400" />
              <span className="text-red-600">Eliminar cuenta</span>
            </button>
          ) : (
            <div className="px-4 py-3 space-y-2 border-t border-gray-50">
              <div className="flex items-start gap-2 bg-red-50 rounded-xl p-3">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">
                  Esta acción es <strong>permanente e irreversible</strong>. Se eliminarán todos tus posts, datos y membresías.
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm hover:bg-gray-50">
                  Cancelar
                </button>
                <button className="flex-1 bg-red-500 text-white py-2 rounded-xl text-sm hover:bg-red-600 transition-colors">
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