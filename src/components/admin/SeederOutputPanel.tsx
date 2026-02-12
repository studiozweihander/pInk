import React from "react";
import "../../styles/admin/SeederOutputPanel.css";

interface SeederOutputPanelProps {
    output: string;
    setOutput: (value: string) => void;
    outputRef: React.RefObject<HTMLTextAreaElement | null>;
    generateSQL: () => void;
    importSQL: () => void;
    copyOutput: () => void;
    downloadSQL: () => void;
}

const SeederOutputPanel: React.FC<SeederOutputPanelProps> = ({
    output,
    setOutput,
    outputRef,
    generateSQL,
    importSQL,
    copyOutput,
    downloadSQL,
}) => (
    <div className="seeder-block">
        <h4>Resultado gerado</h4>
        <div className="seeder-output-controls">
            <button type="button" onClick={generateSQL}>
                Gerar SQL
            </button>
            <button type="button" onClick={importSQL} className="is-secondary">
                Importar SQL
            </button>
            <button type="button" onClick={copyOutput} className="is-secondary">
                Copiar
            </button>
            <button type="button" onClick={downloadSQL} className="is-secondary">
                Baixar
            </button>
        </div>
        <textarea
            className="seeder-output"
            ref={outputRef}
            value={output}
            onChange={(event) => setOutput(event.target.value)}
            placeholder="Cole seu SQL aqui para importar ou clique em 'Gerar SQL' para ver o resultado..."
        />
    </div>
);

export default SeederOutputPanel;
