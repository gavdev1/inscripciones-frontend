# Frontend - Sistema de Inscripciones

Frontend desarrollado con React, TypeScript y Vite para el sistema de gestión de inscripciones escolares.

## 🚀 Tecnologías

- **React 19.2.0** - Biblioteca principal de UI
- **TypeScript** - Tipado estático
- **Vite** - Herramienta de construcción y desarrollo
- **React Router DOM** - Gestión de rutas
- **Axios** - Cliente HTTP para comunicación con el backend
- **Lucide React** - Iconos modernos
- **TailwindCSS** - Framework de estilos (configurado)

## 📋 Prerrequisitos

- Node.js 18+ 
- npm o yarn

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con UI
npm run test:ui

# Generar reporte de cobertura
npm run test:coverage

# Ejecutar tests unitarios
npm run test:unit
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── contexts/           # Contextos de React (AuthContext)
├── pages/              # Páginas principales
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── Sections.tsx
│   ├── Students.tsx
│   ├── Reports.tsx
│   └── Capacity.tsx
├── App.tsx             # Componente principal con rutas
└── main.tsx           # Punto de entrada
```

## 🔐 Autenticación

El frontend implementa un sistema de autenticación con JWT que incluye:

- **Rutas protegidas** - Solo accesibles para usuarios autenticados
- **Rutas públicas** - Login, registro y recuperación de contraseña
- **Contexto de autenticación** - Gestión centralizada del estado de auth

## 🌐 Rutas Principales

- `/` - Redirección al dashboard
- `/login` - Inicio de sesión
- `/register` - Registro de usuarios
- `/dashboard` - Panel principal
- `/sections` - Gestión de secciones
- `/students` - Gestión de estudiantes
- `/reports` - Reportes y estadísticas
- `/capacity` - Gestión de capacidad

## 🔧 Variables de Entorno

Crear archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:3000
```

## 📦 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run lint` - Ejecuta ESLint
- `npm run preview` - Previsualiza build
- `npm run test` - Ejecuta tests
- `npm run test:ui` - Interfaz visual de tests
- `npm run test:coverage` - Reporte de cobertura

## 🎨 Características

- ✅ Interfaz moderna y responsiva
- ✅ Navegación con React Router
- ✅ Gestión de estado con Context API
- �0 Comunicación con backend via Axios
- ✅ Sistema de autenticación completo
- ✅ Testing con Vitest y Testing Library
- ✅ Tipado completo con TypeScript

## 🚀 Despliegue

El build de producción se genera en la carpeta `dist/` y puede ser desplegado en cualquier servidor web estático.

## 📝 Notas

- El frontend está configurado para comunicarse con el backend en `http://localhost:3000`
- Asegúrate de que el backend esté corriendo antes de iniciar el frontend
- Las variables de entorno deben comenzar con `VITE_` para ser accesibles en Vite
