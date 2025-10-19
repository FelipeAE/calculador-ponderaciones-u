import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExamenSection } from './ExamenSection';

describe('ExamenSection Component', () => {
  const defaultProps = {
    modoExamen: false,
    porcentajeExamen: 30,
    notaExamen: 0,
    notaAprobacion: 40,
    notaNecesariaExamen: 45.5,
    onChangeExamen: vi.fn(),
    onChangePorcentajeExamen: vi.fn(),
    onChangeNotaExamen: vi.fn(),
    onChangeNotaAprobacion: vi.fn()
  };

  it('should render the component', () => {
    render(<ExamenSection {...defaultProps} />);

    expect(screen.getByText(/Configuración de Examen/i)).toBeInTheDocument();
    expect(screen.getByText(/Dar Examen/i)).toBeInTheDocument();
  });

  it('should show exam section when modoExamen is true', () => {
    render(
      <ExamenSection
        {...defaultProps}
        modoExamen={true}
      />
    );

    expect(screen.getByLabelText(/Ingresa tu nota del examen/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Porcentaje que vale el examen/i)).toBeInTheDocument();
  });

  it('should not show exam section when modoExamen is false', () => {
    render(<ExamenSection {...defaultProps} />);

    expect(screen.queryByLabelText(/Ingresa tu nota del examen/i)).not.toBeInTheDocument();
  });

  it('should call onChangeExamen when checkbox is toggled', async () => {
    const user = userEvent.setup();
    const onChangeExamen = vi.fn();

    render(
      <ExamenSection
        {...defaultProps}
        onChangeExamen={onChangeExamen}
      />
    );

    const checkbox = screen.getByRole('checkbox', { name: /Activar modo examen/i });
    await user.click(checkbox);

    expect(onChangeExamen).toHaveBeenCalledWith(true);
  });

  it('should display exam percentage when modoExamen is true', () => {
    render(
      <ExamenSection
        {...defaultProps}
        modoExamen={true}
        porcentajeExamen={30}
      />
    );

    const percentageInput = screen.getByLabelText(/Porcentaje que vale el examen/i);
    expect(percentageInput).toHaveValue(30);
  });

  it('should call onChangePorcentajeExamen when percentage changes', async () => {
    const user = userEvent.setup();
    const onChangePorcentajeExamen = vi.fn();

    render(
      <ExamenSection
        {...defaultProps}
        modoExamen={true}
        onChangePorcentajeExamen={onChangePorcentajeExamen}
      />
    );

    const percentageInput = screen.getByLabelText(/Porcentaje que vale el examen/i);
    await user.clear(percentageInput);
    await user.type(percentageInput, '40');

    expect(onChangePorcentajeExamen).toHaveBeenCalledWith(40);
  });

  it('should call onChangeNotaExamen when exam grade changes', async () => {
    const user = userEvent.setup();
    const onChangeNotaExamen = vi.fn();

    render(
      <ExamenSection
        {...defaultProps}
        modoExamen={true}
        onChangeNotaExamen={onChangeNotaExamen}
      />
    );

    const gradeInput = screen.getByLabelText(/Ingresa tu nota del examen/i);
    await user.clear(gradeInput);
    await user.type(gradeInput, '50');

    expect(onChangeNotaExamen).toHaveBeenCalledWith(50);
  });

  it('should display necessary exam grade when modoExamen is true', () => {
    render(
      <ExamenSection
        {...defaultProps}
        modoExamen={true}
        notaNecesariaExamen={45.5}
      />
    );

    expect(screen.getByText(/45.5/)).toBeInTheDocument();
  });

  it('should have fieldset role for semantic markup', () => {
    render(<ExamenSection {...defaultProps} />);

    const fieldset = screen.getByRole('group');
    expect(fieldset).toBeInTheDocument();
  });

  it('should have proper aria labels for all inputs when modoExamen is true', () => {
    render(
      <ExamenSection
        {...defaultProps}
        modoExamen={true}
      />
    );

    expect(screen.getByLabelText(/Ingresa tu nota del examen/i)).toHaveAttribute('aria-describedby');
    expect(screen.getByLabelText(/Porcentaje que vale el examen/i)).toHaveAttribute('aria-describedby');
  });
});
