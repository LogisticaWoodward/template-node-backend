# 🗄️ Estructura de Base de Datos - Woodward Backend Template

## 📋 **Estructura Actual del Template**

El template viene pre-configurado con una estructura básica de autenticación. Aquí está la documentación completa:

### **🔧 Configuración Actual**

```env
# Configuración SQL Server (Woodward estándar)
DATABASE_URL="sqlserver://172.16.0.124:1433;database=PortToDoor;user={WoodwardSA};password={...};encrypt=true;trustServerCertificate=true"
```

---

## 📊 **Esquema de Tablas Incluido**

### **1. Tabla `users`**

```sql
CREATE TABLE users (
    id          NVARCHAR(30)    PRIMARY KEY DEFAULT (NEWID()),
    username    NVARCHAR(100)   UNIQUE NOT NULL,
    email       NVARCHAR(255)   UNIQUE NOT NULL,
    password    NVARCHAR(255)   NOT NULL,
    firstName   NVARCHAR(100)   NOT NULL,
    lastName    NVARCHAR(100)   NOT NULL,
    role        NVARCHAR(50)    NOT NULL DEFAULT 'user',
    createdAt   DATETIME2       DEFAULT GETDATE(),
    updatedAt   DATETIME2       DEFAULT GETDATE()
);
```

**Campos:**
- `id` - Identificador único (CUID)
- `username` - Nombre de usuario único
- `email` - Correo electrónico único  
- `password` - Contraseña encriptada con bcrypt
- `firstName` - Nombre del usuario
- `lastName` - Apellido del usuario
- `role` - Rol del usuario (default: 'user')
- `createdAt` - Fecha de creación
- `updatedAt` - Fecha de última actualización

### **2. Tabla `refresh_tokens`**

```sql
CREATE TABLE refresh_tokens (
    id          NVARCHAR(30)    PRIMARY KEY DEFAULT (NEWID()),
    jti         NVARCHAR(100)   UNIQUE NOT NULL,
    token       NVARCHAR(MAX)   NOT NULL,
    userId      NVARCHAR(30)    NOT NULL,
    isRevoked   BIT             DEFAULT 0,
    expiresAt   DATETIME2       NOT NULL,
    createdAt   DATETIME2       DEFAULT GETDATE(),
    
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

**Campos:**
- `id` - Identificador único
- `jti` - JWT ID único para el token
- `token` - Refresh token completo
- `userId` - Referencia al usuario (FK)
- `isRevoked` - Si el token está revocado
- `expiresAt` - Fecha de expiración
- `createdAt` - Fecha de creación

---

## 🔄 **Cómo Adaptar a Tu Proyecto**

### **Paso 1: Modificar el Esquema Prisma**

Edita `prisma/schema.prisma`:

```prisma
// Ejemplo: Agregar tabla de productos
model Product {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Decimal
  stock       Int      @default(0)
  category    String
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relación con usuario que lo creó
  createdBy   String
  user        User     @relation(fields: [createdBy], references: [id])

  @@map("products")
}

// Agregar relación en User
model User {
  // ... campos existentes
  products Product[] // Relación uno a muchos
}
```

### **Paso 2: Generar Migración**

```bash
# Crear migración
npx prisma migrate dev --name add_products_table

# Generar cliente
npx prisma generate
```

### **Paso 3: Crear Módulo para Nueva Entidad**

```bash
# Generar archivos
nest g module products
nest g controller products  
nest g service products

# Crear DTOs
mkdir src/products/dto
touch src/products/dto/create-product.dto.ts
touch src/products/dto/update-product.dto.ts
```

### **Paso 4: Ejemplo de DTO**

```typescript
// src/products/dto/create-product.dto.ts
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Nombre del producto' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descripción del producto', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Precio del producto' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Stock disponible' })
  @IsNumber()
  stock: number;

  @ApiProperty({ description: 'Categoría del producto' })
  @IsString()
  category: string;
}
```

---

## 🏗️ **Ejemplos de Estructuras Comunes**

### **E-commerce:**
```prisma
model Product { /* ... */ }
model Category { /* ... */ }
model Order { /* ... */ }
model OrderItem { /* ... */ }
model Customer { /* ... */ }
```

### **Blog/CMS:**
```prisma
model Post { /* ... */ }
model Comment { /* ... */ }
model Tag { /* ... */ }
model Category { /* ... */ }
```

### **Logística (como Woodward):**
```prisma
model Shipment { /* ... */ }
model Carrier { /* ... */ }
model Truck { /* ... */ }
model Route { /* ... */ }
model Terminal { /* ... */ }
```

### **Inventario:**
```prisma
model Product { /* ... */ }
model Warehouse { /* ... */ }
model StockMovement { /* ... */ }
model Supplier { /* ... */ }
```

---

## 🔧 **Configuraciones de Base de Datos**

### **SQL Server (actual)**
```prisma
datasource db {
  provider = "sqlserver"
  url      = env("DATABASE_URL")
}
```

### **PostgreSQL**
```prisma
datasource db {
  provider = "postgresql"  
  url      = env("DATABASE_URL")
}
```
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

### **MySQL**
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```
```env
DATABASE_URL="mysql://user:password@localhost:3306/mydb"
```

---

## 🚀 **Comandos Útiles**

```bash
# Ver estado de migraciones
npx prisma migrate status

# Resetear base de datos (desarrollo)
npx prisma migrate reset

# Generar cliente después de cambios
npx prisma generate

# Abrir Prisma Studio (GUI)
npx prisma studio

# Crear migración desde cambios en schema
npx prisma migrate dev --name descripcion_cambio

# Push cambios sin migración (prototipado)
npx prisma db push
```

---

## 📝 **Checklist para Nuevo Proyecto**

- [ ] **Revisar** `prisma/schema.prisma`
- [ ] **Modificar** modelos según tu negocio  
- [ ] **Agregar** relaciones entre tablas
- [ ] **Crear** migración: `npx prisma migrate dev`
- [ ] **Generar** cliente: `npx prisma generate`
- [ ] **Crear** módulos para nuevas entidades
- [ ] **Definir** DTOs con validaciones
- [ ] **Documentar** endpoints en Swagger
- [ ] **Probar** en Prisma Studio

---

## 🔗 **Recursos Útiles**

- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma SQL Server Connector](https://www.prisma.io/docs/concepts/database-connectors/sql-server)
- [NestJS Prisma Integration](https://docs.nestjs.com/recipes/prisma)
- [Class Validator Decorators](https://github.com/typestack/class-validator)

---

## 💡 **Consejos**

1. **Siempre hacer backup** antes de migraciones en producción
2. **Usar transacciones** para operaciones complejas
3. **Indexar campos** que se consultan frecuentemente
4. **Validar datos** tanto en frontend como backend
5. **Documentar cambios** de esquema en commits
6. **Probar migraciones** en ambiente de desarrollo primero
