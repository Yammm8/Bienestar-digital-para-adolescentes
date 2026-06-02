# Especificación de Casos de Uso
**Bienestar Digital — Uso Consciente de Redes Sociales**  
Sistemas Aplicados al Desarrollo Sustentable · 2025

---

## Generales

---

### UC-01 · Ver el feed cronológico de publicaciones

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario autenticado |
| **Precondiciones** | El usuario ha iniciado sesión. Existe al menos una publicación en la plataforma. |
| **Flujo principal** | 1. El usuario abre la app y aterriza en la pantalla principal. <br>2. El sistema carga el feed cronológico mostrando las publicaciones más recientes primero. <br>3. El usuario se desplaza hacia abajo para ver publicaciones anteriores. <br>4. El sistema registra continuamente el tiempo de visualización del feed. |
| **Flujos alternativos** | • Sin publicaciones: el sistema muestra un mensaje de bienvenida e invita a crear la primera publicación o explorar comunidades. <br>• Error de conexión: el sistema muestra el último contenido en caché y notifica la falta de conexión. |
| **Postcondiciones** | El tiempo de uso queda registrado en el historial de bienestar del usuario. |

---

### UC-02 · Filtrar el feed entre "General" y "Mis comunidades"

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario autenticado |
| **Precondiciones** | El usuario ha iniciado sesión y se encuentra en el feed principal. |
| **Flujo principal** | 1. El usuario visualiza las pestañas "General" y "Mis comunidades" en la parte superior del feed. <br>2. El usuario toca la pestaña deseada. <br>3. El sistema recarga el feed mostrando únicamente las publicaciones del tipo seleccionado. <br>4. El filtro permanece activo hasta que el usuario lo cambie o cierre la sesión. |
| **Flujos alternativos** | • El usuario selecciona "Mis comunidades" sin pertenecer a ninguna: el sistema muestra un mensaje que invita a explorar y unirse a comunidades (UC-06). |
| **Postcondiciones** | El feed refleja exclusivamente el contenido correspondiente al filtro seleccionado. |

---

### UC-03 · Crear una publicación con límite de 500 caracteres

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario autenticado |
| **Precondiciones** | El usuario ha iniciado sesión. |
| **Flujo principal** | 1. El usuario toca el botón de nueva publicación. <br>2. El sistema presenta el editor con un contador de caracteres visible (0 / 500). <br>3. El usuario redacta el contenido; el contador se actualiza en tiempo real. <br>4. El usuario selecciona el destino (feed general o comunidad específica). <br>5. El usuario toca "Publicar". <br>6. El sistema valida el contenido y confirma la publicación con un mensaje de éxito. |
| **Flujos alternativos** | • Texto > 500 caracteres: el sistema bloquea la entrada adicional y resalta el contador en rojo. <br>• Publicación vacía: el sistema deshabilita el botón "Publicar" hasta que haya contenido. |
| **Postcondiciones** | La publicación queda visible en el destino seleccionado en orden cronológico. |

---

### UC-04 · Publicar en el feed general o en una comunidad específica

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario autenticado |
| **Precondiciones** | El usuario ha redactado una publicación (UC-03). |
| **Flujo principal** | 1. En el editor, el usuario despliega el selector de destino. <br>2. El sistema muestra las opciones: "Feed general" y la lista de comunidades a las que pertenece. <br>3. El usuario selecciona el destino deseado. <br>4. El usuario confirma con "Publicar". <br>5. El sistema registra y distribuye la publicación en el destino elegido. |
| **Flujos alternativos** | • El usuario no pertenece a ninguna comunidad: solo se muestra la opción "Feed general". |
| **Postcondiciones** | La publicación aparece únicamente en el destino seleccionado y en los feeds de los usuarios correspondientes. |

---

### UC-05 · Ver las comunidades a las que pertenece el usuario

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario autenticado |
| **Precondiciones** | El usuario ha iniciado sesión. |
| **Flujo principal** | 1. El usuario accede a la sección "Mis comunidades". <br>2. El sistema muestra la lista de comunidades con nombre, descripción breve y número de miembros. <br>3. El usuario puede tocar cualquier comunidad para ver sus publicaciones (UC-07). |
| **Flujos alternativos** | • Sin comunidades: el sistema muestra un mensaje e invita al usuario a explorar comunidades sugeridas (UC-06). |
| **Postcondiciones** | El usuario puede navegar hacia cualquiera de sus comunidades. |

