import React from "react";
import "../../styles/admin/SeederConfirmModal.css";

interface ComicSeederConfirmModalProps {
    isOpen: boolean;
    isUploading: boolean;
    comicCount: number;
    comicLabel: string;
    method: "edge" | "direct";
    onClose: () => void;
    onConfirm: () => void;
}

const ComicSeederConfirmModal: React.FC<ComicSeederConfirmModalProps> = ({
    isOpen,
    isUploading,
    comicCount,
    comicLabel,
    method,
    onClose,
    onConfirm,
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-admin" role="dialog" aria-modal="true">
            <div className="modal-admin-overlay" onClick={onClose}></div>
            <div className="modal-admin-content">
                <button
                    className="modal-admin-close"
                    type="button"
                    aria-label="Fechar"
                    onClick={onClose}
                    disabled={isUploading}
                >
                    ×
                </button>
                <div className="modal-admin-header">
                    <h2>Confirmar envio</h2>
                    <p>Revise o sumário antes de enviar.</p>
                </div>
                <div className="modal-admin-confirm-summary">
                    <p className="modal-admin-confirm-message">
                        {`será adicionado ${comicCount} ${comicLabel}.`}
                    </p>
                    <div className="modal-admin-confirm-details">
                        <div>
                            <span>Total de quadrinhos</span>
                            <strong>{comicCount}</strong>
                        </div>
                        <div>
                            <span>Método</span>
                            <strong>{method === "edge" ? "Edge Function" : "Direto"}</strong>
                        </div>
                    </div>
                </div>
                <div className="modal-admin-confirm-actions">
                    <button type="button" className="is-secondary" onClick={onClose} disabled={isUploading}>
                        Cancelar
                    </button>
                    <button type="button" onClick={onConfirm} disabled={isUploading}>
                        {isUploading ? "Enviando..." : "Confirmar envio"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComicSeederConfirmModal;
