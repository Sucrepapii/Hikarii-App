import React, { useMemo, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Premium theme
import { useBudgetStore } from '../stores/budgetStore';
import { ExpenseCategory } from '../types/budget.types';
import { ColDef, ValueSetterParams } from 'ag-grid-community';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export const Tracker = () => {
    const { expenses, fetchExpenses, updateExpense, addExpense, deleteExpense, isLoading } = useBudgetStore();

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    const handleCellValueChanged = async (params: any) => {
        if (!params.data.id) return;
        
        try {
            await updateExpense(params.data.id, {
                [params.colDef.field]: params.newValue
            });
            toast.success("Updated successfully");
        } catch (error) {
            toast.error("Failed to update");
            params.node.setDataValue(params.colDef.field, params.oldValue);
        }
    };

    const handleAddRow = async () => {
        const newExpense = {
            title: 'New Item',
            amount: 0,
            category: ExpenseCategory.OTHER,
            date: new Date(),
            type: 'EXPENSE'
        };
        try {
            // @ts-ignore
            await addExpense(newExpense);
            toast.success("Record added");
        } catch (error: any) {
            toast.error(error?.response?.data?.error || "Failed to add record. Ensure you are online or the server is running.");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this record?")) {
            await deleteExpense(id);
            toast.success("Deleted");
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
            field: 'type', 
            headerName: 'Type', 
            editable: true, 
            sortable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['INCOME', 'EXPENSE']
            },
            minWidth: 120
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
                    onClick={() => handleDelete(params.data.id)}
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
        </div>
    );
};
