import { useEffect } from "react";

export default function useTabRestriction() {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                (event.ctrlKey || event.metaKey) &&
                (event.key === "t" || event.key === "n" || event.key === "Tab")
            ) {
                event.preventDefault();
                alert("Opening new tabs is not allowed!");
            }
        };

        const handleContextMenu = (event: MouseEvent) => {
            event.preventDefault();
        };

        window.addEventListener("keydown", handleKeyDown);
        document.addEventListener("contextmenu", handleContextMenu);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("contextmenu", handleContextMenu);
        };
    }, []);
}
