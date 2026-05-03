import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";

export const List = () => {
    const {
        transactions,
        groups,
        finalizeGroup,
        isGroupActive,
        setIsGroupActive,
        groupName,
        setGroupName,
        deleteGroup,
        deleteTransaction,
        editGroup, // नया फंक्शन context से
        editingGroupId // स्टेट context से
    } = useContext(GlobalContext);

    const activeTotal = (transactions || []).reduce((acc, item) => (acc += item.amount), 0).toFixed(2);

    const handleFinalize = () => {
        finalizeGroup(); // अब नाम भेजने की ज़रूरत नहीं, context खुद संभाल लेगा
    };

    return (
        <div className="mt-8 space-y-10 animate-fade-in">
            {isGroupActive && (
                <section className="bg-white rounded-3xl overflow-hidden shadow-1xl shadow-indigo-100 border border-indigo-50 transition-all duration-500 animate-zoom-in relative">
                    {/* Header */}
                    <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center bg-gradient-to-r from-indigo-600 to-violet-600">
                        <h2 className="text-white font-bold tracking-tight flex items-center gap-2">
                            <span className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md">📁</span>
                            {groupName}
                        </h2>
                        {/* अगर एडिट कर रहे हैं तो RE-EDITING दिखाएँ वरना LIVE */}
                        <span className="bg-white/20 text-white text-[10px] px-2.5 py-1 rounded-md font-black animate-pulse tracking-widest">
                            {editingGroupId ? "RE-EDITING" : "LIVE"}
                        </span>
                    </div>

                    {/* Transaction List */}
                    <ul className="px-6 py-2 divide-y divide-gray-100 max-h-[400px] overflow-y-auto custom-scrollbar">
                        {transactions.length === 0 ? (
                            <li className="py-12 text-center text-gray-400 text-sm font-medium">No entries yet. Start adding!</li>
                        ) : (
                            transactions.map(t => (
                                <li key={t.id} className="flex justify-between items-center py-4 group transition-all">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-800 tracking-tight">{t.text}</span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{t.time}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`font-mono font-black text-lg ${t.amount < 0 ? "text-red-500" : "text-emerald-500"}`}>
                                            {t.amount < 0 ? "" : "+"}{t.amount}
                                        </span>
                                        <button
                                            onClick={() => deleteTransaction(t.id)}
                                            className="bg-white text-slate-300 hover:text-red-500 hover:shadow-md w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer"
                                            title="Remove item"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>

                    {/* Batch Summary & Finalize Action */}
                    <div className="p-6 bg-slate-50/50 border-t border-slate-100 backdrop-blur-sm">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-slate-400 font-black text-[11px] uppercase tracking-[0.2em]">Batch Total</span>
                            <span className="text-3xl font-black text-slate-900 font-mono tracking-tighter">₹{activeTotal}</span>
                        </div>

                        {transactions.length > 0 && (
                            <button
                                onClick={handleFinalize}
                                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer"
                            >
                                {editingGroupId ? "UPDATE & SAVE CHANGES" : "SAVE & FINALIZE GROUP"}
                            </button>
                        )}
                    </div>
                </section>
            )}

            {/* History Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-4 px-1">
                    <h2 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] whitespace-nowrap">Saved History</h2>
                    <div className="h-[1px] w-full bg-slate-100"></div>
                </div>

                {groups.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                        <p className="text-slate-300 font-bold uppercase text-xs tracking-widest">No history available</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-in-bottom">
                        {groups.map(group => (
                            <div key={group.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
                                <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                    <span className="font-bold text-slate-700 truncate max-w-[150px] flex items-center gap-2">
                                        <span className="text-sm">📁</span> {group.name}
                                    </span>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2">
                                        {/* RESUME/EDIT BUTTON */}
                                        <button
                                            onClick={() => editGroup(group)}
                                            className="bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase transition-all cursor-pointer shadow-sm"
                                        >
                                            Resume
                                        </button>
                                        <button
                                            onClick={() => window.confirm("Delete this group history?") && deleteGroup(group.id)}
                                            className="bg-white text-slate-300 hover:text-red-500 hover:shadow-md w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <ul className="space-y-2 mb-4">
                                        {group.items.slice(0, 3).map(item => (
                                            <li key={item.id} className="flex justify-between text-[11px] text-slate-700 font-medium italic">
                                                <span>{item.text}</span>
                                                <span className={item.amount < 0 ? "text-red-400" : "text-emerald-400"}>₹{item.amount}</span>
                                            </li>
                                        ))}
                                        {group.items.length > 3 && (
                                            <li className="text-[10px] text-slate-300 font-bold text-center">+{group.items.length - 3} more items</li>
                                        )}
                                    </ul>

                                    <div className="flex justify-between items-end pt-2">
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter leading-none">Total Value</p>
                                            <p className="text-2xl font-black text-slate-900 font-mono tracking-tighter">₹{group.total}</p>
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">{group.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};