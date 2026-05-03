import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalProvider } from "./context/GlobalContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AddForm } from "./components/AddForm";
import { List } from "./components/List";
import { Navbar } from "./components/Navbar";
import { Statistics } from "./components/Statistics";

function App() {
  return (
    // 1. Providers: Wrap app with Theme and Data contexts
    <ThemeProvider>
      <GlobalProvider>
        {/* 2. Routing: Enable navigation between different pages */}
        <Router>
          {/* Main Wrapper: Handles background colors and transitions */}
          <div className="min-h-screen flex flex-col overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 transition-colors duration-500">

            <Navbar />

            {/* Main Content Area: Centered container */}
            <div className="flex-1 max-w-2xl mx-auto px-4 mt-28 w-full">

              {/* Branding Header Section */}
              <header className="mb-12 text-center animate-fade-in">
                <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic">
                  ASHU<span className="text-indigo-600 drop-shadow-[0_0_15px_rgba(79,70,229,0.2)]">TRACKS</span>
                </h1>
                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black mt-3 uppercase tracking-[0.4em]">
                  Smart Expense Manager • 2026
                </p>
              </header>

              {/* 3. Page Routes: Switch content based on URL path */}
              <main className="pb-20">
                <Routes>
                  {/* Home Page: Shows entry form and live transactions */}
                  <Route path="/" element={
                    <div className="space-y-12 animate-fade-in">
                      <AddForm />
                      <List type="live" />
                    </div>
                  } />

                  {/* History Page: Shows all saved archive cards */}
                  <Route path="/history" element={
                    <div className="animate-fade-in">
                      <List type="history" />
                    </div>
                  } />

                  {/* Analytics Page: Shows category-wise statistics */}
                  <Route path="/analytics" element={
                    <div className="animate-fade-in">
                      <Statistics />
                    </div>
                  } />
                </Routes>
              </main>
            </div>

            {/* 4. Footer: Simple credits at the bottom */}
            <footer className="w-full py-12 border-t border-slate-200/50 dark:border-slate-800/50">
              <p className="text-center text-[10px] text-slate-400 dark:text-slate-600 font-black uppercase tracking-[0.6em]">
                Created by Ashraf Ali
              </p>
            </footer>

          </div>
        </Router>
      </GlobalProvider>
    </ThemeProvider>
  );
}

export default App;