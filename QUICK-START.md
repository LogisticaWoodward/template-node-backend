# 🚀 Guía de Inicio Rápido - Woodward Backend Template

## Para desarrolladores nuevos en el proyecto

### 1. **Crear proyecto desde template** (5 minutos)

#### Método A: GitHub Template (Recomendado)
```bash
# 1. Ve a: https://github.com/LogisticaWoodward/template-node-backend
# 2. Click en "Use this template" → "Create a new repository"
# 3. Nombra tu nuevo repo: "mi-nuevo-proyecto"
# 4. Clona TU nuevo repo:
git clone https://github.com/LogisticaWoodward/mi-nuevo-proyecto.git
cd mi-nuevo-proyecto

# 5. Configurar automáticamente
npm run setup
```

#### Método B: Clone manual (Si no usas GitHub)
```bash
# Clonar el template
git clone https://github.com/LogisticaWoodward/template-node-backend.git mi-nuevo-proyecto
cd mi-nuevo-proyecto

# IMPORTANTE: Configurar automáticamente
npm run setup
# Esto te preguntará:
# - Nombre del proyecto
# - URL del nuevo repositorio
# - Instalará dependencias
# - Generará JWT secrets únicos
# - Configurará Git para tu nuevo repo
```

### 2. **Cambiar nombre del proyecto** (2 minutos)

Actualizar en `package.json`:
```json
{
  "name": "mi-nuevo-proyecto",
  "description": "Descripción de mi proyecto específico"
}
```

### 3. **Configurar base de datos** (3 minutos)

#### **🗺️ Opción A: SQL Server (Estándar Woodward)**
```bash
# 1. PRIMERO: Ejecutar script SQL manualmente en SSMS
#    Archivo: database/sql-server-setup.sql

# 2. Una vez creadas las tablas:
npx prisma generate
```

#### **🍃 Opción B: MongoDB (NoSQL Woodward)**
```bash
# 1. Cambiar a esquema MongoDB
cp prisma/schema-mongodb.prisma prisma/schema.prisma

# 2. Actualizar .env con MONGO_DATABASE_URL

# 3. Generar cliente
npx prisma generate
```

⚠️ **IMPORTANTE**: En Woodward NO podemos crear tablas desde Prisma migrate

### 4. **Ejecutar en desarrollo** (1 minuto)

```bash
npm run start:dev
```

¡Listo! Tu servidor estará corriendo en `http://localhost:3000`

### 5. **Crear tu primer módulo** (10 minutos)

```bash
# Ejemplo: módulo de productos
nest g module productos
nest g controller productos
nest g service productos

# Crear DTOs
mkdir src/productos/dto
touch src/productos/dto/create-producto.dto.ts
touch src/productos/dto/update-producto.dto.ts
touch src/productos/dto/index.ts
```

### 6. **Estructura recomendada para nuevos módulos**

```
src/mi-modulo/
├── dto/
│   ├── create-mi-entidad.dto.ts
│   ├── update-mi-entidad.dto.ts
│   └── index.ts
├── mi-modulo.controller.ts
├── mi-modulo.service.ts
└── mi-modulo.module.ts
```

### 7. **Endpoints ya disponibles**

- `POST /auth/login` - Login con username/password
- `POST /auth/refresh` - Renovar token
- `GET /users` - Listar usuarios (requiere auth)
- `POST /users` - Crear usuario (requiere auth)

### 8. **Patrones incluidos**

- ✅ Manejo de errores estandarizado
- ✅ Validación automática de DTOs
- ✅ Autenticación JWT
- ✅ Guards de protección de rutas
- ✅ Filtros globales de excepciones
- ✅ Códigos de error consistentes

### 📝 **Tips importantes**

1. **Siempre usar DTOs** para validación de entrada
2. **Usar las excepciones personalizadas** del directorio `common/exceptions`
3. **Proteger rutas sensibles** con `@UseGuards(JwtAuthGuard)`
4. **Usar el decorador `@CurrentUser()`** para obtener el usuario logueado
5. **Seguir la estructura de módulos** para consistencia

### 📋 **Git y repositorios**

```bash
# Verificar que Git apunta a TU nuevo repo (no al template)
git remote -v
# Debe mostrar: origin https://github.com/woodward/TU-PROYECTO.git

# Si no se configuró automáticamente:
git remote set-url origin https://github.com/woodward/TU-PROYECTO.git

# Hacer el primer push
git add .
git commit -m "feat: setup inicial del proyecto"
git push -u origin main
```

### 🆘 **¿Problemas?**

1. **Error de conexión DB**: Verificar `DATABASE_URL` en `.env`
2. **Error de JWT**: Verificar `JWT_SECRET` y `JWT_REFRESH_SECRET`
3. **Error de Prisma**: Ejecutar `npx prisma generate`
4. **Puerto ocupado**: Cambiar `PORT` en `.env`
5. **Push va al template**: Verificar `git remote -v` y cambiar el origin

¡Happy coding! 🎉
