import React from 'react';
import { useAppContext } from '../../context/AppContext';

const DateSelector = () => {
    const { selectedDate, setSelectedDate } = useAppContext();

    const handleChange = (e) => {
        // e.target.valueAsDate is sometimes cleaner but string parsing works consistently with input type=date
        if (e.target.value) {
            setSelectedDate(new Date(e.target.value));
        }
    };

    // Format for input value: YYYY-MM-DD
    // Handle timezone offset issues by using string formatting directly if needed, 
    // but toISOString().split('T')[0] works if date is already logical. 
    // To match local date selection:
    const formatDate = (date) => {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        return localDate.toISOString().split('T')[0];
    };

    // Use simple ISO string for now, assuming UTC/Local handling in context isn't complex yet
    // Actually, AppContext uses toISOString().split('T')[0] which is UTC date.
    // If user is in GMT+1, new Date() might be yesterday in UTC if late night? 
    // Let's stick to the Context's logic: 
    const dateValue = selectedDate.toISOString().split('T')[0];
    const minDate = new Date().toISOString().split('T')[0];

    return (
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-xl border border-white/10 backdrop-blur-md">
            <span className="text-white font-medium text-sm md:text-base pl-2">📅 Date:</span>
            <input
                type="date"
                value={dateValue}
                min={minDate}
                onChange={handleChange}
                className="bg-transparent text-white border-0 px-2 py-1 focus:outline-none focus:ring-0 cursor-pointer font-bold text-sm md:text-base [color-scheme:dark]"
            />
        </div>
    );
};

export default DateSelector;
