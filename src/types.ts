export interface Nota {
  id: string;
  nombre: string;
  valor: number;
  porcentaje: number;
}

export interface CalculadoraState {
  notas: Nota[];
  modoExamen: boolean;
  porcentajeExamen: number;
}