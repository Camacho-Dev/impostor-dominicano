import { createContext, useContext, useState, useCallback } from 'react';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';

const NotificacionesContext = createContext(null);

export function NotificacionesProvider({ children }) {
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const showModal = useCallback(({ title, content, onClose }) => {
    setModal({ title, content, onClose });
  }, []);

  const hideModal = useCallback(() => {
    if (modal?.onClose) modal.onClose();
    setModal(null);
  }, [modal]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    setToast({ message, type });
    if (duration > 0) {
      setTimeout(() => setToast(null), duration);
    }
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  const showConfirm = useCallback(({ message, confirmText = 'Confirmar', cancelText = 'Cancelar', onConfirm, onCancel }) => {
    setConfirm({
      message,
      confirmText,
      cancelText,
      onConfirm: () => {
        onConfirm?.();
        setConfirm(null);
      },
      onCancel: () => {
        onCancel?.();
        setConfirm(null);
      }
    });
  }, []);

  const value = {
    showModal,
    hideModal,
    showToast,
    hideToast,
    showConfirm
  };

  return (
    <NotificacionesContext.Provider value={value}>
      {children}
      {modal && (
        <Modal title={modal.title} onClose={hideModal}>
          {modal.content}
        </Modal>
      )}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
      {confirm && (
        <ConfirmDialog
          message={confirm.message}
          confirmText={confirm.confirmText}
          cancelText={confirm.cancelText}
          onConfirm={confirm.onConfirm}
          onCancel={confirm.onCancel}
        />
      )}
    </NotificacionesContext.Provider>
  );
}

export function useNotificaciones() {
  const ctx = useContext(NotificacionesContext);
  if (!ctx) {
    throw new Error('useNotificaciones debe usarse dentro de NotificacionesProvider');
  }
  return ctx;
}
