import React from 'react';
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Modal, ModalProps, ModalHeader, ModalBody, ModalFooter } from '../../components/ui/Modal';

type ModalSize = ModalProps['size'];
type ModalVariant = ModalProps['variant'];

interface ModalContextType {
  showModal: (options: {
    title?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: ModalSize;
    variant?: ModalVariant;
    closeOnOverlay?: boolean;
    onClose?: () => void;
  }) => void;
  hideModal: () => void;
}

interface ModalState {
  isOpen: boolean;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size: ModalSize;
  variant: ModalVariant;
  closeOnOverlay: boolean;
  onClose?: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    size: 'md',
    variant: 'default',
    closeOnOverlay: true,
    children: null,
  });

  const showModal = useCallback((options: {
    title?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: ModalSize;
    variant?: ModalVariant;
    closeOnOverlay?: boolean;
    onClose?: () => void;
  }) => {
    setModalState({
      isOpen: true,
      title: options.title,
      children: options.children,
      footer: options.footer,
      size: options.size || 'md',
      variant: options.variant || 'default',
      closeOnOverlay: options.closeOnOverlay !== undefined ? options.closeOnOverlay : true,
      onClose: options.onClose,
    });
  }, []);

  const hideModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() => {
          hideModal();
          modalState.onClose?.();
        }}
        title={modalState.title}
        footer={modalState.footer}
        size={modalState.size}
        variant={modalState.variant}
        closeOnOverlay={modalState.closeOnOverlay}
      >
        {modalState.children}
      </Modal>
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

export default ModalContext;