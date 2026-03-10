import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { api, Comic as ComicType, Issue } from "../api";
import IssueCard from "../components/IssueCard";
import ControlsBar from "../components/ControlsBar";
import StatusMessage from "../components/StatusMessage";
import Modal from "../components/Modal";
import { updateMetaTags } from "../utils/seoUtils";
import { ActiveFilters, FILTER_KEYS, getDynamicOGImage, VIEW_MODES, ViewMode } from "../constants";
import { useScrollVisibility } from "../hooks/useScrollVisibility";

interface ComicContext {
    searchTerm: string;
    setHeaderComic: (comic: ComicType | null) => void;
    setHeaderAction: (action: React.ReactNode | null) => void;
}

const ComicPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { searchTerm, setHeaderComic } = useOutletContext<ComicContext>();
    const navigate = useNavigate();

    const [currentComic, setCurrentComic] = useState<ComicType | null>(null);
    const [currentIssues, setCurrentIssues] = useState<Issue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
        [FILTER_KEYS.PUBLISHER]: [],
        [FILTER_KEYS.YEAR]: [],
        [FILTER_KEYS.LANGUAGE]: [],
    });
    const [viewMode, setViewMode] = useState<ViewMode>(VIEW_MODES.GRID);
    const scrollableContentRef = useRef<HTMLDivElement>(null);
    const isControlsHidden = useScrollVisibility(scrollableContentRef, {
        hideThreshold: 50,
    });

    useEffect(() => {
        const loadData = async () => {
            if (!slug) return;
            setIsLoading(true);
            setError(null);
            try {
                const [comicRes, issuesRes] = await Promise.all([
                    api.getComicById(slug),
                    api.getComicIssues(slug),
                ]);
                if (!comicRes.data || !issuesRes.data) {
                    throw new Error("Resposta inválida da API");
                }
                setCurrentComic(comicRes.data);
                setHeaderComic(comicRes.data);
                setCurrentIssues(issuesRes.data);
            } catch (error) {
                console.error(error);
                setError("Não foi possível carregar as edições deste quadrinho.");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();

        return () => setHeaderComic(null);
    }, [slug, setHeaderComic]);

    const filteredItems = useMemo(() => {
        let filtered = currentIssues.filter((item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (activeFilters[FILTER_KEYS.YEAR].length > 0) {
            filtered = filtered.filter((item) =>
                activeFilters[FILTER_KEYS.YEAR].includes(item.year?.toString())
            );
        }

        return filtered;
    }, [currentIssues, searchTerm, activeFilters]);

    useEffect(() => {
        if (currentComic) {
            updateMetaTags({
                title: `pInk | ${currentComic.title} (${currentComic.year})`,
                description: `Baixe e leia ${currentComic.title} (${currentComic.year}) gratuitamente no pInk. Acesse todas as edições disponíveis deste quadrinho da ${currentComic.publisher} em alta qualidade.`,
                image: getDynamicOGImage(currentComic.title, currentComic.year),
                keywords: `${currentComic.title}, ${currentComic.publisher}, quadrinhos ${currentComic.year}, baixar ${currentComic.title}, hq gratuita`,
            });
        } else {
            updateMetaTags({
                title: "pInk | Carregando...",
                description: "Carregando detalhes do quadrinho no pInk. Aguarde enquanto preparamos a sua leitura.",
            });
        }
    }, [currentComic]);

    return (
        <>
            <ControlsBar
                isControlsHidden={isControlsHidden}
                view="issues"
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onBackClick={() => navigate("/")}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
                items={currentIssues}
            />
            <main className={`container ${isControlsHidden ? "controls-hidden" : ""}`} id="main-container">


                <h2 className="sr-only">{currentComic ? `Edições de ${currentComic.title}` : "Edições"}</h2>

                <div className={`scrollable-content ${isLoading || error || filteredItems.length === 0 ? "has-status-message" : ""}`} ref={scrollableContentRef}>
                    {isLoading ? (
                        <StatusMessage type="loading" />
                    ) : error ? (
                        <StatusMessage
                            type="error"
                            message="Erro ao carregar dados"
                            description={error}
                            onRetry={() => navigate(0)}
                        />
                    ) : filteredItems.length > 0 ? (
                        <div className={`cards has-content ${viewMode === VIEW_MODES.LIST ? "list-view" : ""}`}>
                            {filteredItems.map((item) => (
                                <IssueCard
                                    key={item.id}
                                    issue={item}
                                    onClick={() => setSelectedIssueId(item.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <StatusMessage
                            type={searchTerm || activeFilters[FILTER_KEYS.YEAR].length > 0 ? "empty_search" : "empty_content"}
                            message={currentComic?.total_issues === 0 ? "Quadrinho sem edições" : undefined}
                            description={currentComic?.total_issues === 0 ? `O quadrinho "${currentComic?.title}" ainda não tem edições disponíveis.` : undefined}
                        />
                    )}
                </div>

                {selectedIssueId && (
                    <Modal
                        issueId={selectedIssueId}
                        onClose={() => setSelectedIssueId(null)}
                    />
                )}
            </main>
        </>
    );
};

export default ComicPage;
