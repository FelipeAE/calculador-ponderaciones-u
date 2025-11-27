import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AprobacionSelector } from './AprobacionSelector';

describe('AprobacionSelector Component', () => {
  const defaultProps = {
    notaAprobacion: 40,
    onChangeNotaAprobacion: vi.fn()
  };

  it('should render the component with title', () => {
    render(<AprobacionSelector {...defaultProps} />);

    expect(screen.getByText(/Nota de Aprobación/i)).toBeInTheDocument();
    expect(screen.getByText(/Selecciona la nota mínima requerida/i)).toBeInTheDocument();
  });

  it('should render all 5 passing grade buttons', () => {
    render(<AprobacionSelector {...defaultProps} />);

    expect(screen.getByRole('button', { name: /Seleccionar nota de aprobación 40/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Seleccionar nota de aprobación 45/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Seleccionar nota de aprobación 50/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Seleccionar nota de aprobación 55/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Seleccionar nota de aprobación 60/i })).toBeInTheDocument();
  });

  it('should mark the current selection as active', () => {
    render(<AprobacionSelector {...defaultProps} notaAprobacion={50} />);

    const button50 = screen.getByRole('button', { name: /Seleccionar nota de aprobación 50/i });
    expect(button50).toHaveClass('active');
  });

  it('should call onChangeNotaAprobacion when a button is clicked', async () => {
    const user = userEvent.setup();
    const onChangeNotaAprobacion = vi.fn();

    render(
      <AprobacionSelector
        {...defaultProps}
        onChangeNotaAprobacion={onChangeNotaAprobacion}
      />
    );

    const button55 = screen.getByRole('button', { name: /Seleccionar nota de aprobación 55/i });
    await user.click(button55);

    expect(onChangeNotaAprobacion).toHaveBeenCalledWith(55);
  });

  it('should have proper aria-pressed attribute on active button', () => {
    render(<AprobacionSelector {...defaultProps} notaAprobacion={45} />);

    const button45 = screen.getByRole('button', { name: /Seleccionar nota de aprobación 45/i });
    expect(button45).toHaveAttribute('aria-pressed', 'true');

    const button40 = screen.getByRole('button', { name: /Seleccionar nota de aprobación 40/i });
    expect(button40).toHaveAttribute('aria-pressed', 'false');
  });

  it('should have group role for accessibility', () => {
    render(<AprobacionSelector {...defaultProps} />);

    const group = screen.getByRole('group', { name: /Selección de nota de aprobación/i });
    expect(group).toBeInTheDocument();
  });

  it('should call onChangeNotaAprobacion with correct value for each button', async () => {
    const user = userEvent.setup();
    const onChangeNotaAprobacion = vi.fn();

    render(
      <AprobacionSelector
        notaAprobacion={40}
        onChangeNotaAprobacion={onChangeNotaAprobacion}
      />
    );

    // Test each button
    const valores = [40, 45, 50, 55, 60];

    for (const valor of valores) {
      const button = screen.getByRole('button', { name: new RegExp(`Seleccionar nota de aprobación ${valor}`, 'i') });
      await user.click(button);
      expect(onChangeNotaAprobacion).toHaveBeenCalledWith(valor);
    }

    expect(onChangeNotaAprobacion).toHaveBeenCalledTimes(5);
  });
});
