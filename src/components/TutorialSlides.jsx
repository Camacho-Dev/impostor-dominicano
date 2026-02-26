import { useState, useEffect, useRef } from 'react';

const SLIDES = [
  {
    id: 'objetivo',
    emoji: '🎯',
    titulo: 'La misión',
    subtitulo: 'Descubre quién es el impostor',
    accentColor: '#a78bfa',
    gradientBg: 'linear-gradient(160deg, #1a0533 0%, #2d1b69 60%, #0f0c29 100%)',
    accentGlow: 'rgba(167,139,250,0.3)',
    contenido: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{
          padding: '15px 16px', borderRadius: 16,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', gap: 14
        }}>
          <div style={{
            width: 50, height: 50, borderRadius: 14, flexShrink: 0,
            background: 'rgba(74,222,128,0.15)', border: '1.5px solid rgba(74,222,128,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6em'
          }}>👥</div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '0.95em', marginBottom: 3, color: '#4ade80' }}>Jugadores normales</div>
            <div style={{ fontSize: '0.82em', opacity: 0.8, lineHeight: 1.5 }}>
              Ven la <strong style={{ color: '#4ade80' }}>palabra secreta</strong>. Dan pistas sin decirla directamente.
            </div>
          </div>
        </div>
        <div style={{
          padding: '15px 16px', borderRadius: 16,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', gap: 14
        }}>
          <div style={{
            width: 50, height: 50, borderRadius: 14, flexShrink: 0,
            background: 'rgba(245,87,108,0.15)', border: '1.5px solid rgba(245,87,108,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6em'
          }}>🎭</div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '0.95em', marginBottom: 3, color: '#f87171' }}>El impostor</div>
            <div style={{ fontSize: '0.82em', opacity: 0.8, lineHeight: 1.5 }}>
              Solo recibe una <strong style={{ color: '#f87171' }}>pista indirecta</strong>. Finge saber la palabra y evita que lo descubran.
            </div>
          </div>
        </div>
        <div style={{
          padding: '12px 15px', borderRadius: 14,
          background: 'rgba(251,191,36,0.07)', border: '1.5px solid rgba(251,191,36,0.2)',
          display: 'flex', gap: 10, alignItems: 'center'
        }}>
          <span style={{ fontSize: '1.1em', flexShrink: 0 }}>🏆</span>
          <p style={{ margin: 0, fontSize: '0.82em', lineHeight: 1.5, color: '#fbbf24' }}>
            Gana el grupo si descubren al impostor. Gana el impostor si pasa desapercibido o adivina la palabra.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'tarjeta',
    emoji: '👆',
    titulo: 'La tarjeta',
    subtitulo: 'Así ves tu rol en secreto',
    accentColor: '#60a5fa',
    gradientBg: 'linear-gradient(160deg, #0c1a33 0%, #1e3a72 60%, #0a0f1e 100%)',
    accentGlow: 'rgba(96,165,250,0.3)',
    contenido: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{
          borderRadius: 18, overflow: 'hidden',
          border: '1.5px solid rgba(96,165,250,0.2)',
          background: 'rgba(255,255,255,0.04)'
        }}>
          <div style={{
            background: 'rgba(96,165,250,0.1)',
            padding: '9px 16px',
            fontSize: '0.7em', fontWeight: '800', letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#60a5fa'
          }}>Paso a paso</div>
          {[
            { n: '1', text: 'El celular pasa de mano en mano.', sub: 'Cada jugador lo toma en privado.' },
            { n: '2', text: 'Mantén presionada la tarjeta.', sub: 'Se voltea y ves tu palabra o tu rol.' },
            { n: '3', text: 'Suelta para ocultar.', sub: 'Nadie más verá lo que te tocó.' },
            { n: '4', text: 'Pasa al siguiente jugador.', sub: 'Repite hasta que todos hayan visto su tarjeta.' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, alignItems: 'flex-start',
              padding: '12px 16px',
              borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)'
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: 'rgba(96,165,250,0.18)', border: '1.5px solid rgba(96,165,250,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.72em', fontWeight: '900', color: '#60a5fa'
              }}>{item.n}</div>
              <div>
                <div style={{ fontSize: '0.88em', fontWeight: '700', lineHeight: 1.3 }}>{item.text}</div>
                <div style={{ fontSize: '0.78em', opacity: 0.6, marginTop: 2, lineHeight: 1.4 }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{
          padding: '12px 15px', borderRadius: 14,
          background: 'rgba(251,191,36,0.07)', border: '1.5px solid rgba(251,191,36,0.2)',
          display: 'flex', gap: 10, alignItems: 'center'
        }}>
          <span style={{ fontSize: '1.1em', flexShrink: 0 }}>⚠️</span>
          <p style={{ margin: 0, fontSize: '0.82em', lineHeight: 1.5, color: '#fbbf24' }}>
            No reacciones cuando veas la tarjeta. El impostor puede delatarse con la cara.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'discusion',
    emoji: '🗣️',
    titulo: 'La discusión',
    subtitulo: 'Aquí está la verdadera acción',
    accentColor: '#4ade80',
    gradientBg: 'linear-gradient(160deg, #0f1f0a 0%, #1a3a0f 60%, #0a1205 100%)',
    accentGlow: 'rgba(74,222,128,0.3)',
    contenido: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{
          borderRadius: 18, overflow: 'hidden',
          border: '1px solid rgba(74,222,128,0.15)',
          background: 'rgba(255,255,255,0.04)'
        }}>
          <div style={{
            background: 'rgba(74,222,128,0.1)',
            padding: '9px 16px',
            fontSize: '0.7em', fontWeight: '800', letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#4ade80'
          }}>Jugadores normales</div>
          {[
            'Dar pistas sobre la palabra sin decirla directamente.',
            'Escuchar las pistas de todos y detectar inconsistencias.',
            'Acusar a quien suene raro o muy vago.',
          ].map((t, i) => (
            <div key={i} style={{
              display: 'flex', gap: 10, alignItems: 'flex-start',
              padding: '11px 16px',
              borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.05)'
            }}>
              <span style={{ color: '#4ade80', flexShrink: 0, fontSize: '1em', lineHeight: 1.4 }}>›</span>
              <span style={{ fontSize: '0.84em', opacity: 0.85, lineHeight: 1.45 }}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{
          borderRadius: 18, overflow: 'hidden',
          border: '1px solid rgba(245,87,108,0.15)',
          background: 'rgba(255,255,255,0.04)'
        }}>
          <div style={{
            background: 'rgba(245,87,108,0.1)',
            padding: '9px 16px',
            fontSize: '0.7em', fontWeight: '800', letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#f87171'
          }}>El impostor</div>
          {[
            'Escuchar las pistas de los demás para deducir la palabra.',
            'Dar pistas vagas que puedan encajar con cualquier cosa.',
            'Acusar a otros para desviar sospechas.',
          ].map((t, i) => (
            <div key={i} style={{
              display: 'flex', gap: 10, alignItems: 'flex-start',
              padding: '11px 16px',
              borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.05)'
            }}>
              <span style={{ color: '#f87171', flexShrink: 0, fontSize: '1em', lineHeight: 1.4 }}>›</span>
              <span style={{ fontSize: '0.84em', opacity: 0.85, lineHeight: 1.45 }}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{
          padding: '12px 15px', borderRadius: 14,
          background: 'rgba(96,165,250,0.07)', border: '1.5px solid rgba(96,165,250,0.2)',
          display: 'flex', gap: 10, alignItems: 'center'
        }}>
          <span style={{ fontSize: '1.1em', flexShrink: 0 }}>💡</span>
          <p style={{ margin: 0, fontSize: '0.82em', lineHeight: 1.5, color: '#93c5fd' }}>
            No hay tiempo límite. Discutan hasta que estén seguros de quién es el impostor.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'final',
    emoji: '🏆',
    titulo: 'El final',
    subtitulo: '¿Quién se lleva la victoria?',
    accentColor: '#fbbf24',
    gradientBg: 'linear-gradient(160deg, #1a0a00 0%, #3a1800 60%, #1a0500 100%)',
    accentGlow: 'rgba(251,191,36,0.3)',
    contenido: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{
          borderRadius: 18, overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.04)'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            padding: '9px 16px',
            fontSize: '0.7em', fontWeight: '800', letterSpacing: '0.1em',
            textTransform: 'uppercase', opacity: 0.6
          }}>Resultados posibles</div>
          {[
            { emoji: '🕵️', titulo: 'Grupo vota al impostor correcto', resultado: '¡Grupo gana!', colorT: '#4ade80', colorBg: 'rgba(74,222,128,0.08)' },
            { emoji: '😅', titulo: 'Grupo vota a un inocente', resultado: 'Impostor gana', colorT: '#f87171', colorBg: 'rgba(245,87,108,0.08)' },
            { emoji: '🎯', titulo: 'Impostor adivina la palabra', resultado: 'Impostor gana', colorT: '#f87171', colorBg: 'rgba(245,87,108,0.08)' },
            { emoji: '❌', titulo: 'Impostor falla al adivinar', resultado: '¡Grupo gana!', colorT: '#4ade80', colorBg: 'rgba(74,222,128,0.08)' },
          ].map((c, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 16px',
              borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)'
            }}>
              <span style={{ fontSize: '1.25em', flexShrink: 0 }}>{c.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.84em', fontWeight: '600', opacity: 0.85 }}>{c.titulo}</div>
              </div>
              <div style={{
                padding: '4px 10px', borderRadius: 20,
                background: c.colorBg, color: c.colorT,
                fontSize: '0.73em', fontWeight: '800', flexShrink: 0,
                whiteSpace: 'nowrap'
              }}>{c.resultado}</div>
            </div>
          ))}
        </div>
        <div style={{
          padding: '14px 16px', borderRadius: 16,
          background: 'rgba(251,191,36,0.06)', border: '1.5px solid rgba(251,191,36,0.2)'
        }}>
          <div style={{ fontWeight: '800', fontSize: '0.9em', marginBottom: 6, color: '#fbbf24' }}>😈 Modos Diabólicos</div>
          <p style={{ margin: 0, fontSize: '0.82em', lineHeight: 1.6, opacity: 0.85 }}>
            Actívalos desde el inicio para jugar con reglas caóticas: múltiples impostores, todos impostores, palabras falsas y más. ¡Para los que ya dominan el juego!
          </p>
        </div>
      </div>
    )
  },
];

