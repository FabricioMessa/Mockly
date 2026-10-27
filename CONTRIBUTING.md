# Guía de colaboración — Mockly

Pasos para los integrantes del equipo. Repo: `https://github.com/FabricioMessa/Mockly`.

## 1. Primera vez

1. Acepta la invitación de **collaborator** (llega por correo o en GitHub).
2. Clona el repositorio:

```bash
git clone https://github.com/FabricioMessa/Mockly.git
cd Mockly
```

## 2. Antes de empezar una tarea

Siempre parte de `main` actualizado y crea tu propia rama:

```bash
git checkout main
git pull
git checkout -b feat/auth
```

Usa una rama por tarea:
- `feat/auth` → login y registro
- `feat/backend` → API FastAPI

## 3. Al terminar

```bash
git add .
git commit -m "feat(auth): pantallas de login y registro"
git push -u origin feat/auth
```

El `-u` solo se usa la primera vez de esa rama; después basta con `git push`.

## 4. Abrir el Pull Request

1. Entra a GitHub; aparece el aviso de la rama subida.
2. Clic en **Compare & pull request**.
3. Verifica **base: `main`** y **compare: `feat/auth`**.
4. **Create pull request** → revisa **Files changed** → **Merge pull request**.

Al mergear, Vercel/Render despliegan automáticamente.

## 5. Si `main` cambió mientras trabajabas

```bash
git checkout main
git pull
git checkout feat/auth
git merge main
```

Resuelve conflictos si aparecen, y luego:

```bash
git add .
git commit
git push
```

## Reglas

- Nunca hagas `git push origin main` con tu trabajo; sube siempre tu rama.
- Commits descriptivos y frecuentes.
- No subir `.env`, `node_modules`, `venv` (ya están en `.gitignore`).
- Antes de crear una rama, haz `git pull` en `main`.
