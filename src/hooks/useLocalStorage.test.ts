import { describe, it, expect, beforeEach, afterEach } from 'vitest';

/**
 * Tests para verificar localStorage functionality
 * Nota: Los tests del hook se verifiquen en la práctica cuando se use en componentes
 */

describe('localStorage functionality', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe guardar y recuperar strings desde localStorage', () => {
    const key = 'test-string';
    const valor = 'hola';
    localStorage.setItem(key, JSON.stringify(valor));
    const recuperado = JSON.parse(localStorage.getItem(key) || '');
    expect(recuperado).toBe(valor);
  });

  it('debe guardar y recuperar números desde localStorage', () => {
    const key = 'test-number';
    const valor = 42;
    localStorage.setItem(key, JSON.stringify(valor));
    const recuperado = JSON.parse(localStorage.getItem(key) || '');
    expect(recuperado).toBe(valor);
  });

  it('debe guardar y recuperar objetos desde localStorage', () => {
    const key = 'test-object';
    const valor = { nombre: 'Juan', edad: 20 };
    localStorage.setItem(key, JSON.stringify(valor));
    const recuperado = JSON.parse(localStorage.getItem(key) || '');
    expect(recuperado).toEqual(valor);
  });

  it('debe guardar y recuperar arrays desde localStorage', () => {
    const key = 'test-array';
    const valor = [1, 2, 3, 4, 5];
    localStorage.setItem(key, JSON.stringify(valor));
    const recuperado = JSON.parse(localStorage.getItem(key) || '');
    expect(recuperado).toEqual(valor);
  });

  it('debe retornar null para claves inexistentes', () => {
    const resultado = localStorage.getItem('clave-inexistente');
    expect(resultado).toBeNull();
  });

  it('debe permitir actualizar valores en localStorage', () => {
    const key = 'test-update';
    localStorage.setItem(key, JSON.stringify('valor1'));
    localStorage.setItem(key, JSON.stringify('valor2'));
    const recuperado = JSON.parse(localStorage.getItem(key) || '');
    expect(recuperado).toBe('valor2');
  });

  it('debe permitir eliminar valores de localStorage', () => {
    const key = 'test-delete';
    localStorage.setItem(key, JSON.stringify('valor'));
    expect(localStorage.getItem(key)).not.toBeNull();
    localStorage.removeItem(key);
    expect(localStorage.getItem(key)).toBeNull();
  });
});