---

### UC-06 · Explorar comunidades sugeridas y unirse a ellas

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario autenticado |
| **Precondiciones** | El usuario ha iniciado sesión. |
| **Flujo principal** | 1. El usuario accede a "Explorar comunidades". <br>2. El sistema muestra comunidades sugeridas basadas en los intereses registrados en el perfil. <br>3. Cada tarjeta muestra nombre, descripción y número de miembros. <br>4. El usuario toca "Unirse" en la comunidad de su interés. <br>5. El sistema confirma la adhesión y añade la comunidad a "Mis comunidades". |
| **Flujos alternativos** | • El usuario ya pertenece a la comunidad: el botón muestra "Salir" en lugar de "Unirse". <br>• Sin comunidades disponibles: el sistema muestra un mensaje indicando que no hay sugerencias por el momento. |
| **Postcondiciones** | La comunidad queda accesible en "Mis comunidades" y su contenido aparece en el feed filtrado. |

---

### UC-07 · Ver las publicaciones de una comunidad específica

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario autenticado |
| **Precondiciones** | El usuario pertenece a la comunidad o la comunidad es de acceso público. |
| **Flujo principal** | 1. El usuario selecciona una comunidad desde "Mis comunidades" o desde el resultado de búsqueda. <br>2. El sistema carga las publicaciones de esa comunidad en orden cronológico. <br>3. El usuario se desplaza para ver publicaciones anteriores. <br>4. El sistema registra el tiempo de permanencia en la comunidad. |
| **Flujos alternativos** | • Sin publicaciones: el sistema muestra un mensaje invitando a crear la primera publicación en la comunidad. |
| **Postcondiciones** | El tiempo de sesión en la comunidad se registra en el historial de bienestar del usuario. |

---

### UC-08 · Seguir o silenciar notificaciones de una comunidad

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario autenticado |
| **Precondiciones** | El usuario pertenece a la comunidad. |
| **Flujo principal** | 1. El usuario accede a la página de la comunidad. <br>2. El usuario toca el ícono de configuración de notificaciones. <br>3. El sistema muestra las opciones: "Activar notificaciones" o "Silenciar". <br>4. El usuario selecciona su preferencia. <br>5. El sistema confirma el cambio. |
| **Flujos alternativos** | • Notificaciones ya silenciadas: la opción disponible es "Activar notificaciones". |
| **Postcondiciones** | Las notificaciones de esa comunidad se gestionan según la preferencia del usuario, siempre bajo el esquema de agrupación por hora (UC-11). |

---

### UC-09 · Ver el dashboard de bienestar con tiempo de uso diario y semanal

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario autenticado |
| **Precondiciones** | El usuario ha iniciado sesión y existe al menos un registro de tiempo de uso. |
| **Flujo principal** | 1. El usuario accede a la sección "Dashboard de bienestar". <br>2. El sistema muestra el tiempo de uso del día actual con una barra de progreso respecto al límite configurado. <br>3. El sistema muestra un gráfico de barras con el uso de los últimos 7 días. <br>4. Los días con uso superior al límite configurado se resaltan visualmente. |
| **Flujos alternativos** | • Sin historial previo: el sistema muestra el día actual en cero e invita al usuario a configurar su primer límite diario. |
| **Postcondiciones** | El usuario puede tomar decisiones informadas sobre su comportamiento digital con base en datos propios. |

---

### UC-10 · Configurar la "fricción consciente" para desincentivar el uso excesivo

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario autenticado |
| **Precondiciones** | El usuario ha iniciado sesión. |
| **Flujo principal** | 1. El usuario accede a "Configuración > Fricción consciente". <br>2. El sistema muestra los parámetros configurables: umbral en minutos para activar la fricción; tipo de cambio visual (escala de grises, reducción de contraste, menor estimulación visual). <br>3. El usuario ajusta los parámetros según su preferencia. <br>4. El usuario guarda los cambios. <br>5. El sistema confirma la configuración activa. |
| **Flujos alternativos** | • El usuario desactiva la fricción completamente: la interfaz se mantiene normal independientemente del tiempo de uso. |
| **Postcondiciones** | La app aplicará los cambios visuales configurados automáticamente al superar el umbral establecido. |

