# Workspace Components Library

Biblioteca de componentes Angular basada en PrimeNG y componentes personalizados.

## 🚀 Despliegue en GitHub Pages

Este proyecto está configurado para desplegarse automáticamente en GitHub Pages usando GitHub Actions.

### Configuración

1. **Habilita GitHub Pages en tu repositorio:**
   - Ve a Settings → Pages
   - En "Source", selecciona "GitHub Actions"

2. **El workflow se ejecutará automáticamente:**
   - Al hacer push a la rama `main` o `master`
   - O manualmente desde la pestaña "Actions"

3. **URL de tu sitio:**
   - `https://[tu-usuario].github.io/[nombre-del-repositorio]/`

### Estructura del Proyecto

- `projects/lib-components`: Biblioteca de componentes
- `projects/app-lib-components`: Aplicación de documentación

### Scripts Disponibles

```bash
# Desarrollo
npm start

# Construir librería
npm run build:lib

# Construir aplicación
npm run build:app

# Construir para GitHub Pages
ng build app-lib-components --configuration github-pages --base-href /[nombre-repo]/
```

### Notas

- El workflow crea automáticamente un archivo `404.html` para manejar las rutas de Angular (SPA)
- El `baseHref` se configura automáticamente según el nombre del repositorio
- Los builds se optimizan para producción
