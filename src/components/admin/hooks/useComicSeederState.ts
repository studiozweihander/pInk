import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../../utils/supabaseClient";
import { createRowId, parseValuesSimple } from "../../../utils/seederShared";
import { ComicSeederRow, Toast } from "../types";

const STORAGE_KEY = "pinkComicSeederData";
const DEFAULT_TEMPLATE = `INSERT INTO "Comic" (title, issues, year, link, cover, "idiomId", "publisherId")
VALUES ('{title}', {issues}, {year}, '{link}', '{cover}', {idiomId}, {publisherId});`;

const createRow = (data?: Partial<ComicSeederRow>): ComicSeederRow => ({
    id: data?.id || createRowId(),
    title: data?.title ?? "",
    issues: data?.issues ?? "",
    year: data?.year ?? "",
    link: data?.link ?? "",
    cover: data?.cover ?? "",
    idiomId: data?.idiomId ?? "",
    publisherId: data?.publisherId ?? "",
});

export const useComicSeederState = () => {
    const [rows, setRows] = useState<ComicSeederRow[]>([]);
    const [output, setOutput] = useState("");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const method: "edge" = "edge";
    const [history, setHistory] = useState<{ rows: ComicSeederRow[] }[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const historyIndexRef = useRef(-1);
    const saveTimeout = useRef<number | null>(null);
    const initializedRef = useRef(false);
    const outputRef = useRef<HTMLTextAreaElement | null>(null);
    const outputBaseHeightRef = useRef<number | null>(null);

    const allSelected = useMemo(() => rows.length > 0 && selectedIds.size === rows.length, [rows, selectedIds]);
    const comicCount = rows.length;
    const comicLabel = comicCount === 1 ? "quadrinho" : "quadrinhos";

    const showToast = (message: string, type: Toast["type"] = "info") => {
        const id = createRowId();
        setToasts((current) => [...current, { id, message, type }]);
        window.setTimeout(() => {
            setToasts((current) => current.filter((toast) => toast.id !== id));
        }, 3000);
    };

    const saveSnapshot = () => {
        const snapshot = {
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

    const restoreSnapshot = (snapshot: { rows: ComicSeederRow[] }) => {
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
        const payload = { rows };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    };

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved) as { rows?: ComicSeederRow[] };
                if (parsed.rows && parsed.rows.length > 0) {
                    setRows(parsed.rows.map((row) => createRow(row)));
                    initializedRef.current = true;
                    return;
                }
            } catch {
                showToast("Erro ao carregar dados salvos", "error");
            }
        }

        const initialRows = Array.from({ length: 3 }, () => createRow());
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
    }, [rows]);

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

    const updateRows = (updater: (current: ComicSeederRow[]) => ComicSeederRow[]) => {
        setRows((current) => updater(current).map((row) => ({ ...row })));
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

    const handleRowChange = (rowId: string, key: keyof ComicSeederRow, value: string) => {
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
        updateRows((current) => [...current, createRow()]);
    };

    const removeRow = () => {
        if (rows.length === 0) return;
        saveSnapshot();
        updateRows((current) => current.slice(0, -1));
    };

    const loadExample = () => {
        saveSnapshot();
        updateRows(() => [
            createRow({
                title: "Kick-Ass",
                issues: "5",
                year: "2008",
                link: "https://exemplo.com/kick-ass",
                cover: "https://exemplo.com/kick-ass.jpg",
                idiomId: "1",
                publisherId: "1",
            }),
            createRow({
                title: "Watchmen",
                issues: "12",
                year: "1986",
                link: "https://exemplo.com/watchmen",
                cover: "https://exemplo.com/watchmen.jpg",
                idiomId: "2",
                publisherId: "1",
            }),
        ]);
    };

    const clearSelectedRows = () => {
        if (selectedIds.size === 0) return;
        saveSnapshot();
        updateRows((current) => current.filter((row) => !selectedIds.has(row.id)));
        setSelectedIds(new Set());
    };

    const buildComicPayload = (row: ComicSeederRow) => {
        const issues = parseInt(row.issues, 10);
        const year = parseInt(row.year, 10);
        const idiomId = parseInt(row.idiomId, 10);
        const publisherId = parseInt(row.publisherId, 10);

        if (!row.title.trim()) {
            throw new Error("Preencha o título de todos os quadrinhos");
        }

        if (Number.isNaN(issues) || Number.isNaN(year)) {
            throw new Error("Preencha issues e ano de todos os quadrinhos");
        }

        if (Number.isNaN(idiomId) || Number.isNaN(publisherId)) {
            throw new Error("Idiom ID e Publisher ID são obrigatórios");
        }

        if (!row.link.trim() || !row.cover.trim()) {
            throw new Error("Link e capa são obrigatórios");
        }

        return {
            title: row.title.trim(),
            issues,
            year,
            link: row.link.trim(),
            cover: row.cover.trim(),
            idiomId,
            publisherId,
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
            const valuesLine = valuesTemplate
                .replace(/{title}/g, row.title.replace(/'/g, "''"))
                .replace(/{issues}/g, row.issues)
                .replace(/{year}/g, row.year)
                .replace(/{link}/g, row.link.replace(/'/g, "''"))
                .replace(/{cover}/g, row.cover.replace(/'/g, "''"))
                .replace(/{idiomId}/g, row.idiomId)
                .replace(/{publisherId}/g, row.publisherId);

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

            const rowsData = allValues.map((valueStr) => {
                const vals = parseValuesSimple(valueStr);

                return createRow({
                    title: vals[0]?.replace(/^['"]|['"]$/g, "").replace(/''/g, "'") || "",
                    issues: vals[1] || "",
                    year: vals[2] || "",
                    link: vals[3]?.replace(/['"]/g, "") || "",
                    cover: vals[4]?.replace(/['"]/g, "") || "",
                    idiomId: vals[5] || "",
                    publisherId: vals[6] || "",
                });
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
        anchor.download = "seed_comics.sql";
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
            const payload = rows.map(buildComicPayload);
            const { data, error } = await supabase.functions.invoke("seed-comics", {
                body: { comics: payload },
            });
            if (error) {
                throw error;
            }
            if (data?.error) {
                throw new Error(data.error);
            }

            showToast(`Quadrinhos enviados: ${payload.length} registro(s)`, "success");
            return true;
        } catch (error) {
            const message = error instanceof Error ? error.message : "Falha ao enviar quadrinhos";
            showToast(`Erro ao enviar quadrinhos: ${message}`, "error");
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
        rows,
        output,
        selectedIds,
        toasts,
        isUploading,
        isConfirmOpen,
        outputRef,
        allSelected,
        comicCount,
        comicLabel,
        method,
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
