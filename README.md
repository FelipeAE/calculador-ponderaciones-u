# Calculadora de Ponderaciones Universitarias

Una aplicación web moderna y responsiva para calcular promedios ponderados de calificaciones universitarias, con modo de examen integrado, simulador avanzado y análisis de recuperación.

## 🎯 Características

- **Cálculo de promedio ponderado**: Calcula automáticamente el promedio basado en notas y porcentajes
- **Modo examen**: Permite reservar un porcentaje para un examen final y redistribuir las notas existentes
- **Cálculo de nota necesaria**: En modo examen, muestra qué nota necesitas para aprobar
- **Simulador avanzado**: Simula escenarios específicos con evaluaciones futuras
- **Análisis de recuperación**: Determina si puedes aprobar con el porcentaje restante
- **Validación inteligente**: Previene que los porcentajes excedan el límite permitido
- **Interfaz responsive**: Funciona perfectamente en dispositivos móviles, tablets y desktop
- **Modo oscuro**: Toggle de tema completo con estilos adaptados
- **Indicador visual**: Muestra visualmente si apruebas o repruebas
- **Validación en tiempo real**: Feedback inmediato con colores (verde, rojo, naranja)

## 🛠️ Tecnologías

- **React 18** con TypeScript para seguridad de tipos
- **Vite** como bundler y servidor de desarrollo (hot reload ultrarrápido)
- **ESLint v9** para linting y calidad de código
- **Vitest** para tests unitarios
- **CSS modular** con variables CSS y dark mode integrado
- **GitHub Pages** para despliegue automático

## 📦 Instalación y uso

### Prerrequisitos
- Node.js 16+
- npm o yarn

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
npm run dev         # Inicia servidor de desarrollo (Vite hot reload)
npm run build       # Construye para producción (TypeScript + Vite)
npm run lint        # Ejecuta ESLint
npm run lint:fix    # Ejecuta ESLint con autofixes
npm run test        # Ejecuta tests unitarios
npm run test:ui     # Ejecuta tests con interfaz visual
npm run test:coverage # Genera reporte de cobertura
npm run preview     # Previsualiza build de producción
```

## 📖 Cómo usar

### Modo Normal
1. Ingresa tus notas (rango 10-70)
2. Asigna porcentaje a cada nota
3. El promedio se calcula automáticamente
4. Suma de porcentajes no puede exceder 100%

### Modo Examen
1. Activa "Dar Examen"
2. Define % que vale el examen (default 30%)
3. Ingresa notas parciales (se ajustan al % disponible)
4. La calculadora muestra:
   - Promedio actual sin examen
   - Nota necesaria en el examen para aprobar
   - Promedio final cuando ingreses nota del examen
   - Estado de aprobación (Aprobado/Reprobado)

### Simulador Avanzado
- Simula escenarios específicos
- Define cuántas evaluaciones futuras tendrás
- Especifica el porcentaje total que representan
- Obtén la nota promedio necesaria

### Análisis de Recuperación
- Calcula automáticamente si puedes aprobar
- Usa TODO el porcentaje restante
- Muestra la nota mínima necesaria
- Indica si es posible o imposible recuperarse

## 🎨 Estilos y Responsividad

- **Desktop (768px+)**: Layout de 3 columnas con máximo ancho de 900px
- **Tablet (768px-480px)**: Layout adaptado con elementos apilados
- **Móvil (<480px)**: Layout vertical optimizado para pantallas pequeñas
- **Dark Mode**: Toggle completo con paleta de colores invertida
- **Validación visual**:
  - Verde (#10b981): Válido
  - Rojo (#ef4444): Inválido
  - Naranja (#f59e0b): Advertencia

## 📐 Fórmulas de Cálculo

### Promedio Actual
```
Promedio = Σ(nota × porcentaje) / 100
```

### Promedio con Examen
```
Porcentaje restante = 100 - porcentaje_examen
Factor ajuste = porcentaje_restante / total_porcentajes_notas

