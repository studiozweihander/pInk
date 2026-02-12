import React from "react";
import "../../styles/admin/IssueSeeder.css";
import SeederConfigForm from "./SeederConfigForm";
import SeederConfirmModal from "./SeederConfirmModal";
import SeederOutputPanel from "./SeederOutputPanel";
import SeederTable from "./SeederTable";
import SeederToasts from "./SeederToasts";
import { useAdminLookups } from "./hooks/useAdminLookups";
import { useSeederState } from "./hooks/useSeederState";

const IssueSeeder: React.FC = () => {
    const seeder = useSeederState();
    const lookups = useAdminLookups();

    return (
        <section className="admin-panel">
            <div className="admin-panel-header">
                <div>
                    <h3>Adicionar Edições</h3>
                    <p>Preencha a tabela para adicionar novas edições.</p>
                </div>
            </div>

            <div className="seeder-grid">
                <SeederConfigForm
                    config={seeder.config}
                    updateConfig={seeder.updateConfig}
                    idioms={lookups.idioms}
                    comics={lookups.comics}
                    isLoading={lookups.isLoading}
                />
                <SeederTable
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

            <div className="seeder-actions">
                <button type="button" onClick={seeder.openConfirmModal} disabled={seeder.isUploading}>
                    {seeder.isUploading ? "Enviando..." : "Enviar edições"}
                </button>
            </div>

            <SeederConfirmModal
                isOpen={seeder.isConfirmOpen}
                isUploading={seeder.isUploading}
                issueCount={seeder.issueCount}
                issueLabel={seeder.issueLabel}
                comicLabel={seeder.comicLabel}
                issueRange={seeder.issueRange}
                idiomId={seeder.config.idiomId}
                comicId={seeder.config.comicId}
                genresSummary={seeder.genresSummary}
                onClose={seeder.closeConfirmModal}
                onConfirm={seeder.handleConfirmUpload}
            />

            <SeederToasts toasts={seeder.toasts} />
        </section>
    );
};

export default IssueSeeder;
