function IconButton({ icon, onClick, title, ariaLabel, className = '', variant = 'default', style = {} }) {
  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    border: '2px solid',
    color: '#fff',
    fontSize: '1.5em',
    cursor: 'pointer',
    zIndex: 1000,
    transition: 'all 0.3s',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
    ...style
  };

  const variants = {
    help: {
      background: 'rgba(102, 126, 234, 0.3)',
      borderColor: 'rgba(102, 126, 234, 0.6)',
    },
    settings: {
      background: 'rgba(255, 165, 0, 0.3)',
      borderColor: 'rgba(255, 165, 0, 0.6)',
    },
    close: {
      background: 'rgba(245, 87, 108, 0.3)',
      borderColor: 'rgba(245, 87, 108, 0.6)',
      width: '40px',
      height: '40px',
    },
    premium: {
      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      borderColor: '#000',
    },
    default: {
      background: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
    }
  };

  const v = variants[variant] || variants.default;

  const handleMouseEnter = (e) => {
    if (window.innerWidth > 768 && variant === 'help') {
      e.target.style.background = 'rgba(102, 126, 234, 0.5)';
      e.target.style.transform = 'scale(1.1)';
    } else if (window.innerWidth > 768 && variant === 'settings') {
      e.target.style.background = 'rgba(255, 165, 0, 0.5)';
      e.target.style.transform = 'scale(1.1) rotate(90deg)';
    } else if (window.innerWidth > 768 && variant === 'close') {
      e.target.style.background = 'rgba(245, 87, 108, 0.5)';
      e.target.style.transform = 'scale(1.1)';
    } else if (window.innerWidth > 768 && variant === 'default') {
      e.target.style.background = 'rgba(255, 255, 255, 0.2)';
    }
  };

  const handleMouseLeave = (e) => {
    e.target.style.background = v.background;
    e.target.style.transform = 'scale(1) rotate(0deg)';
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={ariaLabel || title}
      className={`icon-button ${className}`.trim()}
      style={{ ...baseStyle, ...v, ...style }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {icon}
    </button>
  );
}

export default IconButton;
