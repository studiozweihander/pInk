import React from "react";
import "../../styles/admin/SeederTable.css";
import { SeederRow } from "./types";

interface SeederTableProps {
    rows: SeederRow[];
    selectedIds: Set<string>;
    allSelected: boolean;
    toggleSelectAll: () => void;
    toggleRowSelection: (rowId: string) => void;
    handleRowChange: (rowId: string, key: keyof SeederRow, value: string) => void;
    addRow: () => void;
    removeRow: () => void;
    loadExample: () => void;
    clearSelectedRows: () => void;
}

const SeederTable: React.FC<SeederTableProps> = ({
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
}) => (
    <div className="seeder-block">
        <h4>Dados únicos por registro</h4>
        <div className="seeder-table-wrapper">
            <table className="seeder-table">
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
                        <th>Nº</th>
                        <th>Ano</th>
                        <th>Tamanho</th>
                        <th>Link</th>
                        <th>Sinopse</th>
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
                                    aria-label={`Selecionar linha ${row.number}`}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={row.number}
                                    placeholder="1"
                                    onChange={(event) => handleRowChange(row.id, "number", event.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={row.year}
                                    placeholder="2005"
                                    onChange={(event) => handleRowChange(row.id, "year", event.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={row.size}
                                    placeholder="3.98 MB"
                                    onChange={(event) => handleRowChange(row.id, "size", event.target.value)}
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
                                <textarea
                                    rows={1}
                                    value={row.synopsis}
                                    placeholder="Sinopse do episódio..."
                                    onChange={(event) => handleRowChange(row.id, "synopsis", event.target.value)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="seeder-table-controls">
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

export default SeederTable;
