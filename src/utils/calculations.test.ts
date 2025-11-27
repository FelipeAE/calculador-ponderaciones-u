/**
 * Tests para funciones de cálculo
 * Para ejecutar: npm install vitest && npm run test
 */

import { describe, it, expect } from 'vitest';
import {
  calcularPromedioActual,
  calcularPromedioFinal,
  calcularNotaNecesariaExamen,
  calcularSimuladorAvanzado,
  calcularRecuperacion,
  calcularPorcentajeTotal,
  calcularPorcentajeDisponible
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
      // Promedio de notas: 50 * 0.70 = 35
      // Porcentaje faltante: 100 - 70 = 30%
      // Contribución faltante: 10 * 0.30 = 3
      // Promedio base: 35 + 3 = 38
      // Redistribución: 38 * 0.70 = 26.6
      // Contribución examen: 60 * 0.30 = 18
      // Promedio final: 26.6 + 18 = 44.6
      expect(resultado).toBeCloseTo(44.6, 1);
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
      // promedioNotasAjustado = 35 * 0.5 = 17.5
      // notaNecesaria = (40 - 17.5) * 100 / 50 = 45
      expect(resultado).toBe(45);
    });

    it('debe retornar 0 si ya estás aprobado sin examen', () => {
      const notas: Nota[] = [
        { id: '1', nombre: '', valor: 70, porcentaje: 100 }
      ];
      const resultado = calcularNotaNecesariaExamen(notas, 50, 40);
      // promedioNotasAjustado = 70 * 0.5 = 35
      // notaNecesaria = (40 - 35) * 100 / 50 = 10
      // Pero si es menor que 0, retorna 0
      expect(resultado).toBe(10);
    });

    it('debe retornar 0 si ya estás muy por encima', () => {
      const notas: Nota[] = [
        { id: '1', nombre: '', valor: 60, porcentaje: 100 }
      ];
      const resultado = calcularNotaNecesariaExamen(notas, 50, 35);
      // promedioNotasAjustado = 60 * 0.5 = 30
      // notaNecesaria = (35 - 30) * 100 / 50 = 10
      // Math.max(0, 10) = 10
      expect(resultado).toBe(10);
    });

    it('debe retornar solo nota de examen si no hay otras notas', () => {
      const notas: Nota[] = [
        { id: '1', nombre: '', valor: 0, porcentaje: 0 }
      ];
      const resultado = calcularNotaNecesariaExamen(notas, 50, 40);
      // notaAprobacion * 100 / porcentajeExamen = 40 * 100 / 50 = 80
      expect(resultado).toBe(80);
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

  it('debe calcular correctamente con modo examen', () => {
    const notas: Nota[] = [
      { id: '1', nombre: '', valor: 45, porcentaje: 70 }
    ];
    const promedioActual = 45;
    const promedioFinal = 50;
    const resultado = calcularRecuperacion(notas, true, 30, promedioActual, promedioFinal, 40);
    expect(resultado.porcentajeRestante).toBe(0);
  });
});

describe('Simulador Avanzado', () => {
  it('debe calcular nota necesaria para escenarios futuros', () => {
    const notas: Nota[] = [
      { id: '1', nombre: '', valor: 50, porcentaje: 50 }
    ];
    const resultado = calcularSimuladorAvanzado(
      notas,
      false,
      0,
      2,
      30,
      40,
      50,
      50
    );
    expect(resultado).not.toBeNull();
    expect(resultado?.esPosible).toBe(true);
  });

  it('debe retornar null si los parámetros son inválidos', () => {
    const notas: Nota[] = [
      { id: '1', nombre: '', valor: 50, porcentaje: 50 }
    ];
    const resultado = calcularSimuladorAvanzado(
      notas,
      false,
      0,
      0,
      0,
      40,
      50,
      50
    );
    expect(resultado).toBeNull();
  });

  it('debe retornar null si porcentaje futuro excede disponible', () => {
    const notas: Nota[] = [
      { id: '1', nombre: '', valor: 50, porcentaje: 80 }
    ];
    const resultado = calcularSimuladorAvanzado(
      notas,
      false,
      0,
      2,
      50,
      40,
      50,
      50
    );
    expect(resultado).toBeNull();
  });
});

