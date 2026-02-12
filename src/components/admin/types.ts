export interface SeederRow {
    id: string;
    number: string;
    year: string;
    size: string;
    link: string;
    synopsis: string;
}

export interface ComicSeederRow {
    id: string;
    title: string;
    issues: string;
    year: string;
    link: string;
    cover: string;
    idiomId: string;
    publisherId: string;
}

export interface SeederConfig {
    baseSeries: string;
    startYear: string;
    comicId: string;
    idiomId: string;
    genres: string;
    baseCover: string;
    coverPattern: string;
}

export interface Toast {
    id: string;
    message: string;
    type: "success" | "error" | "info";
}

export interface LookupOption {
    id: number;
    name: string;
}

export interface ComicOption {
    id: number;
    title: string;
    year: number | null;
}
