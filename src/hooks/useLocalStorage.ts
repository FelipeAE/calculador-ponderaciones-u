import { useState, useEffect } from 'react';

/**
 * Hook personalizado para gestionar estado con persistencia en localStorage
 * @param key Clave del localStorage
 * @param initialValue Valor inicial si no existe en localStorage
 * @returns [storedValue, setValue]
 */
export const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading from localStorage for key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error writing to localStorage for key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};
