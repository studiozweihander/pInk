import React from "react";
import "../../styles/admin/SeederToasts.css";
import { Toast } from "./types";

interface SeederToastsProps {
    toasts: Toast[];
}

const SeederToasts: React.FC<SeederToastsProps> = ({ toasts }) => (
    <div className="seeder-toast-container" aria-live="polite">
        {toasts.map((toast) => (
            <div key={toast.id} className={`seeder-toast is-${toast.type}`}>
                {toast.message}
            </div>
        ))}
    </div>
);

export default SeederToasts;
