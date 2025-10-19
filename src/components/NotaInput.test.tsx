import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotaInput } from './NotaInput';
import { Nota } from '../types';

describe('NotaInput Component', () => {
  const mockNota: Nota = {
    id: '1',
    nombre: 'Matemática',
    valor: 65,
    porcentaje: 25
  };

  const defaultProps = {
    nota: mockNota,
    porcentajeDisponible: 100,
    onChangeValor: vi.fn(),
    onChangeNombre: vi.fn(),
    onChangePorcentaje: vi.fn(),
    onEliminar: vi.fn(),
    puedeEliminar: true
  };

  it('should render the component with all inputs', () => {
    render(<NotaInput {...defaultProps} />);

    expect(screen.getByLabelText(/Nombre de la nota/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Valor de la nota/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Porcentaje de la nota/i)).toBeInTheDocument();
  });

  it('should display the note name', () => {
    render(<NotaInput {...defaultProps} />);

    const nameInput = screen.getByDisplayValue('Matemática');
    expect(nameInput).toBeInTheDocument();
  });

  it('should display the note value', () => {
    render(<NotaInput {...defaultProps} />);

    const valueInput = screen.getByDisplayValue('65');
    expect(valueInput).toBeInTheDocument();
  });

  it('should display the percentage', () => {
    render(<NotaInput {...defaultProps} />);

    const percentageInput = screen.getByDisplayValue('25');
    expect(percentageInput).toBeInTheDocument();
  });

  it('should call onChangeNombre when name input changes', async () => {
    const user = userEvent.setup();
    const onChangeNombre = vi.fn();

    render(
      <NotaInput
        {...defaultProps}
        onChangeNombre={onChangeNombre}
      />
    );

    const nameInput = screen.getByLabelText(/Nombre de la nota/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Historia');

    expect(onChangeNombre).toHaveBeenCalledWith('Historia');
  });

  it('should call onChangeValor when value input changes', async () => {
    const user = userEvent.setup();
    const onChangeValor = vi.fn();

    render(
      <NotaInput
        {...defaultProps}
        onChangeValor={onChangeValor}
      />
    );

    const valueInput = screen.getByLabelText(/Valor de la nota/i);
    await user.clear(valueInput);
    await user.type(valueInput, '55');

    expect(onChangeValor).toHaveBeenCalledWith(55);
  });

  it('should call onChangePorcentaje when percentage input changes', async () => {
    const user = userEvent.setup();
    const onChangePorcentaje = vi.fn();

    render(
      <NotaInput
        {...defaultProps}
        onChangePorcentaje={onChangePorcentaje}
      />
    );

    const percentageInput = screen.getByLabelText(/Porcentaje de la nota/i);
    await user.clear(percentageInput);
    await user.type(percentageInput, '30');

    expect(onChangePorcentaje).toHaveBeenCalledWith(30);
  });

  it('should show delete button when puedeEliminar is true', () => {
    render(<NotaInput {...defaultProps} puedeEliminar={true} />);

    const deleteButton = screen.getByLabelText(/Eliminar nota/i);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should not show delete button when puedeEliminar is false', () => {
    render(
      <NotaInput
        {...defaultProps}
        puedeEliminar={false}
      />
    );

    const deleteButton = screen.queryByLabelText(/Eliminar nota/i);
    expect(deleteButton).not.toBeInTheDocument();
  });

  it('should call onEliminar when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onEliminar = vi.fn();

    render(
      <NotaInput
        {...defaultProps}
        onEliminar={onEliminar}
        puedeEliminar={true}
      />
    );

    const deleteButton = screen.getByLabelText(/Eliminar nota/i);
    await user.click(deleteButton);

    expect(onEliminar).toHaveBeenCalled();
  });

  it('should show error message when validation state is invalid', () => {
    const invalidNota: Nota = {
      id: '1',
      nombre: '',
      valor: 5, // Less than 10 - invalid
      porcentaje: 25
    };

    render(
      <NotaInput
        {...defaultProps}
        nota={invalidNota}
      />
    );

    expect(screen.getByText(/La nota debe estar entre 10 y 70/i)).toBeInTheDocument();
  });

  it('should show error when percentage exceeds available', () => {
    const invalidNota: Nota = {
      id: '1',
      nombre: '',
      valor: 65,
      porcentaje: 150 // Exceeds 100 available
    };

    render(
      <NotaInput
        {...defaultProps}
        nota={invalidNota}
        porcentajeDisponible={100}
      />
    );

    expect(screen.getByText(/El porcentaje no puede exceder/i)).toBeInTheDocument();
  });

  it('should have aria-invalid attribute when validation state is invalid', () => {
    const invalidNota: Nota = {
      id: '1',
      nombre: '',
      valor: 5,
      porcentaje: 25
    };

    render(
      <NotaInput
        {...defaultProps}
        nota={invalidNota}
      />
    );

    const valueInput = screen.getByLabelText(/Valor de la nota/i);
    expect(valueInput).toHaveAttribute('aria-invalid', 'true');
  });

  it('should not have aria-invalid attribute when validation state is valid', () => {
    render(<NotaInput {...defaultProps} />);

    const valueInput = screen.getByLabelText(/Valor de la nota/i);
    expect(valueInput).toHaveAttribute('aria-invalid', 'false');
  });
});
