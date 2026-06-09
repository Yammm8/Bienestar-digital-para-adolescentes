import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import logo from "../../imports/Bienestar_digital_logo.png";

export function Register() {
  const navigate = useNavigate();
  const { register, isLoading: authLoading } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);

  const usernameClean = username.replace(/[^a-z0-9_]/gi, "").toLowerCase();
  const pwStrong = password.length >= 8;
  const canSubmit =
    name.trim().length >= 2 &&
    usernameClean.length >= 3 &&
    email.trim().includes("@") &&
    pwStrong &&
    agreed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || loading) return;
    
    setLoading(true);
    setError("");
    
    try {
      const result = await register(name.trim(), usernameClean, email.trim(), password);
      
      if (result.success) {
        // Ir a onboarding después del registro exitoso
        navigate("/onboarding");
      } else {
        setError(result.message || "No se pudo crear la cuenta. Intenta de nuevo.");
      }
    } catch (err: any) {
      setError(err.message || "Error en el registro. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Si está cargando la sesión, mostrar un loader
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="Bienestar Digital"
            className="w-16 h-16 mb-3 drop-shadow-lg"
          />
          <h1 className="text-gray-900 text-center">Bienestar Digital</h1>
          <p className="text-gray-500 text-sm text-center mt-1">
            Únete a la red que respeta tu tiempo
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-gray-800 mb-5">Crear cuenta</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1.5">
                Nombre completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                autoComplete="name"
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1.5">
                Nombre de usuario
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                <input
                  type="text"
                  value={usernameClean}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="tu_usuario"
                  autoComplete="username"
                  maxLength={30}
                  disabled={loading}
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                autoComplete="email"
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mín. 8 caracteres"
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="flex items-center gap-1.5 mt-1.5 px-1">
                  <div className={`h-1 flex-1 rounded-full transition-colors ${password.length >= 4 ? "bg-yellow-400" : "bg-gray-200"}`} />
                  <div className={`h-1 flex-1 rounded-full transition-colors ${password.length >= 6 ? "bg-yellow-400" : "bg-gray-200"}`} />
                  <div className={`h-1 flex-1 rounded-full transition-colors ${pwStrong ? "bg-emerald-500" : "bg-gray-200"}`} />
                  <span className="text-xs text-gray-400 ml-1">{pwStrong ? "Fuerte" : "Débil"}</span>
                </div>
              )}
            </div>

            {/* Terms */}
            <button
              type="button"
              onClick={() => setAgreed((v) => !v)}
              disabled={loading}
              className="flex items-start gap-3 text-left w-full disabled:opacity-50"
            >
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${agreed ? "bg-emerald-500 border-emerald-500" : "border-gray-300"}`}>
                {agreed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </div>
              <span className="text-xs text-gray-500 leading-relaxed">
                Acepto los{" "}
                <span className="text-emerald-600">términos de uso</span> y entiendo que esta red prioriza mi bienestar digital
              </span>
            </button>

            {error && (
              <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-xl">{error}</p>
            )}

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="w-full bg-emerald-500 text-white py-3.5 rounded-2xl hover:bg-emerald-600 active:scale-[0.98] transition-all disabled:bg-gray-200 disabled:text-gray-400 flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Crear cuenta
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-emerald-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="Bienestar Digital"
            className="w-16 h-16 mb-3 drop-shadow-lg"
          />
          <h1 className="text-gray-900 text-center">Bienestar Digital</h1>
          <p className="text-gray-500 text-sm text-center mt-1">
            Únete a la red que respeta tu tiempo
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-gray-800 mb-5">Crear cuenta</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1.5">
                Nombre completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                autoComplete="name"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1.5">
                Nombre de usuario
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                <input
                  type="text"
                  value={usernameClean}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="tu_usuario"
                  autoComplete="username"
                  maxLength={30}
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                autoComplete="email"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mín. 8 caracteres"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="flex items-center gap-1.5 mt-1.5 px-1">
                  <div className={`h-1 flex-1 rounded-full transition-colors ${password.length >= 4 ? "bg-yellow-400" : "bg-gray-200"}`} />
                  <div className={`h-1 flex-1 rounded-full transition-colors ${password.length >= 6 ? "bg-yellow-400" : "bg-gray-200"}`} />
                  <div className={`h-1 flex-1 rounded-full transition-colors ${pwStrong ? "bg-emerald-500" : "bg-gray-200"}`} />
                  <span className="text-xs text-gray-400 ml-1">{pwStrong ? "Fuerte" : "Débil"}</span>
                </div>
              )}
            </div>

            {/* Terms */}
            <button
              type="button"
              onClick={() => setAgreed((v) => !v)}
              className="flex items-start gap-3 text-left w-full"
            >
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${agreed ? "bg-emerald-500 border-emerald-500" : "border-gray-300"}`}>
                {agreed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </div>
              <span className="text-xs text-gray-500 leading-relaxed">
                Acepto los{" "}
                <span className="text-emerald-600">términos de uso</span> y entiendo que esta red prioriza mi bienestar digital
              </span>
            </button>

            {error && (
              <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-xl">{error}</p>
            )}

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="w-full bg-emerald-500 text-white py-3.5 rounded-2xl hover:bg-emerald-600 active:scale-[0.98] transition-all disabled:bg-gray-200 disabled:text-gray-400 flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Crear cuenta
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-emerald-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
