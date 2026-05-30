# Find-It Frontend

React + TypeScript frontend for the Find-It lost-and-found platform.

## Structure

```text
find-it-frontend/
  src/
    components/
      auth/
      layout/
      items/
    lib/
    pages/
      auth/
      dashboard/
      items/
    routes/
  package.json
  tailwind.config.js
  postcss.config.js
  vite.config.ts
```

## Install

```bash
npm install
cp .env.example .env
npm run dev
```

## Backend connection

Set `VITE_API_BASE_URL` to your Django backend, for example `http://127.0.0.1:8000/api`.
