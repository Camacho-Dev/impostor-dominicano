import { useState, useEffect, useRef, useCallback } from 'react';

// Cada "escena" tiene un fondo, un elemento central grande y una lista de ítems
// que aparecen uno por uno con animación stagger.
const ESCENAS = [
  {
    id: 'objetivo',
    bg: 'linear-gradient(160deg, #12003a 0%, #2d1b69 55%, #0f0c29 100%)',
    accentColor: '#a78bfa',
    glow: 'rgba(167,139,250,0.35)',
    heroEmoji: '🎯',
    heroLabel: 'La misión',
    subtitulo: 'Descubre quién es el impostor',
    items: [
      {
        tipo: 'card-duo',
        cards: [
          {
            emoji: '👥',
            titulo: 'Jugadores normales',
            desc: 'Ven la palabra secreta y dan pistas sin decirla directamente.',
            color: '#4ade80',
            bg: 'rgba(74,222,128,0.12)',
            border: 'rgba(74,222,128,0.3)',
          },
          {
            emoji: '🎭',
            titulo: 'El impostor',
            desc: 'Solo recibe una pista indirecta. Finge saber la palabra.',
            color: '#f87171',
            bg: 'rgba(245,87,108,0.12)',
            border: 'rgba(245,87,108,0.3)',
          },
        ],
      },
      {
        tipo: 'alerta',
        emoji: '🏆',
        texto: 'Gana el grupo si descubren al impostor. Gana el impostor si pasa desapercibido o adivina la palabra.',
        color: '#fbbf24',
        bg: 'rgba(251,191,36,0.08)',
        border: 'rgba(251,191,36,0.25)',
      },
    ],
  },
  {
    id: 'tarjeta',
    bg: 'linear-gradient(160deg, #020d1f 0%, #0f2a5c 55%, #050c1a 100%)',
    accentColor: '#60a5fa',
    glow: 'rgba(96,165,250,0.35)',
    heroEmoji: '📱',
    heroLabel: 'La tarjeta',
    subtitulo: 'Así ves tu rol en secreto',
    items: [
      { tipo: 'paso', n: '1', emoji: '🤲', titulo: 'El celular pasa de mano en mano.', desc: 'Cada jugador lo toma en privado, sin que los demás vean.' },
      { tipo: 'paso', n: '2', emoji: '👆', titulo: 'Mantén presionada la tarjeta.', desc: 'Se voltea y ves tu palabra secreta o si eres el impostor.' },
      { tipo: 'paso', n: '3', emoji: '🙈', titulo: 'Suelta para ocultar.', desc: 'La tarjeta se voltea de vuelta. Nadie más verá tu rol.' },
      { tipo: 'paso', n: '4', emoji: '➡️', titulo: 'Pasa al siguiente jugador.', desc: 'Repite hasta que todos hayan visto su tarjeta.' },
      {
        tipo: 'alerta',
        emoji: '⚠️',
        texto: 'No reacciones al ver tu tarjeta. El impostor puede delatarse con la cara.',
        color: '#fbbf24',
        bg: 'rgba(251,191,36,0.08)',
        border: 'rgba(251,191,36,0.25)',
      },
    ],
  },
  {
    id: 'discusion',
    bg: 'linear-gradient(160deg, #071a05 0%, #133a0d 55%, #040f02 100%)',
    accentColor: '#4ade80',
    glow: 'rgba(74,222,128,0.35)',
    heroEmoji: '🗣️',
    heroLabel: 'La discusión',
    subtitulo: 'Aquí está la verdadera acción',
    items: [
      {
        tipo: 'lista-titulo',
        tituloColor: '#4ade80',
        titulo: '✅ Jugadores normales',
        lista: [
          'Dar pistas sobre la palabra sin decirla directamente.',
          'Escuchar a todos y detectar quién suena raro o vago.',
          'Acusar al sospechoso al momento de votar.',
        ],
        color: '#4ade80',
      },
      {
        tipo: 'lista-titulo',
        tituloColor: '#f87171',
        titulo: '🎭 El impostor',
        lista: [
          'Escuchar pistas de los demás para deducir la palabra.',
          'Dar respuestas vagas que no lo delaten.',
          'Desviar sospechas acusando a otros.',
        ],
        color: '#f87171',
      },
      {
        tipo: 'alerta',
        emoji: '💡',
        texto: 'No hay tiempo límite. Discutan hasta que estén seguros de quién es el impostor.',
        color: '#93c5fd',
        bg: 'rgba(96,165,250,0.08)',
        border: 'rgba(96,165,250,0.25)',
      },
    ],
  },
  {
    id: 'final',
    bg: 'linear-gradient(160deg, #1a0800 0%, #3d1400 55%, #100400 100%)',
    accentColor: '#fbbf24',
    glow: 'rgba(251,191,36,0.35)',
    heroEmoji: '🏆',
    heroLabel: 'El final',
    subtitulo: '¿Quién se lleva la victoria?',
    items: [
      {
        tipo: 'resultado',
        filas: [
          { emoji: '🕵️', titulo: 'Grupo vota al impostor correcto', tag: '¡Grupo gana!', colorT: '#4ade80', colorBg: 'rgba(74,222,128,0.1)' },
          { emoji: '😅', titulo: 'Grupo vota a un inocente', tag: 'Impostor gana', colorT: '#f87171', colorBg: 'rgba(245,87,108,0.1)' },
          { emoji: '🎯', titulo: 'Impostor adivina la palabra', tag: 'Impostor gana', colorT: '#f87171', colorBg: 'rgba(245,87,108,0.1)' },
          { emoji: '❌', titulo: 'Impostor falla al adivinar', tag: '¡Grupo gana!', colorT: '#4ade80', colorBg: 'rgba(74,222,128,0.1)' },
        ],
      },
      {
        tipo: 'alerta',
        emoji: '😈',
        titulo: 'Modos Diabólicos',
        texto: 'Actívalos desde el inicio para reglas caóticas: múltiples impostores, palabras falsas y más.',
        color: '#fbbf24',
        bg: 'rgba(251,191,36,0.07)',
        border: 'rgba(251,191,36,0.25)',
      },
    ],
  },
];

