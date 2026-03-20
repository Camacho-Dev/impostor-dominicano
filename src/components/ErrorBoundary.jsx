import { Component } from 'react';
import ErrorFallback from './ErrorFallback';
import { getLogger } from '../utils/logger';

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary:', error, errorInfo);
    try {
      const logger = getLogger();
      logger?.logError?.(error, { name: error?.name, errorInfo });
    } catch {}
  }

  handleRetry = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onRetry={this.handleRetry} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
