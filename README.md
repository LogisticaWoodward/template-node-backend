# 🚀 Backend Template

**Template base para proyectos backend en NestJS con autenticación completa**

> Este es un template listo para usar que incluye todo lo necesario para iniciar un proyecto backend robusto y escalable.

## Características

- ✅ Sistema de autenticación JWT con refresh tokens
- ✅ Manejo global de excepciones
- ✅ Validación de datos con class-validator
- ✅ Integración con Prisma ORM
- ✅ Estructura modular escalable
- ✅ Códigos de error estandarizados

## Tecnologías

- **NestJS**: Framework de Node.js para aplicaciones escalables
- **Prisma**: ORM moderno para TypeScript
- **PostgreSQL**: Base de datos principal
- **JWT**: Autenticación con tokens
- **bcrypt**: Encriptación de contraseñas
- **class-validator**: Validación de datos

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   ```
   Editar el archivo `.env` con tus configuraciones.

4. Configurar la base de datos:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. Ejecutar la aplicación:
   ```bash
   # Modo desarrollo
   npm run start:dev
   
   # Modo producción
   npm run start:prod
   ```

## Estructura del Proyecto

```
src/
├── auth/                 # Módulo de autenticación
│   ├── dto/             # DTOs de autenticación
│   ├── guards/          # Guards JWT
│   └── strategies/      # Estrategias Passport
├── common/              # Utilidades compartidas
│   ├── constants/       # Constantes y códigos de error
│   ├── exceptions/      # Excepciones personalizadas
│   └── filters/         # Filtros globales
├── prisma/              # Configuración de Prisma
├── users/               # Módulo de usuarios
└── main.ts              # Archivo principal
```

## API Endpoints

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/refresh` - Renovar token

### Usuarios
- `GET /users` - Listar usuarios
- `POST /users` - Crear usuario
- `GET /users/:id` - Obtener usuario
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

## Desarrollo

### Comandos útiles

```bash
# Generar módulo
nest g module nombre-modulo

# Generar controlador
nest g controller nombre-controlador

# Generar servicio
nest g service nombre-servicio

# Migración de base de datos
npx prisma migrate dev --name nombre-migracion

# Regenerar cliente Prisma
npx prisma generate
```

### Variables de Entorno

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ptd_vacios_db"
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
PORT=3000
NODE_ENV=development
```

## 📚 Documentación Adicional

- **[DATABASE-STRUCTURE.md](./DATABASE-STRUCTURE.md)** - Estructura de BD completa y cómo adaptarla
- **[EXAMPLES.md](./EXAMPLES.md)** - Ejemplos prácticos para extender el template  
- **[QUICK-START.md](./QUICK-START.md)** - Guía rápida para developers
- **[GITHUB-TEMPLATE-SETUP.md](./GITHUB-TEMPLATE-SETUP.md)** - Configurar como template

## Próximos Pasos

1. **Revisar** [DATABASE-STRUCTURE.md](./DATABASE-STRUCTURE.md) para entender la estructura
2. **Seguir** [EXAMPLES.md](./EXAMPLES.md) para agregar nuevos módulos
3. **Configurar** tu esquema de Prisma según tu proyecto
4. **Implementar** módulos específicos del negocio
5. **Añadir** tests
6. **Configurar** CI/CD

## Contribución

1. Fork del proyecto
2. Crear feature branch
3. Commit cambios
4. Push al branch
5. Crear Pull Request
