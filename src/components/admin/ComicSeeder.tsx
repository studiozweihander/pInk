import React from "react";
import "../../styles/admin/ComicSeeder.css";
import ComicSeederConfirmModal from "./ComicSeederConfirmModal";
import ComicSeederTable from "./ComicSeederTable";
import SeederOutputPanel from "./SeederOutputPanel";
import SeederToasts from "./SeederToasts";
import { useAdminLookups } from "./hooks/useAdminLookups";
import { useComicSeederState } from "./hooks/useComicSeederState";

const ComicSeeder: React.FC = () => {
    const seeder = useComicSeederState();
    const lookups = useAdminLookups();

    return (
        <section className="admin-panel">
            <div className="admin-panel-header">
                <div>
                    <h3>Adicionar Quadrinhos</h3>
                    <p>Cadastre novos quadrinhos com os dados principais.</p>
                </div>
            </div>

            <div className="comic-seeder-grid">
                <ComicSeederTable
                    rows={seeder.rows}
                    selectedIds={seeder.selectedIds}
                    allSelected={seeder.allSelected}
                    toggleSelectAll={seeder.toggleSelectAll}
                    toggleRowSelection={seeder.toggleRowSelection}
                    handleRowChange={seeder.handleRowChange}
                    addRow={seeder.addRow}
                    removeRow={seeder.removeRow}
                    loadExample={seeder.loadExample}
                    clearSelectedRows={seeder.clearSelectedRows}
                    idioms={lookups.idioms}
                    publishers={lookups.publishers}
                    isLoading={lookups.isLoading}
                />
            </div>

            <SeederOutputPanel
                output={seeder.output}
                setOutput={seeder.setOutput}
                outputRef={seeder.outputRef}
                generateSQL={seeder.generateSQL}
                importSQL={seeder.importSQL}
                copyOutput={seeder.copyOutput}
                downloadSQL={seeder.downloadSQL}
            />

            <div className="comic-seeder-actions">
                <button type="button" onClick={seeder.openConfirmModal} disabled={seeder.isUploading}>
                    {seeder.isUploading ? "Enviando..." : "Enviar quadrinhos"}
                </button>
            </div>

            <ComicSeederConfirmModal
                isOpen={seeder.isConfirmOpen}
                isUploading={seeder.isUploading}
                comicCount={seeder.comicCount}
                comicLabel={seeder.comicLabel}
                method={seeder.method}
                onClose={seeder.closeConfirmModal}
                onConfirm={seeder.handleConfirmUpload}
            />

            <SeederToasts toasts={seeder.toasts} />
        </section>
    );
};

export default ComicSeeder;