---

### UC-11 · Recibir notificaciones agrupadas por hora

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario autenticado |
| **Precondiciones** | El usuario tiene notificaciones activas y existen eventos pendientes (reacciones, comentarios, nuevos seguidores). |
| **Flujo principal** | 1. El sistema acumula los eventos de notificación generados durante la hora en curso. <br>2. Al inicio de la siguiente hora, el sistema envía una notificación única con el resumen agrupado. <br>3. El usuario abre la notificación y visualiza el detalle de cada evento. |
| **Flujos alternativos** | • Sin eventos en la hora: no se envía ninguna notificación en ese ciclo. <br>• El usuario ha silenciado todas las notificaciones: no se envía ninguna. |
| **Postcondiciones** | El usuario recibe la información de su actividad sin interrupciones constantes, reforzando el uso consciente de la app. |

---

### UC-12 · Ver el perfil del usuario con estadísticas sin métricas de vanidad

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario autenticado |
| **Precondiciones** | El usuario ha iniciado sesión. |
| **Flujo principal** | 1. El usuario accede a su perfil desde la barra de navegación. <br>2. El sistema muestra: nombre de usuario y foto de perfil; número de comunidades a las que pertenece; número de publicaciones realizadas; tiempo de uso semanal; y tiempo desconectado registrado mediante actividades offline completadas. <br>3. El sistema NO muestra seguidores, likes acumulados ni ningún contador de validación social. |
| **Flujos alternativos** | • Sin actividad registrada: se muestran valores en cero acompañados de mensajes motivacionales. |
| **Postcondiciones** | El usuario obtiene una visión de su actividad centrada en calidad e impacto personal, no en popularidad. |

---

### UC-13 · Completar el onboarding de bienvenida con la filosofía de la app

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario nuevo (primer inicio de sesión) |
| **Precondiciones** | El usuario ha creado una cuenta y aún no ha completado el onboarding. |
| **Flujo principal** | 1. El sistema detecta el primer acceso y muestra la pantalla de bienvenida. <br>2. El sistema presenta 5 pantallas deslizables: propósito de la app y qué la diferencia de otras redes; explicación de la fricción consciente; funcionamiento de las notificaciones agrupadas; cómo interpretar el dashboard de bienestar; e invitación a configurar el primer límite de tiempo. <br>3. El usuario puede configurar su límite inicial o posponerlo. <br>4. El usuario completa el onboarding y accede al feed principal. |
| **Flujos alternativos** | • El usuario omite el onboarding: puede volver a acceder desde "Configuración > Ayuda > Filosofía de la app". |
| **Postcondiciones** | El usuario conoce los principios de uso consciente de la app y, opcionalmente, tiene su primer límite de tiempo configurado. |

---

## Interacción social

---

### UC-14 · Reaccionar a una publicación con un conjunto limitado de reacciones conscientes

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario autenticado |
| **Precondiciones** | El usuario visualiza una publicación en el feed o en una comunidad. |
| **Flujo principal** | 1. El usuario mantiene presionado o toca el ícono de reacción en la publicación. <br>2. El sistema despliega un conjunto reducido de reacciones: "Me importa", "Gracias", "Interesante", "Me alegra". No se muestran contadores de popularidad. <br>3. El usuario selecciona la reacción que mejor representa su respuesta. <br>4. El sistema registra la reacción y programa la notificación al autor para el siguiente ciclo horario (UC-11). |
| **Flujos alternativos** | • El usuario ya reaccionó: puede cambiar su reacción tocando otra opción, o retirarla tocando la reacción activa. |
| **Postcondiciones** | La reacción queda registrada. El autor es notificado en el próximo ciclo de notificaciones agrupadas. |

---