// ─── Renderizadores de ítems ───────────────────────────────────────────────

function ItemCardDuo({ cards }) {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {cards.map((c, i) => (
        <div key={i} style={{
          flex: 1, padding: '14px 12px', borderRadius: 18,
          background: c.bg, border: `1.5px solid ${c.border}`,
          display: 'flex', flexDirection: 'column', gap: 8
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: `${c.bg}`, border: `1.5px solid ${c.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5em'
          }}>{c.emoji}</div>
          <div style={{ fontWeight: '800', fontSize: '0.88em', color: c.color, lineHeight: 1.2 }}>{c.titulo}</div>
          <div style={{ fontSize: '0.78em', opacity: 0.8, lineHeight: 1.5 }}>{c.desc}</div>
        </div>
      ))}
    </div>
  );
}

function ItemPaso({ n, emoji, titulo, desc, accentColor }) {
  return (
    <div style={{
      display: 'flex', gap: 12, alignItems: 'flex-start',
      padding: '12px 14px', borderRadius: 16,
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)'
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        background: `${accentColor}22`, border: `1.5px solid ${accentColor}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.7em', fontWeight: '900', color: accentColor
      }}>{n}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '700', fontSize: '0.9em', marginBottom: 3, display: 'flex', gap: 6, alignItems: 'center' }}>
          <span>{emoji}</span>{titulo}
        </div>
        <div style={{ fontSize: '0.78em', opacity: 0.65, lineHeight: 1.45 }}>{desc}</div>
      </div>
    </div>
  );
}

