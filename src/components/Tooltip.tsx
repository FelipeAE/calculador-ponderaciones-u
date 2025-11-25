import { useState, ReactNode } from 'react';

/**
 * Props del componente Tooltip
 */
interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Componente Tooltip reutilizable con soporte de accesibilidad
 * Muestra información adicional al hacer hover o focus
 */
export const Tooltip = ({ content, children, position = 'top' }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="tooltip-wrapper"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`tooltip-content tooltip-${position}`}
          role="tooltip"
          aria-live="polite"
        >
          {content}
        </div>
      )}
    </div>
  );
};
