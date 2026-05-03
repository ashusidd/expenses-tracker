import { createContext, useEffect, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [transactions, setTransactions] = useState(JSON.parse(localStorage.getItem('transactions')) || []);
    const [groups, setGroups] = useState(JSON.parse(localStorage.getItem('groups')) || []);
    const [groupName, setGroupName] = useState(localStorage.getItem('groupName') || "");
    const [isGroupActive, setIsGroupActive] = useState(JSON.parse(localStorage.getItem('isGroupActive')) || false);

    // NEW STATE: ट्रैक करने के लिए कि क्या हम पुराना ग्रुप एडिट कर रहे हैं
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

    // NEW FUNCTION: पुराने ग्रुप को वापस Live करना
    const editGroup = (group) => {
        setGroupName(group.name);
        setTransactions(group.items); // पुराने आइटम्स को लाइव लिस्ट में डालना
        setEditingGroupId(group.id); // ID सेव करना ताकि ओवरराइट कर सकें
        setIsGroupActive(true);
    };

    const finalizeGroup = () => {
        if (transactions.length === 0) return;

        const updatedData = {
            id: editingGroupId || Date.now(), // अगर एडिट कर रहे हैं तो पुरानी ID, वरना नई
            name: groupName || "Untitled Group",
            items: transactions,
            total: transactions.reduce((acc, t) => acc + t.amount, 0),
            date: new Date().toLocaleDateString('en-GB')
        };

        if (editingGroupId) {
            // REWRITE LOGIC: पुराने वाले को हटाकर नया अपडेटेड डेटा डालना
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
            editGroup, editingGroupId // इन दोनों को एक्सपोर्ट करना न भूलें
        }}>
            {children}
        </GlobalContext.Provider>
    );
};