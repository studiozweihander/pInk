import React, { useEffect, useState } from "react";
import { api, Issue } from "../api";

interface ModalProps {
    issueId: number;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ issueId, onClose }) => {
    const [issue, setIssue] = useState<Issue | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadIssue = async () => {
            setIsLoading(true);
            try {
                const res = await api.getIssueById(issueId);
                setIssue(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        loadIssue();
    }, [issueId]);

    if (!issue && !isLoading) return null;

    return (
        <div className="modal open">
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>
                    ×
                </button>
                <div className="modal-body">
                    <div className="modal-image">
                        <img src={issue?.cover} alt={issue?.title} />
                    </div>
                    <div className="modal-info">
                        <div className="modal-header">
                            <h2>{isLoading ? "Carregando..." : issue?.title}</h2>
                            {issue?.link && (
                                <a
                                    href={issue.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="download-button"
                                    id="download-btn"
                                >
                                    <span>Download</span>
                                    {issue.size && (
                                        <span id="download-size">({issue.size})</span>
                                    )}
                                </a>
                            )}
                        </div>

                        <div className="modal-section">
                            <h3>Sinopse</h3>
                            <p id="modal-synopsis">{issue?.synopsis || "Sem sinopse disponível."}</p>
                        </div>

                        <div className="modal-section">
                            <h3>Detalhes</h3>
                            <div className="modal-details">
                                <div className="detail-item">
                                    <span className="detail-label">Série:</span>
                                    <span>{issue?.series || "-"}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Gênero(s):</span>
                                    <span>
                                        {Array.isArray(issue?.genres)
                                            ? issue?.genres.join(", ")
                                            : issue?.genres || "-"}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Lançamento:</span>
                                    <span>{issue?.year || "-"}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Tamanho:</span>
                                    <span>{issue?.size || "-"}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Idioma:</span>
                                    <span>{issue?.language || "-"}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Crédito:</span>
                                    {issue?.creditoLink ? (
                                        <span
                                            id="modal-credits"
                                            className="credits-link clickable"
                                            aria-label={`Abrir site do ${issue.credito}`}
                                            title={`Clique para visitar ${issue.creditoLink}`}
                                            onClick={() =>
                                                window.open(issue.creditoLink, "_blank")
                                            }
                                        >
                                            {issue.credito || "Visitar"}
                                        </span>
                                    ) : (
                                        <span className="credits-link">
                                            {issue?.credito || "-"}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
