import React, { useState, useEffect, useMemo, useRef } from "react";
import { api, Comic, Issue } from "./api";
import Header from "./components/Header";
import ControlsBar from "./components/ControlsBar";
import ComicCard from "./components/ComicCard";
import IssueCard from "./components/IssueCard";
import Modal from "./components/Modal";
import Footer from "./components/Footer";
import "./styles/style.css";

const App: React.FC = () => {
    const [allComics, setAllComics] = useState<Comic[]>([]);
    const [currentIssues, setCurrentIssues] = useState<Issue[]>([]);
    const [currentComic, setCurrentComic] = useState<Comic | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [view, setView] = useState<"home" | "issues">("home");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
    const [activeFilters, setActiveFilters] = useState<{
        publisher: string[];
        year: string[];
        language: string[];
    }>({
        publisher: [],
        year: [],
        language: [],
    });

    const [isControlsHidden, setIsControlsHidden] = useState(false);
    const lastScrollTop = useRef(0);
    const scrollableContentRef = useRef<HTMLDivElement>(null);

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
    }, []);

    useEffect(() => {
        loadComics();
    }, []);

    const loadComics = async () => {
        setIsLoading(true);
        try {
            const response = await api.getAllComics();
            setAllComics(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadIssues = async (comicId: number) => {
        setIsLoading(true);
        setView("issues");
        setActiveFilters({ publisher: [], year: [], language: [] });
        try {
            const [comicRes, issuesRes] = await Promise.all([
                api.getComicById(comicId),
                api.getComicIssues(comicId),
            ]);
            setCurrentComic(comicRes.data);
            setCurrentIssues(issuesRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredItems = useMemo(() => {
        const items = view === "home" ? allComics : currentIssues;
        let filtered = (items as any[]).filter((item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (activeFilters.year.length > 0) {
            filtered = (filtered as (Comic | Issue)[]).filter((item) =>
                activeFilters.year.includes(item.year?.toString())
            );
        }

        if (view === "home") {
            const comics = filtered as Comic[];
            if (activeFilters.publisher.length > 0) {
                filtered = comics.filter((c) =>
                    activeFilters.publisher.includes(c.publisher)
                );
            }
            if (activeFilters.language.length > 0) {
                filtered = (filtered as Comic[]).filter((c) =>
                    activeFilters.language.includes(c.language)
                );
            }
        }

        return filtered;
    }, [view, allComics, currentIssues, searchTerm, activeFilters]);

    const handleBackToHome = () => {
        setView("home");
        setCurrentComic(null);
        setCurrentIssues([]);
        setSearchTerm("");
        setActiveFilters({ publisher: [], year: [], language: [] });
    };

    return (
        <div className="main-wrapper">
            <div className="landing-section">
                <Header
                    view={view}
                    currentComic={currentComic}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onLogoClick={handleBackToHome}
                />

                <div className={`controls-container ${isControlsHidden ? "controls-hidden" : ""}`}>
                    <ControlsBar
                        key={view}
                        view={view}
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                        onBackClick={handleBackToHome}
                        activeFilters={activeFilters}
                        setActiveFilters={setActiveFilters}
                        items={view === "home" ? allComics : currentIssues}
                    />
                </div>

                <main className={`container ${isControlsHidden ? "controls-hidden" : ""}`} id="main-container">
                    <div className="scrollable-content" ref={scrollableContentRef}>
                        <div className={`cards has-content ${viewMode === "list" ? "list-view" : ""}`}>
                            {isLoading ? (
                                <div className="loading">
                                    <div className="loading-spinner"></div>
                                    <p>Carregando...</p>
                                </div>
                            ) : filteredItems.length > 0 ? (
                                filteredItems.map((item) =>
                                    view === "home" ? (
                                        <ComicCard
                                            key={item.id}
                                            comic={item as Comic}
                                            onClick={() => loadIssues(item.id)}
                                        />
                                    ) : (
                                        <IssueCard
                                            key={item.id}
                                            issue={item as Issue}
                                            onClick={() => setSelectedIssueId(item.id)}
                                        />
                                    )
                                )
                            ) : (
                                <div className="empty-state">
                                    <h3>📚 Nenhum item encontrado</h3>
                                    <p>Tente ajustar sua busca ou filtros.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {selectedIssueId && (
                <Modal
                    issueId={selectedIssueId}
                    onClose={() => setSelectedIssueId(null)}
                />
            )}

            <Footer />
        </div>
    );
};

export default App;
