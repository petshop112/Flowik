# 🐾 Flowik – Panel de Gestión para PYMES

Flowik es una aplicación web destinada a pequeñas y medianas empresas, que centraliza la gestión de usuarios, clientes, productos y proveedores. Su objetivo es digitalizar y simplificar las tareas administrativas del negocio mediante un panel intuitivo con funcionalidades clave como registro de ventas, control de stock, alertas automatizadas, importacion y exportacion masiva para agilizar tiempos y facilitar las tareas administrativas.

## ⚙ Tecnologías utilizadas

### 🧩 Frontend - React 19

- **React 19** – Librería principal para construir la interfaz.
- **React Router DOM** – Manejo de rutas y navegación.
- **Tailwind CSS** – Estilado rápido con utilidades.
- **Formik + Yup** – Manejo y validación de formularios.
- **Redux Toolkit** – Manejo centralizado del estado.
- **Axios** – Cliente HTTP para consumo de APIs.
- **TanStack Query (React Query)** – Manejo de fetching y caché de datos.
- **Nivo (bar/core)** – Librería para gráficos y visualizaciones.
- **jsPDF + jsPDF-Autotable** – Generación de PDF desde el frontend.
- **Radix UI (Dialog, Popover, NavigationMenu, Slot)** – Componentes accesibles y personalizables.
- **React Microsoft Clarity** – Integración con Clarity para analítica.
- **Recharts** – Librería de gráficos basada en D3.
- **Vite** – Herramienta de desarrollo y build rápida.
- **TypeScript** – Tipado estático para mayor seguridad.
- **Lucide React** – Íconos SVG modernos.
- **Heroicons** – Conjunto adicional de íconos SVG.
- **Prettier** – Formateo automático de código.
- **ESLint** – Linter para mantener el código limpio.

### 🧱 Backend - Java + Spring Boot

- **Spring Boot 3.3.1** – Framework principal para construir APIs REST.
- **Spring Security** – Seguridad y autenticación.
- **Spring Data JPA** – Acceso a base de datos relacional.
- **MySQL / MariaDB** – Motores de base de datos soportados.
- **Spring Mail** – Envío de correos electrónicos.
- **Jackson Databind** – Serialización JSON.
- **ModelMapper** – Conversión entre DTOs y entidades.
- **JWT (Java JWT)** – Autenticación con tokens.
- **Lombok** – Simplificación de código boilerplate.
- **Springdoc OpenAPI** – Documentación automática de la API.
- **WebFlux** – Soporte reactivo (opcional).
- **Spring Devtools** – Recarga en caliente para desarrollo.
- **Apache POI** – Lectura y escritura de archivos Excel (XLS, XLSX).
- **OpenCSV** – Manejo de archivos CSV de forma sencilla.
- **Apache PDFBox** – Lectura y manipulación de archivos PDF.
- **Spring AI (OpenAI Starter)** – Integración con modelos de IA (ej. `gpt-4o-mini`, `m4mini`).
- **JDK** - Java 17.

> 📦 El proyecto backend utiliza **Maven** como gestor de dependencias.

## 🛠 Instrucciones para correr localmente

### 1. Clonar el repositorio

```bash
git clone https://github.com/petshop112/misinomascotas.git
```

## 📁 Estructura de Carpetas

### 🧩 Frontend (`/frontend`)

```
/frontend
│
├── api/         # Definiciones de endpoints y servicios API
├── assets/      # Imágenes, íconos, fuentes u otros recursos estáticos
├── components/  # Componentes reutilizables (botones, inputs, etc.)
├── data/        # Datos estáticos o mockeados
├── hooks/       # Custom hooks reutilizables (React)
├── lib/         # Lógica externa o compartida (por ejemplo, cliente de Axios)
├── pages/       # Páginas principales del sitio (Login, Home, etc.)
├── routing/     # Definición de rutas y navegación
├── types/       # Definiciones TypeScript (interfaces, tipos)
├── utils/       # Utilidades y funciones auxiliares
├── App.tsx      # Componente raíz de la aplicación
├── main.tsx     # Punto de entrada del frontend (ReactDOM)
├── index.css    # Estilos globales
└── vite-env.d.ts# Tipado especial para Vite
```

### 🧱 Backend (`/backend`)

```
/backend/src/main/java/fooTalent/misino
│
├── Auth/ # Autenticación y generación de JWT
├── config/ # Clases de configuración (seguridad, cors, etc.)
├── exceptions/ # Manejo global de errores y excepciones personalizadas
├── products/ # Lógica y modelos relacionados con productos
├── provider/ # Proveedores o servicios auxiliares
├── users/ # Gestión de usuarios (controladores, servicios, repositorios)
└── MisinoApplication.java # Clase principal que lanza la aplicación

```

## Estrategia de Ramificación (Git Flow)

Este proyecto utiliza **Git Flow** como metodología de trabajo colaborativo. A continuación se detallan las reglas y flujos que se deben seguir para mantener una estructura ordenada y eficiente.

### 🔗 Repositorio

[https://github.com/petshop112/flowik](https://github.com/petshop112/flowik)

### 🗂️ Ramas Principales

- `main`: Rama principal de **producción**. Solo recibe código **estable y funcional**.
- `dev`: Rama de **desarrollo general**. Aquí se integran las _features_ que ya pasaron revisión y pruebas.

### 🌱 Ramas de Trabajo

Cada nueva tarea o issue debe realizarse en una rama independiente siguiendo esta convención:

- Para nuevas funcionalidades: `feature/nombre-descriptivo`
- Para correcciones de errores: `fix/nombre-descriptivo`

> 📌 Estas ramas **siempre deben salir desde `dev`**.

### 🛠️ Proceso de Trabajo

1. Crear una **issue** en GitHub (Feature, Bug, etc.).
2. Desde la rama `dev`, crear una rama de trabajo con nombre correspondiente (`feature/...` o `fix/...`).
3. Realizar commits descriptivos durante el desarrollo.
4. Al finalizar, abrir un **Pull Request (PR)** hacia `dev`.
5. El equipo revisa el PR.
6. Si se aprueba:

   - Se hace **merge** a `dev`.
   - Se puede **cerrar la rama y el issue**, o mantenerlos si hay tareas pendientes.
7. Cuando `dev` tenga una versión estable y funcional:

   - Se abre un PR hacia `main` para publicación en producción.

### 📌 Ramas Actuales

- `main`: Producción (**no se trabaja directamente** en esta rama).
- `dev`: Integración continua.
- `dev-front`: Tareas generales del frontend.
- `dev-backend`: Tareas generales del backend.

---

> 💡 Este flujo permite organizar mejor el trabajo en equipo, evitar conflictos innecesarios y mantener siempre una versión estable del sistema en `main`.
