import { useState } from 'react';

/**
 * Componente de sección de ayuda colapsable
 * Explica cómo funcionan los cálculos y las suposiciones del sistema
 */
export const HelpSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="help-section">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="help-toggle"
        aria-expanded={isOpen}
        aria-controls="help-content"
      >
        <span className="help-toggle-icon">{isOpen ? '▼' : '▶'}</span>
        <span>¿Cómo se calculan los promedios?</span>
      </button>

      {isOpen && (
        <div id="help-content" className="help-content">
          <div className="help-item">
            <h4>📝 Promedio de Notas Ingresadas</h4>
            <p>
              Este valor muestra el promedio ponderado de <strong>solo las notas que has ingresado</strong>.
            </p>
            <p>
              <strong>Fórmula:</strong> Σ(nota × porcentaje) / 100
            </p>
            <p>
              <strong>Ejemplo:</strong> Si tienes 70×15% + 70×25% + 70×25% = 45.5 puntos
            </p>
          </div>

          <div className="help-divider"></div>

          <div className="help-item">
            <h4>🔮 Promedio Proyectado</h4>
            <p>
              Este valor estima tu promedio final <strong>asumiendo que obtendrás la nota mínima (10)</strong> en el porcentaje que aún no has ingresado.
            </p>
            <p>
              <strong>¿Por qué nota 10?</strong> Es un escenario conservador que te permite planificar de forma realista.
            </p>
            <p>
              <strong>Ejemplo:</strong> Si tienes 45.5 puntos y falta 35%, se asume +3.5 puntos (10×35%) = 49.0 proyectado
            </p>
            <p className="help-note">
              ⚠️ Este es solo un promedio <em>proyectado</em>. Cuando ingreses la nota real, se usará ese valor en lugar del supuesto.
            </p>
          </div>

          <div className="help-divider"></div>

          <div className="help-item">
            <h4>🎯 Simuladores</h4>
            <p>
              Las herramientas de simulación te permiten explorar diferentes escenarios futuros:
            </p>
            <ul>
              <li>
                <strong>Simulador Avanzado:</strong> Simula un porcentaje específico de evaluaciones futuras. El porcentaje NO simulado se asume con nota 10.
              </li>
              <li>
                <strong>Análisis de Recuperación:</strong> Calcula qué nota necesitas en TODO el porcentaje restante para aprobar.
              </li>
            </ul>
          </div>

          <div className="help-divider"></div>

          <div className="help-item">
            <h4>📚 Modo Examen</h4>
            <p>
              Cuando activas el modo examen, el sistema redistribuye los pesos de tus notas actuales para que sumen el porcentaje restante después del examen.
            </p>
            <p>
              <strong>Ejemplo:</strong> Si el examen vale 30% y tus notas actuales suman 60%, se ajustan para que representen el 70% restante.
            </p>
          </div>

          <div className="help-divider"></div>

          <div className="help-item">
            <h4>💡 Tips</h4>
            <ul>
              <li>El "Promedio de Notas Ingresadas" muestra <em>solo</em> lo que ya ingresaste</li>
              <li>El "Promedio Proyectado" incluye una suposición (nota 10) para lo que falta</li>
              <li>Cuando agregas manualmente una nota, se reemplaza la suposición con el valor real</li>
              <li>Los simuladores te ayudan a planificar escenarios futuros</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
