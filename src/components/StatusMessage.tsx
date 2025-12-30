import React from "react";

interface StatusMessageProps {
    type: "loading" | "empty_search" | "empty_content" | "error";
    message?: string;
    description?: string;
    onRetry?: () => void;
}

const StatusMessage: React.FC<StatusMessageProps> = ({
    type,
    message,
    description,
    onRetry,
}) => {
    const getContent = () => {
        switch (type) {
            case "loading":
                return {
                    icon: <div className="loading-spinner"></div>,
                    title: message || "Carregando...",
                    desc: description || "Por favor, aguarde um momento.",
                };
            case "empty_search":
                return {
                    icon: "🔍",
                    title: message || "Nenhum resultado encontrado",
                    desc: description || "Tente ajustar sua busca ou filtros.",
                };
            case "empty_content":
                return {
                    icon: "📚",
                    title: message || "Ainda não há edições",
                    desc: description || "Este quadrinho ainda não possui edições cadastradas.",
                };
            case "error":
                return {
                    icon: "⚠️",
                    title: message || "Ops! Algo deu errado",
                    desc: description || "Não foi possível carregar as informações.",
                };
            default:
                return {
                    icon: null,
                    title: "",
                    desc: "",
                };
        }
    };

    const content = getContent();

    return (
        <div className={`status-message-container ${type}`}>
            <div className="status-message-content">
                <div className="status-message-icon">
                    {typeof content.icon === "string" ? (
                        <span style={{ fontSize: "3rem" }}>{content.icon}</span>
                    ) : (
                        content.icon
                    )}
                </div>
                <h3 className="status-message-title">{content.title}</h3>
                <p className="status-message-description">{content.desc}</p>
                {type === "error" && onRetry && (
                    <button className="retry-btn" onClick={onRetry}>
                        Tentar novamente
                    </button>
                )}
            </div>
        </div>
    );
};

export default StatusMessage;
