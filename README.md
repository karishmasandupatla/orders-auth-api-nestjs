# Orders & Auth API — NestJS

A backend API built with **NestJS, TypeScript, Prisma, and PostgreSQL** for authentication, user management, and order operations using a modular backend architecture.

## Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Package Manager:** pnpm

## Features

- Authentication and user management
- Orders API
- Modular architecture using NestJS modules, controllers, and services
- Database operations using Prisma
- Environment-based configuration

## Project Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Create a `.env` file using `.env.example` as a reference and configure your database connection.

```env
DATABASE_URL="your_postgresql_connection_string"
```

**Note:** Never commit your actual `.env` file or credentials.

### 3. Generate the Prisma Client

Run the Prisma client generation command configured for this project.

### 4. Start the Development Server

```bash
pnpm start:dev
```

Check `package.json` for available scripts and additional project-specific setup instructions.

## Overview

This project uses NestJS's modular architecture to organize authentication, user management, order operations, and database interactions.

## Author

Karishma Sandupatla