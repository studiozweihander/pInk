import React, { useState } from "react";
import { Routes, Route, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Comic } from "./api";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ASCIIArt from "./components/ASCIIArt";
import Home from "./pages/Home";
import ComicPage from "./pages/Comic";
import Indice from "./pages/Indice";
import Admin from "./pages/Admin";
import "./styles/main.css";

const Layout: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [headerComic, setHeaderComic] = useState<Comic | null>(null);
    const [headerAction, setHeaderAction] = useState<React.ReactNode | null>(null);
    const location = useLocation();
    const navigate = useNavigate();

    const isHome = location.pathname === "/" || location.pathname === "" || location.pathname === "/index.html";
    const isIndice = location.pathname === "/indice";
    const isAdmin = location.pathname.startsWith("/admin");
    const view = isHome ? "home" : isIndice ? "indice" : isAdmin ? "admin" : "issues";

    return (
        <div className="main-wrapper">
            <div className={`landing-section ${view === "indice" || view === "admin" ? "auto-height" : ""}`}>
                <Header
                    view={view}
                    currentComic={headerComic}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    actionSlot={headerAction}
                />

                <Outlet context={{ searchTerm, setHeaderComic, setHeaderAction }} />
            </div>
            <Footer />
            <ASCIIArt />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="indice" element={<Indice />} />
                <Route path="admin" element={<Admin />} />
                <Route path=":slug" element={<ComicPage />} />
            </Route>
        </Routes>
    );
};

export default App;
