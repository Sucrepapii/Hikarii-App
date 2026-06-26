import React, { useMemo, useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Premium theme
import { useBudgetStore } from '../stores/budgetStore';
import { useProjectStore } from '../stores/projectStore';
import { useAuthStore } from '../stores/authStore';
import { ExpenseCategory } from '../types/budget.types';
import { ColDef, ModuleRegistry, AllCommunityModule, ClientSideRowModelModule } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule, ClientSideRowModelModule]);

import { Plus, Wallet, FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const Tracker = () => {
    const { expenses, fetchExpenses, updateExpense, addExpense, deleteExpense, isLoading } = useBudgetStore();
    const { projects, fetchProjects } = useProjectStore();
    const { user } = useAuthStore();
    
    const isPro = user?.subscriptionStatus === 'PRO';
    
    const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<string>('ALL');

    useEffect(() => {
        fetchExpenses();
        fetchProjects();
    }, [fetchExpenses, fetchProjects]);

    const filteredExpenses = useMemo(() => {
        if (selectedProjectId === 'ALL') return expenses;
        return expenses.filter(e => e.projectId === selectedProjectId);
    }, [expenses, selectedProjectId]);

    const totalAmount = useMemo(() => {
        return filteredExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    }, [filteredExpenses]);

    const handleCellValueChanged = async (params: any) => {
        if (!params.data.id || params.source !== 'edit') return;
        
        try {
            const cleanData = {
                title: params.data.title || "Untitled Item",
                amount: Number(params.data.amount) || 0,
                category: params.data.category,
                date: params.data.date ? new Date(params.data.date) : new Date(),
                description: params.data.description,
                linkedTaskId: params.data.linkedTaskId,
                projectId: params.data.projectId
            };

            await updateExpense(params.data.id, cleanData);
            toast.success("Updated successfully");
        } catch (error: any) {
            console.error("Backend Error:", error?.response?.data);
            toast.error(`Error: ${JSON.stringify(error?.response?.data?.error || error?.message)}`);
            params.node.setDataValue(params.colDef.field, params.oldValue);
        }
    };

    const handleAddRow = async () => {
        const newExpense = {
            title: 'New Item',
            amount: 1,
            category: ExpenseCategory.OTHER,
            date: new Date(),
            projectId: selectedProjectId !== 'ALL' ? selectedProjectId : undefined
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
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-display font-bold gradient-text">Ledger</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Track daily expenditures across your projects.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                    {/* Project Selector */}
                    <div className="flex items-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 shadow-sm flex-1 sm:flex-none">
                        <FolderOpen className="w-5 h-5 text-primary-500 mr-3" />
                        <select 
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                            className="bg-transparent border-none text-slate-700 dark:text-slate-200 font-medium focus:ring-0 cursor-pointer w-full"
                        >
                            <option value="ALL">All Projects</option>
                            {projects.map((p, index) => {
                                const isDisabled = !isPro && index > 0;
                                return (
                                    <option key={p.id} value={p.id} disabled={isDisabled}>
                                        {p.title} {p.status !== 'ACTIVE' ? `(${p.status})` : ''} {isDisabled ? ' 🔒 PRO' : ''}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* Total Amount Card */}
                    <div className="flex items-center bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl px-6 py-2.5 shadow-lg shadow-primary-500/25 flex-1 sm:flex-none">
                        <Wallet className="w-5 h-5 text-white/80 mr-3" />
                        <div className="flex flex-col">
                            <span className="text-xs text-white/80 font-medium uppercase tracking-wider">Total Amount</span>
                            <span className="text-white font-bold text-lg">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'NGN' }).format(totalAmount)}
                            </span>
                        </div>
                    </div>

                    <button 
                        onClick={handleAddRow}
                        className="btn-primary flex justify-center items-center gap-2 px-6 py-3 sm:py-2.5 rounded-xl shadow-lg hover:shadow-primary-500/25 transition-all h-full"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add Record</span>
                    </button>
                </div>
            </div>

            <div className="ag-theme-quartz-dark flex-1 w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800" style={{ '--ag-header-background-color': 'rgba(0,0,0,0.2)', '--ag-odd-row-background-color': 'rgba(255,255,255,0.02)' } as any}>
                <AgGridReact
                    rowData={filteredExpenses}
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
