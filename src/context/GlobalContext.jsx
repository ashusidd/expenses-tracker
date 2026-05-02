import { createContext, useEffect, useState } from "react";

// 1. Context Initialize
export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    // Persistent States (Data)
    const [transactions, setTransactions] = useState(
        JSON.parse(localStorage.getItem('transactions')) || []
    );
    const [groups, setGroups] = useState(
        JSON.parse(localStorage.getItem('groups')) || []
    );

    // UI & Session Control States 
    const [groupName, setGroupName] = useState(
        localStorage.getItem('groupName') || ""
    );
    const [isGroupActive, setIsGroupActive] = useState(
        JSON.parse(localStorage.getItem('isGroupActive')) || false
    );

    // 2. Sync with LocalStorage (Auto-save everything)
    useEffect(() => {
        localStorage.setItem('transactions', JSON.stringify(transactions));
        localStorage.setItem('groups', JSON.stringify(groups));
        localStorage.setItem('groupName', groupName);
        localStorage.setItem('isGroupActive', JSON.stringify(isGroupActive));
    }, [transactions, groups, groupName, isGroupActive]);

    // 3. Actions: Transactions (Add/Delete)
    const addTransaction = (newTrans) => {
        setTransactions([newTrans, ...transactions]);
    };

    const deleteTransaction = (id) => {
        setTransactions(transactions.filter((t) => t.id !== id));
    };

    // 4. Actions: Batch Groups (Finalize/Delete History)
    const finalizeGroup = (name) => {
        if (transactions.length === 0) return;

        const newGroup = {
            id: Date.now(),
            name: name || groupName || "Untitled Group",
            items: transactions,
            total: transactions.reduce((acc, t) => acc + t.amount, 0),
            date: new Date().toLocaleDateString('en-GB')
        };

        setGroups([newGroup, ...groups]);
        setTransactions([]);
        setGroupName("");
        setIsGroupActive(false);
    };

    const deleteGroup = (id) => {
        setGroups(groups.filter((group) => group.id !== id));
    };

    // 5. Context Provider Wrap
    return (
        <GlobalContext.Provider value={{
            // Data States
            transactions,
            groups,

            // UI States
            groupName,
            setGroupName,
            isGroupActive,
            setIsGroupActive,

            // Methods
            addTransaction,
            deleteTransaction,
            finalizeGroup,
            deleteGroup
        }}>
            {children}
        </GlobalContext.Provider>
    );
};