import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const List = ({ type }) => {
    const navigate = useNavigate();
    const {
        transactions,
        groups,
        finalizeGroup,
        isGroupActive,
        groupName,
        deleteGroup,
        deleteTransaction,
        editGroup,
        editingGroupId
    } = useContext(GlobalContext);

    const activeTotal = (transactions || []).reduce((acc, item) => (acc += item.amount), 0).toFixed(2);

    const downloadPDF = (group) => {
        try {
            const doc = new jsPDF();

            doc.setFontSize(20);
            doc.setTextColor(79, 70, 229);
            doc.text("ASHUTRACKS - EXPENSE REPORT", 14, 20);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Group: ${group.name}`, 14, 30);
            doc.text(`Date Created: ${group.date}`, 14, 35); // Group Creation Date

            // Updated Table: Added Date column in PDF
            const tableRows = group.items.map(item => [
                item.date || group.date, // Showing item date or fallback to group date
                item.time,
                item.text,
                item.category || "Others",
                `Rs. ${item.amount}`
            ]);

            autoTable(doc, {
                head: [['Date', 'Time', 'Item', 'Category', 'Price']],
                body: tableRows,
                startY: 45,
                headStyles: { fillColor: [79, 70, 229] },
            });

            const lastY = doc.lastAutoTable.finalY;
            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.text(`Grand Total: Rs. ${group.total}`, 14, lastY + 15);

            doc.save(`${group.name}_Bill.pdf`);
        } catch (error) {
            console.error("PDF Error:", error);
            alert("Error generating PDF.");
        }
    };

    const handleResume = (group) => {
        editGroup(group);
        navigate("/");
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    };

    return (
        <div className="mt-8 space-y-10 animate-fade-in">

            {/* --- LIVE SECTION --- */}
            {type === "live" && isGroupActive && (
                <section className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-white dark:border-slate-800 relative">
                    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-6 flex justify-between items-center">
                        <h2 className="text-white font-bold flex items-center gap-3">
                            <span className="p-2 bg-white/20 rounded-xl text-lg">📁</span> {groupName}
                        </h2>
                        <span className="bg-white/20 text-white text-[10px] px-3 py-1.5 rounded-full font-black animate-pulse uppercase tracking-widest border border-white/20">
                            {editingGroupId ? "RE-EDITING" : "LIVE BATCH"}
                        </span>
                    </div>

                    <ul className="px-8 py-4 divide-y divide-slate-100 dark:divide-slate-800 max-h-[450px] overflow-y-auto custom-scrollbar">
                        {transactions.length === 0 ? (
                            <li className="py-16 text-center text-slate-400 text-sm font-medium italic">No entries yet.</li>
                        ) : (
                            transactions.map(t => (
                                <li key={t.id} className="flex justify-between items-center py-5 group">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-black bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded uppercase text-slate-400">
                                                {t.category || 'Others'}
                                            </span>
                                            <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">{t.text}</span>
                                        </div>
                                        {/* FIXED: Showing Date and Time both */}
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                            {t.date ? `${t.date} | ` : ""}{t.time}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-5">
                                        <span className={`font-mono font-black text-xl ${t.amount < 0 ? "text-rose-500" : "text-emerald-500"}`}>
                                            {t.amount < 0 ? "" : "+"}{t.amount}
                                        </span>
                                        <button onClick={() => deleteTransaction(t.id)} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-rose-500 transition-all flex items-center justify-center">✕</button>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>

                    <div className="p-8 bg-slate-50/50 dark:bg-slate-950/30 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-slate-400 font-black text-[11px] uppercase tracking-[0.3em]">Total Balance</span>
                            <span className="text-4xl font-black text-slate-900 dark:text-white font-mono">₹{activeTotal}</span>
                        </div>
                        {transactions.length > 0 && (
                            <button onClick={finalizeGroup} className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black shadow-xl hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs">
                                {editingGroupId ? "Update & Save Changes" : "Save & Finalize Group"}
                            </button>
                        )}
                    </div>
                </section>
            )}

            {/* --- HISTORY SECTION --- */}
            {type === "history" && (
                <section className="space-y-8">
                    <div className="flex items-center gap-6 px-2">
                        <h2 className="text-slate-400 dark:text-slate-500 font-black text-[11px] uppercase tracking-[0.4em] whitespace-nowrap">Saved Archives</h2>
                        <div className="h-[1px] w-full bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-800"></div>
                    </div>

                    {groups.length === 0 ? (
                        <div className="py-24 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem]">
                            <p className="text-slate-300 dark:text-slate-700 font-black uppercase text-xs">Your vault is empty</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {groups.map(group => (
                                <div key={group.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 group overflow-hidden">
                                    <div className="p-5 border-b border-slate-50 dark:border-slate-800/50 flex justify-between items-center bg-slate-50/30 dark:bg-slate-950/20">
                                        <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[140px] flex items-center gap-2 text-sm uppercase tracking-tight">
                                            <span className="text-lg">📁</span> {group.name}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => downloadPDF(group)} className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm active:scale-90 cursor-pointer">PDF 📥</button>
                                            <button onClick={() => handleResume(group)} className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm active:scale-90 cursor-pointer">Resume</button>
                                            <button onClick={() => window.confirm("Delete?") && deleteGroup(group.id)} className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 text-slate-500 hover:text-rose-500 transition-all flex items-center justify-center border border-slate-50 dark:border-slate-700 cursor-pointer">✕</button>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        {/* Shows Date of Group Creation */}
                                        <div className="mb-4">
                                            <span className="text-[9px] font-black text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full uppercase">
                                                Created on: {group.date}
                                            </span>
                                        </div>

                                        <ul className="space-y-3 mb-6">
                                            {group.items.slice(0, 3).map(item => (
                                                <li key={item.id} className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-bold tracking-tight bg-slate-50/50 dark:bg-slate-800/30 px-3 py-2 rounded-lg">
                                                    <span className="flex flex-col">
                                                        <span className="flex items-center gap-1">
                                                            <span className="opacity-50 text-[9px]">[{item.category || 'Others'}]</span>
                                                            {item.text}
                                                        </span>
                                                        <span className="text-[8px] opacity-60">{item.date} | {item.time}</span>
                                                    </span>
                                                    <span className={item.amount < 0 ? "text-rose-400" : "text-emerald-400"}>₹{item.amount}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="flex justify-between items-end pt-4 border-t border-slate-50 dark:border-slate-800">
                                            <div className="space-y-1">
                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Net Balance</p>
                                                <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">₹{group.total}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};