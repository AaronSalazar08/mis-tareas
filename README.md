# Mis Tareas

Aplicación web de gestión de tareas con tablero Kanban, autenticación de usuarios y persistencia en la nube.

---

## Stack tecnológico

| Tecnología         | Versión | Uso                          |
| ------------------ | ------- | ---------------------------- |
| React              | 18+     | Framework UI                 |
| Vite               | 5+      | Bundler y dev server         |
| Material UI (MUI)  | 5+      | Componentes visuales         |
| Redux Toolkit      | 2+      | Estado global                |
| React Redux        | 9+      | Integración Redux-React      |
| React Router DOM   | 6+      | Navegación y rutas           |
| Firebase Auth      | 10+     | Autenticación de usuarios    |
| Firebase Firestore | 10+     | Base de datos en tiempo real |

---

## Prerrequisitos

Antes de clonar y ejecutar el proyecto, asegúrate de tener instalado:

- **Node.js** v18 o superior → https://nodejs.org
- **npm** v9 o superior (viene con Node.js)
- **Git** → https://git-scm.com
- Una cuenta en **Firebase** → https://console.firebase.google.com

Verifica las versiones con:

```bash
node -v
npm -v
git -v
```

---

## Instalación y configuración local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/mis-tareas.git
cd mis-tareas
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Firebase

#### 3.1 Crear el proyecto en Firebase Console

1. Ve a https://console.firebase.google.com
2. Clic en **"Crear un proyecto"** → nombre: `mis-tareas`
3. Desactiva Google Analytics → **Crear proyecto**

#### 3.2 Habilitar Authentication

1. Panel lateral → **Authentication** → **Get started**
2. Pestaña **Sign-in method** → habilita **Email/Password** → Guardar

#### 3.3 Crear base de datos Firestore

1. Panel lateral → **Firestore Database** → **Crear base de datos**
2. Selecciona modo **Producción** (Si solo estas en entorno de prueba selecciona modo Prueba--Testing)
3. Elige una región (recomendado: `us-east1`) → Listo

#### 3.4 Configurar reglas de seguridad en Firestore

En Firestore → pestaña **Reglas**, reemplaza el contenido con:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

Haz clic en **Publicar**.

#### 3.5 Obtener credenciales de la app

1. Ícono ⚙️ (Configuración del proyecto) → **Tus apps**
2. Clic en `</>` (Web) → nombre: `mis-tareas` → **Registrar app**
3. Copia el objeto `firebaseConfig` que aparece

### 4. Crear el archivo de variables de entorno

En la raíz del proyecto, crea un archivo llamado `.env`:

```env
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

> **Importante:** Reemplaza cada valor con los datos reales de tu `firebaseConfig`. Este archivo está en `.gitignore` y **nunca debe subirse al repositorio**.

### 5. Ejecutar el proyecto

```bash
npm run dev
```

Abre tu navegador en: **http://localhost:5173**

---

## Estructura del proyecto

```
mis-tareas/
├── public/
├── src/
│   ├── app/
│   │   └── store.js               # Configuración del Redux Store
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx      # Formulario de inicio de sesión
│   │   │   └── RegisterForm.jsx   # Formulario de registro
│   │   ├── layout/
│   │   │   └── Navbar.jsx         # Barra de navegación principal
│   │   └── tasks/
│   │       ├── TaskBoard.jsx      # Tablero Kanban principal
│   │       ├── TaskCard.jsx       # Tarjeta individual de tarea
│   │       ├── TaskColumn.jsx     # Columna del kanban por estado
│   │       └── TaskFormModal.jsx  # Modal para crear/editar tareas
│   ├── features/
│   │   ├── auth/
│   │   │   └── authSlice.js       # Slice Redux: autenticación
│   │   └── tasks/
│   │       └── tasksSlice.js      # Slice Redux: tareas (CRUD)
│   ├── firebase/
│   │   └── config.js              # Inicialización de Firebase
│   ├── hooks/
│   │   └── useAuth.js             # Hook: listener de sesión Firebase
│   ├── pages/
│   │   ├── LoginPage.jsx          # Página de login
│   │   ├── RegisterPage.jsx       # Página de registro
│   │   └── TasksPage.jsx          # Página principal (protegida)
│   ├── routes/
│   │   └── ProtectedRoute.jsx     # Guardia de rutas privadas
│   ├── theme/
│   │   └── theme.js               # Tema global de Material UI
│   ├── App.jsx                    # Rutas y configuración principal
│   └── main.jsx                   # Entry point con providers
├── .env                           # Variables de entorno (NO subir)
├── .env.example                   # Plantilla de variables de entorno
├── .gitignore
├── package.json
└── vite.config.js
```

---

## Flujo de autenticación

```
App arranca
    ↓
