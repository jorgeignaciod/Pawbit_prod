# Backend MVP Pawbit

## Objetivo de esta primera base

Esta etapa deja un backend inicial dentro del mismo proyecto Next.js para destrabar el MVP sin esperar una separacion completa a otro repositorio o a un servicio independiente. El foco es:

- registro con email y contraseña
- login con email y contraseña
- sesion basada en cookie segura
- consulta del usuario autenticado
- actualizacion de onboarding

La persistencia inicial partio en JSON para desbloquear el flujo, pero ahora la fuente de verdad del backend debe ser Neon Postgres a traves de Prisma.

## Endpoints iniciales

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PATCH /api/me/onboarding`

## Base de datos elegida

- proveedor: Neon
- motor: PostgreSQL
- acceso desde app: Prisma
- variable principal: `DATABASE_URL`

## Validaciones aplicadas al registro

- `name`: minimo 2 caracteres, maximo 80
- `email`: formato valido, normalizado a minusculas
- `password`: minimo 8 caracteres, al menos una mayuscula, una minuscula y un numero
- `phone`: opcional por ahora, pero validado si llega

## Estructura recomendada de base de datos objetivo

### `users`

- `id` UUID
- `name`
- `email` unique
- `phone`
- `country`
- `city`
- `document_type`
- `document_number`
- `avatar_url`
- `onboarding_completed`
- `created_at`
- `updated_at`
- `deleted_at`

### `auth_accounts`

- `id`
- `user_id`
- `provider` (`email` por ahora)
- `provider_user_id` nullable
- `password_hash`
- `created_at`

### `refresh_tokens`

- `id`
- `user_id`
- `token_hash`
- `expires_at`
- `revoked_at`
- `created_at`

### `pets`

- `id`
- `user_id`
- `name`
- `species`
- `breed`
- `sex`
- `birth_date`
- `weight_current`
- `color`
- `avatar_url`
- `is_neutered`
- `microchip_number`
- `notes`
- `created_at`
- `updated_at`
- `deleted_at`

### `medical_records`

- `id`
- `pet_id`
- `type`
- `title`
- `description`
- `recorded_at`
- `vet_name`
- `next_due_date`
- `metadata` JSONB
- `created_by_user_id`
- `created_at`
- `updated_at`
- `deleted_at`

### `record_attachments`

- `id`
- `record_id`
- `storage_key`
- `file_name`
- `mime_type`
- `file_size`
- `created_at`

### `events`

- `id`
- `pet_id`
- `source_record_id`
- `type`
- `title`
- `description`
- `start_at`
- `end_at`
- `status`
- `location`
- `metadata` JSONB
- `created_by_user_id`
- `created_at`
- `updated_at`

### `event_reminders`

- `id`
- `event_id`
- `channel`
- `offset_minutes`
- `scheduled_for`
- `sent_at`
- `status`
- `created_at`

### `notifications`

- `id`
- `user_id`
- `pet_id`
- `event_id`
- `type`
- `title`
- `body`
- `priority`
- `read_at`
- `resolved_at`
- `action_url`
- `created_at`

## Siguiente fase recomendada

1. Cambiar persistencia JSON por PostgreSQL + Prisma.
2. Migrar sesiones a tabla `refresh_tokens` o `sessions`.
3. Integrar el frontend de login y onboarding con estos endpoints.
4. Implementar CRUD de mascotas.
5. Implementar registros de salud y eventos.
