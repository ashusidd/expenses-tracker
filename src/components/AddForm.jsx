import { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";

export const AddForm = () => {
    const [text, setText] = useState("");
    const [amount, setAmount] = useState('');
    const { addTransaction, isGroupActive, setIsGroupActive, groupName, setGroupName } = useContext(GlobalContext);

    const handleAdd = (e) => {
        e.preventDefault();
        if (!text || !amount) return;
        addTransaction({
            id: Date.now(),
            text,
            amount: +amount,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        setText(""); setAmount('');
    };

    // Phase 1: Setup Group Name
    if (!isGroupActive) {
        return (
            <div className="mt-8 animate-zoom-in">
                <div className="bg-indigo-600 p-6 rounded-3xl shadow-xl border-4 border-indigo-400/30">
                    <h3 className="text-white font-black text-lg mb-4 flex items-center gap-3">
                        <span className="bg-white text-indigo-600 w-8 h-8 flex items-center justify-center rounded-xl shadow-lg">📁</span>
                        Start New Group
                    </h3>

                    <div className="space-y-4">
                        <input
                            className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl outline-none text-white placeholder-indigo-100"
                            placeholder="Group Name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                        <button
                            onClick={() => groupName && setIsGroupActive(true)}
                            className="w-full bg-white text-indigo-700 py-4 rounded-2xl font-black shadow-xl uppercase tracking-wider text-sm cursor-pointer"
                        >
                            Start New Batch
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Phase 2: Add Expenses
    return (
        <form
            onSubmit={handleAdd}
            className="mt-8 bg-white p-6 rounded-3xl shadow-2xl relative"
        >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-slate-50 rounded-full blur-3xl opacity-50" />

            <header className="flex justify-between items-center mb-6 relative">
                <div className="space-y-1">
                    <h3 className="font-black text-slate-800 text-xl tracking-tight">Add Expense</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Recording in {groupName}
                    </p>
                </div>
                <div className="bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">Current Batch</span>
                </div>
            </header>

            <div className="space-y-5 relative">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Item Description</label>
                    <input
                        type="text"
                        placeholder="Things Name"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 p-4 rounded-2xl outline-none transition-all font-medium text-slate-700"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                        <input
                            type="number"
                            placeholder="price"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 p-4 pl-8 rounded-2xl outline-none transition-all font-mono font-bold text-lg text-slate-700"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-lg shadow-slate-200 hover:bg-black hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer mt-2"
                >
                    ADD TO CURRENT LIST
                </button>
            </div>
        </form>
    );
};