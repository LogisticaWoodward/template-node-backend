# 🔧 Configuración como GitHub Template Repository

## Pasos para convertir este repo en un Template protegido

### 1. **Convertir a Template Repository**
1. Ve a tu repo en GitHub
2. **Settings** → **General**
3. Scroll hasta "Template repository"
4. ✅ Marcar **"Template repository"**
5. **Save**

### 2. **Configurar permisos**
1. **Settings** → **Manage access**
2. **Solo tú** como Owner/Admin
3. **NO agregar** a otros developers como colaboradores
4. El repo puede ser **Public** (para que lo vean) pero **protegido contra push**

### 3. **Proteger branches**
1. **Settings** → **Branches**
2. **Add rule** para la branch `main`:
   - ✅ **Restrict pushes that create files**
   - ✅ **Require pull request reviews before merging**
   - ✅ **Require status checks to pass**
   - ✅ **Include administrators** (para que aplique también para ti)

### 4. **Configurar Branch protection adicional** (Opcional)
```yaml
# .github/branch-protection.yml
restrictions:
  users: ["tu-usuario"]  # Solo tú puedes hacer push directo
  teams: []
  apps: []
```

## 🎯 **Resultado:**
- ✅ Developers pueden **ver** el template
- ✅ Developers pueden **usar** "Use this template"  
- ❌ Developers **NO pueden** hacer push/PR al template
- ✅ **Solo tú** puedes modificar el template

## 👥 **Flujo para los developers:**

### ❌ **Lo que NO pueden hacer:**
```bash
git clone https://github.com/woodward/backend-template.git
git push  # ❌ ERROR: Permission denied
```

### ✅ **Lo que SÍ pueden hacer:**
1. Ir a GitHub → **"Use this template"** 
2. Crear su nuevo repo automáticamente
3. Clonar SU nuevo repo
4. Hacer push a SU repo

## 🔄 **Para actualizar el template:**
Solo tú puedes:
1. Hacer cambios al template
2. Push directo o PR
3. Los developers usan la nueva versión en proyectos futuros
