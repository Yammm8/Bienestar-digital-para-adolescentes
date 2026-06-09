import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import logo from "../../imports/Bienestar_digital_logo.png";

export function Login() {
  const navigate = useNavigate();
  const { login, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = email.trim().length > 0 && password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || loading) return;
    
    setLoading(true);
    setError("");
    
    try {
      const result = await login(email.trim(), password);
      
      if (result.success) {
        // La sesión se mantendrá automáticamente
        navigate("/");
      } else {
        setError(result.message || "Correo o contraseña incorrectos. Intenta de nuevo.");
      }
    } catch (err: any) {
      setError(err.message || "Error en el login. Intenta de nuevo.");
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo + brand */}
        <div className="flex flex-col items-center mb-10">
          <img
            src={logo}
            alt="Bienestar Digital"
            className="w-20 h-20 mb-4 drop-shadow-lg"
          />
          <h1 className="text-gray-900 text-center">Bienestar Digital</h1>
          <p className="text-gray-500 text-sm text-center mt-1">
            Una red social que cuida tu tiempo
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-gray-800 mb-5">Iniciar sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Mín. 6 caracteres"
                  autoComplete="current-password"
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
            </div>

            {error && (
              <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-xl">{error}</p>
            )}

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="w-full bg-emerald-500 text-white py-3.5 rounded-2xl hover:bg-emerald-600 active:scale-[0.98] transition-all disabled:bg-gray-200 disabled:text-gray-400 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Aún no tienes cuenta?{" "}
          <Link to="/register" className="text-emerald-600 hover:underline">
            Regístrate
          </Link>
        </p>

        {/* Values note */}
        <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
          Sin algoritmos manipuladores · Sin métricas de vanidad · Tu bienestar primero
        </p>
      </div>
    </div>
  );
}