### UC-15 · Comentar en una publicación

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario autenticado |
| **Precondiciones** | El usuario visualiza una publicación. |
| **Flujo principal** | 1. El usuario toca el botón "Comentar" en la publicación. <br>2. El sistema muestra un campo de texto con límite de 300 caracteres y un contador visible. <br>3. El usuario redacta su comentario. <br>4. El usuario confirma el envío. <br>5. El sistema publica el comentario en el hilo de la publicación. <br>6. El autor recibe una notificación agrupada en el siguiente ciclo horario (UC-11). |
| **Flujos alternativos** | • Comentario vacío: el botón de envío permanece deshabilitado. <br>• Texto > 300 caracteres: el sistema bloquea la entrada adicional y resalta el contador en rojo. |
| **Postcondiciones** | El comentario es visible para los usuarios que acceden a la publicación; se mantiene el hilo de conversación en orden cronológico. |

---

### UC-16 · Ver el perfil público de otro usuario

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario autenticado |
| **Precondiciones** | El usuario ha identificado a otro usuario en el feed, en una comunidad o en resultados de búsqueda. |
| **Flujo principal** | 1. El usuario toca el nombre o foto de otro usuario. <br>2. El sistema muestra el perfil público con: nombre de usuario y foto, comunidades en común y publicaciones recientes. <br>3. El sistema NO muestra contadores de seguidores, likes acumulados ni métricas de popularidad. <br>4. El usuario puede optar por seguir al otro usuario desde esta pantalla (UC-17). |
| **Flujos alternativos** | • Perfil no encontrado o cuenta eliminada: el sistema muestra un mensaje de error amigable. |
| **Postcondiciones** | El usuario puede iniciar el flujo de seguimiento (UC-17) o regresar al contexto anterior. |

---

### UC-17 · Seguir a otro usuario

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario autenticado |
| **Precondiciones** | El usuario visualiza el perfil público de otro usuario (UC-16). |
| **Flujo principal** | 1. El usuario toca el botón "Seguir". <br>2. El sistema registra la relación de seguimiento. <br>3. Las publicaciones del usuario seguido comenzarán a aparecer en el feed del usuario. <br>4. El usuario seguido recibe una notificación agrupada en el siguiente ciclo horario (UC-11). |
| **Flujos alternativos** | • El usuario ya sigue al otro: el botón muestra "Dejar de seguir". Al tocarlo, el sistema solicita confirmación antes de eliminar el seguimiento. |
| **Postcondiciones** | El feed del usuario se actualiza para incluir el contenido del nuevo usuario seguido. |

---

### UC-18 · Buscar usuarios o comunidades por nombre

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario autenticado |
| **Precondiciones** | El usuario ha iniciado sesión. |
| **Flujo principal** | 1. El usuario toca el ícono de búsqueda en la barra de navegación. <br>2. El usuario ingresa un término de búsqueda. <br>3. El sistema muestra resultados separados en dos pestañas: "Usuarios" y "Comunidades". <br>4. El usuario selecciona un resultado para acceder al perfil (UC-16) o a la comunidad (UC-07). |
| **Flujos alternativos** | • Sin resultados coincidentes: el sistema muestra un mensaje indicando que no se encontraron coincidencias e invita a revisar el término de búsqueda. |
| **Postcondiciones** | El usuario puede acceder al perfil o comunidad encontrado y tomar acciones desde ahí (seguir, unirse, etc.). |

---

## Gestión del tiempo y alertas

---

### UC-19 · Configurar un límite de tiempo diario de uso

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario autenticado |
| **Precondiciones** | El usuario ha iniciado sesión. |
| **Flujo principal** | 1. El usuario accede a "Configuración > Límite de tiempo". <br>2. El sistema muestra el límite actual o indica que no hay ninguno configurado. <br>3. El usuario selecciona la duración deseada: 30 min, 1 h, 2 h o personalizado. <br>4. El usuario confirma la selección. <br>5. El sistema guarda el límite y lo activa a partir del momento actual. |
| **Flujos alternativos** | • El usuario elimina el límite existente: el sistema desactiva las alertas relacionadas (UC-20) y muestra confirmación. |
| **Postcondiciones** | El sistema comienza a rastrear el tiempo de uso contra el límite configurado y activará alertas al acercarse a él (UC-20). |

---

