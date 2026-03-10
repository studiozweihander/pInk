import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Comic } from "../api";
import "../styles/IndicePage.css";
import protonIcon from "../assets/proton-drive-icon.png";
import catboxIcon from "../assets/catbox-logo.png";
import archiveIcon from "../assets/archive-icon.png";

import { ALPHABET, COMIC_DATA_BY_LETTER, ComicSection, Issue, Provider, ProviderType } from "./indiceData";

interface IndiceContext {
    setHeaderComic: (comic: Comic | null) => void;
    setHeaderAction: (action: React.ReactNode | null) => void;
}

const PROVIDER_ICONS: Record<ProviderType, string> = {
    proton: protonIcon,
    catbox: catboxIcon,
    archive: archiveIcon,
};

const ProviderButton: React.FC<Provider> = ({ type, url, label }) => {
    const icon = PROVIDER_ICONS[type];
    const className = `provider-btn btn-${type}`;

    if (!url) return null;

    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
            <img src={icon} alt={`${label} Logo`} /> {label}
        </a>
    );
};

const IssueItem: React.FC<Issue> = ({ title, providers }) => (
    <li>
        <p>{title}</p>
        <div className="provider-buttons">
            {providers.map((p, i) => (
                <ProviderButton key={i} {...p} />
            ))}
        </div>
    </li>
);


const Indice: React.FC = () => {
    const { setHeaderComic } = useOutletContext<IndiceContext>();
    const [isTocExpanded, setIsTocExpanded] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(ALPHABET.map((letter) => letter.toLowerCase())));

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => {
            const next = new Set(prev);
            if (next.has(sectionId)) next.delete(sectionId);
            else next.add(sectionId);
            return next;
        });
    };

    useEffect(() => {
        setHeaderComic(null);
        window.scrollTo(0, 0);
    }, [setHeaderComic]);

    const renderComicSection = (section: ComicSection) => (
        <section key={section.id} className={`collapsible-section ${expandedSections.has(section.id) ? "is-expanded" : ""}`}>
            <button className="section-header-btn h3-toggle" onClick={() => toggleSection(section.id)}>
                <h3>
                    {section.title}
                    {section.link && (
                        <> by {section.link.url ? (
                            <a href={section.link.url} rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                {section.link.text}
                            </a>
                        ) : (
                            <span>{section.link.text}</span>
                        )}</>
                    )}
                </h3>
                <svg className="section-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>
            <div className="collapsible-content">
                <ul>
                    {section.issues.map((issue, idx) => (
                        <IssueItem key={idx} {...issue} />
                    ))}
                </ul>
            </div>
        </section>
    );

    return (
        <div className="indice-page-layout">
            <div className="indice-page-wrapper">
                <main className="indice-main-container">
                    <article className="indice-content">
                        <section id="introducao">
                            <h1>Indice de Arquivos</h1>
                            <p>
                                Bem-vindo ao indice oficial do pInk. Aqui voce encontrara uma organizacao detalhada
                                de todo o nosso acervo, possibilitando uma navegacao mais direta e eficiente.
                            </p>
                        </section>

                        {ALPHABET.map((letter) => {
                            const id = letter.toLowerCase();
                            const sections = COMIC_DATA_BY_LETTER[letter];
                            const hasContent = sections && sections.length > 0;

                            return (
                                <section key={id} id={id} className={`collapsible-section ${expandedSections.has(id) ? "is-expanded" : ""}`}>
                                    <button className="section-header-btn" onClick={() => toggleSection(id)}>
                                        <h2>{letter}</h2>
                                        <svg className="section-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M6 9l6 6 6-6" />
                                        </svg>
                                    </button>
                                    <div className="collapsible-content">
                                        {hasContent ? (
                                            sections.map(section => renderComicSection(section))
                                        ) : (
                                            <p className="placeholder-text">Em breve...</p>
                                        )}
                                    </div>
                                </section>
                            );
                        })}
                    </article>
                </main>

                <aside className="indice-toc-sidebar">
                    <div className={`indice-toc-box ${isTocExpanded ? "is-expanded" : ""}`}>
                        <button
                            className="toc-toggle-btn"
                            onClick={() => setIsTocExpanded(!isTocExpanded)}
                            aria-expanded={isTocExpanded}
                        >
                            <h3>Neste Artigo</h3>
                            <svg className={`chevron-icon ${isTocExpanded ? "rotate" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        </button>
                        <ul className="toc-list alphabet-toc">
                            {ALPHABET.map((letter) => (
                                <li key={letter}>
                                    <a href={`#${letter.toLowerCase()}`} onClick={() => setIsTocExpanded(false)}>{letter}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div >
        </div >
    );
};

export default Indice;
