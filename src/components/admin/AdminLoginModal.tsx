import React, { useState } from "react";
import "../../styles/admin/AdminLoginModal.css";

interface AdminLoginModalProps {
    isOpen: boolean;
    isLoading: boolean;
    errorMessage: string | null;
    onSubmit: (email: string, password: string) => Promise<void>;
    onClose: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
    isOpen,
    isLoading,
    errorMessage,
    onSubmit,
    onClose,
}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        await onSubmit(email.trim(), password);
    };

    return (
        <div className="modal-admin" role="dialog" aria-modal="true">
            <div className="modal-admin-overlay" onClick={onClose}></div>
            <div className="modal-admin-content">
                <button
                    className="modal-admin-close"
                    type="button"
                    aria-label="Fechar"
                    onClick={onClose}
                >
                    ×
                </button>
                <div className="modal-admin-header">
                    <h2>Acesso administrativo</h2>
                    <p>Login exclusivo para administradores.</p>
                </div>
                <form className="modal-admin-form" onSubmit={handleSubmit}>
                    <label className="modal-admin-label" htmlFor="admin-email">
                        Email
                    </label>
                    <input
                        id="admin-email"
                        type="email"
                        autoComplete="email"
                        className="modal-admin-input"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="admin@pink.com"
                        required
                    />
                    <label className="modal-admin-label" htmlFor="admin-password">
                        Senha
                    </label>
                    <input
                        id="admin-password"
                        type="password"
                        autoComplete="current-password"
                        className="modal-admin-input"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="••••••••"
                        required
                    />
                    {errorMessage && (
                        <div className="modal-admin-error" role="alert">
                            {errorMessage}
                        </div>
                    )}
                    <button className="modal-admin-submit" type="submit" disabled={isLoading}>
                        {isLoading ? "Entrando..." : "Entrar"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginModal;
