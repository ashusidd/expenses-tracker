import React, { useContext, useEffect } from 'react';
import { GlobalContext } from "../context/GlobalContext";
import {
    Area, XAxis, ResponsiveContainer,
    Bar, ComposedChart, Cell, LabelList
} from 'recharts';

export const Statistics = () => {
    const { transactions, groups, groupName } = useContext(GlobalContext);

    // This block hides the specific Recharts width/height warning in the console
    useEffect(() => {
        const originalError = console.error;
        console.error = (...args) => {
            if (args[0]?.includes?.('The width(-1) and height(-1) of chart should be greater than 0')) return;
            originalError(...args);
        };
        return () => { console.error = originalError; };
    }, []);

    // Configuration for category icons, colors, and text styles
    const catConfig = {
        Veg: { icon: '🥦', color: '#10b981', text: 'text-emerald-500' },
        'Non-Veg': { icon: '🍗', color: '#f43f5e', text: 'text-rose-500' },
        Grocery: { icon: '🛒', color: '#f59e0b', text: 'text-amber-500' },
        Others: { icon: '📦', color: '#6366f1', text: 'text-indigo-500' }
    };

    // Helper function to calculate totals for each category for the charts
    const formatChartData = (items) => {
        const statsMap = (items || []).reduce((acc, item) => {
            const cat = item.category || 'Others';
            acc[cat] = (acc[cat] || 0) + Math.abs(item.amount);
            return acc;
        }, {});

        return Object.keys(catConfig).map(cat => ({
            name: cat,
            value: statsMap[cat] || 0,
            color: catConfig[cat].color
        }));
    };

    // Calculate data for the Live batch
    const liveChartData = formatChartData(transactions);
    const liveTotal = liveChartData.reduce((acc, curr) => acc + curr.value, 0);

    // Calculate data for all saved batches combined (Grand Total)
    const allItems = (groups || []).flatMap(g => g.items || []);
    const overallChartData = formatChartData(allItems);
    const overallTotal = (groups || []).reduce((acc, g) => acc + (parseFloat(g.total) || 0), 0);

    // Reusable Chart Component with Glow and Animation
    const CoolChart = ({ data, height = 200 }) => (
        <div style={{ height: height, width: '100%', overflow: 'hidden' }}>
            <ResponsiveContainer width="99.9%" height="100%">
                <ComposedChart data={data} margin={{ top: 25, right: 10, left: 10, bottom: 5 }}>
                    {/* SVG Gradients for the shiny bar effect */}
                    <defs>
                        {data.map((entry, index) => (
                            <linearGradient key={`grad-${index}`} id={`glow-${index}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={entry.color} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={entry.color} stopOpacity={0.2} />
                            </linearGradient>
                        ))}
                    </defs>

                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '900' }}
                    />

                    <Area type="monotone" dataKey="value" fill="#6366f1" stroke="none" fillOpacity={0.05} />

                    <Bar
                        dataKey="value"
                        radius={[12, 12, 12, 12]}
                        barSize={35}
                        isAnimationActive={true}
                        animationDuration={1500}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={`url(#glow-${index})`} // Applying the gradient
                                stroke={entry.color}
                                strokeWidth={1}
                            />
                        ))}
                        {/* Static value labels on top of the bars */}
                        <LabelList
                            dataKey="value"
                            position="top"
                            fill="#94a3b8"
                            fontSize={10}
                            fontWeight="900"
                            formatter={(val) => val > 0 ? `₹${val}` : ''}
                        />
                    </Bar>
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );

    return (
        <section className="space-y-16 pb-28 animate-fade-in px-2">
            {/* Section 1: Top card showing Live/Active expenses */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-4">
                    <h2 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live: {groupName || 'Active Batch'}
                    </h2>
                    <span className="text-xl font-black dark:text-white font-mono italic">₹{liveTotal.toFixed(0)}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-4 shadow-2xl border border-slate-100 dark:border-slate-800">
                    <CoolChart data={liveChartData} height={250} />
                </div>
            </div>

            {/* Section 2: Cards for every single saved group/batch */}
            <div className="space-y-8">
                <h2 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] px-4">History Breakdown</h2>
                {(groups || []).length === 0 ? (
                    <p className="text-center text-slate-400 text-xs italic py-10">No data in vault yet.</p>
                ) : (
                    groups.map(group => (
                        <div key={group.id} className="space-y-4">
                            <div className="flex justify-between items-center px-6">
                                <span className="font-black text-[11px] uppercase text-indigo-600 tracking-tighter italic">📁 {group.name}</span>
                                <span className="font-mono font-black text-slate-800 dark:text-slate-200">₹{group.total}</span>
                            </div>
                            <div className="bg-white/40 dark:bg-slate-900/40 rounded-[2.5rem] p-4 border border-slate-100 dark:border-slate-800/50">
                                <CoolChart data={formatChartData(group.items)} height={180} />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Section 3: Final footer card with lifetime total stats */}
            <div className="bg-slate-950 rounded-[3.5rem] p-8 text-white relative overflow-hidden border border-indigo-500/20">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]"></div>
                <div className="text-center mb-8 relative z-10">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Lifetime Total</p>
                    <h3 className="text-6xl font-black font-mono italic tracking-tighter">₹{overallTotal.toFixed(0)}</h3>
                </div>
                <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-4 border border-white/5 relative z-10">
                    <CoolChart data={overallChartData} height={220} />
                </div>
            </div>
        </section>
    );
};