import React from "react";
import { Link } from "react-router-dom";
import { CONTACT_EMAIL, SOCIAL_LINKS } from "../constants";

const Footer: React.FC = () => {
    const [requestTitle, setRequestTitle] = React.useState("");
    const [notification, setNotification] = React.useState<{ message: string; type: "success" | "error" | null }>({
        message: "",
        type: null,
    });

    const showNotification = (message: string, type: "success" | "error" = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: "", type: null }), 3000);
    };

    const handleRequest = () => {
        if (!requestTitle.trim()) {
            showNotification("Por favor, digite sua solicitação antes de enviar.", "error");
            return;
        }

        const encodedContent = encodeURIComponent(requestTitle);
        const mailtoURL = `mailto:${CONTACT_EMAIL}?subject=Solicitação de quadrinho&body=Olá, eu gostaria que vocês adicionassem o seguinte quadrinho: ${encodedContent}`;

        window.location.href = mailtoURL;
        setRequestTitle("");
        showNotification("Solicitação preparada! Por favor, não altere o assunto do email.");
    };

    return (
        <footer className="site-footer">
            <div className="footer-content">
                <div className="footer-main">
                    <div className="footer-brand">
                        <h2 className="footer-title">Solicite um quadrinho!</h2>
                        <p className="footer-subtitle">
                            Não encontrou o que procurava? Envie uma sugestão e nós
                            adicionaremos ao nosso acervo.
                        </p>
                    </div>

                    <div className="footer-email-form">
                        <div className="email-input-group">
                            <input
                                type="text"
                                id="footer-email"
                                placeholder="Digite apenas o nome do quadrinho"
                                aria-label="Solicite um quadrinho"
                                value={requestTitle}
                                onChange={(e) => setRequestTitle(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleRequest()}
                            />
                            <button
                                type="button"
                                id="submit-request"
                                className="email-submit-btn"
                                aria-label="Enviar solicitação"
                                onClick={handleRequest}
                            >
                                <span>Solicitar</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="18px"
                                    viewBox="0 -960 960 960"
                                    width="18px"
                                    fill="currentColor"
                                >
                                    <path d="M647-440H160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520h487L423-744q-12-12-11.5-28t12.5-28q12-11 28-11.5t28 11.5l264 264q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L480-216q-11 11-27.5 11T424-216q-12-12-12-28.5t12-28.5l224-224Z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="footer-info">
                    <div className="footer-section">
                        <h3 className="footer-section-title">Contato</h3>
                        <div className="footer-links">
                            <a
                                href={`mailto:${CONTACT_EMAIL}`}
                                className="footer-link"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Enviar email"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="18px"
                                    viewBox="0 -960 960 960"
                                    width="18px"
                                    fill="currentColor"
                                >
                                    <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"></path>
                                </svg>
                                {CONTACT_EMAIL}
                            </a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-section-title">Navegação</h3>
                        <div className="footer-links">
                            <span className="footer-link disabled">
                                <svg fill="currentColor" height="18px" width="18px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                    <path d="M7.41527,7.75061v3.68905H6.3764v1.576h4.24028v-1.576H9.599v-5.265H6.3764v1.576Zm.27562-2.69847A1.19081,1.19081,0,0,0,9.72622,4.2135a1.16411,1.16411,0,0,0-.34629-.8457,1.19293,1.19293,0,0,0-1.69258,0,1.15814,1.15814,0,0,0-.34982.8457A1.14424,1.14424,0,0,0,7.69089,5.05214Z" />
                                </svg>
                                Como utilizar o pInk
                            </span>
                            <Link to="/indice" className="footer-link">
                                <svg viewBox="0 0 24 24" fill="none" height="18px" width="18px" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 9V17.8C19 18.9201 19 19.4802 18.782 19.908C18.5903 20.2843 18.2843 20.5903 17.908 20.782C17.4802 21 16.9201 21 15.8 21H8.2C7.07989 21 6.51984 21 6.09202 20.782C5.71569 20.5903 5.40973 20.2843 5.21799 19.908C5 19.4802 5 18.9201 5 17.8V6.2C5 5.07989 5 4.51984 5.21799 4.09202C5.40973 3.71569 5.71569 3.40973 6.09202 3.21799C6.51984 3 7.0799 3 8.2 3H13M19 9L13 3M19 9H14C13.4477 9 13 8.55228 13 8V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                                Índice
                            </Link>
                            <Link to="/admin" className="footer-link">
                                <svg viewBox="0 0 24 24" fill="none" height="18px" width="18px" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 3L4 6.5V12.5C4 17.1944 7.05556 21.5 12 21.5C16.9444 21.5 20 17.1944 20 12.5V6.5L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M9.5 12.5L11 14L14.5 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Área Administrativa
                            </Link>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h3 className="footer-section-title">Redes Sociais</h3>
                        <div className="footer-social">
                            <a href={SOCIAL_LINKS.twitter} className="social-link" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                <svg viewBox="0 0 1200 1227" fill="currentColor">
                                    <path d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z" />
                                </svg>
                                <span>@pinkcomics</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <div className="footer-brand-name">
                        <span className="footer-logo">pInk</span>
                    </div>
                    <div className="footer-copyright">
                        <span>© 2025. Todos os direitos reservados</span>
                    </div>
                </div>
            </div>

            {notification.type && (
                <div className={`notification-toast ${notification.type}`}>
                    <span>{notification.message}</span>
                </div>
            )}
        </footer>
    );
};

export default Footer;
