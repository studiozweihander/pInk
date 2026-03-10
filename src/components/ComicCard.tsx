import React from "react";
import { Link } from "react-router-dom";
import { Comic } from "../api";
import { slugify } from "../utils/slugify";
import { PLACEHOLDER_IMAGE } from "../constants";

interface ComicCardProps {
    comic: Comic;
}

const ComicCard: React.FC<ComicCardProps> = ({ comic }) => {
    const metaInfo = [
        `Lançamento: ${comic.year || "N/A"}`,
        `Edições: ${comic.total_issues || 0}`,
        `Idioma: ${comic.language || "N/A"}`,
        `Editora: ${comic.publisher || "N/A"}`,
    ].join(" | ");

    const slug = slugify(comic.title);

    return (
        <Link to={`/${slug}-${comic.year}`} className="card">
            <div className="card-image">
                <img
                    src={comic.cover || PLACEHOLDER_IMAGE}
                    alt={`Capa do quadrinho ${comic.title} de ${comic.year}`}
                    referrerPolicy="no-referrer"
                    onError={(event: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        event.currentTarget.src = PLACEHOLDER_IMAGE;
                    }}
                />
            </div>
            <div className="card-info">
                <h3 className="card-title">{comic.title}</h3>
                <div className="card-meta">{metaInfo}</div>
            </div>
        </Link>
    );
};

export default ComicCard;
