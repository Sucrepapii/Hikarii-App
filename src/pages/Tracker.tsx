import React, { useMemo, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Premium theme
import { useBudgetStore } from '../stores/budgetStore';
import { ExpenseCategory } from '../types/budget.types';
import { ColDef, ModuleRegistry, AllCommunityModule, ClientSideRowModelModule } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule, ClientSideRowModelModule]);

import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { useState } from 'react';

export const Tracker = () => {
    const { expenses, fetchExpenses, updateExpense, addExpense, deleteExpense, isLoading } = useBudgetStore();
    const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    const handleCellValueChanged = async (params: any) => {
        // Prevent infinite loops: only trigger API on actual user edits, not programmatic reverts
        if (!params.data.id || params.source !== 'edit') return;
        
        try {
            // The backend is extremely strict and will reject the PUT request if it contains
            // fields like `id`, `createdAt`, `updatedAt`, or `userId` in the body.
            // We must extract ONLY the fields allowed by the backend schema and ensure none are null.
            const cleanData = {
                title: params.data.title || "Untitled Item",
                amount: Number(params.data.amount) || 0,
                category: params.data.category,
                date: params.data.date ? new Date(params.data.date) : new Date(),
                description: params.data.description,
                linkedTaskId: params.data.linkedTaskId
            };

            await updateExpense(params.data.id, cleanData);
            toast.success("Updated successfully");
        } catch (error: any) {
            console.error("Backend Error:", error?.response?.data);
            toast.error(`Error: ${JSON.stringify(error?.response?.data?.error || error?.message)}`);
            
            // Revert safely (the 'source' check above prevents infinite loops)
            params.node.setDataValue(params.colDef.field, params.oldValue);
        }
    };

    const handleAddRow = async () => {
        const newExpense = {
            title: 'New Item',
            amount: 1,
            category: ExpenseCategory.OTHER,
            date: new Date()
        };
        try {
            // @ts-ignore
            await addExpense(newExpense);
            toast.success("Record added");
        } catch (error: any) {
            toast.error(error?.response?.data?.error || "Failed to add record. Ensure you are online or the server is running.");
        }
    };

    const handleDeleteClick = (id: string) => {
        setExpenseToDelete(id);
    }

    const handleConfirmDelete = async () => {
        if (!expenseToDelete) return;
        setIsDeleting(true);
        try {
            await deleteExpense(expenseToDelete);
            toast.success("Deleted");
        } catch (error) {
            toast.error("Failed to delete record");
        } finally {
            setIsDeleting(false);
            setExpenseToDelete(null);
        }
    }

    const columnDefs = useMemo<ColDef[]>(() => [
        {
            field: 'date',
            headerName: 'Date',
            editable: true,
            sortable: true,
            filter: 'agDateColumnFilter',
            valueFormatter: (params) => {
                if (!params.value) return '';
                return new Date(params.value).toLocaleDateString();
            },
            valueParser: (params) => {
                return new Date(params.newValue);
            },
            minWidth: 120
        },
        { 
            field: 'title', 
            headerName: 'Description', 
            editable: true, 
            sortable: true, 
            filter: true,
            minWidth: 200,
            flex: 1
        },
        { 
            field: 'category', 
            headerName: 'Category', 
            editable: true, 
            sortable: true, 
            filter: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: Object.values(ExpenseCategory)
            },
            minWidth: 150
        },
        { 
            field: 'amount', 
            headerName: 'Amount', 
            editable: true, 
            sortable: true,
            filter: 'agNumberColumnFilter',
            valueParser: (params) => {
                return Number(params.newValue);
            },
            valueFormatter: (params) => {
                return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'NGN' }).format(params.value || 0);
            },
            minWidth: 120
        },
        {
            headerName: 'Actions',
            minWidth: 100,
            cellRenderer: (params: any) => (
                <button 
                    onClick={() => handleDeleteClick(params.data.id)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                >
                    Delete
                </button>
            )
        }
    ], []);

    const defaultColDef = useMemo(() => ({
        resizable: true,
        flex: 1,
        minWidth: 100,
    }), []);

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] p-4 md:p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold gradient-text">Ledger</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Track daily expenditures and income.</p>
                </div>
                <button 
                    onClick={handleAddRow}
                    className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl shadow-lg hover:shadow-primary-500/25 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Record</span>
                </button>
            </div>

            <div className="ag-theme-quartz-dark flex-1 w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800" style={{ '--ag-header-background-color': 'rgba(0,0,0,0.2)', '--ag-odd-row-background-color': 'rgba(255,255,255,0.02)' } as any}>
                <AgGridReact
                    rowData={expenses}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    onCellValueChanged={handleCellValueChanged}
                    animateRows={true}
                    rowSelection="multiple"
                    suppressMenuHide={true}
                    domLayout="normal"
                    overlayLoadingTemplate={'<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>'}
                />
            </div>

            <ConfirmModal
                isOpen={!!expenseToDelete}
                onClose={() => !isDeleting && setExpenseToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Record"
                message="Are you sure you want to delete this ledger record? This action cannot be undone."
                confirmText="Delete Record"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
};
