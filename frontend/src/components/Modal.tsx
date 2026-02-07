import React, { useEffect } from 'react';
import '../styles/Modal.css';

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  size?: 'small' | 'medium' | 'large';
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  children,
  onClose,
  size = 'medium',
  showCloseButton = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className={`modal modal-${size}`}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          {showCloseButton && (
            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              ✕
            </button>
          )}
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
