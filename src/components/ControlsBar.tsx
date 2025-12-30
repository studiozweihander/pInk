import React, { useState, useMemo } from "react";
import { Comic, Issue } from "../api";

interface ControlsBarProps {
    view: "home" | "issues";
    viewMode: "grid" | "list";
    onViewModeChange: (mode: "grid" | "list") => void;
    onBackClick: () => void;
    activeFilters: {
        publisher: string[];
        year: string[];
        language: string[];
    };
    setActiveFilters: (filters: {
        publisher: string[];
        year: string[];
        language: string[];
    }) => void;
    items: (Comic | Issue)[];
}

const ControlsBar: React.FC<ControlsBarProps> = ({
    view,
    viewMode,
    onViewModeChange,
    onBackClick,
    activeFilters,
    setActiveFilters,
    items,
}) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filters = useMemo(() => {
        const publishers = new Set<string>();
        const years = new Set<string>();
        const languages = new Set<string>();

        items.forEach((item) => {
            if ("publisher" in item && item.publisher) publishers.add(item.publisher);
            if (item.year) years.add(item.year.toString());
            if (item.language) languages.add(item.language);
        });

        return {
            publishers: Array.from(publishers).sort(),
            years: Array.from(years).sort((a, b) => parseInt(b) - parseInt(a)),
            languages: Array.from(languages).sort(),
        };
    }, [items]);

    const toggleFilter = (type: "publisher" | "year" | "language", value: string) => {
        const current = activeFilters[type] || [];
        const updated = current.includes(value)
            ? current.filter((v: string) => v !== value)
            : [...current, value];

        setActiveFilters({ ...activeFilters, [type]: updated });
    };

    const totalActive = Object.values(activeFilters).flat().length;

    return (
        <div className="controls-bar">
            <div className="controls-left">
                {view === "issues" && (
                    <button className="control-button back-btn" onClick={onBackClick}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="16px"
                            viewBox="0 -960 960 960"
                            width="16px"
                            fill="currentColor"
                        >
                            <path d="m313-440 196 196q12 12 11.5 28T508-188q-12 11-28 11.5T452-188L188-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l264-264q11-11 27.5-11t28.5 11q12 12 12 28.5T508-715L313-520h447q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H313Z" />
                        </svg>
                        <span className="control-text">Voltar</span>
                    </button>
                )}
            </div>

            <div className="controls-right">
                <div className="filter-container">
                    <button
                        className={`toggle-button filter-toggle ${isFilterOpen ? "active" : ""} ${totalActive > 0 ? "has-filters" : ""}`}
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        data-count={totalActive > 0 ? totalActive : undefined}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="16px"
                            viewBox="0 -960 960 960"
                            width="16px"
                            fill="currentColor"
                        >
                            <path d="M440-120v-240h80v80h320v80H520v80h-80Zm-320-80v-80h240v80H120Zm160-160v-80H120v-80h160v-80h80v240h-80Zm160-80v-80h400v80H440Zm160-160v-240h80v80h160v80H680v80h-80Zm-480-80v-80h400v80H120Z" />
                        </svg>
                    </button>

                    {isFilterOpen && (
                        <div className="filter-dropdown open">
                            {view === "home" && (
                                <div className="filter-section">
                                    <h4 className="filter-title">Editora</h4>
                                    <div className="filter-options">
                                        {filters.publishers.map((p) => (
                                            <label key={p} className="filter-option">
                                                <input
                                                    type="checkbox"
                                                    checked={activeFilters.publisher.includes(p)}
                                                    onChange={() => toggleFilter("publisher", p)}
                                                />
                                                <span className="filter-label">{p}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="filter-section">
                                <h4 className="filter-title">Ano</h4>
                                <div className="filter-options">
                                    {filters.years.map((y) => (
                                        <label key={y} className="filter-option">
                                            <input
                                                type="checkbox"
                                                checked={activeFilters.year.includes(y)}
                                                onChange={() => toggleFilter("year", y)}
                                            />
                                            <span className="filter-label">{y}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-actions">
                                <button
                                    className="filter-clear-all"
                                    onClick={() =>
                                        setActiveFilters({ publisher: [], year: [], language: [] })
                                    }
                                >
                                    Limpar Todos
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="view-toggle">
                    <button
                        className={`toggle-button ${viewMode === "grid" ? "active" : ""}`}
                        onClick={() => onViewModeChange("grid")}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="16px"
                            viewBox="0 -960 960 960"
                            width="16px"
                            fill="currentColor"
                        >
                            <path d="M120-520v-320q0-33 23.5-56.5T200-920h160q33 0 56.5 23.5T440-840v320q0 33-23.5 56.5T360-440H200q-33 0-56.5-23.5T120-520Zm400 0v-320q0-33 23.5-56.5T600-920h160q33 0 56.5 23.5T840-840v320q0 33-23.5 56.5T760-440H600q-33 0-56.5-23.5T520-520ZM120-120v-320q0-33 23.5-56.5T200-520h160q33 0 56.5 23.5T440-440v320q0 33-23.5 56.5T360-40H200q-33 0-56.5-23.5T120-120Zm400 0v-320q0-33 23.5-56.5T600-520h160q33 0 56.5 23.5T840-440v320q0 33-23.5 56.5T760-40H600q-33 0-56.5-23.5T520-120Z" />
                        </svg>
                    </button>
                    <button
                        className={`toggle-button ${viewMode === "list" ? "active" : ""}`}
                        onClick={() => onViewModeChange("list")}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="16px"
                            viewBox="0 -960 960 960"
                            width="16px"
                            fill="currentColor"
                        >
                            <path d="M280-600v-80h560v80H280Zm0 160v-80h560v80H280Zm0 160v-80h560v80H280ZM160-600q-17 0-28.5-11.5T120-640q0-17 11.5-28.5T160-680q17 0 28.5 11.5T200-640q0 17-11.5 28.5T160-600Zm0 160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520q17 0 28.5 11.5T200-480q0 17-11.5 28.5T160-440Zm0 160q-17 0-28.5-11.5T120-320q0-17 11.5-28.5T160-360q17 0 28.5 11.5T200-320q0 17-11.5 28.5T160-280Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ControlsBar;
