# Calculadora de Ponderaciones Universitarias

Una aplicación web simple y elegante para calcular promedios ponderados de calificaciones universitarias, con modo de examen integrado.

## Características

- **Cálculo de promedio ponderado**: Calcula automáticamente el promedio basado en notas y porcentajes
- **Modo examen**: Permite reservar un porcentaje para un examen final y redistribuir las notas existentes
- **Cálculo de nota necesaria**: En modo examen, muestra qué nota necesitas para aprobar
- **Validación inteligente**: Previene que los porcentajes excedan el 100%
- **Interfaz responsive**: Funciona perfectamente en dispositivos móviles y desktop
- **Indicador de aprobación**: Muestra visualmente si apruebas o repruebas

## Tecnologías

- **React 18** con TypeScript
- **Vite** como bundler y servidor de desarrollo
- **ESLint** para linting del código
- **CSS modular** para estilos

## Instalación y uso

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm

### Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd calculador-ponderaciones-u

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Comandos disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Construye la aplicación para producción
npm run lint     # Ejecuta ESLint en el código
npm run preview  # Previsualiza la build de producción
```

## Cómo usar la calculadora

### Modo Normal
1. Ingresa tus notas y sus respectivos porcentajes
2. El promedio se calcula automáticamente
3. Agrega o elimina notas según necesites (mínimo 3 requeridas)

### Modo Examen
1. Activa el "Modo Examen"
2. Define el porcentaje que vale tu examen final
3. Ingresa tus notas parciales (se redistribuyen automáticamente)
4. La calculadora te mostrará:
   - Tu promedio actual sin el examen
   - Qué nota necesitas en el examen para aprobar
   - Tu promedio final una vez ingreses la nota del examen

## Validaciones

- Los porcentajes no pueden exceder el 100%
- En modo examen, las notas parciales se ajustan al porcentaje disponible
- Se requiere un mínimo de 3 notas
- La nota de aprobación por defecto es 4.0 (modificable)

## Estructura del proyecto

```
src/
├── App.tsx        # Componente principal con toda la lógica
├── App.css        # Estilos de la aplicación
├── types.ts       # Definiciones de tipos TypeScript
└── main.tsx       # Punto de entrada de React
```

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).