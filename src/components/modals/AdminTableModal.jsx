import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Check, Clock, DollarSign, Edit, Plus } from 'lucide-react';

const AdminTableModal = ({ isOpen, onClose, table, onAddOrder, onCancelBooking, onUpdateBooking }) => {
    if (!isOpen || !table) return null;

    const currentBooking = table.bookings && table.bookings.length > 0 ? table.bookings[0] : null;

    const sortedGuests = currentBooking?.guest_list
        ? [...currentBooking.guest_list].sort((a, b) => {
            const nameA = (a.firstName || a.name || '').toLowerCase();
            const nameB = (b.firstName || b.name || '').toLowerCase();
            return nameA.localeCompare(nameB);
        })
        : [];

    const handleToggleArrived = async (guestId) => {
        const updatedList = currentBooking.guest_list.map(g => {
            if (g.id === guestId) {
                return { ...g, arrived: !g.arrived };
            }
            return g;
        });

        await onUpdateBooking(currentBooking.id, {
            guest_list: updatedList
        });
    };

    const handleRemoveGuest = async (guestId) => {
        if (!confirm('Remove this guest?')) return;

        const updatedList = currentBooking.guest_list.filter(g => g.id !== guestId);

        await onUpdateBooking(currentBooking.id, {
            guest_list: updatedList,
            guest_count: updatedList.length,
            // Optionally update total_price if it depends on count
        });
    };

    const handleDeleteBooking = async () => {
        if (!confirm('Permanently delete this booking?')) return;
        await onCancelBooking(currentBooking.id);
        onClose();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="glass-card w-full max-w-lg rounded-2xl overflow-hidden relative z-10 max-h-[90vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 bg-white/5 relative flex justify-between items-center shrink-0">
                        <div>
                            <h2 className="text-2xl font-bold">{table.name}</h2>
                            <p className="text-sm text-gray-400">Section: {table.section}</p>
                        </div>
                        <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">

                        {/* Booking Info */}
                        {currentBooking && (
                            <div className="bg-neon-purple/5 p-4 rounded-xl border border-neon-purple/10">
                                <h3 className="text-neon-purple font-bold text-lg mb-1">{currentBooking.booking_name || 'VIP Booking'}</h3>
                                <p className="text-xs text-gray-400">Booked by: {currentBooking.guest_name || 'Unknown'}</p>
                            </div>
                        )}

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-dark-bg p-4 rounded-xl border border-white/5">
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Current Tab</p>
                                <div className="flex items-center gap-2 text-neon-blue font-bold text-xl">
                                    <DollarSign size={18} />
                                    {currentBooking ? currentBooking.total : 0}
                                </div>
                            </div>
                            <div className="bg-dark-bg p-4 rounded-xl border border-white/5">
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Guests</p>
                                <div className="flex items-center gap-2 text-white font-bold text-xl">
                                    <User size={18} />
                                    {currentBooking ? `${currentBooking.guests}/${table.capacity.max}` : `0/${table.capacity.max}`}
                                </div>
                            </div>
                        </div>

                        {/* Guest List */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">Guest List ({sortedGuests.length})</h3>
                            <div className="bg-dark-bg border border-white/5 rounded-xl overflow-hidden">
                                {!currentBooking ? (
                                    <div className="p-4 text-center text-gray-500 text-sm">No active booking</div>
                                ) : sortedGuests.length > 0 ? (
                                    <div className="divide-y divide-white/5">
                                        {sortedGuests.map((guest, i) => (
                                            <div key={guest.id || i} className="p-3 flex items-center justify-between group hover:bg-white/5 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border border-white/10 ${guest.arrived ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-gray-400'}`}>
                                                        <User size={14} />
                                                    </div>
                                                    <div>
                                                        <p className={`font-bold text-sm ${guest.arrived ? 'text-green-400' : 'text-gray-200'}`}>
                                                            {guest.firstName} {guest.lastName}
                                                        </p>
                                                        {guest.arrived && <span className="text-[10px] text-green-500 font-medium">ARRIVED</span>}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleToggleArrived(guest.id)}
                                                        className={`p-2 rounded-lg border transition-all flex items-center gap-2 ${guest.arrived ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
                                                        title="Mark Arrived"
                                                    >
                                                        <Check size={14} />
                                                    </button>

                                                    <button
                                                        onClick={() => handleRemoveGuest(guest.id)}
                                                        className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                        title="Remove Guest"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-gray-500 text-sm">No guests in list</div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        {currentBooking ? (
                            <div className="space-y-3 pt-4 border-t border-white/5">
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => onAddOrder(table.id, 100)}
                                        className="py-3 bg-neon-blue/10 border border-neon-blue/50 text-neon-blue rounded-xl font-bold text-sm hover:bg-neon-blue/20 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Plus size={16} /> Add Order
                                    </button>
                                    <button
                                        onClick={handleDeleteBooking}
                                        className="py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl font-bold text-sm hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <X size={16} /> Delete Booking
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 text-sm italic">
                                Table is available
                            </div>
                        )}

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AdminTableModal;
