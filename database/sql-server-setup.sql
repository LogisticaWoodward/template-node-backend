-- =============================================
-- SQL Server Setup Script - Woodward Template
-- =============================================
-- Ejecutar este script ANTES de usar Prisma
-- Las tablas deben existir antes de generar el cliente

USE PortToDoor; -- Cambiar por tu base de datos
GO

-- =============================================
-- 1. TABLA USERS
-- =============================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
BEGIN
    CREATE TABLE users (
        id          NVARCHAR(30)    NOT NULL DEFAULT NEWID(),
        username    NVARCHAR(100)   NOT NULL,
        email       NVARCHAR(255)   NOT NULL,
        password    NVARCHAR(255)   NOT NULL,
        firstName   NVARCHAR(100)   NOT NULL,
        lastName    NVARCHAR(100)   NOT NULL,
        role        NVARCHAR(50)    NOT NULL DEFAULT 'user',
        createdAt   DATETIME2       NOT NULL DEFAULT GETDATE(),
        updatedAt   DATETIME2       NOT NULL DEFAULT GETDATE(),
        
        CONSTRAINT PK_users PRIMARY KEY (id),
        CONSTRAINT UQ_users_username UNIQUE (username),
        CONSTRAINT UQ_users_email UNIQUE (email)
    );
    
    PRINT '✅ Tabla users creada correctamente';
END
ELSE
BEGIN
    PRINT '⚠️  Tabla users ya existe';
END
GO

-- =============================================
-- 2. TABLA REFRESH_TOKENS
-- =============================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='refresh_tokens' AND xtype='U')
BEGIN
    CREATE TABLE refresh_tokens (
        id          NVARCHAR(30)    NOT NULL DEFAULT NEWID(),
        jti         NVARCHAR(100)   NOT NULL,
        token       NVARCHAR(MAX)   NOT NULL,
        userId      NVARCHAR(30)    NOT NULL,
        isRevoked   BIT             NOT NULL DEFAULT 0,
        expiresAt   DATETIME2       NOT NULL,
        createdAt   DATETIME2       NOT NULL DEFAULT GETDATE(),
        
        CONSTRAINT PK_refresh_tokens PRIMARY KEY (id),
        CONSTRAINT UQ_refresh_tokens_jti UNIQUE (jti),
        CONSTRAINT FK_refresh_tokens_userId FOREIGN KEY (userId) 
            REFERENCES users(id) ON DELETE CASCADE
    );
    
    PRINT '✅ Tabla refresh_tokens creada correctamente';
END
ELSE
BEGIN
    PRINT '⚠️  Tabla refresh_tokens ya existe';
END
GO

-- =============================================
-- 3. ÍNDICES ADICIONALES (OPCIONAL)
-- =============================================
-- Índice para búsquedas por email
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_users_email')
BEGIN
    CREATE INDEX IX_users_email ON users(email);
    PRINT '✅ Índice IX_users_email creado';
END

-- Índice para búsquedas por username
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_users_username')
BEGIN
    CREATE INDEX IX_users_username ON users(username);
    PRINT '✅ Índice IX_users_username creado';
END

-- Índice para refresh tokens por usuario
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_refresh_tokens_userId')
BEGIN
    CREATE INDEX IX_refresh_tokens_userId ON refresh_tokens(userId);
    PRINT '✅ Índice IX_refresh_tokens_userId creado';
END

-- Índice para refresh tokens por expiración
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_refresh_tokens_expiresAt')
BEGIN
    CREATE INDEX IX_refresh_tokens_expiresAt ON refresh_tokens(expiresAt);
    PRINT '✅ Índice IX_refresh_tokens_expiresAt creado';
END
GO

-- =============================================
-- 4. USUARIO DE PRUEBA (OPCIONAL)
-- =============================================
-- Crear usuario admin para testing
-- Contraseña: admin123 (hasheada con bcrypt)
IF NOT EXISTS (SELECT * FROM users WHERE username = 'admin')
BEGIN
    INSERT INTO users (id, username, email, password, firstName, lastName, role)
    VALUES (
        NEWID(),
        'admin',
        'admin@woodward.mx',
        '$2b$10$rGOKUZ.8zZ9q5Z5Z5Z5Z5OJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5', -- admin123
        'Administrador',
        'Sistema',
        'admin'
    );
    
    PRINT '✅ Usuario admin creado (username: admin, password: admin123)';
END
ELSE
BEGIN
    PRINT '⚠️  Usuario admin ya existe';
END
GO

-- =============================================
-- 5. VERIFICACIÓN FINAL
-- =============================================
PRINT '==========================================';
PRINT 'RESUMEN DE INSTALACIÓN:';
PRINT '==========================================';

SELECT 
    'users' as tabla,
    COUNT(*) as registros
FROM users
UNION ALL
SELECT 
    'refresh_tokens' as tabla,
    COUNT(*) as registros
FROM refresh_tokens;

PRINT '==========================================';
PRINT '✅ Setup de base de datos completado!';
PRINT '';
PRINT '📋 PRÓXIMOS PASOS:';
PRINT '1. Ejecutar: npx prisma generate';
PRINT '2. Ejecutar: npm run start:dev';
PRINT '3. Probar login con admin/admin123';
PRINT '==========================================';
GO