### UC-20 · Recibir una alerta al acercarse al límite de tiempo configurado

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario autenticado |
| **Precondiciones** | El usuario tiene un límite de tiempo configurado (UC-19). El tiempo de uso acumulado supera el 80% del límite. |
| **Flujo principal** | 1. El sistema detecta que el tiempo de uso alcanzó el 80% del límite diario. <br>2. El sistema muestra una notificación suave: "Te quedan X minutos de tu límite diario". <br>3. Al alcanzar el 100%, el sistema aplica la fricción consciente configurada (UC-10) y muestra un aviso más prominente. <br>4. El usuario puede elegir continuar con uso consciente o pausar la app voluntariamente (UC-22). |
| **Flujos alternativos** | • Sin fricción consciente configurada: solo se muestra el aviso textual sin cambios visuales. <br>• El usuario ignora el aviso: el sistema continúa registrando el tiempo sin bloquear el acceso. |
| **Postcondiciones** | El exceso de tiempo respecto al límite queda registrado en el dashboard (UC-09) y es visible en la comparativa semanal (UC-23). |

---

### UC-21 · Recibir un recordatorio de pausa activa tras uso continuo prolongado

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario autenticado |
| **Precondiciones** | El usuario lleva más de 30 minutos continuos de uso sin haber tomado una pausa (o el tiempo que haya configurado). |
| **Flujo principal** | 1. El sistema detecta que se alcanzó el umbral de uso continuo sin pausa. <br>2. El sistema muestra una pantalla de pausa suave con un mensaje motivacional, por ejemplo: "Llevas 30 minutos seguidos. ¿Qué tal si estiras un poco?". <br>3. El sistema ofrece dos acciones: "Continuar" o "Tomar un descanso" (UC-22). <br>4. El usuario elige una de las opciones. |
| **Flujos alternativos** | • El usuario cierra el recordatorio y continúa: el sistema reinicia el contador de uso continuo y enviará el próximo recordatorio al completar otro ciclo. |
| **Postcondiciones** | El evento de recordatorio queda registrado en el historial del dashboard de bienestar. |

---

### UC-22 · Pausar la app voluntariamente desde un acceso rápido ("tomar un descanso")

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario autenticado |
| **Precondiciones** | El usuario está activo dentro de la app. |
| **Flujo principal** | 1. El usuario toca el botón de pausa rápida visible en la barra de navegación. <br>2. El sistema muestra un selector de duración: 5 min, 15 min, 30 min o personalizado. <br>3. El usuario confirma la duración seleccionada. <br>4. El sistema muestra la pantalla "Descanso activo" con un contador regresivo y una sugerencia de actividad offline. <br>5. Al finalizar el tiempo, el sistema notifica suavemente que la pausa ha concluido. |
| **Flujos alternativos** | • El usuario cancela la pausa antes de que termine: el sistema regresa al feed y retoma el registro de uso normal. |
| **Postcondiciones** | El tiempo de pausa se registra como tiempo desconectado en el perfil del usuario y contribuye a las métricas del dashboard. |

---

## Métricas y visualización

---

### UC-23 · Comparar el uso de la semana actual contra la semana anterior

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario autenticado |
| **Precondiciones** | El usuario tiene al menos 7 días de historial de uso registrado. |
| **Flujo principal** | 1. El usuario accede al dashboard de bienestar y selecciona la vista "Comparativa semanal". <br>2. El sistema muestra un gráfico de barras lado a lado: semana actual vs semana anterior, por día. <br>3. El sistema calcula y muestra la variación porcentual total (ej: "+15% esta semana" o "-20% esta semana"). <br>4. Los días con mejora respecto a la semana anterior se resaltan con un indicador positivo. |
| **Flujos alternativos** | • Menos de 7 días de historial: el sistema muestra los días disponibles e indica cuántos faltan para la comparativa completa. |
| **Postcondiciones** | El usuario puede identificar tendencias de mejora o retroceso en su consumo digital a lo largo del tiempo. |

---

## Actividades fuera del entorno digital

---

### UC-24 · Explorar sugerencias de actividades offline personalizadas al perfil del usuario

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario autenticado |
| **Precondiciones** | El usuario ha completado el onboarding y tiene al menos un interés registrado en su perfil. |
| **Flujo principal** | 1. El usuario accede a la sección "Desconéctate". <br>2. El sistema muestra una lista de actividades offline sugeridas según los intereses del usuario (lectura, ejercicio, tiempo con familia, actividad al aire libre, entre otras). <br>3. Cada sugerencia incluye nombre, descripción breve y duración estimada. <br>4. El usuario puede tocar "Voy a hacer esto" para registrar la actividad como pendiente. |
| **Flujos alternativos** | • Sin intereses configurados en el perfil: el sistema muestra sugerencias genéricas e invita al usuario a completar sus intereses (UC-27). |
| **Postcondiciones** | La actividad queda pendiente en el perfil del usuario para ser marcada como completada (UC-25). |

