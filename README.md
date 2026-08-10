# Liga Del Ente — Público

Sitio público con todo lo que el espectador puede consultar: comandos del chat, tabla de
posiciones e historial/récords. Es un proyecto **separado** de la app principal (la que
tiene el panel admin) a propósito — comparte la misma base de datos de Turso, pero solo con
lectura, y no tiene ningún endpoint que escriba datos ni el secreto de admin.

## Páginas

- `/` — landing con los 3 links
- `/comandos` — lista de personajes y perks votables, con click para copiar el comando
- `/posiciones` — tabla de posiciones por división, en vivo
- `/historial` — récords, rachas, Hall of Fame, historial por personaje

## Variables de entorno

Necesita las mismas credenciales de Turso que la app principal, pero **de solo lectura**:

```
TURSO_DATABASE_URL=...
TURSO_AUTH_TOKEN=...
```

### Recomendado: usar un token de solo lectura

Por defecto, un token de Turso tiene permisos de lectura y escritura. Como este servidor
nunca necesita escribir nada, conviene generar un token separado con permiso `read-only`
específicamente para este deploy — así, aunque este servidor público tuviera algún problema
de seguridad, no podría modificar ni borrar datos.

```bash
turso db tokens create <nombre-de-tu-db> --read-only
```

(Necesitás el [Turso CLI](https://docs.turso.tech/cli/installation) instalado y logueado.
Si no lo tenés a mano, con el mismo token que usa la app principal también funciona — pero
perdés esa capa extra de seguridad.)

## Deploy en Vercel

1. Este proyecto tiene que quedar en su **propio repo de git**, separado del repo de la app
   principal — ya está inicializado localmente (`git init` corrido), falta subirlo a GitHub
   (o el proveedor que uses) y conectarlo como proyecto nuevo en Vercel.
2. En Vercel, "Add New Project" → importás este repo.
3. En la configuración del proyecto, agregás las variables de entorno `TURSO_DATABASE_URL`
   y `TURSO_AUTH_TOKEN` (la de solo lectura, si la generaste).
4. Deploy. Te va a dar una URL tipo `liga-del-ente-publico.vercel.app`.

## Conectar la URL a la app principal

Una vez que tengas la URL de este deploy, andá al proyecto principal (el del overlay) y
configurá:

```
NEXT_PUBLIC_COMMANDS_URL=https://tu-url-de-este-deploy.vercel.app/comandos
```

Eso hace que el cartel "Comandos del chat" del overlay muestre el link completo.

## Sobre el sitio viejo de comandos (Netlify)

Si tenías un sitio estático aparte solo para `/comandos` (carpeta `LigaDelEnte-Comandos`,
deployado en Netlify), ya no hace falta — esta página `/comandos` lo reemplaza y encima lee
los datos en vivo desde el mismo código fuente que usa la app principal, así que nunca se
desactualiza. Podés dar de baja el sitio de Netlify cuando quieras.

## Actualizar el roster de personajes

A diferencia del sitio viejo (JSON pegado a mano), acá `src/lib/data/characters.ts` es una
copia del mismo archivo del proyecto principal. Si agregás/sacás un personaje allá, hay que
copiar el archivo actualizado acá también (o pedirle a Claude que lo haga).

## Correr en local

```bash
corepack pnpm install
corepack pnpm run dev
```

Corre en `http://localhost:3000` por default (usá otro puerto si ya tenés la app principal
corriendo ahí: `next dev --port 3001`).
