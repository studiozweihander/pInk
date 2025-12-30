import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Comic } from "../api";

interface HeaderProps {
    view: "home" | "issues";
    currentComic: Comic | null;
    searchTerm: string;
    onSearchChange: (val: string) => void;
}

const Header: React.FC<HeaderProps> = ({
    view,
    currentComic,
    searchTerm,
    onSearchChange,
}) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <header>
            <div className="header-title">
                <div
                    className={`logo-container ${view === "issues" ? "has-navigation" : ""}`}
                    onClick={() => navigate("/")}
                    style={{ cursor: "pointer" }}
                >
                    <span className="logo-text">pInk</span>
                    <span className="logo-chevron">&gt;</span>
                </div>
                <span id="breadcrumb">
                    {view === "issues" && currentComic
                        ? `${currentComic.title} (${currentComic.year || "N/A"})`
                        : ""}
                </span>
            </div>

            <div className="search-container">
                <button
                    className="search-toggle"
                    onClick={() => setIsSearchOpen(true)}
                    aria-label="Abrir pesquisa"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#e78fde"
                    >
                        <path d="M795.76-114.3 531.33-378.5q-29.76 25.26-69.6 39.41-39.84 14.16-85.16 14.16-109.84 0-185.96-76.2Q114.5-477.33 114.5-585t76.2-183.87q76.19-76.2 184.37-76.2 108.17 0 183.86 76.2 75.7 76.2 75.7 184.02 0 43.33-13.64 82.97t-40.92 74.4L845.5-164.04l-49.74 49.74ZM375.65-393.07q79.73 0 135.29-56.24Q566.5-505.55 566.5-585q0-79.45-55.6-135.69-55.59-56.24-135.25-56.24-80.49 0-136.76 56.24-56.26 56.24-56.26 135.69 0 79.45 56.23 135.69 56.23 56.24 136.79 56.24Z" />
                    </svg>
                </button>

                <div
                    className={`search-input-container ${isSearchOpen ? "active" : ""}`}
                >
                    <input
                        id="search"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange((e.target as HTMLInputElement).value)}
                        placeholder={
                            view === "home" ? "Buscar quadrinho..." : "Buscar edição..."
                        }
                    />
                    <button
                        className="search-close"
                        onClick={() => {
                            setIsSearchOpen(false);
                            onSearchChange("");
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="20px"
                            viewBox="0 -960 960 960"
                            width="20px"
                            fill="#e78fde"
                        >
                            <path d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