useAuth() → onAuthStateChanged (Firebase listener)
    ↓
¿Hay sesión activa?
    ├── SÍ → dispatch(setUser) → Redux guarda { uid, email }
    └── NO → dispatch(setUser(null)) → Redux limpia estado
              dispatch(clearTasks())
    ↓
ProtectedRoute verifica state.auth.user
    ├── null + initialized → <Navigate to="/login" />
    ├── !initialized → <CircularProgress /> (espera a Firebase)
    └── user existe → renderiza la ruta solicitada
```

---

## Rutas de la aplicación

| Ruta        | Acceso        | Descripción              |
| ----------- | ------------- | ------------------------ |
| `/`         | Público       | Redirige a `/login`      |
| `/login`    | Público       | Inicio de sesión         |
| `/register` | Público       | Creación de cuenta       |
| `/tasks`    | **Protegida** | Tablero Kanban de tareas |
| `/*`        | Público       | Redirige a `/login`      |

---

## Estado global con Redux Toolkit

La app usa dos slices:

### `authSlice`

```
state.auth = {
  user: { uid, email } | null,
  loading: boolean,
  error: string | null,
  initialized: boolean
}
```

**Thunks disponibles:** `registerUser`, `loginUser`, `logoutUser`

### `tasksSlice`

```
state.tasks = {
  items: Task[],
  loading: boolean,
  error: string | null,
  loaded: boolean         ← evita re-fetch innecesario a Firestore
}
```

**Thunks disponibles:** `fetchTasks`, `createTask`, `updateTask`, `deleteTask`

---

## Modelo de datos en Firestore

**Colección:** `tasks`

```json
{
  "id": "auto-generado por Firestore",
  "title": "string (requerido, 3-80 caracteres)",
  "description": "string (opcional, máx 300 caracteres)",
  "status": "pending | in_progress | done",
  "userId": "string (UID del usuario propietario)",
  "createdAt": "Firestore Timestamp"
}
```

---

## Estados de una tarea (Kanban)

```
[pending] → [in_progress] → [done]
              ↑                ↑
              └── (reversible) ┘
```

Cada tarea puede avanzar o retroceder entre estados desde el menú `⋮` de la tarjeta.

---

## Scripts disponibles

```bash
npm run dev       # Servidor de desarrollo en localhost:5173
npm run build     # Build de producción en /dist
npm run preview   # Preview del build de producción
npm run lint      # Linting con ESLint
```

---

## Seguridad

- Las reglas de Firestore garantizan que **cada usuario solo puede leer y escribir sus propias tareas**, validado por `request.auth.uid == resource.data.userId` directamente en el servidor de Firebase.
- Las credenciales de Firebase se manejan exclusivamente a través de **variables de entorno** (`VITE_*`) y nunca se hardcodean en el código fuente.
- Las rutas privadas están protegidas con `ProtectedRoute`, que valida el estado de autenticación en Redux antes de renderizar cualquier contenido.
- El archivo `.env` está incluido en `.gitignore` para evitar exposición accidental de credenciales.

---

## Preguntas frecuentes

**¿Por qué mis tareas no aparecen después de recargar?**
Verifica que las variables de entorno en `.env` sean correctas y que las reglas de Firestore estén publicadas.

**¿Cómo agrego un nuevo miembro al equipo?**
Solo necesita clonar el repositorio y crear su propio `.env` con las credenciales del proyecto Firebase compartido. Cada usuario gestiona sus propias tareas de forma aislada.

**¿Puedo usar el mismo proyecto Firebase para desarrollo y producción?**
No se recomienda. Lo ideal es tener un proyecto Firebase separado para cada entorno.

---

## Contribuir al proyecto

1. Haz fork del repositorio
2. Crea una rama para tu feature: `git checkout -b feature/nombre-feature`
3. Haz commit de tus cambios: `git commit -m 'feat: descripción del cambio'`
4. Haz push a tu rama: `git push origin feature/nombre-feature`
5. Abre un Pull Request

---

## Respuestas — Parte teórica de la evaluación

### ¿Qué pasa si Firebase falla?

Si Firebase no está disponible, la app muestra mensajes de error en la UI gracias al manejo de errores en los thunks de Redux (`rejectWithValue`). Las tareas que ya estaban cargadas en el store de Redux permanecen visibles mientras dure la sesión, funcionando como caché local temporal. Para mayor resiliencia en producción, se podría implementar persistencia local con `redux-persist` + `localStorage`, junto con un sistema de cola de operaciones pendientes que se sincronice cuando Firebase recupere la disponibilidad.

### ¿Qué mejoras priorizaría en los próximos 3 meses para una empresa real?

1. **Persistencia offline** con `redux-persist` para que los usuarios puedan trabajar sin conexión
2. **Testing** con Vitest + React Testing Library para cubrir los flujos críticos de autenticación y CRUD
3. **Paginación o carga infinita** en Firestore para escalar con grandes volúmenes de tareas
4. **Notificaciones en tiempo real** usando `onSnapshot` de Firestore en lugar de fetch puntual
5. **Roles y permisos** para habilitar equipos colaborativos con tareas compartidas
6. **CI/CD automatizado** con GitHub Actions para despliegue automático a producción

### ¿Cómo diseñaría la arquitectura si dejara de usarse Firebase?

Se mantendría exactamente la misma estructura de Redux (slices, thunks, store). La única capa que cambiaría sería la de servicios: los thunks que hoy llaman a la SDK de Firebase pasarían a llamar a funciones de un módulo de servicios (`src/services/tasksService.js`, `src/services/authService.js`) que internamente usen `axios` o `fetch` para comunicarse con un backend REST o GraphQL. Redux actúa como una capa de abstracción que desacopla la UI de la fuente de datos, lo que hace que este reemplazo sea quirúrgico y no afecte a ningún componente visual.

### ¿Cómo evitaría que un usuario acceda a las tareas de otro usuario?

En tres capas de seguridad complementarias:

1. **Firestore Rules (servidor):** La regla `request.auth.uid == resource.data.userId` impide cualquier lectura o escritura no autorizada directamente en la base de datos, independientemente de lo que haga el cliente.
2. **Query filtrada (cliente):** Al consultar las tareas, siempre se usa `where('userId', '==', uid)`, por lo que Firestore nunca retorna tareas de otros usuarios.
3. **Rutas protegidas (UI):** `ProtectedRoute` garantiza que ningún usuario no autenticado pueda acceder a la pantalla de tareas.

### ¿Qué documentación o estructura dejaría para facilitar el mantenimiento?

- **Este README** con instrucciones de instalación, arquitectura y decisiones técnicas
- **Comentarios en código** en los archivos más complejos (slices, hooks, rutas protegidas)
- **Archivo `.env.example`** con las variables requeridas sin valores reales
- **Estructura de carpetas por dominio** (`features/auth`, `features/tasks`) en lugar de por tipo de archivo, para que sea intuitivo encontrar todo lo relacionado con una funcionalidad
- **Convención de commits** semánticos (`feat:`, `fix:`, `refactor:`) para un historial de Git legible
- **Diagramas de flujo** del sistema de autenticación y del ciclo de vida de una tarea en la wiki del repositorio

---

_Desarrollado como parte de la Evaluación Técnica — Practicante Frontend._
