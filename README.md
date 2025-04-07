# ShopiFruta - Aplicación de Ecommerce

## Visión General

ShopiFruta es una aplicación de comercio electrónico para la venta de frutas, desarrollada siguiendo principios de Clean Architecture y desplegada con AWS Amplify. La aplicación ofrece una experiencia completa de compra en línea, incluyendo catálogo de productos, carrito de compras, proceso de checkout, y administración de facturas.

## Demo en vivo

Puedes visitar la aplicación desplegada en: [https://main.d1g3mmbx6bbo0z.amplifyapp.com/login](https://main.d1g3mmbx6bbo0z.amplifyapp.com/login)

## Características principales

- 🛒 Catálogo de productos con filtros
- 🔍 Búsqueda y navegación intuitiva
- 🧾 Gestión de carrito de compras
- 💳 Proceso de checkout simplificado
- 📊 Panel de administración para ventas
- 📱 Diseño responsivo adaptable a todos los dispositivos

## Arquitectura y Stack Tecnológico

### Frontend

- **React 19**: Utilizamos la última versión de React por su rendimiento mejorado y nuevas características como concurrent rendering.
- **TypeScript**: Proporciona tipado estático para reducir errores y mejorar la mantenibilidad del código.
- **Vite**: Bundler moderno que ofrece tiempos de compilación rápidos y una experiencia de desarrollo fluida.
- **Tailwind CSS**: Framework de utilidades CSS para un desarrollo rápido y consistente de interfaces.
- **Zustand**: Solución ligera para gestión de estado global con una API simple e intuitiva.
- **React Router**: Para navegación y enrutamiento dentro de la aplicación.
- **Lucide React**: Biblioteca de iconos SVG limpios y consistentes.

### Arquitectura

El proyecto sigue los principios de **Clean Architecture**, dividiendo claramente la aplicación en capas:

- **Core Domain**: Entidades y reglas de negocio independientes de frameworks y UI.
- **Use Cases**: Casos de uso específicos de la aplicación.
- **Infrastructure**: Adaptadores y servicios externos.
- **Presentation**: Componentes y lógica de UI.

```
src/
├── core/
│   ├── domain/
│   │   ├── entities/
│   │   └── repositories/
│   ├── useCases/
│   └── actions/
├── di/
│   └── container.ts
├── infrastructure/
│   └── repositories/
├── presentation/
│   ├── screens/
│   ├── presenters/
│   └── shared/
└── stores/
```

### Patrones de Diseño Implementados

1. **Dependency Injection (DI)**: Utilizamos un contenedor de DI personalizado para gestionar dependencias y facilitar los tests.

2. **Repository Pattern**: Abstrae la lógica de acceso a datos, permitiendo cambiar la fuente de datos sin modificar la lógica de negocio.

3. **Presenter Pattern**: Separa la lógica de presentación de los componentes visuales, mejorando la testabilidad.

4. **Action Pattern**: Encapsula las operaciones de casos de uso en interfaces simples para la capa de presentación.

5. **Store Pattern (con Zustand)**: Gestión de estado global con API sencilla y soporte para persistencia.

## Despliegue con AWS Amplify

Elegimos **AWS Amplify** para el despliegue por varias razones:

- **CI/CD Integrado**: Despliegue automático conectado directamente con nuestro repositorio Git.
- **Escalabilidad**: Infraestructura gestionada que escala automáticamente según las necesidades.
- **Dominios y HTTPS**: Configuración sencilla de dominios personalizados con certificados SSL.
- **Preview Deployments**: Permite revisar los cambios en entornos de prueba antes de fusionar a producción.
- **Monitoreo y Analíticas**: Herramientas integradas para monitorear el rendimiento de la aplicación.

El proceso de despliegue se activa automáticamente con cada push a la rama principal, siguiendo este flujo:

1. Se detectan cambios en el repositorio
2. Amplify ejecuta el proceso de construcción con los scripts definidos
3. Se ejecutan tests automatizados
4. Si todo es correcto, se despliega la nueva versión
5. Se invalida la caché de CDN para servir el nuevo contenido

Además, hemos implementado GitHub Actions para asegurar la calidad del código antes de que los cambios lleguen a la rama principal:

```yaml
name: Test and Validate

on:
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      - run: yarn install
      - run: yarn lint
      - run: yarn test
      - run: yarn build
```

Este workflow se ejecuta automáticamente en cada Pull Request hacia las ramas principales, verificando:
- Integridad del código con linters
- Ejecución exitosa de tests unitarios y de integración
- Compilación correcta del proyecto

Esto asegura que solo código validado sea integrado en las ramas principales, manteniendo la calidad y estabilidad del proyecto.

## Librería de UI

Hemos creado nuestra propia librería de componentes UI (`@mono-repo/ui`) dentro del monorepo por varias razones:

- **Consistencia**: Garantiza una experiencia visual coherente en todas las aplicaciones.
- **Reutilización**: Los componentes se pueden compartir entre múltiples aplicaciones.
- **Mantenibilidad**: Centraliza los cambios de diseño, facilitando actualizaciones globales.
- **Documentación**: Incluye una documentación integrada de los componentes disponibles.

La librería está construida sobre **Tailwind CSS** y **shadcn/ui**, aprovechando componentes accesibles y personalizables que siguen las mejores prácticas de diseño.

## Estructura del Monorepo

El proyecto está estructurado como un monorepo utilizando Yarn Workspaces:

```
/
├── apps/
│   └── ecommerce-app/  # Aplicación principal
├── packages/
│   └── ui/  # Biblioteca de componentes compartidos
├── package.json  # Con configuración de workspaces
└── yarn.lock
```

Esta estructura permite:
- Compartir código y dependencias entre aplicaciones
- Gestionar versiones de manera centralizada
- Simplificar los flujos de CI/CD
- Facilitar la creación de nuevas aplicaciones dentro del ecosistema

## Instalación y Desarrollo Local

### Prerrequisitos

- Node.js v18+
- Yarn v1.22+

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/company/shopifrutas.git
cd shopifrutas

# Instalar dependencias
yarn install

# Iniciar el servidor de desarrollo
yarn dev
```

La aplicación estará disponible en http://localhost:5173

### Scripts disponibles

- `yarn dev` - Inicia el servidor de desarrollo
- `yarn build` - Compila la aplicación para producción
- `yarn preview` - Previsualiza la versión compilada localmente
- `yarn lint` - Ejecuta análisis estático del código
- `yarn test` - Ejecuta las pruebas

## Pruebas

El proyecto utiliza Vitest para testing, con Jest como runner. Incluye:

- Tests unitarios para lógica de negocio
- Tests de componentes con Testing Library
- Tests de integración para flujos críticos como checkout

## Aspectos adicionales
 - Se ha desplegado con chromatic https://67f350e690a71935093ee666-pmlwkyglst.chromatic.com/
 - Se ha desplegado la librería https://www.npmjs.com/package/ui-test-fruit