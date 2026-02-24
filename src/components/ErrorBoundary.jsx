import { Component } from 'react';

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary:', error, errorInfo);
  }

  handleRetry = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="pantalla activa"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '24px',
            textAlign: 'center',
            background: 'var(--color-surface, rgba(26, 26, 46, 0.95))',
            color: 'var(--color-text)'
          }}
        >
          <div style={{ fontSize: '4em', marginBottom: '16px' }}>😅</div>
          <h2 style={{ fontSize: '1.5em', marginBottom: '12px' }}>Algo salió mal</h2>
          <p style={{ opacity: 0.9, marginBottom: '24px', maxWidth: '320px' }}>
            No te preocupes, tu partida puede estar bien. Prueba volver a cargar.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.handleRetry}
            style={{ maxWidth: '280px' }}
          >
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
