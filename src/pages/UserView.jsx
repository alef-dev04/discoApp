import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import FloorPlan from '../components/floorplan/FloorPlan';
import BookingModal from '../components/modals/BookingModal';
import PersonalAreaModal from '../components/modals/PersonalAreaModal';
import DateSelector from '../components/common/DateSelector';
import { LogOut, Calendar } from 'lucide-react';

const UserView = () => {
    const { tables, bookTable, logout } = useAppContext();
    const [selectedTable, setSelectedTable] = useState(null);
    const [isPersonalAreaOpen, setIsPersonalAreaOpen] = useState(false);

    const handleTableClick = (table) => {
        // Only allow booking if available
        if (table.status === 'available') {
            setSelectedTable(table);
        }
    };

    const handleBookingConfirm = (tableId, bookingName, guestList, total) => {
        bookTable(tableId, bookingName, guestList, total);
        setSelectedTable(null);
        // Could add a toast/confetti here
    };

    return (
        <div className="h-screen flex flex-col bg-dark-bg text-white overflow-hidden relative">
            {/* Header */}
            <header className="h-14 md:h-20 glass z-20 px-3 md:px-8 flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-lg md:text-2xl font-bold tracking-widest">NIGHT<span className="text-neon-purple">CLUB</span></h1>
                    <p className="text-[10px] md:text-xs text-gray-400 hidden md:block">Welcome Guest</p>
                </div>

                <div className="flex items-center gap-2 md:gap-6">
                    {/* DateSelector Wrapper to ensure z-index/position */}
                    <div className="relative z-30">
                        <DateSelector />
                    </div>

                    <button
                        onClick={() => setIsPersonalAreaOpen(true)}
                        className="hidden md:flex items-center gap-2 bg-neon-purple/10 hover:bg-neon-purple/20 px-4 py-2 rounded-lg border border-neon-purple/20 transition-all"
                    >
                        <span className="font-bold text-neon-purple text-sm">MY BOOKINGS</span>
                    </button>

                    {/* Mobile: My Bookings Icon Button */}
                    <button
                        onClick={() => setIsPersonalAreaOpen(true)}
                        className="md:hidden flex items-center justify-center bg-neon-purple/10 hover:bg-neon-purple/20 p-2 rounded-lg border border-neon-purple/20 transition-all"
                    >
                        <Calendar size={16} className="text-neon-purple" />
                    </button>

                    <button onClick={logout} className="flex items-center gap-1 md:gap-2 text-gray-400 hover:text-white transition-colors text-xs md:text-sm">
                        <LogOut size={14} className="md:hidden" />
                        <LogOut size={16} className="hidden md:block" />
                        <span className="hidden md:inline">Exit</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 relative">
                <FloorPlan tables={tables} onTableClick={handleTableClick} isUserView={true} />
            </main>

            {/* Booking Modal */}
            <BookingModal
                isOpen={!!selectedTable}
                onClose={() => setSelectedTable(null)}
                table={selectedTable}
                onConfirm={handleBookingConfirm}
            />

            {/* Personal Area Modal */}
            <PersonalAreaModal
                isOpen={isPersonalAreaOpen}
                onClose={() => setIsPersonalAreaOpen(false)}
            />
        </div>
    );
};

export default UserView;
