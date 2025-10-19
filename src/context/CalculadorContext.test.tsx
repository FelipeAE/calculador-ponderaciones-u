import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CalculadorProvider, useCalculador } from './CalculadorContext';
import React from 'react';

describe('CalculadorContext', () => {
  it('should provide initial values', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(CalculadorProvider, {}, children)
    );

    const { result } = renderHook(() => useCalculador(), { wrapper });

    expect(result.current.notas).toHaveLength(3);
    expect(result.current.modoExamen).toBe(false);
    expect(result.current.porcentajeExamen).toBe(30);
    expect(result.current.notaExamen).toBe(0);
    expect(result.current.notaAprobacion).toBe(40);
    expect(result.current.theme).toBe('light');
  });

  it('should add a new nota', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(CalculadorProvider, {}, children)
    );

    const { result } = renderHook(() => useCalculador(), { wrapper });

    act(() => {
      result.current.agregarNota();
    });

    expect(result.current.notas).toHaveLength(4);
  });

  it('should delete a nota', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(CalculadorProvider, {}, children)
    );

    const { result } = renderHook(() => useCalculador(), { wrapper });

    const notaIdToDelete = result.current.notas[0].id;

    act(() => {
      result.current.eliminarNota(notaIdToDelete);
    });

    expect(result.current.notas).toHaveLength(2);
    expect(result.current.notas.some(n => n.id === notaIdToDelete)).toBe(false);
  });

  it('should update a nota', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(CalculadorProvider, {}, children)
    );

    const { result } = renderHook(() => useCalculador(), { wrapper });

    const notaId = result.current.notas[0].id;

    act(() => {
      result.current.actualizarNota(notaId, 'valor', 65);
    });

    expect(result.current.notas[0].valor).toBe(65);
  });

  it('should update nota nombre', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(CalculadorProvider, {}, children)
    );

    const { result } = renderHook(() => useCalculador(), { wrapper });

    const notaId = result.current.notas[0].id;

    act(() => {
      result.current.actualizarNota(notaId, 'nombre', 'Matemática');
    });

    expect(result.current.notas[0].nombre).toBe('Matemática');
  });

  it('should toggle exam mode', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(CalculadorProvider, {}, children)
    );

    const { result } = renderHook(() => useCalculador(), { wrapper });

    act(() => {
      result.current.setModoExamen(true);
    });

    expect(result.current.modoExamen).toBe(true);
  });

  it('should update exam percentage', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(CalculadorProvider, {}, children)
    );

    const { result } = renderHook(() => useCalculador(), { wrapper });

    act(() => {
      result.current.setPorcentajeExamen(40);
    });

    expect(result.current.porcentajeExamen).toBe(40);
  });

  it('should calculate correct porcentajeTotal', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(CalculadorProvider, {}, children)
    );

    const { result } = renderHook(() => useCalculador(), { wrapper });

    act(() => {
      result.current.actualizarNota(result.current.notas[0].id, 'porcentaje', 25);
      result.current.actualizarNota(result.current.notas[1].id, 'porcentaje', 30);
      result.current.actualizarNota(result.current.notas[2].id, 'porcentaje', 45);
    });

    expect(result.current.porcentajeTotal).toBe(100);
  });

  it('should calculate correct promedioActual', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(CalculadorProvider, {}, children)
    );

    const { result } = renderHook(() => useCalculador(), { wrapper });

    act(() => {
      result.current.actualizarNota(result.current.notas[0].id, 'valor', 50);
      result.current.actualizarNota(result.current.notas[0].id, 'porcentaje', 50);
      result.current.actualizarNota(result.current.notas[1].id, 'valor', 60);
      result.current.actualizarNota(result.current.notas[1].id, 'porcentaje', 50);
      result.current.actualizarNota(result.current.notas[2].id, 'valor', 0);
      result.current.actualizarNota(result.current.notas[2].id, 'porcentaje', 0);
    });

    expect(result.current.promedioActual).toBe(55);
  });

  it('should clear all data', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(CalculadorProvider, {}, children)
    );

    const { result } = renderHook(() => useCalculador(), { wrapper });

    act(() => {
      result.current.setModoExamen(true);
      result.current.setPorcentajeExamen(50);
      result.current.setNotaExamen(70);
      result.current.limpiar();
    });

    expect(result.current.notas).toHaveLength(3);
    expect(result.current.modoExamen).toBe(false);
    expect(result.current.porcentajeExamen).toBe(30);
    expect(result.current.notaExamen).toBe(0);
  });

  it('should throw error when useCalculador is used outside CalculadorProvider', () => {
    const { result } = renderHook(() => useCalculador());

    expect(result.error).toBeTruthy();
  });

  it('should update theme', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(CalculadorProvider, {}, children)
    );

    const { result } = renderHook(() => useCalculador(), { wrapper });

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
  });
});
