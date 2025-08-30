## Estrategia de Ramificación (Git Flow)

Este proyecto utiliza **Git Flow** como metodología de trabajo colaborativo. A continuación se detallan las reglas y flujos que se deben seguir para mantener una estructura ordenada y eficiente.

---

### 🔗 Repositorio
[https://github.com/petshop112/misinomascotas](https://github.com/petshop112/misinomascotas)

---

### 🗂️ Ramas Principales

- `main`: Rama principal de **producción**. Solo recibe código **estable y funcional**.
- `dev`: Rama de **desarrollo general**. Aquí se integran las _features_ que ya pasaron revisión y pruebas.

---

### 🌱 Ramas de Trabajo

Cada nueva tarea o issue debe realizarse en una rama independiente siguiendo esta convención:

- Para nuevas funcionalidades: `feature/nombre-descriptivo`
- Para correcciones de errores: `fix/nombre-descriptivo`

> 📌 Estas ramas **siempre deben salir desde `dev`**.

---

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

---

### 📌 Ramas Actuales

- `main`: Producción (**no se trabaja directamente** en esta rama).
- `dev`: Integración continua.
- `dev-front`: Tareas generales del frontend.
- `dev-backend`: Tareas generales del backend.

---

> 💡 Este flujo permite organizar mejor el trabajo en equipo, evitar conflictos innecesarios y mantener siempre una versión estable del sistema en `main`.