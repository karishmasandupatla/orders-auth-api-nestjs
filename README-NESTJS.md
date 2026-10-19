# intern-api — NestJS conversion

This project is the NestJS version of the original Express + TypeScript + Prisma/PostgreSQL API.

## Stack
- NestJS
- TypeScript
- Prisma + PostgreSQL
- JWT authentication
- bcrypt password hashing
- class-validator DTO validation

## Run

```bash
pnpm install
pnpm prisma generate
pnpm dev
```

Make sure `.env` contains:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

## API routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/users` — admin only
- `GET /api/users/:id` — admin or owner
- `PATCH /api/users/:id` — admin or owner
- `DELETE /api/users/:id` — admin only
- `POST /api/orders` — authenticated user
- `GET /api/orders` — admin sees all; customer sees own
- `GET /api/orders/:id` — admin or owner
- `PATCH /api/orders/:id/status` — admin only
- `DELETE /api/orders/:id` — admin only

## NestJS request flow

`Request → Controller → Guard → DTO validation → Service → PrismaService → PostgreSQL → Response`

### Express → NestJS mapping

- Express routers → NestJS controllers/modules
- Express middleware `authenticate` → `JwtAuthGuard`
- Express `requireRole` → `@Roles()` + `RolesGuard`
- Zod schemas → DTO classes + `ValidationPipe`
- Prisma singleton → injectable `PrismaService`
- Controller business logic → service classes
- `res.status(...).json(...)` → returned objects + Nest HTTP exceptions
