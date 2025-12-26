# Animated Container Component

Componente simple que proporciona una animación fadeIn automática usando CSS puro.

## Características

- **Animación automática**: Se ejecuta automáticamente cuando el componente se renderiza
- **CSS puro**: No depende de librerías externas
- **Ligero**: Sin configuraciones complejas ni inputs
- **Smooth**: Transición suave de 0.8 segundos

## Uso Básico

```html
<app-aminated-container>
  <div class="mi-contenido">
    <p>Este contenido aparecerá con fadeIn automáticamente</p>
  </div>
</app-aminated-container>
```

## Comportamiento

El componente aplicará automáticamente una animación fadeIn que:

- Comienza con opacidad 0 y se mueve ligeramente hacia arriba (10px)
- Termina con opacidad 1 y en su posición final
- Duración: 0.8 segundos
- Easing: ease-out

## Ejemplo de Uso

```html
<!-- Cualquier contenido dentro se animará automáticamente -->
<app-aminated-container>
  <div class="tarjeta">
    <h3>Título de la Tarjeta</h3>
    <p>Este contenido aparecerá con una animación fadeIn suave.</p>
    <button>Acción</button>
  </div>
</app-aminated-container>
```

## Integración

```typescript
// En tu componente TypeScript - no necesitas ninguna configuración
export class MiComponente {
  // El componente animated-container funciona automáticamente
}
```

```html
<!-- En tu template HTML -->
<div class="contenedor-principal">
  <app-aminated-container>
    <div class="contenido-que-se-anima">
      <p>Cualquier contenido aquí se animará automáticamente</p>
    </div>
  </app-aminated-container>
</div>
```

## Notas Técnicas

- Utiliza `@keyframes` CSS para la animación
- Animación: `fadeIn 0.8s ease-out forwards`
- Efecto: Opacidad 0 → 1 y translateY(10px) → 0
- No requiere inputs ni configuración
- Funciona automáticamente al renderizar el componente
