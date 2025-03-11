import { useEffect, useState } from "react";

export default function useProctoring() {
    const [isTabActive, setIsTabActive] = useState(true);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsTabActive(false);
                alert("Tab switching is not allowed!");
            } else {
                setIsTabActive(true);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    return isTabActive;
}