function ItemListaTitulo({ titulo, lista, color, tituloColor }) {
  return (
    <div style={{
      borderRadius: 16, overflow: 'hidden',
      background: 'rgba(255,255,255,0.04)',
      border: `1px solid ${color}25`
    }}>
      <div style={{
        padding: '9px 14px',
        background: `${color}14`,
        fontWeight: '800', fontSize: '0.82em',
        color: tituloColor, letterSpacing: '0.02em'
      }}>{titulo}</div>
      {lista.map((t, i) => (
        <div key={i} style={{
          display: 'flex', gap: 10, alignItems: 'flex-start',
          padding: '10px 14px',
          borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.05)'
        }}>
          <span style={{ color, flexShrink: 0, fontSize: '0.9em', lineHeight: 1.5, marginTop: 1 }}>›</span>
          <span style={{ fontSize: '0.84em', opacity: 0.85, lineHeight: 1.45 }}>{t}</span>
        </div>
      ))}
    </div>
  );
}

function ItemResultado({ filas }) {
  return (
    <div style={{
      borderRadius: 16, overflow: 'hidden',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)'
    }}>
      <div style={{
        padding: '9px 14px', background: 'rgba(255,255,255,0.06)',
        fontSize: '0.72em', fontWeight: '800', textTransform: 'uppercase',
        letterSpacing: '0.1em', opacity: 0.6
      }}>Resultados posibles</div>
      {filas.map((f, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '11px 14px',
          borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.05)'
        }}>
          <span style={{ fontSize: '1.2em', flexShrink: 0 }}>{f.emoji}</span>
          <div style={{ flex: 1, fontSize: '0.83em', fontWeight: '600', opacity: 0.85 }}>{f.titulo}</div>
          <div style={{
            padding: '4px 10px', borderRadius: 20, flexShrink: 0,
            background: f.colorBg, color: f.colorT,
            fontSize: '0.72em', fontWeight: '800', whiteSpace: 'nowrap'
          }}>{f.tag}</div>
        </div>
      ))}
    </div>
  );
}

function ItemAlerta({ emoji, titulo, texto, color, bg, border }) {
  return (
    <div style={{
      padding: '12px 14px', borderRadius: 14,
      background: bg, border: `1.5px solid ${border}`,
      display: 'flex', gap: 10, alignItems: 'flex-start'
    }}>
      <span style={{ fontSize: '1.1em', flexShrink: 0, marginTop: 1 }}>{emoji}</span>
      <div>
        {titulo && <div style={{ fontWeight: '800', fontSize: '0.88em', color, marginBottom: 4 }}>{titulo}</div>}
        <p style={{ margin: 0, fontSize: '0.82em', lineHeight: 1.5, color }}>{texto}</p>
      </div>
    </div>
  );
}

function renderItem(item, accentColor) {
  switch (item.tipo) {
    case 'card-duo': return <ItemCardDuo cards={item.cards} />;
    case 'paso': return <ItemPaso {...item} accentColor={accentColor} />;
    case 'lista-titulo': return <ItemListaTitulo {...item} />;
    case 'resultado': return <ItemResultado filas={item.filas} />;
    case 'alerta': return <ItemAlerta {...item} />;
    default: return null;
  }
}

// ─── Componente principal ─────────────────────────────────────────────────

const ITEM_DELAY = 550; // ms entre cada ítem
const HERO_DURATION = 600; // ms para mostrar el hero

