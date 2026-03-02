import { useState, useEffect } from 'react';

// Tour guiado profesional sobre la pantalla de inicio

const PASOS = [
  {
    id: 'categorias',
    selector: '[data-tour="categorias"]',
    titulo: 'Elige las categorías',
    emoji: '🎯',
    descripcion: 'Selecciona la categoría para que las palabras y pistas estén relacionadas con ese tema. Mientras más selecciones, más variedad de rondas.',
    posicion: 'abajo'
  },
  {
    id: 'pista',
    selector: '[data-tour="pista-impostor"]',
    titulo: 'Pista al impostor',
    emoji: '💡',
    descripcion: 'Activa o desactiva si el impostor recibe una pista de la palabra. Con pista es más fácil para el impostor, sin pista es mucho más difícil.',
    posicion: 'arriba'
  },
  {
    id: 'modos',
    selector: '[data-tour="modos"]',
    titulo: 'Modos especiales',
    emoji: '😈',
    descripcion: 'Aquí activas los Modos Aleatorios y Diabólicos: más caos, reglas locas y partidas diferentes. Si no quieres complicarte, puedes dejarlos apagados.',
    posicion: 'arriba'
  },
  {
    id: 'empezar',
    selector: '[data-tour="boton-empezar"]',
    titulo: 'Empezar partida',
    emoji: '🎮',
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

  const padding = 6;
  const hole = targetRect
    ? {
        top: targetRect.top - padding,
        left: targetRect.left - padding,
        width: targetRect.width + padding * 2,
        height: targetRect.height + padding * 2,
      }
    : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tutorial de la pantalla de inicio"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 3000,
        pointerEvents: 'none',
      }}
    >
      {/* Overlay en 4 paneles para dejar un hueco donde se ve la opción */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
        }}
      >
        {hole ? (
          <>
            {/* Panel superior */}
            <div
              onClick={onClose}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onClose?.()}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: hole.top,
                background: 'rgba(10,15,28,0.82)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                pointerEvents: 'auto',
                cursor: 'pointer',
              }}
            />
            {/* Panel inferior */}
            <div
              onClick={onClose}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onClose?.()}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                top: hole.top + hole.height,
                background: 'rgba(10,15,28,0.82)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                pointerEvents: 'auto',
                cursor: 'pointer',
              }}
            />
            {/* Panel izquierdo */}
            <div
              onClick={onClose}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onClose?.()}
              style={{
                position: 'absolute',
                left: 0,
                top: hole.top,
                width: hole.left,
                height: hole.height,
                background: 'rgba(10,15,28,0.82)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                pointerEvents: 'auto',
                cursor: 'pointer',
              }}
            />
            {/* Panel derecho */}
            <div
              onClick={onClose}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onClose?.()}
              style={{
                position: 'absolute',
                right: 0,
                top: hole.top,
                width: typeof window !== 'undefined' ? window.innerWidth - hole.left - hole.width : 0,
                height: hole.height,
                background: 'rgba(10,15,28,0.82)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                pointerEvents: 'auto',
                cursor: 'pointer',
              }}
            />
            {/* Spotlight: borde con glow sutil */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: hole.top,
                left: hole.left,
                width: hole.width,
                height: hole.height,
                borderRadius: 20,
                border: '2px solid rgba(255,255,255,0.95)',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.15), 0 0 32px rgba(102,126,234,0.25)',
                pointerEvents: 'none',
                transition: 'top 0.25s ease, left 0.25s ease, width 0.25s ease, height 0.25s ease, box-shadow 0.25s ease',
              }}
            />
          </>
        ) : (
          <div
            onClick={onClose}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClose?.()}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(10,15,28,0.82)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              pointerEvents: 'auto',
              cursor: 'pointer',
            }}
          />
        )}
      </div>

      {/* Tarjeta del paso */}
      <div
        onClick={(e) => e.stopPropagation()}
        role="document"
        style={{
          position: 'absolute',
          top: posicionTooltip.top,
          left: posicionTooltip.left,
          transform: `translate(${posicionTooltip.translateX}, ${posicionTooltip.translateY})`,
          maxWidth: 340,
          width: 'calc(100% - 32px)',
          padding: 0,
          background: 'linear-gradient(165deg, rgba(30,41,59,0.98) 0%, rgba(15,23,42,0.99) 100%)',
          borderRadius: 20,
          border: '1px solid rgba(148,163,184,0.2)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)',
          color: '#f1f5f9',
          zIndex: 3001,
          pointerEvents: 'auto',
          overflow: 'hidden',
        }}
      >
        {/* Flecha hacia el elemento */}
        {posicionTooltip.flecha === 'arriba' && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderBottom: '12px solid rgba(30,41,59,0.98)',
              filter: 'drop-shadow(0 -2px 4px rgba(0,0,0,0.2))',
            }}
          />
        )}
        {posicionTooltip.flecha === 'abajo' && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: -10,
              left: '50%',
              transform: 'translateX(-50%) rotate(180deg)',
              width: 0,
              height: 0,
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderBottom: '12px solid rgba(30,41,59,0.98)',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
            }}
          />
        )}

        <div style={{ padding: '20px 20px 16px' }}>
          {/* Progreso: indicador visual */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
              Paso {pasoActual + 1} de {PASOS.length}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {PASOS.map((_, i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  style={{
                    width: i === pasoActual ? 20 : 6,
                    height: 6,
                    borderRadius: 3,
                    background: i === pasoActual ? 'rgba(102,126,234,0.9)' : 'rgba(255,255,255,0.2)',
                    transition: 'width 0.2s ease, background 0.2s ease',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Título con emoji */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{paso.emoji}</span>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.02em', color: '#fff' }}>
              {paso.titulo}
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.55, color: 'rgba(241,245,249,0.88)' }}>
            {paso.descripcion}
          </p>
        </div>

        {/* Acciones */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            padding: '14px 20px 20px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <button
            type="button"
            onClick={pasoActual === 0 ? onClose : retroceder}
            style={{
              padding: '10px 16px',
              borderRadius: 12,
              border: 'none',
              background: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {pasoActual === 0 ? 'Cerrar' : 'Atrás'}
          </button>
          <button
            type="button"
            onClick={avanzar}
            style={{
              padding: '10px 20px',
              borderRadius: 12,
              border: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 14px rgba(102,126,234,0.4)',
            }}
          >
            {esUltimo ? 'Listo, a jugar' : 'Siguiente'}
            {!esUltimo && <span style={{ fontSize: '0.85em' }}>→</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TutorialSlides;
