import { useContext, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

export const Navbar = () => {
    // 1. Theme Logic
    const themeContext = useContext(ThemeContext);
    const theme = themeContext?.theme || "light";
    const toggleTheme = themeContext?.toggleTheme || (() => { });

    // 2. Menu State
    const [isOpen, setIsOpen] = useState(false);

    // 3. Links Data: Added Analytics link here
    const navLinks = [
        { path: "/", label: "Home Dashboard", icon: "🏠", desc: "Manage current batch" },
        { path: "/history", label: "History Vault", icon: "📜", desc: "Access saved records" },
        { path: "/analytics", label: "Real-time Stats", icon: "📊", desc: "Category-wise analysis" } // New Link
    ];

    return (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[94%] max-w-2xl z-50">
            {/* --- Main Bar Section --- */}
            <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border border-white dark:border-slate-800 rounded-[2rem] shadow-2xl shadow-indigo-100/50 dark:shadow-none px-6 h-16 flex justify-between items-center transition-all duration-300">

                {/* Brand Logo */}
                <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className="font-black text-xl tracking-tighter text-slate-900 dark:text-white italic"
                >
                    ASHU<span className="text-indigo-600">TRACKS</span>
                </Link>

                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    >
                        {theme === "dark" ? "☀️" : "🌙"}
                    </button>

                    {/* Hamburger Menu */}
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className={`p-2.5 rounded-2xl transition-all duration-300 ${isOpen ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''} cursor-pointer`}
                    >
                        <div className="flex flex-col gap-1.5 items-end pointer-events-none">
                            <div className={`h-0.5 bg-indigo-600 transition-all duration-300 ${isOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`} />
                            <div className={`h-0.5 bg-indigo-600 transition-all duration-300 ${isOpen ? 'opacity-0' : 'w-4'}`} />
                            <div className={`h-0.5 bg-indigo-600 transition-all duration-300 ${isOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-5'}`} />
                        </div>
                    </button>
                </div>
            </div>

            {/* --- Dropdown Menu List --- */}
            {isOpen && (
                <div className="mt-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-[2.5rem] p-4 shadow-[0_20px_50px_rgba(79,70,229,0.15)] animate-zoom-in overflow-hidden">
                    <div className="grid gap-2">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) => `
                                    group flex items-center gap-4 p-4 rounded-[1.8rem] transition-all duration-300
                                    ${isActive
                                        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none"
                                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300"
                                    }
                                `}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-colors ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
                                    {link.icon}
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="font-black text-[12px] uppercase tracking-widest leading-none mb-1">
                                        {link.label}
                                    </span>
                                    <span className="text-[10px] font-medium opacity-60">
                                        {link.desc}
                                    </span>
                                </div>
                            </NavLink>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};