Promedio notas ajustado = promedio_notas × factor_ajuste
Promedio final = (promedio_notas_ajustado × porcentaje_restante/100) + (nota_examen × porcentaje_examen/100)
```

### Nota Necesaria en Examen
```
Nota necesaria = (nota_aprobacion - promedio_notas_ajustado) × (100 / porcentaje_examen)
```

## 🔍 Validaciones

- **Notas**: Rango 10-70 (escala universitaria)
- **Porcentajes**: No pueden exceder 100% (o % disponible en modo examen)
- **Mínimo de notas**: 3 requeridas (máximo no hay límite)
- **Nota de aprobación**: Configurable (default 40)
- **Nota máxima**: 70 (para cálculos de recuperación)

## 📁 Estructura del Proyecto

```
src/
├── App.tsx                    # Componente principal
├── App.css                    # Estilos (CSS puro)
├── main.tsx                   # Punto de entrada React
├── types.ts                   # Interfaces TypeScript
├── index.css                  # Estilos globales
├── utils/
│   ├── calculations.ts        # Lógica de cálculos (extraída)
│   ├── calculations.test.ts   # Tests unitarios
│   └── validations.ts         # Funciones de validación
└── __tests__/
    └── [futuros tests aquí]
```

## 🧪 Testing

Los tests están implementados con Vitest:

```bash
# Ejecutar tests
npm run test

# Tests con UI visual
npm run test:ui

# Cobertura de código
npm run test:coverage
```

Tests incluidos:
- Cálculo de promedios
- Validación de porcentajes
- Análisis de recuperación
- Manejo de casos edge

## 🚀 Despliegue

### GitHub Pages (Automático)
- Cada push a `main` dispara workflow de CI/CD
- Build automático y deploy a GitHub Pages
- URL: `https://usuario.github.io/calculador-ponderaciones-u/`

### Despliegue manual
```bash
npm run build
# Los archivos están en dist/
```

## 🎯 Mejoras Recientes

✅ **Prioridad Alta (Completada)**
- ✅ Configuración ESLint v9
- ✅ CSS refactorizado (sin duplicados, mejor responsive)
- ✅ Lógica de cálculos extraída a utils/
- ✅ Validaciones centralizadas

✅ **Prioridad Media (Completada)**
- ✅ Validación en tiempo real
- ✅ Tests unitarios con Vitest
- ✅ README actualizado con documentación completa

📋 **Próximas Mejoras (Futuro)**
- Persistencia en localStorage
- Exportar resultados (PDF/CSV)
- Internacionalización (i18n)
- Componentes más pequeños y reutilizables

## 🐛 Problemas Solucionados

- ✅ CSS duplicado eliminado
- ✅ Media queries consolidadas
- ✅ Responsividad mejorada (ahora ocupa todo el espacio)
- ✅ Dark mode integrado completamente
- ✅ ESLint configurado y funcionando
- ✅ Lógica inline removida del JSX

## 📚 Documentación

### Archivos Importantes
- [CLAUDE.md](CLAUDE.md) - Instrucciones para Claude Code
- [eslint.config.js](eslint.config.js) - Configuración de linting
- [vitest.config.ts](vitest.config.ts) - Configuración de tests
- [vite.config.ts](vite.config.ts) - Configuración de bundler

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Asegúrate que los tests pasen (`npm run test`)
4. Verifica linting (`npm run lint`)
5. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
6. Push a la rama (`git push origin feature/nueva-caracteristica`)
7. Abre un Pull Request

## 📝 Notas para Desarrolladores

- TypeScript está configurado en modo estricto
- ESLint ejecuta automáticamente pre-commit
- Los cálculos están centralizados en `utils/calculations.ts` para fácil testing
- Las validaciones están en `utils/validations.ts`
- Usa `useMemo` para optimizar cálculos costosos
- Los estilos usan CSS variables para fácil personalización

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).

---

**¿Preguntas o sugerencias?** Abre un [issue](../../issues) o una [discusión](../../discussions).
