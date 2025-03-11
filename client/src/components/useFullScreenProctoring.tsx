import { useEffect } from "react";

export default function useFullscreenProctoring() {
    useEffect(() => {
        const checkFullscreen = () => {
            if (!document.fullscreenElement) {
                alert("You must stay in fullscreen mode!");
            }
        };

        document.addEventListener("fullscreenchange", checkFullscreen);

        return () => {
            document.removeEventListener("fullscreenchange", checkFullscreen);
        };
    }, []);
}
