import { createContext, useEffect, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [transactions, setTransactions] = useState(JSON.parse(localStorage.getItem('transactions')) || []);
    const [groups, setGroups] = useState(JSON.parse(localStorage.getItem('groups')) || []);
    const [groupName, setGroupName] = useState(localStorage.getItem('groupName') || "");
    const [isGroupActive, setIsGroupActive] = useState(JSON.parse(localStorage.getItem('isGroupActive')) || false);
    const [editingGroupId, setEditingGroupId] = useState(JSON.parse(localStorage.getItem('editingGroupId')) || null);

    useEffect(() => {
        localStorage.setItem('transactions', JSON.stringify(transactions));
        localStorage.setItem('groups', JSON.stringify(groups));
        localStorage.setItem('groupName', groupName);
        localStorage.setItem('isGroupActive', JSON.stringify(isGroupActive));
        localStorage.setItem('editingGroupId', JSON.stringify(editingGroupId));
    }, [transactions, groups, groupName, isGroupActive, editingGroupId]);

    const addTransaction = (newTrans) => setTransactions([newTrans, ...transactions]);
    const deleteTransaction = (id) => setTransactions(transactions.filter((t) => t.id !== id));

    const editGroup = (group) => {
        setGroupName(group.name);
        setTransactions(group.items);
        setEditingGroupId(group.id);
        setIsGroupActive(true);
    };

    const finalizeGroup = () => {
        if (transactions.length === 0) return;

        const updatedData = {
            id: editingGroupId || Date.now(),
            name: groupName || "Untitled Group",
            items: transactions,
            total: transactions.reduce((acc, t) => acc + t.amount, 0),
            date: new Date().toLocaleDateString('en-GB')
        };

        if (editingGroupId) {
            setGroups(groups.map(g => g.id === editingGroupId ? updatedData : g));
        } else {
            setGroups([updatedData, ...groups]);
        }

        // Cleanup
        setTransactions([]);
        setGroupName("");
        setIsGroupActive(false);
        setEditingGroupId(null);
    };

    const deleteGroup = (id) => setGroups(groups.filter((group) => group.id !== id));

    return (
        <GlobalContext.Provider value={{
            transactions, groups, groupName, setGroupName, isGroupActive, setIsGroupActive,
            addTransaction, deleteTransaction, finalizeGroup, deleteGroup,
            editGroup, editingGroupId
        }}>
            {children}
        </GlobalContext.Provider>
    );
};