import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultadosSection } from './ResultadosSection';

describe('ResultadosSection Component', () => {
  const defaultProps = {
    promedioActual: 50.5,
    promedioFinal: 55.3,
    modoExamen: false,
    notaExamen: 0,
    notaAprobacion: 40
  };

  it('should render current average', () => {
    render(<ResultadosSection {...defaultProps} />);

    expect(screen.getByText(/Promedio Actual/i)).toBeInTheDocument();
    expect(screen.getByText('50.50')).toBeInTheDocument();
  });

  it('should not show final average when modoExamen is false', () => {
    render(<ResultadosSection {...defaultProps} />);

    expect(screen.queryByText(/Promedio Final/i)).not.toBeInTheDocument();
  });

  it('should show final average when modoExamen is true', () => {
    render(
      <ResultadosSection
        {...defaultProps}
        modoExamen={true}
      />
    );

    expect(screen.getByText(/Promedio Final \(con examen\)/i)).toBeInTheDocument();
    expect(screen.getByText('55.30')).toBeInTheDocument();
  });

  it('should show passed status when final average >= approval grade', () => {
    render(
      <ResultadosSection
        {...defaultProps}
        modoExamen={true}
        notaExamen={60}
        promedioFinal={50}
        notaAprobacion={40}
      />
    );

    expect(screen.getByText(/¡Aprobado!/i)).toBeInTheDocument();
  });

  it('should show failed status when final average < approval grade', () => {
    render(
      <ResultadosSection
        {...defaultProps}
        modoExamen={true}
        notaExamen={10}
        promedioFinal={30}
        notaAprobacion={40}
      />
    );

    expect(screen.getByText(/Reprobado/i)).toBeInTheDocument();
  });

  it('should not show status when notaExamen is 0 even if modoExamen is true', () => {
    render(
      <ResultadosSection
        {...defaultProps}
        modoExamen={true}
        notaExamen={0}
      />
    );

    expect(screen.queryByText(/¡Aprobado!/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Reprobado/i)).not.toBeInTheDocument();
  });

  it('should have proper roles for accessibility', () => {
    render(
      <ResultadosSection
        {...defaultProps}
        modoExamen={true}
      />
    );

    expect(screen.getByRole('region', { name: /Resultados de cálculos/i })).toBeInTheDocument();
  });

  it('should display aria labels with numeric values', () => {
    render(
      <ResultadosSection
        {...defaultProps}
        promedioActual={65.75}
      />
    );

    const currentAverageDiv = screen.getByLabelText(/Promedio actual: 65.75/i);
    expect(currentAverageDiv).toBeInTheDocument();
  });

  it('should format final average to 1 decimal place in status message', () => {
    render(
      <ResultadosSection
        {...defaultProps}
        modoExamen={true}
        notaExamen={60}
        promedioFinal={55.126}
        notaAprobacion={40}
      />
    );

    expect(screen.getByText(/Nota final: 55.1/)).toBeInTheDocument();
  });
});
