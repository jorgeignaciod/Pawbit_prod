# PawBit

MVP frontend mobile-first para tutores de mascotas, construido con Next.js App Router, TypeScript, Tailwind CSS, componentes reutilizables de estilo shadcn/ui, Zustand, react-hook-form y mocks realistas.

## Scripts

```bash
npm install
npm run dev
```

## iPhone Simulator con Xcode

La ruta mas rapida para iterar en mobile es usar Capacitor como shell iOS:

```bash
npm run ios:add
npm run ios:open
```

Para desarrollo local contra el servidor de Next:

```bash
npm run dev:mobile
npm run ios:dev:sync
npm run ios:open
```

Notas:

- `npm run ios:open` abre el workspace de Xcode para correr en un simulador de iPhone.
- `npm run ios:dev:sync` apunta la app nativa a `http://127.0.0.1:3000` para iterar sin redeploy a Vercel.
- `npm run ios:sync` genera una version estatica exportada de Next y sincroniza los assets en iOS.

## Demo states

Algunas vistas aceptan `?state=loading`, `?state=empty`, `?state=error` o `?state=success` para validar sus estados principales.
