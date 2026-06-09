/**
 * ProtectedRoute - Redirige a login si el usuario no está autenticado
 */
import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarded?: boolean;
}

export function ProtectedRoute({ children, requireOnboarded = false }: ProtectedRouteProps) {
  const { isLoggedIn, hasOnboarded, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  // No está logueado → ir a login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Requiere onboarding completado pero no lo está → ir a onboarding
  if (requireOnboarded && !hasOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
