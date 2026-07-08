import React, { useState } from 'react';
import {
    format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths
} from 'date-fns';
import { ChevronLeft, ChevronRight, CheckSquare, Wallet } from 'lucide-react';
import { Card } from '../components/common/Card';
import { useTaskStore } from '../stores/taskStore';
import { useBudgetStore } from '../stores/budgetStore';
import { TaskStatus } from '../types/task.types';
import { formatCurrency } from '../utils/currencyFormatter';
import { TaskItem } from '../components/tasks/TaskItem';
import { Modal } from '../components/common/Modal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { useAuthStore } from '../stores/authStore';
import { UpgradeModal } from '../components/modals/UpgradeModal';

export const Calendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);

    const { tasks, toggleTaskStatus, deleteTask } = useTaskStore();
    const { expenses, currency } = useBudgetStore();

    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const { user } = useAuthStore();
    const isPro = user?.subscriptionStatus === 'PRO';

    // Navigation
    const nextMonth = () => {
        if (isPro) {
            setCurrentDate(addMonths(currentDate, 1));
        } else {
            setShowUpgradeModal(true);
        }
    };

    const prevMonth = () => {
        if (isPro) {
            setCurrentDate(subMonths(currentDate, 1));
        } else {
            setShowUpgradeModal(true);
        }
    };

    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (id: string) => {
        setTaskToDelete(id);
    };

    const handleConfirmDelete = async () => {
        if (taskToDelete) {
            setIsDeleting(true);
            try {
                await deleteTask(taskToDelete);
                setTaskToDelete(null);
            } catch (error) {
                // toast handled in store usually, but good to be safe if local
            } finally {
                setIsDeleting(false);
            }
        }
    };

    // Calendar Grid Generation
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Collect all days
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });

    // Function to get items for a day
    const getDayItems = (date: Date) => {
        // Free Plan Restriction: Only show items from the last 7 days
        const isWithin7Days = date >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && date <= new Date();

        if (!isPro && !isWithin7Days) {
            return { dayTasks: [], dayExpenses: [] };
        }

        const dayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), date));
        const dayExpenses = expenses.filter(e => isSameDay(new Date(e.date), date));
        return { dayTasks, dayExpenses };
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 mb-6">
                <div>
                    <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                        Calendar
                    </h1>
                    <div className="flex items-center gap-2">
                        <p className="text-slate-600 dark:text-slate-400">
                            View your schedule and spending
                        </p>
                        {!isPro && (
                            <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300">
                                7-Day History Limit
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 self-start md:self-auto">
                    <button
                        onClick={prevMonth}
                        className={`p-2 rounded-lg touch-manipulation ${!isPro ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-base sm:text-lg min-w-[120px] sm:min-w-[140px] text-center">
                        {format(currentDate, 'MMMM yyyy')}
                    </span>
                    <button
                        onClick={nextMonth}
                        className={`p-2 rounded-lg touch-manipulation ${!isPro ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="min-w-0">
                        {/* Weekday Header */}
                        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                            {weekDays.map(d => (
                                <div key={d} className="p-3 text-center text-sm font-semibold text-slate-500">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 auto-rows-fr bg-slate-200 dark:bg-slate-700 gap-[1px]">
                            {allDays.map((dayItem) => {
                                const { dayTasks, dayExpenses } = getDayItems(dayItem);
                                const isCurrentMonth = isSameMonth(dayItem, monthStart);
                                const isTodayDate = isToday(dayItem);

                                // Indicators

                                const totalExpense = dayExpenses.reduce((sum, e) => sum + e.amount, 0);

                                return (
                                    <div
                                        key={dayItem.toString()}
                                        onClick={() => setSelectedDay(dayItem)}
                                        className={`
                                            min-h-[100px] p-2 bg-white dark:bg-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors
                                            ${!isCurrentMonth ? 'text-slate-400 bg-slate-50/50 dark:bg-slate-800/50' : ''}
                                            ${isTodayDate ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''}
                                        `}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`
                                                text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                                                ${isTodayDate ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : ''}
                                            `}>
                                                {format(dayItem, 'd')}
                                            </span>
                                            {totalExpense > 0 && (
                                                <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-full break-all">
                                                    {formatCurrency(useBudgetStore.getState().getConvertedAmount(totalExpense, currency), currency).split('.')[0]}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {/* Task Dots */}
                                            {dayTasks.map((t, i) => {
                                                if (i > 3) return null; // limit dots
                                                const isDone = t.status === TaskStatus.COMPLETED;
                                                const isOverdue = !isDone && new Date(t.dueDate!) < new Date() && !isToday(new Date(t.dueDate!));
                                                return (
                                                    <div
                                                        key={t.id}
                                                        className={`
                                                            w-2 h-2 rounded-full 
                                                            ${isDone ? 'bg-emerald-400' : isOverdue ? 'bg-red-500' : 'bg-accent-400'}
                                                        `}
                                                    />
                                                );
                                            })}
                                            {dayTasks.length > 4 && (
                                                <span className="text-[10px] text-slate-400 leading-none self-center">+</span>
                                            )}
                                        </div>

                                        {dayExpenses.length > 0 && (
                                            <div className="mt-1 flex gap-0.5">
                                                {dayExpenses.map((e, i) => i < 3 && (
                                                    <div key={e.id} className="w-2 h-0.5 bg-accent-400 rounded-full" />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Day Details Modal */}
            <Modal
                isOpen={!!selectedDay}
                onClose={() => setSelectedDay(null)}
                title={selectedDay ? format(selectedDay, 'EEEE, MMMM do, yyyy') : ''}
            >
                <div className="space-y-6">
                    {/* Tasks Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <CheckSquare className="w-4 h-4" />
                            Tasks ({selectedDay ? getDayItems(selectedDay).dayTasks.length : 0})
                        </h3>
                        <div className="space-y-3">
                            {selectedDay && getDayItems(selectedDay).dayTasks.length > 0 ? (
                                getDayItems(selectedDay).dayTasks.map(task => (
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        onToggle={toggleTaskStatus}
                                        onEdit={() => { }} // Read-only in calendar for now
                                        onDelete={handleDeleteClick}
                                    />
                                ))
                            ) : (
                                <p className="text-sm text-slate-400 italic">No tasks due this day</p>
                            )}
                        </div>
                    </div>

                    {/* Expenses Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Wallet className="w-4 h-4" />
                            Expenses ({selectedDay ? getDayItems(selectedDay).dayExpenses.length : 0})
                        </h3>
                        {selectedDay && getDayItems(selectedDay).dayExpenses.length > 0 ? (
                            <div className="space-y-2">
                                {getDayItems(selectedDay).dayExpenses.map(expense => (
                                    <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                        <div>
                                            <p className="font-medium text-slate-700 dark:text-slate-200">{expense.title}</p>
                                            <p className="text-xs text-slate-500">{expense.category}</p>
                                        </div>
                                        <span className="font-bold text-accent-600 dark:text-accent-400">
                                            {formatCurrency(useBudgetStore.getState().getConvertedAmount(expense.amount, currency), currency)}
                                        </span>
                                    </div>
                                ))}
                                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-sm font-bold">
                                    <span>Total Day Spending</span>
                                    <span className="text-slate-900 dark:text-white">
                                        {formatCurrency(useBudgetStore.getState().getConvertedAmount(getDayItems(selectedDay).dayExpenses.reduce((s, e) => s + e.amount, 0), currency), currency)}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 italic">No expenses recorded</p>
                        )}
                    </div>
                </div>
            </Modal>

            <ConfirmModal
                isOpen={!!taskToDelete}
                onClose={() => !isDeleting && setTaskToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Task"
                message="Are you sure you want to delete this task? This cannot be undone."
                confirmText="Delete Task"
                variant="danger"
                isLoading={isDeleting}
            />

            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
            />
        </div>
    );
};
