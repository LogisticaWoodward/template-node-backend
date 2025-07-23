export const ERROR_CODES = {
  // Errores de autenticación
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  AUTH_FORBIDDEN: 'AUTH_FORBIDDEN',
  AUTH_REFRESH_TOKEN_INVALID: 'AUTH_REFRESH_TOKEN_INVALID',
  AUTH_REFRESH_TOKEN_EXPIRED: 'AUTH_REFRESH_TOKEN_EXPIRED',

  // Errores de validación
  VALIDATION_REQUIRED_FIELD: 'VALIDATION_REQUIRED_FIELD',
  VALIDATION_INVALID_FORMAT: 'VALIDATION_INVALID_FORMAT',
  VALIDATION_INVALID_LENGTH: 'VALIDATION_INVALID_LENGTH',
  VALIDATION_INVALID_VALUE: 'VALIDATION_INVALID_VALUE',

  // Errores de usuarios
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  USER_EMAIL_ALREADY_EXISTS: 'USER_EMAIL_ALREADY_EXISTS',
  USER_USERNAME_ALREADY_EXISTS: 'USER_USERNAME_ALREADY_EXISTS',
  USER_INVALID_ROLE: 'USER_INVALID_ROLE',

  // Errores de base de datos
  DB_CONNECTION_ERROR: 'DB_CONNECTION_ERROR',
  DB_QUERY_ERROR: 'DB_QUERY_ERROR',
  DB_CONSTRAINT_ERROR: 'DB_CONSTRAINT_ERROR',
  DB_FOREIGN_KEY_ERROR: 'DB_FOREIGN_KEY_ERROR',

  // Errores generales
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  UNPROCESSABLE_ENTITY: 'UNPROCESSABLE_ENTITY',
} as const;

export const ERROR_MESSAGES = {
  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 'Credenciales inválidas. Por favor, verifica tu usuario y contraseña.',
  [ERROR_CODES.AUTH_TOKEN_EXPIRED]: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
  [ERROR_CODES.AUTH_TOKEN_INVALID]: 'Token de autenticación inválido.',
  [ERROR_CODES.AUTH_UNAUTHORIZED]: 'No tienes permisos para acceder a este recurso.',
  [ERROR_CODES.AUTH_FORBIDDEN]: 'Acceso prohibido. No tienes los permisos necesarios.',
  [ERROR_CODES.AUTH_REFRESH_TOKEN_INVALID]: 'Token de actualización inválido.',
  [ERROR_CODES.AUTH_REFRESH_TOKEN_EXPIRED]: 'Token de actualización expirado.',

  [ERROR_CODES.USER_NOT_FOUND]: 'Usuario no encontrado.',
  [ERROR_CODES.USER_ALREADY_EXISTS]: 'El usuario ya existe.',
  [ERROR_CODES.USER_EMAIL_ALREADY_EXISTS]: 'Este correo electrónico ya está registrado.',
  [ERROR_CODES.USER_USERNAME_ALREADY_EXISTS]: 'Este nombre de usuario ya está registrado.',
  [ERROR_CODES.USER_INVALID_ROLE]: 'Rol de usuario inválido.',

  [ERROR_CODES.DB_CONNECTION_ERROR]: 'Error de conexión a la base de datos.',
  [ERROR_CODES.DB_QUERY_ERROR]: 'Error en la consulta a la base de datos.',
  [ERROR_CODES.DB_CONSTRAINT_ERROR]: 'Error de restricción en la base de datos.',
  [ERROR_CODES.DB_FOREIGN_KEY_ERROR]: 'Error de clave foránea en la base de datos.',

  [ERROR_CODES.INTERNAL_SERVER_ERROR]: 'Error interno del servidor.',
  [ERROR_CODES.BAD_REQUEST]: 'Solicitud incorrecta.',
  [ERROR_CODES.NOT_FOUND]: 'Recurso no encontrado.',
  [ERROR_CODES.CONFLICT]: 'Conflicto con el estado actual del recurso.',
  [ERROR_CODES.UNPROCESSABLE_ENTITY]: 'Datos no procesables.',
} as const;
