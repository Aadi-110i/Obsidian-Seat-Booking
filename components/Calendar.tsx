'use client';
import { 
    format, 
    addMonths, 
    subMonths, 
    startOfMonth, 
    endOfMonth, 
    startOfWeek, 
    endOfWeek, 
    isSameMonth, 
    isSameDay, 
    addDays, 
    isWeekend, 
    startOfDay,
    isAfter,
    isBefore
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface CalendarProps {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
    maxDate: Date;
}

export default function Calendar({ selectedDate, onDateSelect, maxDate }: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const today = startOfDay(new Date());

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between mb-8 px-2">
                <h2 className="text-xl font-serif text-white flex items-center gap-3">
                    {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        className="p-2 hover:bg-white/5 rounded-xl border border-white/5 transition-all text-zinc-400 hover:text-white"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button 
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        className="p-2 hover:bg-white/5 rounded-xl border border-white/5 transition-all text-zinc-400 hover:text-white"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <div className="grid grid-cols-7 mb-4">
                {days.map(day => (
                    <div key={day} className="text-center text-[10px] font-black uppercase tracking-widest text-zinc-600 py-2">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, 'd');
                const cloneDay = day;
                
                const isPast = isBefore(startOfDay(cloneDay), today);
                const isOutsideWindow = isAfter(startOfDay(cloneDay), maxDate);
                const isOffDay = isWeekend(cloneDay);
                const isDisabled = isPast || isOutsideWindow || isOffDay;
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isTodayDate = isSameDay(day, today);

                days.push(
                    <div
                        key={day.toString()}
                        className={`
                            relative h-14 border-[0.5px] border-white/5 flex flex-col items-center justify-center transition-all duration-300 group
                            ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-white/[0.03]'}
                            ${isSelected ? 'bg-white text-black z-10' : ''}
                            ${!isCurrentMonth ? 'opacity-20' : ''}
                        `}
                        onClick={() => !isDisabled && onDateSelect(cloneDay)}
                    >
                        {isTodayDate && !isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-white shadow-[0_0_8px_white]" />
                        )}
                        
                        <span className={`text-xs font-medium ${isSelected ? 'font-bold' : 'text-zinc-400 group-hover:text-white'}`}>
                            {formattedDate}
                        </span>
                        
                        {!isDisabled && !isSelected && isCurrentMonth && (
                            <div className="mt-1 w-0.5 h-0.5 rounded-full bg-zinc-700 group-hover:bg-zinc-400 transition-colors" />
                        )}
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="border border-white/5 rounded-2xl overflow-hidden glass-dark shadow-2xl">{rows}</div>;
    };

    return (
        <div className="fade-in">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
        </div>
    );
}
