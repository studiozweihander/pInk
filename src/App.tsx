import React, { useState } from "react";
import { Routes, Route, Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ASCIIArt from "./components/ASCIIArt";
import Home from "./pages/Home";
import ComicPage from "./pages/Comic";
import Indice from "./pages/Indice";
import "./styles/main.css";

const Layout: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [headerComic, setHeaderComic] = useState<any | null>(null);
    const location = useLocation();
    const navigate = useNavigate();

    const isHome = location.pathname === "/" || location.pathname === "" || location.pathname === "/index.html";
    const isIndice = location.pathname === "/indice";
    const view = isHome ? "home" : isIndice ? "indice" : "issues";

    return (
        <div className="main-wrapper">
            <div className={`landing-section ${view === "indice" ? "auto-height" : ""}`}>
                <Header
                    view={view}
                    currentComic={headerComic}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />

                <Outlet context={{ searchTerm, setHeaderComic }} />
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
                <Route path=":slug" element={<ComicPage />} />
            </Route>
        </Routes>
    );
};

export default App;