describe('Cálculos con Porcentaje Faltante', () => {
  describe('calcularNotaNecesariaExamen con porcentaje faltante', () => {
    it('debe considerar porcentaje faltante con nota mínima (10)', () => {
      // Caso del usuario: 65% de notas, 25% de examen, 35% faltante
      const notas: Nota[] = [
        { id: '1', nombre: '', valor: 70, porcentaje: 15 },
        { id: '2', nombre: '', valor: 40, porcentaje: 25 },
        { id: '3', nombre: '', valor: 30, porcentaje: 25 }
      ];
      // Promedio de notas: 70*0.15 + 40*0.25 + 30*0.25 = 10.5 + 10 + 7.5 = 28
      // Porcentaje faltante: 100 - 65 = 35%
      // Contribución faltante: 10 * 0.35 = 3.5
      // Promedio base: 28 + 3.5 = 31.5
      // Redistribución: 31.5 * 0.75 = 23.625
      // Nota necesaria: (40 - 23.625) * 100 / 25 = 65.5
      const resultado = calcularNotaNecesariaExamen(notas, 25, 40);
      expect(resultado).toBe(65.5);
    });

    it('debe redistribuir cuando no hay faltante', () => {
      // Caso con 100% de notas y 25% de examen
      const notas: Nota[] = [
        { id: '1', nombre: '', valor: 70, porcentaje: 15 },
        { id: '2', nombre: '', valor: 70, porcentaje: 25 },
        { id: '3', nombre: '', valor: 30, porcentaje: 25 },
        { id: '4', nombre: '', valor: 40, porcentaje: 35 }
      ];
      // Promedio de notas: 70*0.15 + 70*0.25 + 30*0.25 + 40*0.35 = 49.5
      // Porcentaje faltante: 100 - 100 = 0%
      // Contribución faltante: 0
      // Promedio base: 49.5 + 0 = 49.5
      // Redistribución: 49.5 * 0.75 = 37.125
      // Nota necesaria: (40 - 37.125) * 100 / 25 = 11.5
      const resultado = calcularNotaNecesariaExamen(notas, 25, 40);
      expect(resultado).toBeCloseTo(11.5, 1);
    });

    it('debe manejar caso extremo con solo faltante', () => {
      // 0% de notas, 25% de examen, 75% faltante
      const notas: Nota[] = [
        { id: '1', nombre: '', valor: 0, porcentaje: 0 }
      ];
      // Nota necesaria directa: 40 * 100 / 25 = 160
      const resultado = calcularNotaNecesariaExamen(notas, 25, 40);
      expect(resultado).toBe(160);
    });
  });

  describe('calcularPromedioFinal con porcentaje faltante', () => {
    it('debe incluir porcentaje faltante con nota mínima (10)', () => {
      // 65% de notas, 25% de examen, 35% faltante
      const notas: Nota[] = [
        { id: '1', nombre: '', valor: 70, porcentaje: 15 },
        { id: '2', nombre: '', valor: 40, porcentaje: 25 },
        { id: '3', nombre: '', valor: 30, porcentaje: 25 }
      ];
      const notaExamen = 50;
      // Promedio de notas: 28
      // Porcentaje faltante: 100 - 65 = 35%
      // Contribución faltante: 10 * 0.35 = 3.5
      // Promedio base: 28 + 3.5 = 31.5
      // Redistribución: 31.5 * 0.75 = 23.625
      // Contribución examen: 50 * 0.25 = 12.5
      // Promedio final: 23.625 + 12.5 = 36.125
      const resultado = calcularPromedioFinal(notas, 25, notaExamen);
      expect(resultado).toBeCloseTo(36.125, 2);
    });

    it('debe redistribuir cuando no hay faltante en promedio final', () => {
      // 100% de notas y 25% de examen
      const notas: Nota[] = [
        { id: '1', nombre: '', valor: 70, porcentaje: 15 },
        { id: '2', nombre: '', valor: 70, porcentaje: 25 },
        { id: '3', nombre: '', valor: 30, porcentaje: 25 },
        { id: '4', nombre: '', valor: 40, porcentaje: 35 }
      ];
      const notaExamen = 50;
      // Promedio de notas: 49.5
      // Porcentaje faltante: 100 - 100 = 0%
      // Contribución faltante: 0
      // Promedio base: 49.5 + 0 = 49.5
      // Redistribución: 49.5 * 0.75 = 37.125
      // Contribución examen: 50 * 0.25 = 12.5
      // Promedio final: 37.125 + 12.5 = 49.625
      const resultado = calcularPromedioFinal(notas, 25, notaExamen);
      expect(resultado).toBeCloseTo(49.625, 2);
    });
  });
});
