/**
 * Tests para funciones de cálculo
 * Para ejecutar: npm install vitest && npm run test
 */

import { describe, it, expect } from 'vitest';
import {
  calcularPromedioActual,
  calcularPromedioFinal,
  calcularNotaNecesariaExamen,
  calcularPorcentajeTotal,
  calcularPorcentajeDisponible,
  calcularRecuperacion
} from './calculations';
import { Nota } from '../types';

describe('Cálculos de Promedio', () => {
  describe('calcularPromedioActual', () => {
    it('debe calcular correctamente con dos notas', () => {
      const notas: Nota[] = [
        { id: '1', nombre: '', valor: 50, porcentaje: 40 },
        { id: '2', nombre: '', valor: 60, porcentaje: 60 }
      ];
      const resultado = calcularPromedioActual(notas);
      expect(resultado).toBe(56); // (50*40 + 60*60)/100 = 56
    });

    it('debe retornar 0 si no hay notas con porcentaje', () => {
      const notas: Nota[] = [
        { id: '1', nombre: '', valor: 50, porcentaje: 0 },
        { id: '2', nombre: '', valor: 60, porcentaje: 0 }
      ];
      const resultado = calcularPromedioActual(notas);
      expect(resultado).toBe(0);
    });

    it('debe ignorar notas con porcentaje 0', () => {
      const notas: Nota[] = [
        { id: '1', nombre: '', valor: 50, porcentaje: 0 },
        { id: '2', nombre: '', valor: 60, porcentaje: 100 }
      ];
      const resultado = calcularPromedioActual(notas);
      expect(resultado).toBe(60);
    });

    it('debe trabajar con decimales', () => {
      const notas: Nota[] = [
        { id: '1', nombre: '', valor: 50.5, porcentaje: 50 },
        { id: '2', nombre: '', valor: 60.5, porcentaje: 50 }
      ];
      const resultado = calcularPromedioActual(notas);
      expect(resultado).toBeCloseTo(55.5, 1);
    });
  });

  describe('calcularPromedioFinal', () => {
    it('debe calcular correctamente con examen', () => {
      const notas: Nota[] = [
        { id: '1', nombre: '', valor: 50, porcentaje: 70 }
      ];
      const resultado = calcularPromedioFinal(notas, 30, 60);
      // Promedio sin examen = 50
      // Factor de ajuste = (100-30)/70 = 1
      // Promedio ajustado = 50 * 1 = 50
      // Promedio final = 50 * 0.7 + 60 * 0.3 = 35 + 18 = 53
      expect(resultado).toBeCloseTo(53, 1);
    });

    it('debe retornar solo nota de examen si no hay otras notas', () => {
      const notas: Nota[] = [
        { id: '1', nombre: '', valor: 0, porcentaje: 0 }
      ];
      const resultado = calcularPromedioFinal(notas, 30, 60);
      expect(resultado).toBe(18); // 60 * 30/100 = 18
    });
  });

  describe('calcularNotaNecesariaExamen', () => {
    it('debe calcular nota necesaria en el examen', () => {
      const notas: Nota[] = [
        { id: '1', nombre: '', valor: 35, porcentaje: 100 }
      ];
      const resultado = calcularNotaNecesariaExamen(notas, 50, 40);
      // Si necesitas 40 total y tienes 35 en el 50% no examen
      // Necesitas: (40 - 35*1) / (50/100) = 5 / 0.5 = 10
      expect(resultado).toBe(10);
    });

    it('debe retornar 0 si no es necesaria nota adicional', () => {
      const notas: Nota[] = [
        { id: '1', nombre: '', valor: 50, porcentaje: 100 }
      ];
      const resultado = calcularNotaNecesariaExamen(notas, 50, 40);
      expect(resultado).toBe(0);
    });
  });
});

describe('Cálculos de Porcentaje', () => {
  describe('calcularPorcentajeTotal', () => {
    it('debe sumar correctamente los porcentajes', () => {
      const notas: Nota[] = [
        { id: '1', nombre: '', valor: 50, porcentaje: 25 },
        { id: '2', nombre: '', valor: 60, porcentaje: 75 }
      ];
      expect(calcularPorcentajeTotal(notas)).toBe(100);
    });

    it('debe retornar 0 si no hay notas', () => {
      expect(calcularPorcentajeTotal([])).toBe(0);
    });
  });

  describe('calcularPorcentajeDisponible', () => {
    it('debe retornar 100 si no está en modo examen', () => {
      expect(calcularPorcentajeDisponible(false, 30)).toBe(100);
    });

    it('debe restar porcentaje de examen si está en modo examen', () => {
      expect(calcularPorcentajeDisponible(true, 30)).toBe(70);
    });

    it('debe manejar valores diferentes de porcentaje de examen', () => {
      expect(calcularPorcentajeDisponible(true, 50)).toBe(50);
    });
  });
});

describe('Análisis de Recuperación', () => {
  it('debe indicar si es posible aprobar', () => {
    const notas: Nota[] = [
      { id: '1', nombre: '', valor: 30, porcentaje: 50 }
    ];
    const resultado = calcularRecuperacion(notas, false, 0, 30, 30, 40);
    expect(resultado.esPosible).toBe(true);
    expect(resultado.porcentajeRestante).toBe(50);
  });

  it('debe indicar si es imposible aprobar', () => {
    const notas: Nota[] = [
      { id: '1', nombre: '', valor: 10, porcentaje: 100 }
    ];
    const resultado = calcularRecuperacion(notas, false, 0, 10, 10, 40);
    expect(resultado.esPosible).toBe(false);
  });

  it('debe indicar si ya está aprobado', () => {
    const notas: Nota[] = [
      { id: '1', nombre: '', valor: 50, porcentaje: 100 }
    ];
    const resultado = calcularRecuperacion(notas, false, 0, 50, 50, 40);
    expect(resultado.esPosible).toBe(true);
  });
});
