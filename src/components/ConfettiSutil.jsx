import { useState, useEffect } from 'react';

const COLORES = ['#667eea', '#764ba2', '#4ade80', '#fbbf24', '#f5576c'];
const CANTIDAD = 14;

export default function ConfettiSutil() {
  const [particulas] = useState(() =>
    Array.from({ length: CANTIDAD }, (_, i) => ({
      id: i,
      left: `${10 + Math.random() * 80}%`,
      delay: Math.random() * 0.8,
      duration: 2 + Math.random() * 1.5,
      color: COLORES[i % COLORES.length],
      size: 6 + Math.random() * 6,
      rotation: Math.random() * 360
    }))
  );

  return (
    <div
      className="confetti-sutil"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0
      }}
    >
      {particulas.map((p) => (
        <div
          key={p.id}
          className="confetti-particula"
          style={{
            position: 'absolute',
            left: p.left,
            top: '-20px',
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transform: `rotate(${p.rotation}deg)`,
            animation: `confetti-caer ${p.duration}s ease-out ${p.delay}s forwards`,
            opacity: 0.85
          }}
        />
      ))}
    </div>
  );
}
