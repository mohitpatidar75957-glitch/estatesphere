# EstateSphere 3D

Immersive real-estate discovery platform built with React, Three.js, Spring Boot and MySQL.

## Start locally

1. Start MySQL: `docker compose up -d mysql`
2. Backend: `cd backend` then `mvn spring-boot:run` (set `DB_URL=jdbc:mysql://localhost:3307/estate_sphere...` when using the included Docker port).
3. Frontend: `cd frontend`, run `npm install`, then `npm run dev`.

Frontend: http://localhost:5173 · API: http://localhost:8082/api/properties

The current UI includes curated sample content as an offline fallback. The REST API and booking persistence foundation are ready for live integration.
