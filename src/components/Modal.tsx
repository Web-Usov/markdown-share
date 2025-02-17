import React, { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  confirmAction?: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  message,
  confirmAction,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onClose={onClose}
    >
      <div className="modal-box">
        <p className="py-4 text-center">{message}</p>
        <div className="modal-action justify-center">
          {confirmAction ? (
            <>
              <button className="btn btn-primary" onClick={confirmAction}>
                Да
              </button>
              <button className="btn" onClick={onClose}>
                Нет
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={onClose}>
              OK
            </button>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};
