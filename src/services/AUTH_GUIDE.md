# Guía de Autenticación

## Flujo completo

### 1. **Registro (Register.tsx)**
```typescript
const { register } = useAuth();

// Usuario completa el formulario
const result = await register(nombre, username, email, password);

if (result.success) {
  navigate("/onboarding"); // Va a completar onboarding
}
```

**¿Qué sucede internamente?**
- `authService.signup()` crea usuario en `auth.users` (Supabase Auth)
- Trigger `on_auth_user_created` crea registro en `public.usuario`
- Trigger `trg_crear_config_usuario` crea configuraciones por defecto
- Usuario redirigido a onboarding (sin estar totalmente logueado)

### 2. **Onboarding (Onboarding.tsx)**
```typescript
const { completeOnboarding } = useAuth();

// Usuario completa 5 pasos
await completeOnboarding(); // Marca onboarded = true
```

### 3. **Login (Login.tsx)**
```typescript
const { login } = useAuth();

const result = await login(email, password);

if (result.success) {
  navigate("/"); // Va al feed (requiere onboarded=true)
}
```

**¿Qué sucede internamente?**
- `authService.signin()` autentica en Supabase Auth
- Obtiene perfil desde `public.usuario`
- AuthContext actualiza estado con usuario

### 4. **Logout (SettingsAccount.tsx)**
```typescript
const { logout } = useAuth();

await logout();
navigate("/login", { replace: true });
```

**¿Qué sucede internamente?**
- `authService.signout()` cierra sesión en Supabase Auth
- Limpia localStorage (configuración de bienestar)
- AuthContext limpia estado
- Usuario redirigido a login

### 5. **Mantener Sesión (AuthContext.tsx)**
```typescript
// Al montar la app
useEffect(() => {
  const initializeAuth = async () => {
    const userData = await authService.getCurrentUser();
    if (userData?.profile) {
      setUser(userData.profile);
      setHasOnboarded(userData.profile.onboarded);
    }
  };

  initializeAuth();

  // Escuchar cambios de sesión
  const { data: subscription } = authService.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN") {
      // Actualizar usuario
    } else if (event === "SIGNED_OUT") {
      // Limpiar estado
    }
  });

  return () => subscription?.unsubscribe();
}, []);
```

## Protección de Rutas

Las rutas están protegidas con `ProtectedRoute`:

```typescript
// Login y Register — SIN protección (usuario no autenticado)
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />

// Onboarding — requiere estar autenticado (pero no onboarded)
<Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

// Resto de la app — requiere autenticado + onboarded
<Route path="/" element={<ProtectedRoute requireOnboarded><Layout /></ProtectedRoute>} />
```

## Estados de Loading

**AuthContext.isLoading** es `true` mientras:
- Se carga la sesión inicial
- Se espera respuesta de login/register
- Se espera respuesta de logout

Durante este tiempo, se muestra un loader en todos los componentes.

## Manejo de Errores

```typescript
const { login, error } = useAuth();

const result = await login(email, password);
if (!result.success) {
  console.log(result.message); // "Correo o contraseña incorrectos"
}
```

## Persistencia de Sesión

Supabase maneja automáticamente:
- Token JWT en localStorage
- Refresh token
- Session recovery

Tu AuthContext verificará cada vez que se monta la app si hay sesión activa.

## Próximos Pasos

1. **Adaptar perfiles** — Mostrar datos reales del usuario autenticado
2. **Crear publicaciones** — Usuario actual en `publicaciones.ts`
3. **Seguimiento** — Integrar relaciones de usuarios
4. **Configuraciones** — Guardar settings en BD
