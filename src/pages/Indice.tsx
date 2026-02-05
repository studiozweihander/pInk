import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import "../styles/IndicePage.css";
import protonIcon from "../assets/proton-drive-icon.png";
import catboxIcon from "../assets/catbox-logo.png";
import archiveIcon from "../assets/archive-icon.png";

interface IndiceContext {
    setHeaderComic: (comic: any | null) => void;
}

type ProviderType = "proton" | "catbox" | "archive";

interface Provider {
    type: ProviderType;
    url?: string;
    label: string;
}

interface Issue {
    title: string;
    providers: Provider[];
}

interface ComicSection {
    id: string;
    title: string;
    link?: {
        text: string;
        url?: string | null;
    } | null;
    issues: Issue[];
}

const PROVIDER_ICONS: Record<ProviderType, string> = {
    proton: protonIcon,
    catbox: catboxIcon,
    archive: archiveIcon,
};

const ProviderButton: React.FC<Provider> = ({ type, url, label }) => {
    const icon = PROVIDER_ICONS[type];
    const className = `provider-btn btn-${type}`;

    if (!url) return null;

    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
            <img src={icon} alt={`${label} Logo`} /> {label}
        </a>
    );
};

const IssueItem: React.FC<Issue> = ({ title, providers }) => (
    <li>
        <p>{title}</p>
        <div className="provider-buttons">
            {providers.map((p, i) => (
                <ProviderButton key={i} {...p} />
            ))}
        </div>
    </li>
);

const ABSOLUTE_BATMAN_ISSUES: Issue[] = [
    {
        title: "Absolute Batman #1",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/GEYNXDM7PG#2nzOd40zBS0y" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/srytb6.cbz" },
            { type: "archive", label: "Archive", url: "https://archive.org/download/absolute-batman-2024/absolute-batman-01.cbz" }
        ]
    },
    {
        title: "Absolute Batman #2",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/3GVMWCQ3DG#5ewWcoXbzSeu" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/isz5h3.cbz" },
            { type: "archive", label: "Archive", url: "https://archive.org/download/absolute-batman-2024/absolute-batman-02.cbz" }
        ]
    },
    {
        title: "Absolute Batman #3",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/69D3TMCXP8#s9XK5iZFfWKd" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/30myvr.cbz" },
            { type: "archive", label: "Archive", url: "https://archive.org/download/absolute-batman-2024/absolute-batman-03.cbz" }
        ]
    },
    {
        title: "Absolute Batman #4",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/NA6B9HH7ZW#ShZKnrKKbLp5" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/kieaz1.cbz" },
            { type: "archive", label: "Archive", url: "https://archive.org/download/absolute-batman-2024/absolute-batman-04.cbz" }
        ]
    },
    {
        title: "Absolute Batman #5",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/7WDH7HSPRC#Obdw5hcnt41m" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/odzl94.cbz" },
            { type: "archive", label: "Archive", url: "https://archive.org/download/absolute-batman-2024/absolute-batman-05.cbz" }
        ]
    },
    {
        title: "Absolute Batman #6",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/2SBXX91VN4#2xSQBfumHDAJ" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/td27sp.cbz" },
            { type: "archive", label: "Archive", url: "https://archive.org/download/absolute-batman-2024/absolute-batman-06.cbz" }
        ]
    },
    {
        title: "Absolute Batman #7",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/86R7YJ0ZTW#xX5owKeD0t6l" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/sz3r1s.cbz" },
            { type: "archive", label: "Archive", url: "https://archive.org/download/absolute-batman-2024/absolute-batman-07.cbz" }
        ]
    },
    {
        title: "Absolute Batman #8",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/3E7S6E7FMW#pnBDtloG8ncc" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/0ceu0e.cbz" },
            { type: "archive", label: "Archive", url: "https://archive.org/download/absolute-batman-2024/absolute-batman-08.cbz" }
        ]
    },
    {
        title: "Absolute Batman #9",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/ZS1QRQSSRW#Y8DvEPHNnRJK" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/c6n016.cbz" },
            { type: "archive", label: "Archive", url: "https://archive.org/download/absolute-batman-2024/absolute-batman-09.cbz" }
        ]
    },
    {
        title: "Absolute Batman #10",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/1EXYG9ZTCR#sdvoOyZ4Pr0w" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/n1jl4i.cbz" },
            { type: "archive", label: "Archive", url: "https://archive.org/download/absolute-batman-2024/absolute-batman-10.cbz" }
        ]
    },
    {
        title: "Absolute Batman #11",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/F6A1X5N8H8#9uInCePL758p" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/a51i4t.cbz" },
            { type: "archive", label: "Archive", url: "https://archive.org/download/absolute-batman-2024/absolute-batman-11.cbz" }
        ]
    },
    {
        title: "Absolute Batman #12",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/JWC7DJ210R#b7wsS1WPQNcj" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/t325wi.cbz" },
            { type: "archive", label: "Archive", url: "https://archive.org/download/absolute-batman-2024/absolute-batman-12.cbz" }
        ]
    },
    {
        title: "Absolute Batman #13",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/7R48WNDSZ8#xUV6zq5mUWQK" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/qfuxpk.cbz" },
            { type: "archive", label: "Archive", url: "https://archive.org/download/absolute-batman-2024/absolute-batman-13.cbz" }
        ]
    },
    {
        title: "Absolute Batman Annual #1",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/JB0G74M9E8#AkiZXTVQwoMo" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/ne6cb9.cbz" },
            { type: "archive", label: "Archive", url: "https://archive.org/download/absolute-batman-2024/absolute-batman-annual-01.cbz" }
        ]
    },
    {
        title: "Absolute Batman #14",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/Z5AC92RT08#cs34Ld8OtpgD" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/2xq7hs.cbz" },
            { type: "archive", label: "Archive", url: "https://archive.org/download/absolute-batman-2024/absolute-batman-14.cbz" }
        ]
    },
    {
        title: "Absolute Batman #15",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/Z3J5K9G5FR#ICQueGxqBosi" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/cf87b3.cbz" },
            { type: "archive", label: "Archive", url: "https://archive.org/download/absolute-batman-2024/absolute-batman-15.cbz" }
        ]
    },
    {
        title: "Absolute Batman: Ark M #1",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/Z3J5K9G5FR#ICQueGxqBosi" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/152bwi.cbz" },
            { type: "archive", label: "Archive", url: "https://archive.org/download/absolute-batman-2024/absolute-batman-ark-m-01.cbz" }
        ]
    },
    {
        title: "Absolute Batman #16",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/J0ERS7E6SW#AqzY3R7LyE7d" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/usk3ud.cbz" },
            { type: "archive", label: "Archive", url: "https://archive.org/download/absolute-batman-2024/absolute-batman-16.cbz" }
        ]
    },
];

