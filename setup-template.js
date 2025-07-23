#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('🚀 Configurando Woodward Backend Template...\n');

// Función para ejecutar comandos
function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

// Función para solicitar input del usuario
function askQuestion(question) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    readline.question(question, answer => {
      readline.close();
      resolve(answer);
    });
  });
}

async function setupTemplate() {
  try {
    // 1. Solicitar información del proyecto
    const projectName = await askQuestion('📝 Nombre del nuevo proyecto: ');
    const newRepoUrl = await askQuestion('🔗 URL del nuevo repositorio (ej: https://github.com/woodward/mi-proyecto.git): ');
    
    if (projectName.trim()) {
      // 2. Actualizar package.json
      console.log('📦 Actualizando package.json...');
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      packageJson.name = projectName.trim().toLowerCase().replace(/\s+/g, '-');
      packageJson.description = `Backend para el proyecto ${projectName}`;
      fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    }

    // 3. Generar nuevos JWT secrets
    console.log('🔐 Generando nuevos JWT secrets...');
    const crypto = require('crypto');
    const jwtSecret = crypto.randomBytes(64).toString('hex');
    const jwtRefreshSecret = crypto.randomBytes(64).toString('hex');

    // 4. Actualizar .env
    const envContent = `# =============================================================================
# ${projectName.toUpperCase()} BACKEND - CONFIGURACIÓN DE DESARROLLO
# =============================================================================
# IMPORTANTE: Cambia estas credenciales antes de usar en producción!

# Base de datos SQL Server (Woodward estándar)
DATABASE_URL="sqlserver://172.16.0.124:1433;database=PortToDoor;user={WoodwardSA};password={SqLEdcLw$3977};encrypt=true;trustServerCertificate=true"

# JWT Secrets - Generados automáticamente
JWT_SECRET="${jwtSecret}"
JWT_REFRESH_SECRET="${jwtRefreshSecret}"

# Configuración del servidor
PORT=3000
NODE_ENV=development

# Email (Opcional - descomentar si necesitas envío de correos)
# EMAIL_HOST=smtp.office365.com
# EMAIL_PORT=587
# EMAIL_SECURE=false
# EMAIL_USER=your-email@woodward.mx
# EMAIL_PASSWORD=your-password
`;

    fs.writeFileSync('.env', envContent);

    // 5. Instalar dependencias
    console.log('📚 Instalando dependencias...');
    await runCommand('npm install');

    // 6. Generar cliente Prisma
    console.log('🗄️ Generando cliente de Prisma...');
    await runCommand('npx prisma generate');

    // 7. Configurar Git para el nuevo proyecto
    if (newRepoUrl.trim()) {
      console.log('📋 Configurando Git para el nuevo repositorio...');
      
      // Cambiar el remote origin al nuevo repo
      await runCommand(`git remote set-url origin ${newRepoUrl.trim()}`);
      
      // Confirmar el cambio
      console.log('✅ Git configurado. El siguiente push irá al nuevo repositorio.');
      console.log(`📍 Nuevo remote: ${newRepoUrl.trim()}`);
    }

    // 8. Limpiar archivos de template
    if (fs.existsSync('setup-template.js')) {
      fs.unlinkSync('setup-template.js');
    }

    console.log('\n✅ ¡Template configurado exitosamente!');
    console.log('\n🎉 Próximos pasos:');
    console.log('1. npm run start:dev');
    console.log('2. Visita http://localhost:3000');
    console.log('3. Lee QUICK-START.md para más información');
    console.log('\n¡Happy coding! 🚀');

  } catch (error) {
    console.error('❌ Error durante la configuración:', error.message);
  }
}

setupTemplate();
