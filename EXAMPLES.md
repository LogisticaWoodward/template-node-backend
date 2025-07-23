# 🚀 Ejemplos Prácticos - Extensión del Template

## 📝 **Caso de Uso: Sistema de Productos**

Ejemplo completo de cómo agregar una nueva funcionalidad al template.

### **1. Actualizar Esquema Prisma**

```prisma
// prisma/schema.prisma
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
  
  // Relación con usuario creador
  createdBy   String
  creator     User     @relation(fields: [createdBy], references: [id])

  @@map("products")
}

// Agregar en User model
model User {
  // ... campos existentes
  
  // Relación con productos
  products Product[]
  
  // ... resto igual
}
```

### **2. Crear Migración**

```bash
npx prisma migrate dev --name add_products
npx prisma generate
```

### **3. Crear Estructura de Archivos**

```bash
nest g module products
nest g controller products
nest g service products

mkdir src/products/dto
touch src/products/dto/create-product.dto.ts
touch src/products/dto/update-product.dto.ts
touch src/products/dto/index.ts
```

### **4. DTOs Completos**

```typescript
// src/products/dto/create-product.dto.ts
import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ 
    description: 'Nombre del producto',
    example: 'Laptop Dell XPS 13'
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Descripción detallada del producto',
    required: false,
    example: 'Laptop ultradelgada con procesador Intel i7'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Precio del producto',
    example: 1299.99
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ 
    description: 'Cantidad en stock',
    example: 10
  })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ 
    description: 'Categoría del producto',
    example: 'Electrónicos'
  })
  @IsString()
  category: string;

  @ApiProperty({ 
    description: 'Si el producto está activo',
    default: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
```

```typescript
// src/products/dto/update-product.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
```

```typescript
// src/products/dto/index.ts
export * from './create-product.dto';
export * from './update-product.dto';
```

### **5. Servicio Completo**

```typescript
// src/products/products.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { 
  NotFoundException,
  ConflictException,
  InternalServerException,
} from '../common/exceptions/custom.exception';
import { ERROR_CODES } from '../common/constants/error-codes';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, userId: string) {
    try {
      const product = await this.prisma.product.create({
        data: {
          ...createProductDto,
          createdBy: userId,
        },
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      return product;
    } catch (error) {
      throw new InternalServerException(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        'Error al crear el producto',
      );
    }
  }

  async findAll(page: number = 1, limit: number = 10, category?: string) {
    try {
      const skip = (page - 1) * limit;
      
      const where = {
        isActive: true,
        ...(category && { category }),
      };

      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          where,
          skip,
          take: limit,
          include: {
            creator: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.product.count({ where }),
      ]);

      return {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new InternalServerException(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        'Error al obtener productos',
      );
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      if (!product) {
        throw new NotFoundException(
          ERROR_CODES.NOT_FOUND,
          'Producto no encontrado',
        );
      }

      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerException(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        'Error al buscar el producto',
      );
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, userId: string) {
    try {
      // Verificar que el producto existe y pertenece al usuario
      const existingProduct = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        throw new NotFoundException(
          ERROR_CODES.NOT_FOUND,
          'Producto no encontrado',
        );
      }

      if (existingProduct.createdBy !== userId) {
        throw new ConflictException(
          ERROR_CODES.AUTH_FORBIDDEN,
          'No tienes permisos para modificar este producto',
        );
      }

      const product = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      return product;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      
      throw new InternalServerException(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        'Error al actualizar el producto',
      );
    }
  }

  async remove(id: string, userId: string) {
    try {
      const existingProduct = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        throw new NotFoundException(
          ERROR_CODES.NOT_FOUND,
          'Producto no encontrado',
        );
      }

      if (existingProduct.createdBy !== userId) {
        throw new ConflictException(
          ERROR_CODES.AUTH_FORBIDDEN,
          'No tienes permisos para eliminar este producto',
        );
      }

      await this.prisma.product.delete({
        where: { id },
      });
      
      return { message: 'Producto eliminado correctamente' };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      
      throw new InternalServerException(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        'Error al eliminar el producto',
      );
    }
  }
}
```

### **6. Controlador con Swagger Completo**

```typescript
// src/products/products.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo producto' })
  @ApiResponse({ 
    status: 201, 
    description: 'Producto creado exitosamente',
    schema: {
      example: {
        id: 'cuid-example',
        name: 'Laptop Dell XPS 13',
        description: 'Laptop ultradelgada',
        price: 1299.99,
        stock: 10,
        category: 'Electrónicos',
        isActive: true,
        createdAt: '2025-01-01T00:00:00Z',
        creator: {
          id: 'user-id',
          username: 'admin',
          firstName: 'Admin',
          lastName: 'User'
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: any
  ) {
    return this.productsService.create(createProductDto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener productos con paginación' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Página (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Límite por página (default: 10)' })
  @ApiQuery({ name: 'category', required: false, type: String, description: 'Filtrar por categoría' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de productos con paginación',
  })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('category') category?: string,
  ) {
    return this.productsService.findAll(page, limit, category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar producto' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Producto actualizado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() user: any
  ) {
    return this.productsService.update(id, updateProductDto, user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar producto' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Producto eliminado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: any
  ) {
    return this.productsService.remove(id, user.userId);
  }
}
```

### **7. Módulo Final**

```typescript
// src/products/products.module.ts
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
```

### **8. Registrar en AppModule**

```typescript
// src/app.module.ts
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    // ... otros imports
    ProductsModule,
  ],
  // ... resto igual
})
export class AppModule {}
```

---

## 🧪 **Testing del Nuevo Módulo**

```bash
# 1. Instalar dependencias y regenerar Prisma
npm install
npx prisma generate

# 2. Ejecutar servidor
npm run start:dev

# 3. Probar endpoints (requiere login primero)
# POST /products
# GET /products
# GET /products/123
# PATCH /products/123
# DELETE /products/123
```

---

## 🎯 **Patrones del Template**

Al seguir este ejemplo, notarás que el template sigue estos patrones consistentes:

1. **DTOs con validación** usando class-validator
2. **Decoradores Swagger** completos en controladores  
3. **Excepciones personalizadas** con códigos estandarizados
4. **Autenticación JWT** en endpoints protegidos
5. **Servicios con manejo de errores** robusto
6. **Paginación** en endpoints de listado
7. **Relaciones Prisma** bien estructuradas

¡Sigue estos patrones para mantener consistencia en tu proyecto! 🚀
