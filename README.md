# Funnel de captación · Luifer García

Embudo de tres pasos para captar leads de un infoproducto de inversión
inmobiliaria y llevarlos al grupo privado de WhatsApp.

## Stack

| Capa     | Tecnología                                              |
| -------- | ------------------------------------------------------- |
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript |
| Backend  | NestJS 11, Mongoose, class-validator, Throttler          |
| Base     | MongoDB                                                  |

## Flujo del embudo

1. `/` — Formulario de captación: nombre, apellido, celular con prefijo
   internacional (+57, +1, +58, …) y correo. Al enviar crea el lead en MongoDB.
2. `/procesando` — Barra de progreso animada hasta 79% y llamado a unirse al
   grupo de WhatsApp.
3. `/registro` — Confirmación al 100% con resumen de datos y próximos pasos.

El estado del lead avanza por etapas: `captured` → `progress_viewed` →
`whatsapp_joined` → `registered`.

## Puesta en marcha

```bash
# Backend
cd backend
cp .env.example .env      # completar MONGODB_URI y WHATSAPP_GROUP_URL
npm install
npm run start:dev         # http://localhost:4000/api

# Frontend
cd ../frontend
cp .env.example .env.local
npm install
npm run dev               # http://localhost:3000
```

También se puede levantar todo desde la raíz:

```bash
npm install
npm run dev
```

## Variables de entorno

### `backend/.env`

| Variable             | Descripción                                          |
| -------------------- | ---------------------------------------------------- |
| `PORT`               | Puerto del API (por defecto 4000)                    |
| `MONGODB_URI`        | Cadena de conexión de MongoDB                        |
| `CORS_ORIGINS`       | Orígenes permitidos, separados por coma              |
| `ADMIN_API_KEY`      | Clave para los endpoints administrativos             |
| `WHATSAPP_GROUP_URL` | Enlace de invitación al grupo                        |
| `FUNNEL_PROGRESS`    | Porcentaje mostrado en la vista de progreso (79)     |

### `frontend/.env.local`

| Variable              | Descripción                                    |
| --------------------- | ---------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | URL base del API, incluyendo el prefijo `/api` |

## API

| Método  | Ruta                    | Descripción                                  |
| ------- | ----------------------- | -------------------------------------------- |
| `POST`  | `/api/leads`            | Crea o actualiza un lead y devuelve el paso siguiente |
| `PATCH` | `/api/leads/:id/stage`  | Actualiza la etapa del lead en el embudo      |
| `GET`   | `/api/leads`            | Listado paginado (requiere `x-api-key`)       |
| `GET`   | `/api/leads/stats`      | Conteo por etapa (requiere `x-api-key`)       |
| `GET`   | `/api/funnel/config`    | Configuración pública del embudo              |
| `GET`   | `/api/health`           | Estado del servicio                           |

Ejemplo de creación de lead:

```bash
curl -X POST http://localhost:4000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Luis",
    "lastName": "García",
    "email": "luis@ejemplo.com",
    "countryCode": "CO",
    "dialCode": "+57",
    "phoneNumber": "3001234567"
  }'
```

## Identidad visual

Paleta y tipografías definidas en `frontend/src/app/globals.css` y
`frontend/src/lib/fonts.ts`.

| Color              | Hex       | Uso                     |
| ------------------ | --------- | ----------------------- |
| Negro obsidiana    | `#0C0812` | Fondo principal         |
| Violeta nocturno   | `#1A1125` | Profundidad y branding  |
| Dorado inversión   | `#D7A72E` | Títulos y llamados      |
| Oro luminoso       | `#F2C85B` | Destellos y énfasis     |
| Blanco marfil      | `#F4F1EB` | Texto                   |
| Gris grafito       | `#747078` | Información secundaria  |
| Azul tecnológico   | `#0A6680` | Acento opcional         |

Las tipografías de marca (Molde Condensed Heavy Italic, Neue Plak Bold y
Coolvetica Regular) son comerciales y todavía usan sustitutos. Ver
`frontend/src/fonts/README.md` para activarlas.
