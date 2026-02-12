import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabaseClient";
import { ComicOption, LookupOption } from "../types";

interface UseAdminLookupsState {
    comics: ComicOption[];
    idioms: LookupOption[];
    publishers: LookupOption[];
    isLoading: boolean;
    error: string | null;
}

export const useAdminLookups = (): UseAdminLookupsState => {
    const [comics, setComics] = useState<ComicOption[]>([]);
    const [idioms, setIdioms] = useState<LookupOption[]>([]);
    const [publishers, setPublishers] = useState<LookupOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        const loadLookups = async () => {
            setIsLoading(true);
            setError(null);

            const [comicsRes, idiomsRes, publishersRes] = await Promise.all([
                supabase.from("Comic").select("id, title, year").order("title").order("year"),
                supabase.from("Idiom").select("id, name").order("name"),
                supabase.from("Publisher").select("id, name").order("name"),
            ]);

            if (!isActive) return;

            if (comicsRes.error || idiomsRes.error || publishersRes.error) {
                setError(
                    comicsRes.error?.message || idiomsRes.error?.message || publishersRes.error?.message || "Erro ao carregar listas"
                );
            } else {
                setComics(
                    (comicsRes.data ?? []).map((comic) => ({
                        id: comic.id,
                        title: comic.title,
                        year: comic.year,
                    }))
                );
                setIdioms((idiomsRes.data ?? []).map((idiom) => ({ id: idiom.id, name: idiom.name })));
                setPublishers(
                    (publishersRes.data ?? []).map((publisher) => ({ id: publisher.id, name: publisher.name }))
                );
            }

            setIsLoading(false);
        };

        loadLookups();

        return () => {
            isActive = false;
        };
    }, []);

    return { comics, idioms, publishers, isLoading, error };
};
