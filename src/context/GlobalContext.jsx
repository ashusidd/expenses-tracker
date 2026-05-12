import { createContext, useEffect, useState } from "react";

// Create context to share data across components
export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    // 1. App State: Load data from LocalStorage or use empty defaults
    const [transactions, setTransactions] = useState(JSON.parse(localStorage.getItem('transactions')) || []);
    const [groups, setGroups] = useState(JSON.parse(localStorage.getItem('groups')) || []);
    const [groupName, setGroupName] = useState(localStorage.getItem('groupName') || "");
    const [isGroupActive, setIsGroupActive] = useState(JSON.parse(localStorage.getItem('isGroupActive')) || false);
    const [editingGroupId, setEditingGroupId] = useState(JSON.parse(localStorage.getItem('editingGroupId')) || null);

    // Safety vault to temporarily hold current live work when editing history
    const [pendingLive, setPendingLive] = useState(JSON.parse(localStorage.getItem('pendingLive')) || null);

    // 2. Persistent Storage: Automatically save every change to LocalStorage
    useEffect(() => {
        localStorage.setItem('transactions', JSON.stringify(transactions));
        localStorage.setItem('groups', JSON.stringify(groups));
        localStorage.setItem('groupName', groupName);
        localStorage.setItem('isGroupActive', JSON.stringify(isGroupActive));
        localStorage.setItem('editingGroupId', JSON.stringify(editingGroupId));
        localStorage.setItem('pendingLive', JSON.stringify(pendingLive));
    }, [transactions, groups, groupName, isGroupActive, editingGroupId, pendingLive]);

    // 3. Add single expense item to current list (FIXED: Auto-injecting current date)
    const addTransaction = (newTrans) => {
        const transactionWithDate = {
            ...newTrans,
            // If date doesn't exist, strictly attach today's date to this specific item
            date: newTrans.date || new Date().toLocaleDateString('en-GB')
        };
        setTransactions([transactionWithDate, ...transactions]);
    };

    // Delete single expense item
    const deleteTransaction = (id) => setTransactions(transactions.filter((t) => t.id !== id));

    // 4. Resume Logic: Switch from Live work to History editing
    const editGroup = (group) => {
        // If current batch is unsaved, "Pause" it and store in pendingLive
        if (transactions.length > 0 && !editingGroupId) {
            setPendingLive({
                items: transactions,
                name: groupName
            });
        }

        // Load History group data into the main form
        setGroupName(group.name);
        setTransactions(group.items);
        setEditingGroupId(group.id);
        setIsGroupActive(true);
    };

    // 5. Save Logic: Finalize batch and restore "Paused" work if any (FIXED: Preserving old dates)
    const finalizeGroup = () => {
        if (transactions.length === 0) return;

        // Find existing group to grab its original creation date
        const existingGroup = editingGroupId ? groups.find(g => g.id === editingGroupId) : null;

        // Prepare group data object
        const updatedData = {
            id: editingGroupId || Date.now(),
            name: groupName || "Untitled Group",
            items: transactions,
            total: transactions.reduce((acc, t) => acc + t.amount, 0),
            // FIXED: Only assign a NEW date if it's a new group. Otherwise, keep the old date.
            date: existingGroup ? existingGroup.date : new Date().toLocaleDateString('en-GB')
        };

        // Update existing group or add as new history
        if (editingGroupId) {
            setGroups(groups.map(g => g.id === editingGroupId ? updatedData : g));
        } else {
            setGroups([updatedData, ...groups]);
        }

        // Restore paused work after finishing an edit
        if (pendingLive && editingGroupId) {
            setTransactions(pendingLive.items);
            setGroupName(pendingLive.name);
            setEditingGroupId(null);
            setPendingLive(null); // Clear the safety vault
        } else {
            // Full reset if no pending work exists
            setTransactions([]);
            setGroupName("");
            setIsGroupActive(false);
            setEditingGroupId(null);
            setPendingLive(null);
        }
    };

    // Remove group from History
    const deleteGroup = (id) => setGroups(groups.filter((group) => group.id !== id));

    return (
        <GlobalContext.Provider value={{
            transactions, groups, groupName, setGroupName, isGroupActive, setIsGroupActive,
            addTransaction, deleteTransaction, finalizeGroup, deleteGroup,
            editGroup, editingGroupId, pendingLive
        }}>
            {children}
        </GlobalContext.Provider>
    );
};