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

export const Calendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);

    const { tasks, toggleTaskStatus, deleteTask } = useTaskStore();
    const { expenses, currency } = useBudgetStore();

    // Navigation
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

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
        const dayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), date));
        const dayExpenses = expenses.filter(e => isSameDay(new Date(e.date), date));
        return { dayTasks, dayExpenses };
    };

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                        Calendar
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        View your schedule and spending
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-lg min-w-[140px] text-center">
                        {format(currentDate, 'MMMM yyyy')}
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
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
                                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-full">
                                                    {formatCurrency(totalExpense, currency).split('.')[0]}
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
                                                        key={t._id}
                                                        className={`
                                                            w-2 h-2 rounded-full 
                                                            ${isDone ? 'bg-emerald-400' : isOverdue ? 'bg-red-500' : 'bg-blue-400'}
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
                                                    <div key={e._id} className="w-2 h-0.5 bg-purple-400 rounded-full" />
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
                                        key={task._id}
                                        task={task}
                                        onToggle={toggleTaskStatus}
                                        onEdit={() => { }} // Read-only in calendar for now
                                        onDelete={deleteTask}
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
                                    <div key={expense._id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                        <div>
                                            <p className="font-medium text-slate-700 dark:text-slate-200">{expense.title}</p>
                                            <p className="text-xs text-slate-500">{expense.category}</p>
                                        </div>
                                        <span className="font-bold text-purple-600 dark:text-purple-400">
                                            {formatCurrency(expense.amount, currency)}
                                        </span>
                                    </div>
                                ))}
                                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-sm font-bold">
                                    <span>Total Day Spending</span>
                                    <span className="text-slate-900 dark:text-white">
                                        {formatCurrency(getDayItems(selectedDay).dayExpenses.reduce((s, e) => s + e.amount, 0), currency)}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 italic">No expenses recorded</p>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};
