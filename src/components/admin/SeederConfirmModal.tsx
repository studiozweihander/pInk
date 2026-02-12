import React from "react";
import "../../styles/admin/SeederConfirmModal.css";

interface SeederConfirmModalProps {
    isOpen: boolean;
    isUploading: boolean;
    issueCount: number;
    issueLabel: string;
    comicLabel: string;
    issueRange: string;
    idiomId: string;
    comicId: string;
    genresSummary: string;
    onClose: () => void;
    onConfirm: () => void;
}

const SeederConfirmModal: React.FC<SeederConfirmModalProps> = ({
    isOpen,
    isUploading,
    issueCount,
    issueLabel,
    comicLabel,
    issueRange,
    idiomId,
    comicId,
    genresSummary,
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
                        {`será adicionado ${issueCount} ${issueLabel} ao quadrinho ${comicLabel}.`}
                    </p>
                    <div className="modal-admin-confirm-details">
                        <div>
                            <span>Total de edições</span>
                            <strong>{issueCount}</strong>
                        </div>
                        <div>
                            <span>Quadrinho</span>
                            <strong>{comicLabel}</strong>
                        </div>
                        <div>
                            <span>Faixa de números</span>
                            <strong>{issueRange}</strong>
                        </div>
                        <div>
                            <span>Idiom ID</span>
                            <strong>{idiomId || "-"}</strong>
                        </div>
                        <div>
                            <span>Comic ID</span>
                            <strong>{comicId || "-"}</strong>
                        </div>
                        <div>
                            <span>Gêneros</span>
                            <strong>{genresSummary}</strong>
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

export default SeederConfirmModal;
