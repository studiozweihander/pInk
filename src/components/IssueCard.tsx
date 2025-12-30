import React from "react";
import { Issue } from "../api";

const PLACEHOLDER_IMAGE =
    "https://placehold.co/300x450/242424/e78fde?text=Imagem+Não+Disponível&font=source-sans-pro";

interface IssueCardProps {
    issue: Issue;
    onClick: () => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, onClick }) => {
    const metaInfo = [
        `Ano: ${issue.year || "N/A"}`,
        `Tamanho: ${issue.size || "N/A"}`,
        `Gêneros: ${Array.isArray(issue.genres) ? issue.genres.join(", ") : issue.genres || "N/A"
        }`,
    ].join(" | ");

    return (
        <div className="card" onClick={onClick}>
            <div className="card-image">
                <img
                    src={issue.cover || PLACEHOLDER_IMAGE}
                    alt={issue.title}
                    onError={(e: any) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                    }}
                />
            </div>
            <div className="card-info">
                <h3 className="card-title">{issue.title}</h3>
                <div className="card-meta">{metaInfo}</div>
            </div>
        </div>
    );
};

export default IssueCard;
