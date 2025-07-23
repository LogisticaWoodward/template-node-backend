import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Welcome')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Página de bienvenida del template' })
  @ApiResponse({ 
    status: 200, 
    description: 'Información del template',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        template: { type: 'string' },
        version: { type: 'string' },
        endpoints: {
          type: 'object',
          properties: {
            swagger: { type: 'string' },
            auth: { type: 'array', items: { type: 'string' } },
            users: { type: 'array', items: { type: 'string' } }
          }
        }
      }
    }
  })
  getWelcome() {
    return {
      message: '🚀 ¡Bienvenido al Woodward Backend Template!',
      template: 'Woodward Backend Template',
      version: '1.0.0',
      description: 'Template base para proyectos backend con autenticación completa',
      endpoints: {
        swagger: '/api - Documentación completa de la API',
        auth: [
          'POST /auth/login - Iniciar sesión',
          'POST /auth/refresh - Renovar token'
        ],
        users: [
          'GET /users - Listar usuarios (requiere auth)',
          'POST /users - Crear usuario (requiere auth)',
          'GET /users/:id - Obtener usuario (requiere auth)',
          'PATCH /users/:id - Actualizar usuario (requiere auth)',
          'DELETE /users/:id - Eliminar usuario (requiere auth)'
        ]
      },
      quickStart: {
        1: 'Revisa la documentación en /api',
        2: 'Crea tu primer usuario en POST /users',
        3: 'Haz login en POST /auth/login',
        4: 'Usa el token en los headers: Authorization: Bearer <token>'
      }
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check del servidor' })
  @ApiResponse({ 
    status: 200, 
    description: 'Estado del servidor',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        timestamp: { type: 'string' },
        uptime: { type: 'number' }
      }
    }
  })
  getHealth() {
    return {
      status: '✅ Servidor funcionando correctamente',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }
}
