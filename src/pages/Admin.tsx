import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import AdminLoginModal from "../components/admin/AdminLoginModal";
import ComicSeeder from "../components/admin/ComicSeeder";
import IssueSeeder from "../components/admin/IssueSeeder";
import { supabase } from "../utils/supabaseClient";
import "../styles/admin/Admin.css";

interface AdminContext {
    setHeaderAction: (action: React.ReactNode | null) => void;
}

const Admin: React.FC = () => {
    const navigate = useNavigate();
    const { setHeaderAction } = useOutletContext<AdminContext>();
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (!isMounted) return;
            if (error) {
                console.error(error);
            }
            setSession(data.session ?? null);
            setIsAuthChecked(true);
            setIsLoading(false);
        };

        loadSession();

        const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            setSession(nextSession);
            setIsAuthChecked(true);
        });

        return () => {
            isMounted = false;
            data.subscription.unsubscribe();
            void supabase.auth.signOut();
        };
    }, []);

    const handleLogin = async (email: string, password: string) => {
        setIsLoading(true);
        setLoginError(null);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            setLoginError("Email ou senha inválidos");
        }
        setIsLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const handleCloseLogin = () => {
        navigate("/");
    };

    const isAdmin = session?.user?.app_metadata?.role === "admin";

    useEffect(() => {
        if (!session) return;
        if (isAdmin) return;
        setLoginError("Conta sem permissão administrativa");
        void supabase.auth.signOut();
    }, [session, isAdmin]);

    useEffect(() => {
        if (!isAdmin) {
            setHeaderAction(null);
            return;
        }

        setHeaderAction(
            <button className="admin-action-logout" onClick={handleLogout} type="button">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path d="M15 11H8v2h7v4l6-5-6-5z"></path>
                    <path d="M5 21h7v-2H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2"></path>
                </svg>
                Sair
            </button>
        );

        return () => {
            setHeaderAction(null);
        };
    }, [isAdmin, setHeaderAction]);

    return (
        <>
            <main>
                <div className="container admin-layout-container">
                    <div className={`admin-layout-page ${isAdmin ? "" : "is-locked"}`}>
                        <ComicSeeder />
                    </div>
                </div>

                <div className="container admin-layout-container">
                    <div className={`admin-layout-page ${isAdmin ? "" : "is-locked"}`}>
                        <IssueSeeder />
                    </div>
                </div>
            </main>

            <AdminLoginModal
                isOpen={!isAdmin && isAuthChecked}
                isLoading={isLoading}
                errorMessage={loginError}
                onSubmit={handleLogin}
                onClose={handleCloseLogin}
            />
        </>
    );
};

export default Admin;
