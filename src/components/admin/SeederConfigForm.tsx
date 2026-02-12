import React from "react";
import "../../styles/admin/SeederConfigForm.css";
import { ComicOption, LookupOption, SeederConfig } from "./types";

interface SeederConfigFormProps {
    config: SeederConfig;
    updateConfig: (key: keyof SeederConfig, value: string) => void;
    idioms: LookupOption[];
    comics: ComicOption[];
    isLoading: boolean;
}

const SeederConfigForm: React.FC<SeederConfigFormProps> = ({
    config,
    updateConfig,
    idioms,
    comics,
    isLoading,
}) => (
    <div className="seeder-block">
        <h4>Configurações globais</h4>
        <div className="seeder-form-grid">
            <div className="seeder-form-group">
                <label>Quadrinho</label>
                <input
                    className="seeder-input"
                    type="text"
                    value={config.baseSeries}
                    onChange={(event) => updateConfig("baseSeries", event.target.value)}
                    placeholder="Nome da quadrinho"
                />
            </div>
            <div className="seeder-form-group">
                <label>Lançamento</label>
                <input
                    className="seeder-input"
                    type="number"
                    value={config.startYear}
                    onChange={(event) => updateConfig("startYear", event.target.value)}
                    placeholder="Ano de lançamento"
                />
            </div>
            <div className="seeder-form-group">
                <label>Comic ID</label>
                {comics.length > 0 ? (
                    <select
                        className="seeder-input"
                        value={config.comicId}
                        onChange={(event) => updateConfig("comicId", event.target.value)}
                    >
                        <option value="">{isLoading ? "Carregando..." : "Selecione um quadrinho"}</option>
                        {comics.map((comic) => (
                            <option key={comic.id} value={comic.id}>
                                {comic.title}{comic.year ? ` (${comic.year})` : ""}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        className="seeder-input"
                        type="number"
                        value={config.comicId}
                        onChange={(event) => updateConfig("comicId", event.target.value)}
                        placeholder="ID do quadrinho"
                    />
                )}
            </div>
            <div className="seeder-form-group">
                <label>Idiom ID</label>
                {idioms.length > 0 ? (
                    <select
                        className="seeder-input"
                        value={config.idiomId}
                        onChange={(event) => updateConfig("idiomId", event.target.value)}
                    >
                        <option value="">{isLoading ? "Carregando..." : "Selecione um idioma"}</option>
                        {idioms.map((idiom) => (
                            <option key={idiom.id} value={idiom.id}>
                                {idiom.name}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        className="seeder-input"
                        type="number"
                        value={config.idiomId}
                        onChange={(event) => updateConfig("idiomId", event.target.value)}
                        placeholder="1 = PT-BR, 2 = EN"
                    />
                )}
            </div>
            <div className="seeder-form-group">
                <label>Gêneros (array)</label>
                <input
                    className="seeder-input"
                    type="text"
                    value={config.genres}
                    onChange={(event) => updateConfig("genres", event.target.value)}
                    placeholder="['Genero1', 'Genero2']"
                />
            </div>
            <div className="seeder-form-group">
                <label>Base URL Cover</label>
                <input
                    className="seeder-input"
                    type="text"
                    value={config.baseCover}
                    onChange={(event) => updateConfig("baseCover", event.target.value)}
                    placeholder="https://.../covers/nome-da-serie/"
                />
            </div>
            <div className="seeder-form-group">
                <label>Padrão Cover</label>
                <input
                    className="seeder-input"
                    type="text"
                    value={config.coverPattern}
                    onChange={(event) => updateConfig("coverPattern", event.target.value)}
                    placeholder="{nome-da-serie}-{number:3}.webp"
                />
            </div>
        </div>
    </div>
);

export default SeederConfigForm;
