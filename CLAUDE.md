# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a grade weighting calculator built with React + TypeScript + Vite. It's a single-page application that calculates weighted averages for academic grades with an optional exam mode.

## Development Commands

- `npm run dev` - Start development server (runs on http://localhost:5173)
- `npm run build` - Build for production (TypeScript compilation + Vite build)  
- `npm run lint` - Run ESLint on the codebase
- `npm run preview` - Preview production build locally

## Architecture

### Core State Management
The application uses React hooks for state management with these key pieces of state:
- `notas`: Array of grade objects (valor, porcentaje)
- `modoExamen`: Boolean for exam mode toggle
- `porcentajeExamen`: Percentage weight of the exam
- `notaExamen`: The actual exam grade
- `notaAprobacion`: Minimum passing grade

### Calculation Logic
Two main calculation modes:

**Normal Mode**: Simple weighted average
```
Promedio = Σ(nota × porcentaje) / 100
```

**Exam Mode**: Redistributed weighting
- Existing grades get adjusted to fit remaining percentage after exam
- Formula: `(Existing grades × remaining%) + (Exam grade × exam%)`
- Factor adjustment: `(100 - examPercentage) / totalGradesPercentage`

### Validation Rules
- Normal mode: Total percentages cannot exceed 100%
- Exam mode: Grade percentages cannot exceed `100% - exam percentage`
- Minimum 3 grades required (can only delete when more than 3 exist)

### Key Components Structure
- Single `App.tsx` component handles all logic
- Separate `types.ts` for TypeScript interfaces
- CSS modules approach with `App.css` for styling
- Responsive design with mobile-first approach

### Important Implementation Details
- Uses `useMemo` for expensive calculations (promedio actual/final)
- Grade percentage validation differs between modes
- Dynamic "nota que necesitas" calculation in exam mode
- Approval/failure status shown when exam grade is entered