const ABSOLUTE_WONDER_WOMAN_ISSUES: Issue[] = [
    {
        title: "Absolute Wonder Woman #1",
        providers: [
            { type: "proton", label: "Proton Drive" },
            { type: "catbox", label: "Catbox" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Absolute Wonder Woman #2",
        providers: [
            { type: "proton", label: "Proton Drive" },
            { type: "catbox", label: "Catbox" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Absolute Wonder Woman #3",
        providers: [
            { type: "proton", label: "Proton Drive" },
            { type: "catbox", label: "Catbox" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Absolute Wonder Woman #4",
        providers: [
            { type: "proton", label: "Proton Drive" },
            { type: "catbox", label: "Catbox" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Absolute Wonder Woman #5",
        providers: [
            { type: "proton", label: "Proton Drive" },
            { type: "catbox", label: "Catbox" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Absolute Wonder Woman #6",
        providers: [
            { type: "proton", label: "Proton Drive" },
            { type: "catbox", label: "Catbox" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Absolute Wonder Woman #7",
        providers: [
            { type: "proton", label: "Proton Drive" },
            { type: "catbox", label: "Catbox" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Absolute Wonder Woman #8",
        providers: [
            { type: "proton", label: "Proton Drive" },
            { type: "catbox", label: "Catbox" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Absolute Wonder Woman #9",
        providers: [
            { type: "proton", label: "Proton Drive" },
            { type: "catbox", label: "Catbox" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Absolute Wonder Woman #10",
        providers: [
            { type: "proton", label: "Proton Drive" },
            { type: "catbox", label: "Catbox" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Absolute Wonder Woman #11",
        providers: [
            { type: "proton", label: "Proton Drive" },
            { type: "catbox", label: "Catbox" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Absolute Wonder Woman #12",
        providers: [
            { type: "proton", label: "Proton Drive" },
            { type: "catbox", label: "Catbox" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Absolute Wonder Woman #13",
        providers: [
            { type: "proton", label: "Proton Drive" },
            { type: "catbox", label: "Catbox" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Absolute Wonder Woman #14",
        providers: [
            { type: "proton", label: "Proton Drive" },
            { type: "catbox", label: "Catbox" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Absolute Wonder Woman #15",
        providers: [
            { type: "proton", label: "Proton Drive" },
            { type: "catbox", label: "Catbox" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Absolute Wonder Woman #16",
        providers: [
            { type: "proton", label: "Proton Drive" },
            { type: "catbox", label: "Catbox" },
            { type: "archive", label: "Archive" }
        ]
    },
];

const BITE_CLUB_ISSUES: Issue[] = [
    {
        title: "Bite Club #1",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/56ANCJJZM0#3y7H1T0RzHbW" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/intkec.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Bite Club #2",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/T79R70QNT0#oHrDsBes9wsZ" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/ggzg3k.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Bite Club #3",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/M5GD3G48N8#4SGPcvPg3Lz5" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/owdcpg.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Bite Club #4",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/K7DWW2AFQ8#FQWnppNESLoS" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/laxn30.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Bite Club #5",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/WX9Q8K33E8#lI9r8ppPCOEn" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/6jqqki.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Bite Club #6",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/K0C59FPHF8#OJIAfLi0wr0u" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/jn51i8.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
];

const FATALE_ISSUES: Issue[] = [
    {
        title: "Fatale #1",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/2XW9KWQ7P4#URaqPCaUD5w6" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/bonswn.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Fatale #2",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/82PJSVB7N4#V9YsfatrSeLs" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/e7tx8c.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Fatale #3",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/K289SAF0HM#5dnPQVUZ4CLx" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/me6wjs.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Fatale #4",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/J12Z66ESB4#AsAs0SfGzL7L" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/rpyivg.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Fatale #5",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/C316Z1FVXR#JpiMInlSmAUP" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/rqk0ip.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Fatale #6",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/EV7AX0TG3W#nCJi6ayAuNfb" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/1f3a9c.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Fatale #7",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/9HW3FMPMDW#TrgCS1BrioW8" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/9o6ans.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Fatale #8",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/Y0R27YHRFM#0xGrkSHqJQri" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/icd6r3.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Fatale #9",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/A4SBVBDM1W#f7bDrf6MRXr0" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/2gbygc.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Fatale #10",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/NN057YME3C#MCHE3Vs4VPue" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/6jc5hz.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Fatale #11",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/NV1AWZRFGG#eL45NFUZWmsi" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/kylcv0.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Fatale #12",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/4831YW6Q7C#JhLt4yqzvMyx" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/5l6986.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Fatale #13",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/4K4PGZEYNW#RYLfGnFLk79S" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/5l6986.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Fatale #14",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/J8B9K4QGVW#HZA50BO0VlT6" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/8zuide.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Fatale #15",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/ZTW2QA2W78#hciNQ8n7FuRw" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/efhid1.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Fatale #16",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/Z0Q2ZZK980#lHoHUsGfMC4E" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/oyctjt.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Fatale #17",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/90ZGGTQHVG#IreJuxkIw3Kc" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/dnm2dm.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Fatale #18",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/E2R0PCTR6R#GR91GEEe7FPz" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/of8lbp.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Fatale #19",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/2EN8QVBT5M#rrqGkJmcxp50" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/g9z0d7.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Fatale #20",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/ZHPFYKQGC0#NdtidF9olGka" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/b94jtk.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Fatale #21",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/S9HXRKW31W#0zWim4Oo5Xzw" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/p6ssnq.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Fatale #22",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/S9EMJ3XSEG#4ZxrpkvM24Iv" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/vboven.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Fatale #23",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/Z7HXN8AAYM#nGtQ9jzdGDp7" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/m56t33.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Fatale #24",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/TPNVTYBTTR#Q4T8tQckEaEl" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/6wpyyx.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
];

const HAPPY_ISSUES: Issue[] = [
    {
        title: "Happy! #1",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/8ZKMND7DR0#MHsuPVraXN20" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/jlphnz.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Happy! #2",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/FA999RZDHM#RR6w2AX5entK" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/p8i715.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Happy! #3",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/9R8FA2KKK8#EWlMI0X5lc6a" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/qpm64c.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Happy! #4",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/7E9YTQSZQ8#QnbC5oH623Wk" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/e6bxop.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
];

const HELLBLAZER_ISSUES: Issue[] = [
    {
        title: "Hellblazer #1",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/QZHHPB6KT4#R3RlHkroJedM" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/9ra3t4.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #2",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/H8T9TRCQJ8#d6V2PE9O6IMq" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/x9klt7.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #3",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/S1FDKCSFNG#LGX0Sm7QEVR4" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/5agjcm.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #4",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/WGVN2KEPX0#uPTd2KLT81Fv" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/vwlt92.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #5",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/FJF3NJ91YM#HRxYOTKmi8EL" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/emdvd8.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #6",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/6JS2NMQRSR#xL4VahKnEuKd" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/du28hd.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #7",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/CBWE0DY94M#6vMN9jz9Al0E" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/s7isq7.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #8",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/77KNFGKQCC#UVGFyj2LQWLa" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/7jvyzp.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #9",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/9RTM8BEK4G#2EFyYaGFdZLB" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/asltp3.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #10",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/BS6G55708W#FRkEdvUXGTE1" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/d1jtlc.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #11",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/WF2K2QTGTC#kN9fzcJaieir" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/pcbb45.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #12",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/VZQR5RV3ER#9ZFxORSjh3C3" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/zvch3p.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #13",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/MZDE2E11F8#pjZL3Os3Dqmn" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/3y4yoc.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #14",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/D1H729FHRG#r9Ob0dj3p90e" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/fb2egd.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #15",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/ZF5B57AKD4#1q0T4dNac88R" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/rh6dsg.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #16",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/B3G3T3KZ38#yJcwmzi2h7cj" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/rccadz.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #17",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/6F0XEHKWD4#mycqTUvlhCcg" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/xcdlrn.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #18",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/N8NPW3XEH0#0aslC6WlDZ5v" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/j6fcrj.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #19",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/S4S11E2N60#VL2RXw0KHtUy" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/j3jl7c.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #20",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/VGTVJGZDN8#2jdYisuK0XEP" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/lisn4q.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #21",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/QQ020202HR#IP9dmch7hD1X" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/gfg5cq.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #22",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/J0SSCY5X9M#rGHvw6ZANTvO" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/3tcd0o.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #23",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/BNBKQP8S30#tT9jDLKOMjRi" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/7l65q2.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #24",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/PGAKCTZM1W#CCfwxd3PJwSF" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/cjvlw7.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #25",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/MNPFC05V68#9z46b6oimOV8" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/x216qo.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #26",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/9WMK1WQKC8#HW2y5k2QkoHr" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/6lis7m.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #27",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/GSWWMPFKC4#mpphpO9wOmHZ" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/lfnu4a.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #28",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/AX21XZXGE0#Hbkw8ohSYWla" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/m2odcg.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #29",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/DPJKRF6DS0#NZnlb6CjOmX7" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/m7xab8.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #30",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/K2TEDB7VK8#gfE1RI5xi3sG" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/65q3mk.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #31",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/F820GNMPE8#xIQiBqWD1NC4" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/r6alph.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #32",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/D8CT9XWX2M#EpKqJLk1qbDY" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/49q5as.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #33",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/WSN59BGPA8#Gd3OuDfqDOv7" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/eajkdf.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #34",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/8GCX7MKE6G#tmYfBqKpZT2V" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/tuikf2.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #35",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/D8P6Q0VCNW#IODKD7PXGVL9" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/5cppyb.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #36",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/GXC3Q94F2R#5gSFweyn2ayl" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/x67fjy.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #37",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/KYHNN507TW#KvjDF2lbIH0V" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/6ycle1.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #38",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/SVV04DKVJM#8qZLUYaBfZid" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/yj0zw4.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #39",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/9A29NMZ890#EuXNrPbxZO7J" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/h3dat1.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #40",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/Y5DAT3DBGM#MMblzhoRB8XA" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/4vms9b.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #41",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/4139BK0TZW#UE7b2gqZDOcy" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/qnijjr.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #42",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/EYQAK587W8#A7J4aZV9sYwG" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/m2hklk.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #43",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/G73PVJB2GG#ngc54xi8gEh5" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/xwlfks.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #44",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/1WAZ3D62B4#l4eBtmhrX9Qd" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/cqexup.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #45",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/6R4YNAYFH4#bWw1yfbZ4iaw" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/odcxo5.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #46",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/VGF9V9XZ30#i3bEeyp7S70d" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/17rlfd.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #47",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/13TJPSBB6W#P0GgylmKSgQu" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/s97x2g.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #48",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/Q492XPSVXW#SRmhGKyEz0Nm" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/so69t3.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #49",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/JFRJJ2CG7W#3ZJ1yenHZXrU" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/oe6ggr.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #50",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/PXN74TSTJW#LmLnuXSfTJU7" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/gdufcj.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #51",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/5PZPKKBMGM#ep5iP6zNameK" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/tpesaz.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #52",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/CWV40P75AW#DFS3OKS6Di5H" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/iyqbxe.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #53",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/VNBGSETJ64#AHms8CnaxhbB" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/r0ck8r.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #54",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/BYZF56MW0W#FPCPMgo2vtFt" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/umcxx2.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #55",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/445EVHVEVC#weMPH5eo3BDe" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/hk98xf.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #56",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/JD3NQKXK4R#l8nfPe7T9rSE" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/yaigpl.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #57",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/QTHA3JP39C#10qSGBra5nM3" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/ev9ors.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #58",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/X03HJKTZD4#iCijutG3Xf3K" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/g3z7v7.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #59",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/A6862JMCSW#RxGhUdKeFymy" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/8gebls.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #60",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/V8RVM4SEQR#ea5p5NbmWnjF" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/bhdy06.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #61",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/A4JDGZ0W6R#6DcGxNgdmy49" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/m8mwym.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #62",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/X16S7FG0E4#kOXpwHkb1GzO" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/gk9xq7.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #63",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/M77GSDRB2C#iMCS97LaQTJS" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/011yrz.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #64",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/KN7DP5PHT0#Em0qDXuYEOA4" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/syynma.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #65",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/AAS04DWGZR#kbImZxmzkG7C" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/hlhsl1.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #66",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/33P88PXDNG#1hiRpH1bt0Xs" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/2eo541.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #67",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/KQV2D231H4#SGT7vV9MZBkk" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/nslsb5.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #68",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/KHFMW36908#JHMj0EU5U9gS" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/zog7kq.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #69",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/WA2YPMHFCM#bY9fwJPMtt19" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/rg1a4t.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #70",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/QRCD8CZ4V8#RVOdWiyBhPiW" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/v0sver.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #71",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/7RCTGZ27KG#oYKytGeUh3tb" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/b0jirs.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #72",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/55MDBBVQQ8#GtNlvR1pzx8p" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/5aq1pa.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #73",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/QWNBS3ACHW#ujfmXNzLuIJq" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/qpdlap.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #74",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/8MFSJEYGQ4#d6fs8EWJmxVd" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/2f2qh4.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #75",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/NTVC680YYM#sQlbx4fA4zIo" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/2xlwe0.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #76",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/F64J6S0S5R#SirA9Td001m4" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/4q7h9q.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #77",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/P1WZP9HBT0#iD7RiGUGh7FF" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/w9tgkg.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #78",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/WBTSQ44J6G#B5TfPCJjUiWG" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/xqciyj.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #79",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/HGVQEF1GXM#5KAHRn7ltapq" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/14bnho.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #80",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/JA4G1CTM2R#aDtyWhpo5hqX" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/pbjlkw.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #81",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/6N3YYT2TAR#IWSR1iyyA6G6" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/byw2fu.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #82",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/P82JK1K1BR#j5u4IKf2c8e5" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/w8kcwe.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #83",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/04MV2NKK8R#L9WqGT7Q4xCq" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/kwf7f9.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #84",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/Q1S33W1WXC#XjRXNfQa3Pfu" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/7rdtvp.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #85",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/AFPSBZ8CMM#oq7z2AYAej1T" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/23uqx4.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #86",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/4R42Y7FZYM#Y6c6Agd5a6AQ" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/tqs4g6.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #87",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/DGHYMZ5KMM#sEnW6bMux9av" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/mkz1am.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #88",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/GF9KBD0VJ8#Mkks5vuUO13R" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/k21yv1.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #89",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/9QR89B0YS4#Hi77iOLbgIlS" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/zx8ssd.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #90",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/0X7WA0C9V8#l7lsZfCQkQl1" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/40wxjd.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #91",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/C259VR4TCM#O77JyBPFwAB6" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/b9qw4c.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #92",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/KMX6V6C79M#TFRl5cv5aPGG" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/v6xv50.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #93",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/Y9AGHRXEBM#tAzPXsTS9qxS" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/n5suel.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #94",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/CPNYP03N44#i5GWrzT3PoGU" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/j79dpg.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #95",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/XYGGP0VH00#REHnI0JPUOmJ" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/rbp7ak.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #96",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/HC5A5JDYG8#QfGEcijjZ3bW" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/0ny1ch.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #97",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/QAH55J01NC#bKaG6kdrSchV" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/hi7wbg.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #98",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/6EJCRVHH14#7sFSEgbmUiCq" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/tc64sr.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #99",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/SP6JJHWS9R#FiMYB8ILua9i" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/7yeph8.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #100",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/Q1BS0CT608#goJJhxeZHum2" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/q95d7o.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #101",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/44T1JJJ7E4#CaKaeonhn2OM" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/gn8tc7.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #102",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/08G6VKECB0#7cgYYSlnkJXb" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/g4x0h7.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #103",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/50W9H5VNDM#frfGJBCBTlG5" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/p93b0n.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #104",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/KBB32HSGXC#1WKJzAEoCUZp" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/5ho7me.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #105",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/F9HN7EBPRG#k5ehJvpDNn0I" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/2s93td.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #106",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/V45Z9MPST8#DOA1HWyTVqKT" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/vaepjd.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #107",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/5PM0YJJ9WG#HMdQQ6JxibbK" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/6p6fze.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #108",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/69VZJYG36G#iip4NCZVbHJj" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/czy618.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #109",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/Z2SR9JE3S4#eoPnEldjydY2" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/moqmdl.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #110",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/SYTA0TY75W#iB4BHBdzWn1C" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/ifw8op.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #111",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/ZSZB045Z0G#mFJ93E5pKY6D" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/717iz3.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #112",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/NFQ5814MQW#n0K7IVxQ9Joo" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/4k4zkk.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #113",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/PP6WFG1P24#q3s1H4zoJg1I" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/nwbpgy.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #114",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/BA75R65MS4#K13AtF23fmgG" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/85p9u0.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #115",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/TFEHTP9B3W#zxjKZnVor12N" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/d9ec5q.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #116",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/VBVQHK3Z0G#RCsN5ai12dcc" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/rii7gy.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #117",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/3J7SDT316W#KxhoDTvjIQhK" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/n65mve.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #118",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/X7Z501PV78#sTOnFRxTm44W" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/ee6umr.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #119",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/Y7DKMY44BM#7WqNYeHYPSSj" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/ifwuha.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #120",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/95KW059GZ0#Qw1MnwpKIOtI" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/d5qtqt.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #121",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/EAY0PY8FAC#uD44B7SmSLYQ" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/b602gv.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #122",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/HPTA3Z2D5W#vLzLysBDcvX1" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/e1n9vh.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #123",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/HSNE828SDC#1QBxLS3FnaSS" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/w6jt39.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #124",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/NAJX4HDVFW#pCiLLKxiaYpD" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/jhydwr.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #125",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/GJPZSA5MG4#0oYgM1YrKz0h" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/59ncpw.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #126",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/91XEM4ZMDW#865kfyNYsuyz" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/dxehnq.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #127",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/JCB91ZH9DG#cGqSBmICqNDT" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/2nturf.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #128",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/HKMD34G37W#IceHqesHR9F8" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/lf3nyo.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #129",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/M7SGEAKWX4#nqNCqNTUpai2" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/upvobz.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #130",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/TGK9MRQADM#6gQM7zICTPsd" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/x4bk0l.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #131",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/22A6P46NN4#jhVuxiQKDdJ7" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/yr9x2z.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #132",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/KSSTG1EJQW#9LYvH2LibQXI" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/upxeqc.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #133",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/A4735462DG#sTzKkayIiWf9" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/g3pd8w.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #134",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/QX1HT8YTE0#1NvptbEoDQlv" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/ypwmes.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #135",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/2G7VWGN3CG#lXUEIjVHV53N" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/9rsqal.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #136",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/VPB77TPG28#R5CH2x9SjMsk" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/8kbpxa.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #137",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/DVWTCWWF48#fH2i0Us54ZkV" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/996pub.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #138",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/N31TXBCW4R#GjM4bMqMCDcs" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/jte37o.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #139",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/0V3C7B9CNG#u7w0XxVSIkrZ" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/tbc0h4.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #140",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/3Q0YXJ89SR#8jjT6TH4x98k" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/70d2qn.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #141",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/1EZCNWQSNM#zkjnCoWuikJ6" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/xxzvf6.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #142",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/8HMGHGWMMC#ElaCpZL77Bte" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/3zjcmx.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #143",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/F7HS7JKC4C#PGsVBLaECcID" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/eeolba.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #144",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/4VZFFAK800#hzOTzPyRmBt3" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/t1oubm.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #145",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/FVHZ70KQFM#p3i1cOYbvT1a" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/hocf1x.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #146",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/5Y7XSA0T0W#R1GZmtsKif3h" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/51kahe.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #147",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/ENDGXKXX64#mDqiPYSsQl0V" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/9apn3k.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #148",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/NY60QQFXXG#TgtEnYCv4AcG" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/kt0wel.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #149",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/R6KPE18QVG#7vBtCUbsnL60" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/pg29jr.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #150",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/H4W7JS4DA0#2qcqq5PAVKX6" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/kyr46x.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #151",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/1MSK0H5GE8#g5xHb31CHpEe" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/tj7iav.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #152",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/J3XMZBYPA4#557FcLaILjYp" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/nzec9c.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #153",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/BKYK1MNH8C#o41KHpBqVvqJ" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/xfjhsl.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #154",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/HVB05HBW7C#nS0J6o0bKrqR" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/banz9e.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #155",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/K2GAWHZ7V0#D2GcMjhBrN1z" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/80a0k0.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #156",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/SPK95A1EB4#HKxPgW7O0Fhb" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/vfkh92.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #157",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/M5RAXKEA2W#nFz8hQr9Kfd3" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/uich92.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #158",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/6MZDKKV8FG#XCWdOsR6q99q" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/ky65d9.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #159",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/0PMMGEKF0C#YpJaNlfAAd4a" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/jvckll.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #160",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/YWTVSW8J6W#XBkrVURYbALr" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/ft0sy4.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #161",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/55ERFVT4YG#olV9mDvyUGud" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/uneopi.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #162",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/0G8C57DBT4#PldmmtCiW06B" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/o2wtpw.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #163",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/9FKVAYBW10#RKZ9HwXHW24w" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/klnvai.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #164",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/XVJCZ8HEQ4#Bht9MbdiHdal" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/nr3yna.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #165",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/HN4C8QNFTM#jvkdW4KY808f" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/sj4one.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #166",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/NA1211J6XG#cVQ5HKi5yyMM" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/oejf7n.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #167",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/SCKJ7SHKPC#6xWPaGYk4I4I" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/548dpz.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #168",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/W75Q426RQW#TGom9M0pLNdA" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/53yuz3.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #169",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/GWZFF6YPXR#Up22IBgFlubg" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/t5av26.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #170",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/DJEWPSGRQM#sWEHIflvjdvM" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/wwoqs3.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #171",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/DA92N9H8MG#fJbeANnEP5ud" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/fjfgyb.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #172",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/43A12PR0JM#NqwtJJzyoBIb" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/vhkzfw.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #173",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/TFVYXEDHN8#GMP8xked5A5O" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/063kfr.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #174",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/CNVP7789EW#BB9arIbeaPIv" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/gvdaxc.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #175",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/ZB1C2RYCZC#ZNQnuxaMGurP" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/bjmvsr.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #176",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/S3KZ3CVJ6W#1o1LKBoJKAiJ" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/bab270.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #177",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/ZHRGTK2M90#4gCEERhB1cs6" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/r756zl.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #178",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/ST83X96AXM#JfDlPz2SGsrz" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/ko5f7s.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #179",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/Z7J8P93K60#2qDI2oUtCrxq" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/hamrvp.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #180",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/T5P5NETQB4#Z8PdkBBbUiST" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/opmlma.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #181",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/5R4P5WBX5G#nhDcoIZ2YI5d" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/0jp257.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #182",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/P4J9YHF4ZR#rT9XkbHLbvs1" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/qhq6kg.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #183",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/90ADK542ZC#15Qug7TESPsU" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/4ys1jb.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #184",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/S4XS1R65E0#OndIyg6xdU4q" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/0sh5li.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #185",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/CNYC6EGVTC#VEQTg56jNq4u" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/syr6oc.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #186",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/WC3V6MMSQ0#b78rE7pEH9MZ" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/qc1an9.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #187",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/9JF8J6QSE4#Cw6N8dowWGqx" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/7irou3.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #188",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/7YR5AH3048#Y1rBIwiM3mXB" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/67ynyn.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #189",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/A3V1Z1EN28#RImJVahglbxu" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/pbxzjy.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #190",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/BX8PJTD99R#aSkr456oLTf4" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/hbti7j.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #191",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/5T9E1RM704#7AgHB2Masyga" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/lgoa8o.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #192",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/5MFC0SYCRG#vNRdzWlNMXTb" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/gi1nz9.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #193",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/9104RYKSWW#kYP3hiOoDsut" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/029zs0.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #194",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/M0F800NV44#drve5pFYqYI3" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/e76x79.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #195",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/1XFAQKNH44#PP5tr2xJ37vU" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/d6fwur.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #196",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/ACGGYQD01W#hedfrIjuwcAL" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/r007op.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #197",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/6E9B11BMMC#fCF5VFgzDkt1" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/l70b2s.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #198",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/2MR4EQMTZC#hRXXCidCQOpw" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/kxlztx.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #199",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/81J85TY25R#ReHuUDF7qG9B" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/c1yhp0.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #200",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/4JRH4G80P4#Bt0lC4W3wsPt" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/mv3gew.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #201",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/K62NBPA38G#oS7tWDIaNMb7" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/yrvvlg.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #202",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/WV9W7HFQ14#kiWe9sBhIevA" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/2imeeo.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #203",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/F07YFWSZ58#s3f3MviyEwA4" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/qii2dg.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #204",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/A7A7CWWRY8#pvEyvymy2v4K" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/yhqzio.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #205",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/7SFYHKJ0P4#pnBCKyNxj65N" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/en38cw.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #206",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/1QAP66X26C#9ONySYNzehiJ" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/2wvnlz.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #207",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/4J6KN6P30M#zTVmwusKpgbx" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/zx1g7a.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #208",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/MDZKTN1XP0#NCm5fbwzk3C7" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/zlc5g7.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #209",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/Z0AC5CXVFC#OK5zEFV8n9RO" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/mas2gw.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #210",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/EFCDMN9Q7M#13nLptWBbyXu" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/3hs0l4.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #211",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/M7QJT2YZ7M#nArEgWz9hCho" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/4ohb7k.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #212",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/R3PJXWE2B8#ql4ZzgxzP22f" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/lpjxaw.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #213",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/TJMJ43PH74#0vUlxSL7WS9w" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/f0jz2m.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #214",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/KVQHM94W58#p2KoHD4wTDEX" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/rwqvyx.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #215",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/CHE2BE4K7C#vuuJLFsBjqvG" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/b4xifp.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #216",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/8PKR0GWDDR#tdlfUMK3D6AG" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/xlc3ez.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #217",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/980BZA95BR#RY30gQm9z1Y5" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/alxpg2.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #218",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/MK81P82ARW#mwixVTaJkt0A" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/ldeipe.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #219",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/SAWVV39PDM#QugU5sjgOOuL" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/2u205k.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #220",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/SGYC6WSZ24#wrdsmxJc0MYH" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/zywc03.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #221",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/TZX30F589M#AhgT8pPoFrdV" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/3bbjq8.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #222",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/R92KDP9R60#rX8VrvsPfF9e" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/nxo32j.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #223",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/6HSTWERFHW#LfRlBMonQ1Pv" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/ie7ofq.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #224",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/KRSF76KQY8#FlRGT6JJwYLi" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/q2fvrt.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #225",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/BG97YMGQG4#j3LMoAJcwwI8" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/wany3s.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #226",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/P99916N8XM#eS5hFdiyevig" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/uswwo2.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #227",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/MFK09RZCF8#46PKfPHRESWY" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/epinp2.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #228",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/8SFC1Q2YKG#FY6gdjs0lbPq" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/uncork.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #229",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/145T32C7MC#I6QVTPymbYEk" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/5jhda0.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #230",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/9SKMCVM850#y89cjHZ2CXhG" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/vswbi0.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #231",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/NCME1ETYR8#FuuRLvlJPLkB" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/dzhm5j.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #232",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/6HJJFJDAAM#FiDY0wdbJ53w" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/ugm227.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #233",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/WGZGR91N0C#7H71EACfWf0v" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/jist1v.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #234",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/077CA7E9RR#S5ie9qyG9o2q" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/6gh3jx.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #235",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/WBQ09EKN2M#W8yYRmkUDVGC" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/74wlym.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #236",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/WVD8ETFWZC#BgoSpItG9g9x" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/bcv2vo.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #237",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/JAQQPF2TT4#axHiIEWke7OT" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/o8c963.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #238",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/H49T33DY00#cchEvh3AyOqF" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/met0i5.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #239",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/A5VJM2T970#PAzutUCQc4BC" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/qtnrns.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #240",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/QA39Y0S6R0#Ih4kyUX9lASJ" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/0inqr0.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #241",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/AM6RVPGYJR#GzvQDkOlD2QF" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/vrqb17.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #242",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/3V458J7AQR#HB8980KB8s3k" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/9m4j6q.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #243",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/XVE4J33JD0#Rj82uq2DlAgj" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/t42s41.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #244",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/3ZTBNBF0CC#jJpriSDmmja2" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/ctptg6.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #245",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/7H8QJ10K2G#4x0VzSuAw64J" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/gild6k.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #246",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/41ZZFG0TP4#UcH53LDgWL5c" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/8von6e.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #247",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/ZXAM94WG00#ibgUrb0joWoW" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/uosi5j.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #248",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/0RTJNBK6T8#LuTEECrz76lD" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/k0yd3g.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #249",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/KWDDGWG1T4#sI52cDbXCoio" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/3ekegx.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #250",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/EBN2GPW81W#f8FRFKxarNiw" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/hgn51f.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #251",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/DQE2461GAG#KRIBCCvN5WjE" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/c2pjig.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #252",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/7J8EWZT9PC#yF07zSL1zlAl" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/rpctfv.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #253",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/YVXNY1X1W4#6GHfR7ldgkPk" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/688r0e.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #254",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/9M6XHCNQQ0#aYqsaV5AkqgG" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/og8v2s.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #255",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/VF44MVS1NW#7zJufxlkBJff" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/wuxr9b.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #256",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/RNNZ50EZ50#xPTPjPf1HkIs" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/u77f3b.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #257",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/6QKQ5T33HM#D9JWKRMc0eL3" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/hqh2r5.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #258",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/RT3R87EBCG#ShBqNx3Flfy3" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/l38iyn.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #259",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/1B810W77KW#Rxr36c1rRUVM" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/a0bfnu.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #260",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/MS19Z9VPDG#Elx68OFJqJHN" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/os3ivt.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #261",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/34ZB9J1EWM#2l8cexkQAVAL" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/9spunp.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #262",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/2KBA98CXDR#GFUQ72PN9zhF" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/10kwbn.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #263",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/162FCC47G0#NLoxGvlOppbi" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/polvwg.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #264",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/AECAJDNZSC#UsqnfdNcdpmn" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/02jq3d.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #265",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/FCN3ZVRQS4#doWswOLdkL0x" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/r2d1fj.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #266",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/71QFYZJ85G#WBfjwrHVGTEr" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/scvrum.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #267",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/Z3XXSJQQ44#iA7YrUgVMYps" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/wftu2j.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #268",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/P3QJVC7424#hhkNkQj1xoz8" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/bclghp.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #269",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/4ZB2SMVEAW#bdMNTlQBWCHM" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/1xt72y.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #270",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/WC6YH3RX7C#J78p3u9jSvZ0" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/0ivp7m.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #271",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/0D4QSX8D5G#HoLrtk4PgyCH" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/gvgx24.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #272",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/ZC0BYSGAKC#1m6jmmYBllnm" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/vmrexs.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #273",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/FH6MNG4P8C#VH18sZS1Oozd" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/lrxncv.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #274",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/CT053TADV0#xw8Z2oxJV5Z5" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/yuusp6.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #275",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/C4F488K9WG#05CPXxsEEqe0" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/i2t4a2.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #276",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/GFKXH4YQAW#aMKWLztOV17A" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/h1b724.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #277",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/Y5KE0KJ2MG#F0V9L2yt2hyS" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/5z9vol.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #278",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/9CZJ6V8GQG#CeWXbRUmxEJr" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/kn6hjc.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #279",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/5PBFHBAYKG#OwKzeWRTMtP4" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/440wui.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #280",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/WM7SVMYK98#McuNazu9M76w" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/jwr10g.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #281",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/ZKS88KTS0G#UvI6O4VsaaaM" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/ycci15.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #282",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/RCV2PW16WM#CkPJwIb0ETau" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/x8xkgg.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #283",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/GTG87CNX1R#9Fwwu1jbo4JE" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/2ccflj.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #284",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/VCF59AWWDR#J7NYeox0YYND" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/2t60hq.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #285",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/58X9QHHYRM#MQjM82crJz5u" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/llho7b.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #286",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/JPT945Z3EC#FkKIO6EAbQAq" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/84yoey.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #287",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/SH844KYWKM#uujMEvvnNKXN" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/a7uc9b.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #288",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/N2G28QNB5C#JbGYt5G6RvPa" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/tedl6y.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #289",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/CR4P8KGERR#tVngd9ct6glC" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/66f5um.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #290",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/MGF35CGGCG#MfZnJMIc7Boi" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/02x8es.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #291",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/6Z1K1XWSAR#Ppw5QlAVm5QA" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/727qke.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #292",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/3HE3GZBTC8#CkceNFJgIdyl" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/99bqbo.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #293",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/BQF6E0PBQ0#5XQtOcmf9aq6" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/uo5xp6.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #294",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/KKD9DXFMZ0#L5DjFmUEL13Y" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/1owvdb.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #295",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/7FSGVFPJN0#oJ7I24UZv6wS" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/bhg173.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #296",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/M1JTAM80K8#RLSGlLrMmqii" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/7p23gi.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #297",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/1N6GTJYZF8#aCzgL6IB7kYX" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/2xputl.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #298",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/MM3QWH77FR#Kwa8BNInGGPY" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/9veg48.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #299",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/1P73Z30SCM#8RPDkbY5pb28" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/036id8.cbr" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hellblazer #300",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/T7PDD431S8#MP0a8JiWRqEf" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/2q87ln.cbr" },
            { type: "archive", label: "Archive" }
        ]
    }
];

const HITGIRL_2012_ISSUES: Issue[] = [
    {
        title: "Hit-Girl #1",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/KCDX3GA43W#xkviEoM4LGIU" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/5wz330.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hit-Girl #2",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/71K2B4HSKM#iZUZPN2scXQK" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/ipx7cs.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hit-Girl #3",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/57G2AA29HG#k65LZKsdUIcx" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/z00iqp.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hit-Girl #4",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/WERD1065TC#lqxyYTe0laSe" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/n2c0a2.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hit-Girl #5",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/M62EKQ8HAR#iLR2toxCkEKz" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/o2lrxv.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
];

const HITGIRL_2018_ISSUES: Issue[] = [
    {
        title: "Hit-Girl #1",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/3QXD8ETMA8#J2f1zCnqp9D2" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/ehjyd8.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hit-Girl #2",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/4Y74R119ZM#qkc9lTofEQmP" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/g8mmkw.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hit-Girl #3",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/JQ8Y9YSDBR#Ye1JlIIRE8uG" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/6mfxde.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hit-Girl #4",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/WT3XSQ2CKC#OYrpbfgIVqUs" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/in0qj9.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hit-Girl #5",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/77HWR9NJRM#dK8rNqnmtjJN" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/2865h3.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hit-Girl #6",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/048MRSB144#wAPzjfyP866W" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/yndx6f.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hit-Girl #7",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/DGHATNNHCC#nbMtLwGQvibs" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/n83g7r.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hit-Girl #8",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/R4B1H1YKP4#vEWfXznC25Xt" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/nd1muq.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hit-Girl #9",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/2EPVZ10QAM#8tvnkrul5hdx" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/n4b2xh.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hit-Girl #10",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/1RAAPGGJNM#cEsOIMqfNlrR" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/g3378o.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hit-Girl #11",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/7NJDQY7YV0#DwSJ2SXB5ceR" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/mxygr0.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hit-Girl #12",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/5WVMEJ3E54#oraIyynH0xgW" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/64idyd.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
];

const HITGIRL_2019_ISSUES: Issue[] = [
    {
        title: "Hit-Girl #1",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/WH3TT51T20#DVuTtuQ3Yus0" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/tqudgf.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hit-Girl #2",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/1V9GCFTFAG#oxvdtAqYosn4" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/5gchxr.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hit-Girl #3",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/R5PBHT9XKW#LPoZyxQ7rVKD" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/tggv1q.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hit-Girl #4",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/AWB4PWK60M#ULD6LiQxKftB" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/lmk7mr.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hit-Girl #5",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/VBG9ACZXJ4#ffmDxlkXmtPu" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/9k48s8.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hit-Girl #6",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/4GM6ME0G4M#ptxWQnBQHMxt" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/9eu2nj.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hit-Girl #7",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/3F3D0AW588#1n09d2jevIat" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/33ekpm.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hit-Girl #8",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/8H2EZ003MC#epyVoutGl98W" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/b1u9ac.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hit-Girl #9",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/NKE44KJXMM#SMQsSD7XpVSz" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/9p7vw8.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hit-Girl #10",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/F43SQ3ABC8#mwpFxdq3fBEa" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/hadfnl.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hit-Girl #11",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/194A1EZWNC#Bp7hRwwiU9Yd" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/0zcbst.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Hit-Girl #12",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/QA6Q44VMV4#mSZ3py28QM6M" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/pjd0aa.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
];

const INCOGNITO_ISSUES: Issue[] = [
    {
        title: "Incognito #1",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/ND7N3EK98M#iBj5OKUsExm9" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/32arv9.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Incognito #2",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/EV22JHC2EC#8pjCbYXhCZOt" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/tdn2pb.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Incognito #3",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/6W46RFXBGW#k6HBy2iZWZPA" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/p2j9i3.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Incognito #4",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/BJYHJNS3P8#VMabipluiAXo" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/o8px4y.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Incognito #5",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/NKPQVEVAK0#z2uD5XaRufni" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/whp6je.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
    {
        title: "Incognito #6",
        providers: [
            { type: "proton", label: "Proton Drive", url: "https://drive.proton.me/urls/J06P1K7R3G#qGEH1mJl1Kut" },
            { type: "catbox", label: "Catbox", url: "https://files.catbox.moe/qbytmu.cbz" },
            { type: "archive", label: "Archive" }
        ]
    },
];

const COMIC_DATA_BY_LETTER: Record<string, ComicSection[]> = {
    A: [
        {
            id: "h3-absolute-batman-2024",
            title: "Absolute Batman [2024]",
            link: { text: "Darkseid Club", url: "https://site.ds-club.net/" },
            issues: ABSOLUTE_BATMAN_ISSUES
        },
        // {
        //     id: "h3-absolute-wonder-woman-2024",
        //     title: "Absolute Wonder Woman [2024]",
        //     link: { text: "Darkseid Club", url: "https://site.ds-club.net/" },
        //     issues: ABSOLUTE_WONDER_WOMAN_ISSUES
        // }
    ],
    B: [
        {
            id: "h3-bite-club-2004",
            title: "Bite Club [2004]",
            link: { text: "Quadrinhos Nerds", url: "https://t.me/QuadrinhosNerds" },
            issues: BITE_CLUB_ISSUES
        }
    ],
    F: [
        {
            id: "h3-fatale-2012",
            title: "Fatale [2012]",
            link: { text: "Quadrinhos Nerds", url: "https://t.me/QuadrinhosNerds" },
            issues: FATALE_ISSUES
        }
    ],
    H: [
        {
            id: "h3-happy-2012",
            title: "Happy! [2012]",
            link: { text: "QuadrinhosBr", url: "https://t.me/QuadrinhosBrasilOFC" },
            issues: HAPPY_ISSUES
        },
        {
            id: "h3-hellblazer-1988",
            title: "Hellblazer [1988]",
            link: { text: "Diversos" },
            issues: HELLBLAZER_ISSUES
        },
        {
            id: "h3-hit-girl-2012",
            title: "Hit-Girl [2012]",
            link: { text: "Quadrinhos Nerds", url: "https://t.me/QuadrinhosNerds" },
            issues: HITGIRL_2012_ISSUES
        },
        {
            id: "h3-hit-girl-2018",
            title: "Hit-Girl [2018]",
            link: { text: "Quadrinhos Nerds", url: "https://t.me/QuadrinhosNerds" },
            issues: HITGIRL_2018_ISSUES
        },
        {
            id: "h3-hit-girl-2019",
            title: "Hit-Girl [2019]",
            link: { text: "Quadrinhos Nerds", url: "https://t.me/QuadrinhosNerds" },
            issues: HITGIRL_2019_ISSUES
        }
    ],
    I: [
        {
            id: "h3-incognito-2008",
            title: "Incognito [2008]",
            link: { text: "Quadrinhos Nerds", url: "https://t.me/QuadrinhosNerds" },
            issues: INCOGNITO_ISSUES
        }
    ]
};

const Alphabet: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const Indice: React.FC = () => {
    const { setHeaderComic } = useOutletContext<IndiceContext>();
    const [isTocExpanded, setIsTocExpanded] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(Alphabet.map(l => l.toLowerCase())));

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => {
            const next = new Set(prev);
            if (next.has(sectionId)) next.delete(sectionId);
            else next.add(sectionId);
            return next;
        });
    };

    useEffect(() => {
        setHeaderComic(null);
        window.scrollTo(0, 0);
    }, [setHeaderComic]);

    const renderComicSection = (section: ComicSection) => (
        <section key={section.id} className={`collapsible-section ${expandedSections.has(section.id) ? "is-expanded" : ""}`}>
            <button className="section-header-btn h3-toggle" onClick={() => toggleSection(section.id)}>
                <h3>
                    {section.title}
                    {section.link && (
                        <> by {section.link.url ? (
                            <a href={section.link.url} rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                {section.link.text}
                            </a>
                        ) : (
                            <span>{section.link.text}</span>
                        )}</>
                    )}
                </h3>
                <svg className="section-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>
            <div className="collapsible-content">
                <ul>
                    {section.issues.map((issue, idx) => (
                        <IssueItem key={idx} {...issue} />
                    ))}
                </ul>
            </div>
        </section>
    );

    return (
        <div className="indice-page-layout">
            <div className="indice-page-wrapper">
                <main className="indice-main-container">
                    <article className="indice-content">
                        <section id="introducao">
                            <h1>Índice de Arquivos</h1>
                            <p>
                                Bem-vindo ao índice oficial do pInk. Aqui você encontrará uma organização detalhada
                                de todo o nosso acervo, possibilitando uma navegação mais direta e eficiente.
                            </p>
                        </section>

                        {Alphabet.map(letter => {
                            const id = letter.toLowerCase();
                            const sections = COMIC_DATA_BY_LETTER[letter];
                            const hasContent = sections && sections.length > 0;

                            return (
                                <section key={id} id={id} className={`collapsible-section ${expandedSections.has(id) ? "is-expanded" : ""}`}>
                                    <button className="section-header-btn" onClick={() => toggleSection(id)}>
                                        <h2>{letter}</h2>
                                        <svg className="section-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M6 9l6 6 6-6" />
                                        </svg>
                                    </button>
                                    <div className="collapsible-content">
                                        {hasContent ? (
                                            sections.map(section => renderComicSection(section))
                                        ) : (
                                            <p className="placeholder-text">Em breve...</p>
                                        )}
                                    </div>
                                </section>
                            );
                        })}
                    </article>
                </main>

                <aside className="indice-toc-sidebar">
                    <div className={`indice-toc-box ${isTocExpanded ? "is-expanded" : ""}`}>
                        <button
                            className="toc-toggle-btn"
                            onClick={() => setIsTocExpanded(!isTocExpanded)}
                            aria-expanded={isTocExpanded}
                        >
                            <h3>Neste Artigo</h3>
                            <svg className={`chevron-icon ${isTocExpanded ? "rotate" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        </button>
                        <ul className="toc-list alphabet-toc">
                            {Alphabet.map(letter => (
                                <li key={letter}>
                                    <a href={`#${letter.toLowerCase()}`} onClick={() => setIsTocExpanded(false)}>{letter}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div >
        </div >
    );
};

export default Indice;