function TutorialSlides({ onClose }) {
  const [slide, setSlide] = useState(0);
  const [animDir, setAnimDir] = useState(null);
  const [visible, setVisible] = useState(false);
  const touchStartX = useRef(null);
  const total = SLIDES.length;
  const s = SLIDES[slide];

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goTo(slide + 1);
      if (e.key === 'ArrowLeft') goTo(slide - 1);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [slide]);

  const goTo = (idx) => {
    if (idx < 0 || idx >= total) return;
    setAnimDir(idx > slide ? 'next' : 'prev');
    setTimeout(() => {
      setSlide(idx);
      setAnimDir(null);
    }, 180);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) goTo(slide + 1);
    else goTo(slide - 1);
  };

  const isLast = slide === total - 1;

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        zIndex: 3000,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.25s ease'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%', maxWidth: 480,
          maxHeight: '95dvh',
          display: 'flex', flexDirection: 'column',
          borderRadius: '28px 28px 0 0',
          overflow: 'hidden',
          background: s.gradientBg,
          border: '1px solid rgba(255,255,255,0.1)',
          borderBottom: 'none',
          boxShadow: `0 -12px 60px rgba(0,0,0,0.6), 0 0 0 1px ${s.accentGlow}`,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'transform 0.35s cubic-bezier(0.34,1.3,0.64,1), background 0.4s ease',
          willChange: 'transform'
        }}
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle de arrastre */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 2, flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.2)' }} />
        </div>

        {/* Barra de progreso */}
        <div style={{ display: 'flex', gap: 5, padding: '8px 20px 0', flexShrink: 0 }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              style={{
                flex: 1, height: 3, borderRadius: 3, border: 'none',
                background: i <= slide ? s.accentColor : 'rgba(255,255,255,0.15)',
                cursor: 'pointer', padding: 0,
                transition: 'background 0.3s ease',
                minHeight: '10px',
                touchAction: 'manipulation'
              }}
              aria-label={`Ir a paso ${i + 1}`}
            />
          ))}
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          padding: '14px 20px 10px', flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16, flexShrink: 0,
              background: `${s.accentGlow.replace('0.3', '0.15')}`,
              border: `1.5px solid ${s.accentGlow}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.7em',
              boxShadow: `0 4px 20px ${s.accentGlow}`
            }}>
              {s.emoji}
            </div>
            <div>
              <div style={{ fontSize: '0.72em', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: s.accentColor, marginBottom: 3 }}>
                Paso {slide + 1} de {total}
              </div>
              <h2 style={{ margin: 0, fontSize: '1.25em', fontWeight: '900', lineHeight: 1.1 }}>{s.titulo}</h2>
              <p style={{ margin: '2px 0 0', fontSize: '0.8em', opacity: 0.55, lineHeight: 1.3 }}>{s.subtitulo}</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Cerrar tutorial"
            onClick={onClose}
            style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.7)', fontSize: '1.1em',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent'
            }}
          >×</button>
        </div>

        {/* Contenido scroll */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '4px 16px 16px',
          opacity: animDir ? 0 : 1,
          transform: animDir === 'next' ? 'translateX(-18px)' : animDir === 'prev' ? 'translateX(18px)' : 'translateX(0)',
          transition: 'opacity 0.18s ease, transform 0.18s ease'
        }}>
          <s.contenido />
        </div>

        {/* Footer de navegación */}
        <div style={{
          padding: '12px 16px',
          paddingBottom: 'max(12px, env(safe-area-inset-bottom, 12px))',
          background: 'rgba(0,0,0,0.25)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', gap: 10, alignItems: 'center',
          flexShrink: 0
        }}>
          {slide > 0 ? (
            <button
              type="button"
              onClick={() => goTo(slide - 1)}
              style={{
                padding: '14px 20px', borderRadius: 14, flexShrink: 0,
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.8)', fontSize: '0.95em', fontWeight: '600',
                cursor: 'pointer', minHeight: '48px',
                touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
                display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              ←
            </button>
          ) : (
            <div style={{ width: 58, flexShrink: 0 }} />
          )}

          {isLast ? (
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: '15px 20px', borderRadius: 14,
                background: `linear-gradient(135deg, ${s.accentColor}, ${s.accentColor}cc)`,
                border: 'none',
                color: '#000', fontSize: '1em', fontWeight: '800',
                cursor: 'pointer', minHeight: '48px',
                touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: `0 4px 20px ${s.accentGlow}`
              }}
            >
              ¡Listo, a jugar! 🎮
            </button>
          ) : (
            <button
              type="button"
              onClick={() => goTo(slide + 1)}
              style={{
                flex: 1, padding: '15px 20px', borderRadius: 14,
                background: `linear-gradient(135deg, ${s.accentColor}22, ${s.accentColor}11)`,
                border: `1.5px solid ${s.accentColor}55`,
                color: s.accentColor, fontSize: '1em', fontWeight: '700',
                cursor: 'pointer', minHeight: '48px',
                touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}
            >
              Siguiente →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TutorialSlides;
