import { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";

export const AddForm = () => {
    // 1. Local States: Form inputs
    const [text, setText] = useState("");
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState("Veg"); // Default category set to Veg

    // 2. Global Context: App-wide data and functions
    const { addTransaction, isGroupActive, setIsGroupActive, groupName, setGroupName } = useContext(GlobalContext);

    // 3. Form Handler: Runs on "Add to List" click
    const handleAdd = (e) => {
        e.preventDefault();
        if (!text || !amount) return; // Stop if empty

        addTransaction({
            id: Date.now(), // Unique ID
            text,
            amount: +amount, // String to Number
            category, // Store the selected category
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        // Reset inputs after adding
        setText("");
        setAmount('');
        setCategory("Veg"); // Reset category to default
    };

    // 4. Phase 1: Create Group View (Shows first)
    if (!isGroupActive) {
        return (
            <div className="mt-8 animate-zoom-in">
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2.5rem] shadow-2xl border-4 border-white/20 relative overflow-hidden">
                    <h3 className="text-white font-black text-xl mb-6 relative z-10 flex items-center gap-3">
                        <span className="bg-white/20 p-2 rounded-xl">📁</span> Create New Group
                    </h3>
                    <div className="space-y-4 relative z-10">
                        <input
                            className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl outline-none text-white placeholder-indigo-100 font-medium"
                            placeholder="Group Name (e.g. Market)"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                        <button
                            onClick={() => groupName && setIsGroupActive(true)}
                            className="w-full bg-white text-indigo-700 py-4 rounded-2xl font-black uppercase text-xs cursor-pointer"
                        >
                            Start Tracking
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 5. Phase 2: Add Expenses View (Shows when group is active)
    return (
        <form
            onSubmit={handleAdd}
            className="mt-8 bg-white/90 dark:bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(79,70,229,0.1)] dark:shadow-none border border-slate-100 dark:border-slate-800/50 relative animate-fade-in"
        >
            <header className="flex justify-between items-start mb-8 relative">
                <div className="space-y-1">
                    <h3 className="font-black text-slate-800 dark:text-white text-2xl italic tracking-tight">Add Expense</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                        <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        Active: {groupName}
                    </p>
                </div>
            </header>

            <div className="space-y-6 relative">
                {/* Item Name Input */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Item Details</label>
                    <input
                        type="text"
                        placeholder="What did you buy?"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950/50 ring-1 ring-slate-200 dark:ring-slate-800/60 focus:ring-2 focus:ring-indigo-500 p-4 rounded-2xl outline-none font-bold dark:text-white"
                    />
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price</label>
                    <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-indigo-500 text-xl italic">₹</span>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950/50 ring-1 ring-slate-200 dark:ring-slate-800/60 focus:ring-2 focus:ring-indigo-500 p-4 pl-12 rounded-2xl outline-none font-mono font-black text-2xl dark:text-white"
                        />
                    </div>
                </div>

                {/* Category Selection Dropdown */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950/50 ring-1 ring-slate-200 dark:ring-slate-800/60 focus:ring-2 focus:ring-indigo-500 p-4 rounded-2xl outline-none font-bold text-slate-700 dark:text-white cursor-pointer"
                    >
                        <option value="Veg">🥦 Veg</option>
                        <option value="Non-Veg">🍗 Non-Veg</option>
                        <option value="Grocery">🛒 Grocery</option>
                        <option value="Others">📦 Others</option>
                    </select>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black shadow-xl hover:-translate-y-1 active:scale-95 transition-all cursor-pointer mt-4 uppercase tracking-widest text-xs"
                >
                    Add to List
                </button>
            </div>
        </form>
    );
};