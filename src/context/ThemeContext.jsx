import { createContext, useState, useEffect } from "react";

// Create context to manage app theme (Dark/Light)
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // 1. Initial State: Get saved theme from LocalStorage or default to "dark"
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

    // 2. Theme Applier: Runs every time the theme changes
    useEffect(() => {
        const root = window.document.documentElement; // Target the <html> tag

        if (theme === "dark") {
            root.classList.add("dark"); // Add "dark" class for Tailwind CSS
        } else {
            root.classList.remove("dark"); // Remove "dark" class for light mode
        }

        // Save the current theme choice to LocalStorage
        localStorage.setItem("theme", theme);
    }, [theme]);

    // 3. Toggle Function: Switch between dark and light
    const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};