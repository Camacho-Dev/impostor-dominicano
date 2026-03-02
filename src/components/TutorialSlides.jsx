import { useState, useEffect } from 'react';

// Tour guiado sobre la pantalla de inicio con flechas apuntando a cada sección clave

const PASOS = [
  {
    id: 'categorias',
    selector: '[data-tour="categorias"]',
    titulo: '1. Elige las categorías 🎯',
    descripcion: 'Selecciona la categoría para que las palabras y pistas estén relacionadas con ese tema. Mientras más selecciones, más variedad de rondas.',
    posicion: 'abajo'
  },
  {
    id: 'pista',
    selector: '[data-tour="pista-impostor"]',
    titulo: '2. Pista al impostor 💡',
    descripcion: 'Activa o desactiva si el impostor recibe una pista de la palabra. Con pista es más fácil para el impostor, sin pista es mucho más difícil.',
    posicion: 'arriba'
  },
  {
    id: 'modos',
    selector: '[data-tour="modos"]',
    titulo: '3. Modos especiales 😈',
    descripcion: 'Aquí activas los Modos Aleatorios y Diabólicos: más caos, reglas locas y partidas diferentes. Si no quieres complicarte, puedes dejarlos apagados.',
    posicion: 'arriba'
  },
  {
    id: 'empezar',
    selector: '[data-tour="boton-empezar"]',
    titulo: '4. Empezar partida 🎮',
    descripcion: 'Cuando tengas categorías y opciones listas, toca este botón. Luego escribirás los nombres de los jugadores y comenzará el lío.',
    posicion: 'arriba'
  }
];

function calcularPosicion(targetRect, posicionPreferida) {
  if (!targetRect) {
    return {
      top: '50%',
      left: '50%',
      translateX: '-50%',
      translateY: '-50%',
      flecha: null
    };
  }

  const scrollY = window.scrollY || 0;
  const centerX = targetRect.left + targetRect.width / 2;

  if (posicionPreferida === 'abajo') {
    return {
      top: `${targetRect.bottom + 12 + scrollY}px`,
      left: `${centerX}px`,
      translateX: '-50%',
      translateY: '0',
      flecha: 'arriba'
    };
  }

  return {
    top: `${targetRect.top - 12 + scrollY}px`,
    left: `${centerX}px`,
    translateX: '-50%',
    translateY: '-100%',
    flecha: 'abajo'
  };
}

function TutorialSlides({ onClose }) {
  const [pasoActual, setPasoActual] = useState(0);
  const [targetRect, setTargetRect] = useState(null);

  const paso = PASOS[pasoActual];
  const esUltimo = pasoActual === PASOS.length - 1;

  // Recalcular posición al cambiar de paso o al redimensionar / hacer scroll
  useEffect(() => {
    const actualizar = () => {
      if (!paso) return;
      const el = document.querySelector(paso.selector);
      if (el) {
        try {
          el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        } catch (_) {}
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      } else {
        setTargetRect(null);
      }
    };

    actualizar();
    window.addEventListener('resize', actualizar);
    window.addEventListener('scroll', actualizar, { passive: true });

    return () => {
      window.removeEventListener('resize', actualizar);
      window.removeEventListener('scroll', actualizar);
    };
  }, [pasoActual, paso]);

  const avanzar = () => {
    if (esUltimo) {
      onClose?.();
      return;
    }
    setPasoActual((i) => Math.min(i + 1, PASOS.length - 1));
  };

  const retroceder = () => {
    setPasoActual((i) => Math.max(i - 1, 0));
  };

  const posicionTooltip = calcularPosicion(targetRect, paso?.posicion);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tutorial de la pantalla de inicio"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 3000,
      }}
      onClick={onClose}
    >
      {/* Resalte del elemento objetivo */}
      {targetRect && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: targetRect.top + (window.scrollY || 0) - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
            borderRadius: 16,
            border: '2px solid rgba(250,250,250,0.9)',
            boxShadow: '0 0 0 4px rgba(255,255,255,0.25)',
            pointerEvents: 'none',
            transition: 'all 0.2s ease',
          }}
        />
      )}

      {/* Tooltip con flecha */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          top: posicionTooltip.top,
          left: posicionTooltip.left,
          transform: `translate(${posicionTooltip.translateX}, ${posicionTooltip.translateY})`,
          maxWidth: 320,
          width: 'calc(100% - 40px)',
          padding: '14px 14px 12px',
          background: 'rgba(15,23,42,0.96)',
          borderRadius: 14,
          border: '1px solid rgba(148,163,184,0.7)',
          boxShadow: '0 18px 50px rgba(0,0,0,0.7)',
          color: '#e5e7eb',
          zIndex: 3001,
        }}
      >
        {/* Flecha visual — más grande y visible */}
        {posicionTooltip.flecha === 'arriba' && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: -14,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '14px solid transparent',
              borderRight: '14px solid transparent',
              borderBottom: '14px solid rgba(15,23,42,0.96)',
              filter: 'drop-shadow(0 -1px 2px rgba(0,0,0,0.3))',
            }}
          />
        )}
        {posicionTooltip.flecha === 'abajo' && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: -14,
              left: '50%',
              transform: 'translateX(-50%) rotate(180deg)',
              width: 0,
              height: 0,
              borderLeft: '14px solid transparent',
              borderRight: '14px solid transparent',
              borderBottom: '14px solid rgba(15,23,42,0.96)',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
            }}
          />
        )}

        <div style={{ fontSize: '0.75em', textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.7, marginBottom: 4 }}>
          Paso {pasoActual + 1} de {PASOS.length}
        </div>
        <div style={{ fontWeight: 800, fontSize: '0.98em', marginBottom: 4 }}>
          {paso.titulo}
        </div>
        <div style={{ fontSize: '0.86em', opacity: 0.9, lineHeight: 1.5 }}>
          {paso.descripcion}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 8,
            gap: 8,
          }}
        >
          <button
            type="button"
            onClick={pasoActual === 0 ? onClose : retroceder}
            style={{
              padding: '6px 10px',
              borderRadius: 999,
              border: 'none',
              background: 'transparent',
              color: '#9ca3af',
              fontSize: '0.78em',
              cursor: 'pointer',
            }}
          >
            {pasoActual === 0 ? 'Cerrar' : '← Atrás'}
          </button>
          <button
            type="button"
            onClick={avanzar}
            style={{
              padding: '7px 14px',
              borderRadius: 999,
              border: 'none',
              background: '#22c55e',
              color: '#022c22',
              fontSize: '0.82em',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {esUltimo ? 'Listo, a jugar' : 'Siguiente'}
            {!esUltimo && <span>➡️</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TutorialSlides;
