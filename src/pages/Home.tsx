import React, { useState, useEffect, useMemo, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { api, Comic } from "../api";
import ComicCard from "../components/ComicCard";
import ControlsBar from "../components/ControlsBar";
import StatusMessage from "../components/StatusMessage";
import { updateMetaTags } from "../utils/seoUtils";
import { useScrollVisibility } from "../hooks/useScrollVisibility";
import { ActiveFilters, FILTER_KEYS, VIEW_MODES, ViewMode } from "../constants";

interface HomeContext {
    searchTerm: string;
}

const Home: React.FC = () => {
    const { searchTerm } = useOutletContext<HomeContext>();
    const [allComics, setAllComics] = useState<Comic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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
        const loadComics = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await api.getAllComics();
                if (!response.data) {
                    throw new Error("Resposta inválida da API");
                }
                setAllComics(response.data);
            } catch (error) {
                console.error(error);
                setError("Não foi possível carregar a lista de quadrinhos.");
            } finally {
                setIsLoading(false);
            }
        };
        loadComics();
    }, []);

    const filteredItems = useMemo(() => {
        let filtered = allComics.filter((item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (activeFilters[FILTER_KEYS.YEAR].length > 0) {
            filtered = filtered.filter((item) =>
                activeFilters[FILTER_KEYS.YEAR].includes(item.year?.toString())
            );
        }
        if (activeFilters[FILTER_KEYS.PUBLISHER].length > 0) {
            filtered = filtered.filter((comic) =>
                activeFilters[FILTER_KEYS.PUBLISHER].includes(comic.publisher)
            );
        }
        if (activeFilters[FILTER_KEYS.LANGUAGE].length > 0) {
            filtered = filtered.filter((comic) =>
                activeFilters[FILTER_KEYS.LANGUAGE].includes(comic.language)
            );
        }
        return filtered;
    }, [allComics, searchTerm, activeFilters]);

    useEffect(() => {
        updateMetaTags({
            title: "pInk | Catálogo de Quadrinhos Gratuitos",
            description: "Explore o pInk, o melhor catálogo de quadrinhos gratuitos da web! Encontre edições da Marvel, DC, Image e muito mais. Nossa biblioteca é atualizada constantemente com as melhores HQs em alta qualidade para download.",
            keywords: "catálogo de quadrinhos, hqs gratuitas, baixar hqs, ler quadrinhos online, marvel comics, dc comics, image comics, pInk comics",
        });
    }, []);

    return (
        <>
            <ControlsBar
                isControlsHidden={isControlsHidden}
                view="home"
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onBackClick={() => { }}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
                items={allComics}
            />
            <main className={`container ${isControlsHidden ? "controls-hidden" : ""}`} id="main-container">
                <h2 className="sr-only">Todos os Quadrinhos</h2>

                <div className={`scrollable-content ${isLoading || error || filteredItems.length === 0 ? "has-status-message" : ""}`} ref={scrollableContentRef}>
                    {isLoading ? (
                        <StatusMessage type="loading" />
                    ) : error ? (
                        <StatusMessage
                            type="error"
                            message="Erro ao carregar dados"
                            description={error}
                            onRetry={() => window.location.reload()}
                        />
                    ) : filteredItems.length > 0 ? (
                        <div className={`cards has-content ${viewMode === VIEW_MODES.LIST ? "list-view" : ""}`}>
                            {filteredItems.map((item) => (
                                <ComicCard
                                    key={item.id}
                                    comic={item}
                                />
                            ))}
                        </div>
                    ) : (
                        <StatusMessage
                            type={searchTerm || activeFilters[FILTER_KEYS.YEAR].length > 0 || activeFilters[FILTER_KEYS.PUBLISHER].length > 0 || activeFilters[FILTER_KEYS.LANGUAGE].length > 0 ? "empty_search" : "empty_content"}
                        />
                    )}
                </div>
            </main>
        </>
    );
};

export default Home;
