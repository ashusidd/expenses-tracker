import { GlobalProvider } from "./context/GlobalContext";
import { AddForm } from "./components/AddForm";
import { List } from "./components/List";

function App() {
  return (
    <GlobalProvider>
      <div className="min-h-screen overflow-x-hidden bg-slate-950 bg-linear-to-b from-slate-900 via-indigo-950 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">

          {/* Header Section */}
          <header className="mb-12 text-center animate-fade-in">
            <h1 className="text-4xl font-black text-red-900 tracking-tighter italic">
              ASHU<span className="text-indigo-600">TRACKS</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-black mt-2 uppercase tracking-[0.3em]">
              Smart Expense Manager • 2026
            </p>
          </header>

          <main className="space-y-10">
            <AddForm />
            <List />
          </main>

          {/* Footer */}
          <footer className="mt-20 text-center text-[9px] text-slate-300 font-black uppercase tracking-[0.5em] pb-10">
            Created by Ashraf Ali
          </footer>
        </div>
      </div>
    </GlobalProvider >
  );
}

export default App;