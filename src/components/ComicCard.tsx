import React from "react";
import { Comic } from "../api";

const PLACEHOLDER_IMAGE =
    "https://placehold.co/300x450/242424/e78fde?text=Imagem+Não+Disponível&font=source-sans-pro";

interface ComicCardProps {
    comic: Comic;
    onClick: () => void;
}

const ComicCard: React.FC<ComicCardProps> = ({ comic, onClick }) => {
    const metaInfo = [
        `Lançamento: ${comic.year || "N/A"}`,
        `Edições: ${comic.total_issues || 0}`,
        `Idioma: ${comic.language || "N/A"}`,
        `Editora: ${comic.publisher || "N/A"}`,
    ].join(" | ");

    return (
        <div className="card" onClick={onClick}>
            <div className="card-image">
                <img
                    src={comic.cover || PLACEHOLDER_IMAGE}
                    alt={comic.title}
                    referrerPolicy="no-referrer"
                    onError={(e: any) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                    }}
                />
            </div>
            <div className="card-info">
                <h3 className="card-title">{comic.title}</h3>
                <div className="card-meta">{metaInfo}</div>
            </div>
        </div>
    );
};

export default ComicCard;
