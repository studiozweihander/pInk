import React from "react";
import "../../styles/admin/ComicSeederTable.css";
import { ComicSeederRow, LookupOption } from "./types";

interface ComicSeederTableProps {
    rows: ComicSeederRow[];
    selectedIds: Set<string>;
    allSelected: boolean;
    toggleSelectAll: () => void;
    toggleRowSelection: (rowId: string) => void;
    handleRowChange: (rowId: string, key: keyof ComicSeederRow, value: string) => void;
    addRow: () => void;
    removeRow: () => void;
    loadExample: () => void;
    clearSelectedRows: () => void;
    idioms: LookupOption[];
    publishers: LookupOption[];
    isLoading: boolean;
}

const ComicSeederTable: React.FC<ComicSeederTableProps> = ({
    rows,
    selectedIds,
    allSelected,
    toggleSelectAll,
    toggleRowSelection,
    handleRowChange,
    addRow,
    removeRow,
    loadExample,
    clearSelectedRows,
    idioms,
    publishers,
    isLoading,
}) => (
    <div className="seeder-block">
        <h4>Dados do quadrinho</h4>
        <div className="comic-seeder-table-wrapper">
            <table className="comic-seeder-table">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={toggleSelectAll}
                                aria-label="Selecionar todas"
                            />
                        </th>
                        <th>Título</th>
                        <th>Edições</th>
                        <th>Ano</th>
                        <th>Link</th>
                        <th>Capa</th>
                        <th>Idioma</th>
                        <th>Editora</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id} className={selectedIds.has(row.id) ? "is-selected" : ""}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.has(row.id)}
                                    onChange={() => toggleRowSelection(row.id)}
                                    aria-label={`Selecionar linha ${row.title || "quadrinho"}`}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={row.title}
                                    placeholder="Nome do quadrinho"
                                    onChange={(event) => handleRowChange(row.id, "title", event.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={row.issues}
                                    placeholder="0"
                                    onChange={(event) => handleRowChange(row.id, "issues", event.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={row.year}
                                    placeholder="2000"
                                    onChange={(event) => handleRowChange(row.id, "year", event.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={row.link}
                                    placeholder="https://..."
                                    onChange={(event) => handleRowChange(row.id, "link", event.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={row.cover}
                                    placeholder="https://..."
                                    onChange={(event) => handleRowChange(row.id, "cover", event.target.value)}
                                />
                            </td>
                            <td>
                                {idioms.length > 0 ? (
                                    <select
                                        value={row.idiomId}
                                        onChange={(event) => handleRowChange(row.id, "idiomId", event.target.value)}
                                    >
                                        <option value="">
                                            {isLoading ? "Carregando..." : "Selecione"}
                                        </option>
                                        {idioms.map((idiom) => (
                                            <option key={idiom.id} value={idiom.id}>
                                                {idiom.name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="number"
                                        value={row.idiomId}
                                        placeholder="Idiom ID"
                                        onChange={(event) => handleRowChange(row.id, "idiomId", event.target.value)}
                                    />
                                )}
                            </td>
                            <td>
                                {publishers.length > 0 ? (
                                    <select
                                        value={row.publisherId}
                                        onChange={(event) => handleRowChange(row.id, "publisherId", event.target.value)}
                                    >
                                        <option value="">
                                            {isLoading ? "Carregando..." : "Selecione"}
                                        </option>
                                        {publishers.map((publisher) => (
                                            <option key={publisher.id} value={publisher.id}>
                                                {publisher.name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="number"
                                        value={row.publisherId}
                                        placeholder="Publisher ID"
                                        onChange={(event) => handleRowChange(row.id, "publisherId", event.target.value)}
                                    />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="comic-seeder-table-controls">
            <button type="button" onClick={addRow}>
                Adicionar linha
            </button>
            <button type="button" onClick={removeRow} className="is-secondary">
                Remover última
            </button>
            <button type="button" onClick={loadExample}>
                Carregar exemplo
            </button>
            <button type="button" onClick={clearSelectedRows} className="is-secondary">
                Limpar
            </button>
        </div>
    </div>
);

export default ComicSeederTable;
