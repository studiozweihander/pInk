import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../../utils/supabaseClient";
import { SeederConfig, SeederRow, Toast } from "../types";

const STORAGE_KEY = "pinkSeederData";
const DEFAULT_TEMPLATE = `INSERT INTO "Issue" (title, "issueNumber", year, size, series, genres, link, cover, synopsis, "comicId", "idiomId")
VALUES ('{title}', {number}, {year}, '{size}', '{series}', ARRAY{genres}, '{link}', '{cover}', '{synopsis}', {comicId}, {idiomId});`;
const DEFAULT_COVER_PATTERN = "{nome-da-serie}-{number:3}.webp";

const createRowId = () => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    return `row-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const createRow = (data?: Partial<SeederRow>, fallbackNumber = 1): SeederRow => ({
    id: data?.id || createRowId(),
    number: data?.number ?? String(fallbackNumber),
    year: data?.year ?? "",
    size: data?.size ?? "",
    link: data?.link ?? "",
    synopsis: data?.synopsis ?? "",
});

const parseValuesSimple = (valueStr: string) => {
    const values: string[] = [];
    let current = "";
    let inString = false;
    let stringChar: string | null = null;
    let depth = 0;

    for (let i = 0; i < valueStr.length; i += 1) {
        const char = valueStr[i];
        const prevChar = i > 0 ? valueStr[i - 1] : "";

        if ((char === "'" || char === '"') && prevChar !== "\\") {
            if (!inString) {
                inString = true;
                stringChar = char;
                current += char;
            } else if (char === stringChar) {
                if (valueStr[i + 1] === stringChar) {
                    current += char;
                    i += 1;
                    current += valueStr[i];
                } else {
                    inString = false;
                    stringChar = null;
                    current += char;
                }
            } else {
                current += char;
            }
            continue;
        }

        if (!inString) {
            if (char === "(" || char === "[") {
                depth += 1;
            } else if (char === ")" || char === "]") {
                depth -= 1;
            }
        }

        if (char === "," && !inString && depth === 0) {
            values.push(current.trim());
            current = "";
        } else {
            current += char;
        }
    }

    if (current.trim()) {
        values.push(current.trim());
    }

    return values;
};

const parseGenresInput = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith("[")) {
        try {
            const normalized = trimmed.replace(/'/g, '"');
            const parsed = JSON.parse(normalized);
            if (Array.isArray(parsed)) {
                return parsed.map((item) => String(item).trim()).filter(Boolean);
            }
        } catch {
            return [];
        }
    }

    return trimmed
        .split(",")
        .map((item) => item.replace(/[\[\]"']/g, "").trim())
        .filter(Boolean);
};

export const useSeederState = () => {
    const [config, setConfig] = useState<SeederConfig>({
        baseSeries: "",
        startYear: "",
        comicId: "",
        idiomId: "",
        genres: "",
        baseCover: "",
        coverPattern: DEFAULT_COVER_PATTERN,
    });
    const [rows, setRows] = useState<SeederRow[]>([]);
    const [output, setOutput] = useState("");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [comicTitle, setComicTitle] = useState<string | null>(null);
    const [isComicTitleLoading, setIsComicTitleLoading] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [history, setHistory] = useState<{ config: SeederConfig; rows: SeederRow[] }[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const historyIndexRef = useRef(-1);
    const saveTimeout = useRef<number | null>(null);
    const initializedRef = useRef(false);
    const outputRef = useRef<HTMLTextAreaElement | null>(null);
    const outputBaseHeightRef = useRef<number | null>(null);

    const allSelected = useMemo(() => rows.length > 0 && selectedIds.size === rows.length, [rows, selectedIds]);
    const issueCount = rows.length;
    const issueLabel = issueCount === 1 ? "edição" : "edições";
    const comicLabel = comicTitle
        ? comicTitle
        : isComicTitleLoading
        ? "carregando..."
        : config.baseSeries.trim()
        ? config.baseSeries.trim()
        : config.comicId
        ? `ID ${config.comicId}`
        : "desconhecido";
    const issueRange = useMemo(() => {
        const numbers = rows
            .map((row) => parseInt(row.number, 10))
            .filter((value) => !Number.isNaN(value));
        if (numbers.length === 0) return "-";
        const min = Math.min(...numbers);
        const max = Math.max(...numbers);
        return min === max ? String(min) : `${min} - ${max}`;
    }, [rows]);
    const genresSummary = useMemo(() => {
        const parsed = parseGenresInput(config.genres);
        return parsed.length > 0 ? parsed.join(", ") : "-";
    }, [config.genres]);

    const showToast = (message: string, type: Toast["type"] = "info") => {
        const id = createRowId();
        setToasts((current) => [...current, { id, message, type }]);
        window.setTimeout(() => {
            setToasts((current) => current.filter((toast) => toast.id !== id));
        }, 3000);
    };

    const saveSnapshot = () => {
        const snapshot = {
            config: { ...config },
            rows: rows.map((row) => ({ ...row })),
        };

        setHistory((current) => {
            const currentIndex = historyIndexRef.current;
            const trimmed = currentIndex < current.length - 1 ? current.slice(0, currentIndex + 1) : current;
            const next = [...trimmed, snapshot].slice(-50);
            return next;
        });
        setHistoryIndex((current) => {
            const nextIndex = Math.min(current + 1, 49);
            historyIndexRef.current = nextIndex;
            return nextIndex;
        });
    };

    const restoreSnapshot = (snapshot: { config: SeederConfig; rows: SeederRow[] }) => {
        setConfig(snapshot.config);
        setRows(snapshot.rows);
        setSelectedIds(new Set());
    };

    const undo = () => {
        if (historyIndex <= 0) return;
        const nextIndex = historyIndex - 1;
        const snapshot = history[nextIndex];
        if (snapshot) {
            setHistoryIndex(nextIndex);
            restoreSnapshot(snapshot);
        }
    };

    const redo = () => {
        if (historyIndex >= history.length - 1) return;
        const nextIndex = historyIndex + 1;
        const snapshot = history[nextIndex];
        if (snapshot) {
            setHistoryIndex(nextIndex);
            restoreSnapshot(snapshot);
        }
    };

    const saveToLocalStorage = () => {
        const payload = {
            config,
            rows,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    };

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved) as { config?: SeederConfig; rows?: SeederRow[] };
                if (parsed.config) {
                    setConfig({
                        ...parsed.config,
                        coverPattern: parsed.config.coverPattern || DEFAULT_COVER_PATTERN,
                    });
                }
                if (parsed.rows && parsed.rows.length > 0) {
                    setRows(parsed.rows.map((row, index) => createRow(row, index + 1)));
                    initializedRef.current = true;
                    return;
                }
            } catch {
                showToast("Erro ao carregar dados salvos", "error");
            }
        }

        const initialRows = Array.from({ length: 3 }, (_, index) => createRow(undefined, index + 1));
        setRows(initialRows);
        initializedRef.current = true;
    }, []);

    useEffect(() => {
        if (!initializedRef.current) return;
        if (saveTimeout.current) {
            window.clearTimeout(saveTimeout.current);
        }
        saveTimeout.current = window.setTimeout(saveToLocalStorage, 500);
        return () => {
            if (saveTimeout.current) {
                window.clearTimeout(saveTimeout.current);
            }
        };
    }, [config, rows]);

    useEffect(() => {
        historyIndexRef.current = historyIndex;
    }, [historyIndex]);

    useEffect(() => {
        const outputEl = outputRef.current;
        if (!outputEl) return;
        if (outputBaseHeightRef.current === null) {
            outputBaseHeightRef.current = outputEl.offsetHeight;
        }
        outputEl.style.height = "auto";
        const minHeight = outputBaseHeightRef.current ?? 0;
        outputEl.style.height = `${Math.max(outputEl.scrollHeight, minHeight)}px`;
    }, [output]);

    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if (!event.ctrlKey) return;
            if (event.key === "z" && !event.shiftKey) {
                event.preventDefault();
                undo();
            } else if (event.key === "y" || (event.key === "z" && event.shiftKey)) {
                event.preventDefault();
                redo();
            }
        };

        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [historyIndex, history]);

    useEffect(() => {
        setSelectedIds((current) => {
            const next = new Set<string>();
            rows.forEach((row) => {
                if (current.has(row.id)) {
                    next.add(row.id);
                }
            });
            return next;
        });
    }, [rows]);

    useEffect(() => {
        const comicId = parseInt(config.comicId, 10);
        if (Number.isNaN(comicId)) {
            setComicTitle(null);
            setIsComicTitleLoading(false);
            return;
        }

        let isActive = true;
        setIsComicTitleLoading(true);

        const fetchComicTitle = async () => {
            const { data, error } = await supabase.from("Comic").select("title").eq("id", comicId).single();
            if (!isActive) return;
            if (error) {
                setComicTitle(null);
            } else {
                setComicTitle(data?.title ?? null);
            }
            setIsComicTitleLoading(false);
        };

        fetchComicTitle();

        return () => {
            isActive = false;
        };
    }, [config.comicId]);

    const updateConfig = (key: keyof SeederConfig, value: string) => {
        setConfig((current) => ({ ...current, [key]: value }));
    };

    const updateRows = (updater: (current: SeederRow[]) => SeederRow[]) => {
        setRows((current) =>
            updater(current).map((row, index) => ({
                ...row,
                number: row.number || String(index + 1),
            }))
        );
    };

    const toggleRowSelection = (rowId: string) => {
        setSelectedIds((current) => {
            const next = new Set(current);
            if (next.has(rowId)) {
                next.delete(rowId);
            } else {
                next.add(rowId);
            }
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedIds(new Set());
            return;
        }
        setSelectedIds(new Set(rows.map((row) => row.id)));
    };

    const handleRowChange = (rowId: string, key: keyof SeederRow, value: string) => {
        updateRows((current) => {
            const shouldCopy = selectedIds.size > 0 && selectedIds.has(rowId);
            return current.map((row) => {
                if (shouldCopy && selectedIds.has(row.id)) {
                    return { ...row, [key]: value };
                }
                if (!shouldCopy && row.id === rowId) {
                    return { ...row, [key]: value };
                }
                return row;
            });
        });
    };

    const addRow = () => {
        saveSnapshot();
        updateRows((current) => {
            const lastYear = current[current.length - 1]?.year || config.startYear;
            return [...current, createRow({ year: lastYear }, current.length + 1)];
        });
    };

    const removeRow = () => {
        if (rows.length === 0) return;
        saveSnapshot();
        updateRows((current) => current.slice(0, -1));
    };

    const loadExample = () => {
        saveSnapshot();
        updateRows(() => [
            createRow(
                {
                    number: "1",
                    year: "2003",
                    size: "3.98 MB",
                    link: "C96p53di",
                    synopsis: "Rick Grimes nao esta preparado para isto...",
                },
                1
            ),
            createRow(
                {
                    number: "2",
                    year: "2003",
                    size: "8.45 MB",
                    link: "xwfhQwy1",
                    synopsis: "A terrivel aventura de Rick Grimes continua...",
                },
                2
            ),
            createRow(
                {
                    number: "3",
                    year: "2003",
                    size: "4.07 MB",
                    link: "bpuvdKUy",
                    synopsis: "Reunido com sua familia, seu foco muda...",
                },
                3
            ),
        ]);
    };

    const clearSelectedRows = () => {
        if (selectedIds.size === 0) return;
        saveSnapshot();
        updateRows((current) => current.filter((row) => !selectedIds.has(row.id)));
        setSelectedIds(new Set());
    };

    const applyCoverPattern = (number: string) => {
        const pattern = config.coverPattern || DEFAULT_COVER_PATTERN;
        if (pattern.includes("{number:3}")) {
            return pattern.replace("{number:3}", number.padStart(3, "0"));
        }
        if (pattern.includes("{number:2}")) {
            return pattern.replace("{number:2}", number.padStart(2, "0"));
        }
        if (pattern.includes("{number}")) {
            return pattern.replace("{number}", number);
        }
        return pattern;
    };

    const buildIssuePayload = (row: SeederRow) => {
        const issueNumber = parseInt(row.number, 10);
        const year = parseInt(row.year, 10);
        const comicId = parseInt(config.comicId, 10);
        const idiomId = parseInt(config.idiomId, 10);

        if (Number.isNaN(issueNumber) || Number.isNaN(year)) {
            throw new Error("Preencha número e ano de todas as linhas");
        }

        if (Number.isNaN(comicId) || Number.isNaN(idiomId)) {
            throw new Error("Comic ID e Idiom ID são obrigatórios");
        }

        const genres = parseGenresInput(config.genres);
        const title = config.baseSeries ? `${config.baseSeries} #${issueNumber}` : `Issue #${issueNumber}`;
        const series =
            config.baseSeries && config.startYear
                ? `${config.baseSeries} (${config.startYear})`
                : config.baseSeries || "Unknown Series";
        const cover = `${config.baseCover}${applyCoverPattern(String(issueNumber))}`;

        return {
            title,
            issueNumber,
            year,
            size: row.size,
            series,
            genres: genres.length > 0 ? genres : null,
            link: row.link,
            cover,
            synopsis: row.synopsis,
            comicId,
            idiomId,
        };
    };

    const generateSQL = () => {
        if (rows.length === 0) {
            showToast("Adicione pelo menos uma linha de dados", "error");
            return;
        }

        const insertMatch = DEFAULT_TEMPLATE.match(/INSERT\s+INTO\s+.*?\s*\([^)]+\)/i);
        const valuesMatch = DEFAULT_TEMPLATE.match(/VALUES\s*\(.*?\)/i);

        if (!insertMatch || !valuesMatch) {
            showToast("Template SQL inválido", "error");
            return;
        }

        const insertPart = insertMatch[0];
        const valuesTemplate = valuesMatch[0].replace(/VALUES\s*\(/i, "").replace(/\)$/, "");
        let sql = `${insertPart}\nVALUES\n`;

        rows.forEach((row, index) => {
            const title = config.baseSeries ? `${config.baseSeries} #${row.number}` : `Issue #${row.number}`;
            const series =
                config.baseSeries && config.startYear
                    ? `${config.baseSeries} (${config.startYear})`
                    : config.baseSeries || "Unknown Series";
            const cover = `${config.baseCover}${applyCoverPattern(row.number)}`;

            const valuesLine = valuesTemplate
                .replace(/{title}/g, title)
                .replace(/{number}/g, row.number)
                .replace(/{year}/g, row.year)
                .replace(/{size}/g, row.size)
                .replace(/{series}/g, series)
                .replace(/{genres}/g, config.genres)
                .replace(/{link}/g, row.link)
                .replace(/{cover}/g, cover)
                .replace(/{synopsis}/g, row.synopsis.replace(/'/g, "''"))
                .replace(/{comicId}/g, config.comicId)
                .replace(/{idiomId}/g, config.idiomId);

            sql += `(${valuesLine})${index === rows.length - 1 ? ";" : ","}\n`;
        });

        setOutput(sql);
        showToast("SQL gerado com sucesso!", "success");
    };

    const importSQL = () => {
        const sqlText = output.trim();
        if (!sqlText) {
            showToast("Cole um SQL válido antes de importar", "error");
            return;
        }

        try {
            saveSnapshot();
            const valuesSection = sqlText.match(/VALUES\s+([\s\S]+)/i);
            if (!valuesSection) {
                throw new Error("Nenhuma seção VALUES encontrada no SQL");
            }

            const valuesText = valuesSection[1];
            const allValues: string[] = [];
            let depth = 0;
            let currentValue = "";
            let inString = false;
            let stringChar: string | null = null;

            for (let i = 0; i < valuesText.length; i += 1) {
                const char = valuesText[i];
                const prevChar = i > 0 ? valuesText[i - 1] : "";

                if ((char === "'" || char === '"') && prevChar !== "\\") {
                    if (!inString) {
                        inString = true;
                        stringChar = char;
                    } else if (char === stringChar) {
                        if (valuesText[i + 1] === stringChar) {
                            currentValue += char;
                            i += 1;
                        } else {
                            inString = false;
                            stringChar = null;
                        }
                    }
                }

                if (!inString) {
                    if (char === "(") {
                        depth += 1;
                        if (depth === 1) {
                            currentValue = "";
                            continue;
                        }
                    } else if (char === ")") {
                        depth -= 1;
                        if (depth === 0) {
                            allValues.push(currentValue.trim());
                            currentValue = "";
                            continue;
                        }
                    }
                }

                if (depth > 0) {
                    currentValue += char;
                }
            }

            if (allValues.length === 0) {
                throw new Error("Nenhum VALUE encontrado no SQL");
            }

            const rowsData = allValues.map((valueStr, index) => {
                const vals = parseValuesSimple(valueStr);

                return createRow(
                    {
                        number: vals[1] || String(index + 1),
                        year: vals[2] || "",
                        size: vals[3]?.replace(/['"]/g, "") || "",
                        link: vals[6]?.replace(/['"]/g, "") || "",
                        synopsis: vals[8]?.replace(/^['"]|['"]$/g, "").replace(/''/g, "'") || "",
                    },
                    index + 1
                );
            });

            setRows(rowsData);
            setSelectedIds(new Set());
            showToast(`SQL importado com sucesso! ${allValues.length} registro(s).`, "success");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erro ao importar SQL";
            showToast(`Erro ao importar SQL: ${message}`, "error");
        }
    };

    const copyOutput = async () => {
        if (!output.trim()) {
            showToast("Primeiro gere o SQL", "error");
            return;
        }

        try {
            await navigator.clipboard.writeText(output);
            showToast("Copiado para a área de transferência!", "success");
        } catch {
            showToast("Erro ao copiar. Tente selecionar o texto manualmente", "error");
        }
    };

    const downloadSQL = () => {
        if (!output.trim()) {
            showToast("Primeiro gere o SQL", "error");
            return;
        }

        const blob = new Blob([output], { type: "text/sql" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "seed_data.sql";
        anchor.click();
        URL.revokeObjectURL(url);
        showToast("Download iniciado!", "success");
    };

    const uploadSeeds = async () => {
        if (rows.length === 0) {
            showToast("Não há linhas para enviar", "error");
            return false;
        }

        setIsUploading(true);
        try {
            const payload = rows.map(buildIssuePayload);
            const { data, error } = await supabase.functions.invoke("seed-issues", {
                body: { issues: payload },
            });
            if (error) {
                throw error;
            }
            if (data?.error) {
                throw new Error(data.error);
            }
            showToast(`Seeds enviadas: ${payload.length} registro(s)`, "success");
            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : "Falha ao enviar seeds";
            showToast(`Erro ao enviar seeds: ${message}`, "error");
            return false;
        } finally {
            setIsUploading(false);
        }
    };

    const openConfirmModal = () => {
        if (rows.length === 0) {
            showToast("Não há linhas para enviar", "error");
            return;
        }
        setIsConfirmOpen(true);
    };

    const closeConfirmModal = () => {
        if (isUploading) return;
        setIsConfirmOpen(false);
    };

    const handleConfirmUpload = async () => {
        const success = await uploadSeeds();
        if (success) {
            setIsConfirmOpen(false);
        }
    };

    return {
        config,
        rows,
        output,
        selectedIds,
        toasts,
        isUploading,
        isConfirmOpen,
        outputRef,
        allSelected,
        issueCount,
        issueLabel,
        issueRange,
        comicLabel,
        genresSummary,
        updateConfig,
        handleRowChange,
        toggleRowSelection,
        toggleSelectAll,
        addRow,
        removeRow,
        loadExample,
        clearSelectedRows,
        generateSQL,
        importSQL,
        copyOutput,
        downloadSQL,
        openConfirmModal,
        closeConfirmModal,
        handleConfirmUpload,
        setOutput,
    };
};
