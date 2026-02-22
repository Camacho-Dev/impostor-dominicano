import './Footer.css';

function Footer({ className = '' }) {
  return (
    <footer className={`footer ${className}`.trim()} role="contentinfo">
      <p>© 2026 Brayan Camacho. Todos los derechos reservados.</p>
      <p style={{ marginTop: '5px', fontSize: '0.9em' }}>
        Creado por: <strong>Brayan Camacho</strong>
      </p>
    </footer>
  );
}

export default Footer;
