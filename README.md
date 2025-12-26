# Workspace Components Library

Biblioteca de componentes Angular basada en PrimeNG y componentes personalizados.

## 🚀 Despliegue en GitHub Pages

Este proyecto está configurado para desplegarse automáticamente en GitHub Pages usando GitHub Actions.

### Configuración

1. **Habilita GitHub Pages en tu repositorio:**
   - Ve a Settings → Pages
   - En "Source", selecciona "GitHub Actions"
   - ⚠️ **IMPORTANTE:** NO configures los workflows sugeridos (Jekyll o Static HTML)
   - Simplemente deja "GitHub Actions" seleccionado y cierra la página

2. **Haz push de tu código:**
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment"
   git push origin main
   ```

3. **El workflow se ejecutará automáticamente:**
   - Ve a la pestaña "Actions" en GitHub
   - Verás el workflow "Deploy to GitHub Pages" ejecutándose
   - Espera a que termine (puede tardar unos minutos)

4. **URL de tu sitio:**
   - Una vez completado el workflow, tu sitio estará disponible en:
   - `https://Dev19Carmona.github.io/workspace-components-lib/`
   - La URL aparecerá en la sección "Environments" después del primer despliegue exitoso

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
