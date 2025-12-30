import React, { useState, useEffect, useMemo, useRef } from "react";
import { api, Comic, Issue } from "./api";
import Header from "./components/Header";
import ControlsBar from "./components/ControlsBar";
import ComicCard from "./components/ComicCard";
import IssueCard from "./components/IssueCard";
import Modal from "./components/Modal";
import Footer from "./components/Footer";
import StatusMessage from "./components/StatusMessage";
import ASCIIArt from "./components/ASCIIArt";
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

    const [error, setError] = useState<string | null>(null);
    const [lastComicId, setLastComicId] = useState<number | null>(null);

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

    const loadIssues = async (comicId: number) => {
        setIsLoading(true);
        setError(null);
        setLastComicId(comicId);
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
            setError("Não foi possível carregar as edições deste quadrinho.");
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
            <ASCIIArt />
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
                    <div className={`scrollable-content ${isLoading || error || filteredItems.length === 0 ? "has-status-message" : ""}`} ref={scrollableContentRef}>
                        {isLoading ? (
                            <StatusMessage type="loading" />
                        ) : error ? (
                            <StatusMessage
                                type="error"
                                message="Erro ao carregar dados"
                                description={error}
                                onRetry={view === "home" ? loadComics : () => lastComicId && loadIssues(lastComicId)}
                            />
                        ) : filteredItems.length > 0 ? (
                            <div className={`cards has-content ${viewMode === "list" ? "list-view" : ""}`}>
                                {filteredItems.map((item) =>
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
                                )}
                            </div>
                        ) : (
                            <StatusMessage
                                type={searchTerm || activeFilters.year.length > 0 || (view === "home" && (activeFilters.publisher.length > 0 || activeFilters.language.length > 0)) ? "empty_search" : "empty_content"}
                                message={view === "issues" && currentComic?.total_issues === 0 ? "Quadrinho sem edições" : undefined}
                                description={view === "issues" && currentComic?.total_issues === 0 ? `O quadrinho "${currentComic?.title}" ainda não tem edições disponíveis.` : undefined}
                            />
                        )}
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