---

### UC-25 · Marcar una actividad offline como completada y registrar el tiempo desconectado

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario autenticado |
| **Precondiciones** | El usuario tiene al menos una actividad offline pendiente (UC-24). |
| **Flujo principal** | 1. El usuario regresa a la app después de realizar la actividad. <br>2. El usuario accede a "Desconéctate > Mis actividades". <br>3. El usuario selecciona la actividad realizada y toca "Marcar como completada". <br>4. El sistema muestra un campo de tiempo pre-llenado con la duración estimada; el usuario puede editarlo. <br>5. El usuario confirma. <br>6. El sistema registra el tiempo desconectado y muestra un mensaje de reconocimiento positivo. |
| **Flujos alternativos** | • El usuario realizó una actividad no listada: puede agregarla manualmente indicando nombre y duración. |
| **Postcondiciones** | El tiempo desconectado acumulado se refleja en el perfil del usuario y contribuye a las métricas de calidad de uso en el dashboard. |

---

## Configuración y cuenta

---

### UC-26 · Configurar la frecuencia y el tipo de notificaciones permitidas

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario autenticado |
| **Precondiciones** | El usuario ha iniciado sesión. |
| **Flujo principal** | 1. El usuario accede a "Configuración > Notificaciones". <br>2. El sistema muestra los tipos disponibles: reacciones, comentarios, nuevos seguidores, actividad de comunidades y recordatorios de bienestar. <br>3. El usuario activa o desactiva cada tipo de forma individual. <br>4. El usuario guarda los cambios. |
| **Flujos alternativos** | • El usuario desactiva todos los tipos: el sistema advierte que no recibirá notificaciones de ningún tipo y solicita confirmación. |
| **Postcondiciones** | El sistema enviará únicamente los tipos de notificación habilitados, siempre bajo el esquema de agrupación por hora (UC-11). |

---

### UC-27 · Editar la información del perfil

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario autenticado |
| **Precondiciones** | El usuario ha iniciado sesión. |
| **Flujo principal** | 1. El usuario accede a su perfil y toca "Editar perfil". <br>2. El sistema muestra los campos editables: nombre de usuario, foto de perfil, descripción corta e intereses para sugerencias de actividades offline. <br>3. El usuario realiza los cambios deseados. <br>4. El usuario guarda los cambios. <br>5. El sistema actualiza el perfil y muestra confirmación. |
| **Flujos alternativos** | • Nombre de usuario ya en uso: el sistema notifica el conflicto y solicita elegir uno diferente. |
| **Postcondiciones** | El perfil refleja la información actualizada. Los intereses editados influyen en las sugerencias de actividades offline (UC-24). |

---

### UC-28 · Cerrar sesión / Eliminar cuenta

| Campo | Descripción |
|---|---|
| **Actor(es)** | Usuario autenticado |
| **Precondiciones** | El usuario ha iniciado sesión. |
| **Flujo principal** | **Cerrar sesión:** <br>1. El usuario accede a "Configuración > Cuenta". <br>2. El usuario selecciona "Cerrar sesión". <br>3. El sistema solicita confirmación. <br>4. El sistema cierra la sesión y redirige a la pantalla de inicio. <br><br>**Eliminar cuenta:** <br>1. El usuario accede a "Configuración > Cuenta > Eliminar cuenta". <br>2. El sistema informa las implicaciones: se perderán publicaciones, historial de bienestar y actividades registradas. <br>3. El sistema solicita confirmación mediante el ingreso de la contraseña actual. <br>4. El usuario confirma. <br>5. El sistema elimina permanentemente todos los datos del usuario y cierra la sesión. |
| **Flujos alternativos** | • El usuario cancela cualquiera de los dos procesos: no se realiza ninguna acción. |
| **Postcondiciones** | **Cerrar sesión:** la sesión termina y los datos permanecen guardados. **Eliminar cuenta:** todos los datos del usuario son eliminados de forma permanente e irreversible. |
