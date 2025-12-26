# LibComponents

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.0.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the library, run:

```bash
ng build lib-components
```

This command will compile your project, and the build artifacts will be placed in the `dist/` directory.

### Publishing the Library

Once the project is built, you can publish your library by following these steps:

1. Navigate to the `dist` directory:
   ```bash
   cd dist/lib-components
   ```

2. Run the `npm publish` command to publish your library to the npm registry:
   ```bash
   npm publish
   ```

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Dark Mode Configuration

Los componentes de esta librería están diseñados para funcionar con el modo dark de PrimeNG usando la clase `.my-app-dark`.

### Configuración requerida en tu aplicación

Para que los componentes funcionen correctamente con el modo dark, asegúrate de tener la siguiente configuración en tu archivo `styles.scss`:

```scss
@use "tailwindcss";
@use "primeicons/primeicons.css";

@plugin "tailwindcss-primeui";

@custom-variant dark (&:where(.my-app-dark, .my-app-dark *));
```

### Activación del modo dark

Para activar el modo dark en tu aplicación, simplemente agrega la clase `my-app-dark` al elemento raíz (normalmente `<body>` o el contenedor principal):

```html
<body class="my-app-dark">
  <!-- Tu aplicación -->
</body>
```

O dinámicamente desde TypeScript:

```typescript
// Agregar modo dark
document.body.classList.add('my-app-dark');

// Remover modo dark
document.body.classList.remove('my-app-dark');
```

### Componentes compatibles

Todos los componentes de la librería son compatibles con el modo dark:
- `lib-button-ng`
- `lib-table-ng`
- `lib-form`
- `lib-inline-input`
- `lib-custom-input`
- Y todos los demás componentes

Los estilos se aplicarán automáticamente cuando la clase `.my-app-dark` esté presente en el DOM.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
