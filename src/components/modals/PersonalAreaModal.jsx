import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Trash2, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import EditBookingModal from './EditBookingModal';

const PersonalAreaModal = ({ isOpen, onClose }) => {
    const { user, fetchUserBookings, cancelBooking, tables } = useAppContext();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        if (isOpen && user) {
            loadBookings();
        }
    }, [isOpen, user]);

    const loadBookings = async () => {
        setLoading(true);
        const data = await fetchUserBookings();
        setBookings(data || []);
        setLoading(false);
    };

    const handleCancel = async (bookingId) => {
        if (confirm('Are you sure you want to cancel this booking?')) {
            await cancelBooking(bookingId);
            loadBookings(); // Refresh list
        }
    };

    const handleEdit = (booking) => {
        setSelectedBooking(booking);
    };

    const handleEditClose = () => {
        setSelectedBooking(null);
        loadBookings(); // Refresh on close
    };

    if (!isOpen) return null;

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
                    className="glass-card w-full max-w-2xl rounded-2xl overflow-hidden relative z-10 max-h-[85vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 bg-white/5 relative flex-shrink-0 flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Personal Area</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                        <h3 className="text-lg font-semibold mb-4 text-neon-blue">My Bookings</h3>

                        {loading ? (
                            <div className="text-center py-8 text-gray-400">Loading...</div>
                        ) : bookings.length === 0 ? (
                            <div className="text-center py-12 border border-white/5 border-dashed rounded-xl">
                                <p className="text-gray-400">No active bookings found.</p>
                                <button onClick={onClose} className="mt-4 text-neon-purple hover:underline">
                                    Browse Tables
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {bookings.map(booking => {
                                    // Find table details (assuming tables are loaded in context)
                                    // If tables aren't fully loaded or strict relation needed, might need join fetch. 
                                    // But 'tables' in context should have them.
                                    // Actually bookings return from fetchUserBookings might just be booking rows.
                                    // Ideally fetchUserBookings returns joined data or we lookup.
                                    // Let's assume fetchUserBookings returns data with table info or we lookup from context tables.
                                    // Looking up from context 'tables' is safer if they are static/fetched.
                                    const table = tables.find(t => t.id === booking.table_id);
                                    const tableName = table ? table.name : `Table #${booking.table_id}`;
                                    const tableSection = table ? table.section : 'Unknown';

                                    // Use custom name if set, otherwise table name
                                    const displayTitle = booking.booking_name || tableName;

                                    return (
                                        <motion.div
                                            key={booking.id}
                                            layout
                                            className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer"
                                            onClick={() => handleEdit(booking)}
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-bold text-lg">{displayTitle}</h4>
                                                    {booking.booking_name && <span className="text-xs text-gray-500">({tableName})</span>}
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-neon-purple/20 text-neon-purple border border-neon-purple/20">
                                                        {tableSection}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-300">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        <span>{booking.booking_date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <User size={14} />
                                                        <span>{booking.guest_count} Guests</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                {/* Edit button visually implicit by clicking card, or explicit */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleCancel(booking.id); }}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors text-sm font-medium z-10"
                                                >
                                                    <Trash2 size={16} /> Cancel
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            <EditBookingModal
                isOpen={!!selectedBooking}
                onClose={handleEditClose}
                booking={selectedBooking}
            />
        </AnimatePresence>
    );
};

export default PersonalAreaModal;