function TutorialSlides({ onClose }) {
  const [escenaIdx, setEscenaIdx] = useState(0);
  const [itemsVisibles, setItemsVisibles] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);
  const [slideDir, setSlideDir] = useState(null); // 'in' | 'out-left' | 'out-right'
  const [modalVisible, setModalVisible] = useState(false);
  const touchStartX = useRef(null);
  const timerRef = useRef(null);
  const autoRef = useRef(null);

  const escena = ESCENAS[escenaIdx];
  const totalItems = escena.items.length;
  const todosVisibles = itemsVisibles >= totalItems;
  const isLast = escenaIdx === ESCENAS.length - 1;

  // Entrada del modal
  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setModalVisible(true));
    });
  }, []);

  // Animación de ítems al cambiar de escena
  const iniciarAnimacion = useCallback(() => {
    setHeroVisible(false);
    setItemsVisibles(0);

    // Mostrar hero primero
    timerRef.current = setTimeout(() => {
      setHeroVisible(true);

      // Luego ir mostrando ítems uno a uno
      let count = 0;
      const mostrarSiguiente = () => {
        count++;
        setItemsVisibles(count);
        if (count < totalItems) {
          autoRef.current = setTimeout(mostrarSiguiente, ITEM_DELAY);
        }
      };
      autoRef.current = setTimeout(mostrarSiguiente, HERO_DURATION);
    }, 80);
  }, [totalItems]);

  useEffect(() => {
    iniciarAnimacion();
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(autoRef.current);
    };
  }, [escenaIdx, iniciarAnimacion]);

  // Teclado
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') avanzar();
      if (e.key === 'ArrowLeft') retroceder();
      if (e.key === ' ') { e.preventDefault(); avanzar(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [escenaIdx, itemsVisibles]);

  const avanzar = useCallback(() => {
    // Si no se han mostrado todos los ítems, mostrarlos todos de golpe
    if (!todosVisibles) {
      clearTimeout(autoRef.current);
      setItemsVisibles(totalItems);
      return;
    }
    // Si es la última escena, cerrar
    if (isLast) { onClose(); return; }
    // Ir a la siguiente escena
    irAEscena(escenaIdx + 1, 'next');
  }, [todosVisibles, isLast, escenaIdx, totalItems]);

  const retroceder = useCallback(() => {
    if (escenaIdx === 0) return;
    irAEscena(escenaIdx - 1, 'prev');
  }, [escenaIdx]);

  const irAEscena = (idx, dir) => {
    clearTimeout(timerRef.current);
    clearTimeout(autoRef.current);
    setSlideDir(dir === 'next' ? 'out-left' : 'out-right');
    setTimeout(() => {
      setEscenaIdx(idx);
      setSlideDir('in');
      setTimeout(() => setSlideDir(null), 350);
    }, 220);
  };

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 44) { avanzar(); return; }
    if (dx < 0) avanzar();
    else retroceder();
  };

  const slideTransform = slideDir === 'out-left'
    ? 'translateX(-40px)'
    : slideDir === 'out-right'
      ? 'translateX(40px)'
      : 'translateX(0)';
  const slideOpacity = (slideDir === 'out-left' || slideDir === 'out-right') ? 0 : 1;

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        zIndex: 3000,
        opacity: modalVisible ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
      onClick={avanzar}
    >
      <div
        style={{
          width: '100%', maxWidth: 480,
          height: '92dvh',
          display: 'flex', flexDirection: 'column',
          borderRadius: '28px 28px 0 0',
          overflow: 'hidden',
          background: escena.bg,
          border: '1px solid rgba(255,255,255,0.1)',
          borderBottom: 'none',
          boxShadow: `0 -16px 80px rgba(0,0,0,0.7), inset 0 0 0 1px ${escena.glow}`,
          transform: modalVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'transform 0.4s cubic-bezier(0.34,1.2,0.64,1)',
        }}
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 4, flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.18)' }} />
        </div>

        {/* Progreso — puntos */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 7, paddingBottom: 8, flexShrink: 0 }}>
          {ESCENAS.map((_, i) => (
            <div key={i} style={{
              width: i === escenaIdx ? 22 : 7, height: 7, borderRadius: 4,
              background: i <= escenaIdx ? escena.accentColor : 'rgba(255,255,255,0.15)',
              transition: 'all 0.35s cubic-bezier(0.34,1.2,0.64,1)',
              cursor: 'pointer',
              boxShadow: i === escenaIdx ? `0 0 10px ${escena.glow}` : 'none'
            }}
              onClick={e => { e.stopPropagation(); if (i !== escenaIdx) irAEscena(i, i > escenaIdx ? 'next' : 'prev'); }}
            />
          ))}
        </div>

        {/* Botón cerrar */}
        <button
          type="button"
          aria-label="Cerrar tutorial"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          style={{
            position: 'absolute', top: 16, right: 16,
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.6)', fontSize: '1em',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            touchAction: 'manipulation', zIndex: 1
          }}
        >×</button>

        {/* Contenido animado */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          padding: '0 18px 0',
          overflowY: 'auto',
          opacity: slideOpacity,
          transform: slideTransform,
          transition: 'opacity 0.22s ease, transform 0.22s ease'
        }}>

          {/* Hero */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            paddingTop: 24, paddingBottom: 20,
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'scale(1) translateY(0)' : 'scale(0.7) translateY(20px)',
            transition: 'opacity 0.5s cubic-bezier(0.34,1.4,0.64,1), transform 0.5s cubic-bezier(0.34,1.4,0.64,1)'
          }}>
            <div style={{
              width: 76, height: 76, borderRadius: 24,
              background: `${escena.accentColor}18`,
              border: `2px solid ${escena.glow}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.4em', marginBottom: 14,
              boxShadow: `0 8px 32px ${escena.glow}, 0 0 0 8px ${escena.accentColor}08`
            }}>{escena.heroEmoji}</div>
            <div style={{
              fontSize: '0.72em', fontWeight: '700', letterSpacing: '0.1em',
              textTransform: 'uppercase', color: escena.accentColor, marginBottom: 6,
              opacity: 0.9
            }}>
              Paso {escenaIdx + 1} de {ESCENAS.length}
            </div>
            <h2 style={{
              margin: 0, fontSize: '1.55em', fontWeight: '900',
              textAlign: 'center', letterSpacing: '-0.02em', lineHeight: 1.1
            }}>{escena.heroLabel}</h2>
            <p style={{
              margin: '6px 0 0', fontSize: '0.88em', opacity: 0.5,
              textAlign: 'center', lineHeight: 1.3
            }}>{escena.subtitulo}</p>
          </div>

          {/* Ítems con stagger */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 20 }}>
            {escena.items.map((item, i) => (
              <div key={i} style={{
                opacity: i < itemsVisibles ? 1 : 0,
                transform: i < itemsVisibles ? 'translateY(0) scale(1)' : 'translateY(22px) scale(0.96)',
                transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.34,1.2,0.64,1)'
              }}>
                {renderItem(item, escena.accentColor)}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 18px',
          paddingBottom: 'max(14px, env(safe-area-inset-bottom, 14px))',
          background: 'rgba(0,0,0,0.3)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0
        }}>
          {/* Botón atrás */}
          {escenaIdx > 0 ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); retroceder(); }}
              style={{
                padding: '14px 18px', borderRadius: 14, flexShrink: 0,
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.75)', fontSize: '1em', fontWeight: '600',
                cursor: 'pointer', minHeight: '50px',
                touchAction: 'manipulation', display: 'flex', alignItems: 'center'
              }}
            >←</button>
          ) : (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              style={{
                padding: '14px 16px', borderRadius: 14, flexShrink: 0,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.4)', fontSize: '0.85em', fontWeight: '500',
                cursor: 'pointer', minHeight: '50px',
                touchAction: 'manipulation'
              }}
            >Saltar</button>
          )}

          {/* Botón principal */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); avanzar(); }}
            style={{
              flex: 1, padding: '15px 20px', borderRadius: 14,
              background: todosVisibles
                ? (isLast
                  ? `linear-gradient(135deg, ${escena.accentColor}, ${escena.accentColor}bb)`
                  : `${escena.accentColor}22`)
                : `${escena.accentColor}14`,
              border: todosVisibles
                ? (isLast ? 'none' : `1.5px solid ${escena.accentColor}66`)
                : `1.5px solid ${escena.accentColor}33`,
              color: todosVisibles
                ? (isLast ? '#000' : escena.accentColor)
                : `${escena.accentColor}88`,
              fontSize: '1em', fontWeight: '800',
              cursor: 'pointer', minHeight: '50px',
              touchAction: 'manipulation',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.3s ease',
              boxShadow: (todosVisibles && isLast) ? `0 4px 24px ${escena.glow}` : 'none'
            }}
          >
            {!todosVisibles
              ? <>Ver todo de una vez</>
              : isLast
                ? <>¡Listo, a jugar! 🎮</>
                : <>Siguiente →</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

export default TutorialSlides;
