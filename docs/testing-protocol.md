# Protocolo de Testing PawBit

## Objetivo

Establecer una barrera automática antes de aceptar cambios en `main` y antes de considerar un push listo para producción.

## Quality Gate automático

El workflow de GitHub Actions `Quality Gate` corre en cada:

- `pull_request` hacia `main`
- `push` a `main`

Validaciones obligatorias:

1. instalación limpia con `npm ci`
2. generación de cliente Prisma
3. ejecución de tests automatizados
4. build completo de Next.js

Si una etapa falla, el cambio no debe considerarse listo para producción.

## Recomendación de branch protection

En GitHub, marcar como required status check:

- `Quality Gate / Test And Build`

Así evitamos merges a `main` sin pasar el gate automático.

## Smoke test manual recomendado

Además del gate automático, antes de dar por aprobado un release:

1. iniciar sesión
2. crear cuenta
3. crear mascota
4. editar mascota
5. registrar evento
6. revisar calendario
7. revisar producción o preview en mobile

## Comandos locales

```bash
npm run test
npm run build
npm run verify
```

## Cobertura inicial

Actualmente el gate cubre:

- helpers de contraseñas
- schemas de auth
- helpers de calendario
- schemas de mascotas
- generación de tokens

## Próximos pasos sugeridos

1. agregar tests de repositorios y servicios
2. agregar tests de rutas API
3. sumar E2E con Playwright para login, crear mascota y registrar evento
