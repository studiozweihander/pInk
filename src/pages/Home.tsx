import React, { useState, useEffect, useMemo, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { api, Comic } from "../api";
import ComicCard from "../components/ComicCard";
import ControlsBar from "../components/ControlsBar";
import StatusMessage from "../components/StatusMessage";
import { updateMetaTags } from "../utils/seoUtils";

interface HomeContext {
    searchTerm: string;
}

const Home: React.FC = () => {
    const { searchTerm } = useOutletContext<HomeContext>();
    const [allComics, setAllComics] = useState<Comic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilters, setActiveFilters] = useState<{
        publisher: string[];
        year: string[];
        language: string[];
    }>({
        publisher: [],
        year: [],
        language: [],
    });
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [isControlsHidden, setIsControlsHidden] = useState(false);
    const lastScrollTop = useRef(0);
    const scrollableContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadComics = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await api.getAllComics();
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

        if (activeFilters.year.length > 0) {
            filtered = filtered.filter((item) =>
                activeFilters.year.includes(item.year?.toString())
            );
        }
        if (activeFilters.publisher.length > 0) {
            filtered = filtered.filter((c) =>
                activeFilters.publisher.includes(c.publisher)
            );
        }
        if (activeFilters.language.length > 0) {
            filtered = filtered.filter((c) =>
                activeFilters.language.includes(c.language)
            );
        }
        return filtered;
    }, [allComics, searchTerm, activeFilters]);

    useEffect(() => {
        const scrollElement = scrollableContentRef.current;
        if (!scrollElement) return;

        const handleScroll = () => {
            const scrollTop = scrollElement.scrollTop;
            if (scrollTop > lastScrollTop.current && scrollTop > 50) {
                setIsControlsHidden(true);
            } else if (scrollTop < lastScrollTop.current) {
                setIsControlsHidden(false);
            }
            lastScrollTop.current = scrollTop;
        };

        scrollElement.addEventListener("scroll", handleScroll);
        return () => scrollElement.removeEventListener("scroll", handleScroll);
    }, [isLoading]);

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
                        <div className={`cards has-content ${viewMode === "list" ? "list-view" : ""}`}>
                            {filteredItems.map((item) => (
                                <ComicCard
                                    key={item.id}
                                    comic={item}
                                />
                            ))}
                        </div>
                    ) : (
                        <StatusMessage
                            type={searchTerm || activeFilters.year.length > 0 || activeFilters.publisher.length > 0 || activeFilters.language.length > 0 ? "empty_search" : "empty_content"}
                        />
                    )}
                </div>
            </main>
        </>
    );
};

export default Home;
