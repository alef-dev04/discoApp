import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Plus, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const EditBookingModal = ({ isOpen, onClose, booking }) => {
    const { updateBooking, tables } = useAppContext();
    const [guestList, setGuestList] = useState([]);
    const [bookingName, setBookingName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);

    // Get Table Details
    const table = tables.find(t => t.id === booking?.table_id);

    useEffect(() => {
        if (booking) {
            setGuestList(booking.guest_list || []);
            setBookingName(booking.booking_name || '');
            setFirstName('');
            setLastName('');
            setLoading(false);
        }
    }, [booking]);

    const addGuest = () => {
        if (!firstName.trim() || !lastName.trim()) return;
        setGuestList([...guestList, { firstName, lastName, id: Date.now() }]);
        setFirstName('');
        setLastName('');
    };

    const removeGuest = (id) => {
        setGuestList(prev => prev.filter(g => g.id !== id));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateBooking(booking.id, {
                booking_name: bookingName,
                guest_list: guestList,
                guest_count: guestList.length,
                // Optionally update price if needed, but usually price is fixed or deposit based?
                // For now keeping price as is or we can recalculate:
                // total_price: guestList.length * table.pricePerPerson 
                // But let's assume price might have been paid or is fixed deposit. 
                // If per person, we should update it.
                total_price: table ? Math.max(guestList.length * table.pricePerPerson, table.minSpend) : booking.total_price
            });
            onClose();
        } catch (error) {
            console.error("Failed to update booking", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !booking) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
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
                    className="glass-card w-full max-w-lg rounded-2xl overflow-hidden relative z-50 max-h-[90vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 bg-white/5 relative flex-shrink-0">
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-bold">Edit Booking {table?.name}</h2>
                        <p className="text-neon-purple text-sm">{booking.booking_date}</p>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">

                        {/* Booking Name Input */}
                        <div className="space-y-1">
                            <label className="text-xs uppercase text-gray-500 font-bold tracking-wider">Booking Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Birthday Party"
                                value={bookingName}
                                onChange={(e) => setBookingName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-colors"
                            />
                        </div>

                        {/* Add Guest Form */}
                        <div className="bg-dark-bg p-4 rounded-xl border border-white/5 space-y-3">
                            <div className="flex items-center gap-2 text-gray-300 font-medium mb-1">
                                <User size={16} />
                                <span>Add Guest</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-purple transition-colors"
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-purple transition-colors"
                                    onKeyDown={e => e.key === 'Enter' && addGuest()}
                                />
                            </div>
                            <button
                                onClick={addGuest}
                                disabled={!firstName || !lastName}
                                className="w-full py-2 bg-white/5 hover:bg-neon-blue/20 text-neon-blue border border-neon-blue/20 rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Plus size={14} /> ADD TO LIST
                            </button>
                        </div>

                        {/* Guest List Display */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs uppercase text-gray-500 font-bold tracking-wider">
                                <span>Guest List ({guestList.length})</span>
                            </div>

                            {guestList.length === 0 ? (
                                <div className="text-center py-4 text-gray-600 text-sm border border-white/5 border-dashed rounded-lg">
                                    No guests added
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {guestList.map((guest, idx) => (
                                        <motion.div
                                            key={guest.id || idx}
                                            layout
                                            className="flex items-center justify-between bg-white/5 px-3 py-2 rounded-lg border border-white/5"
                                        >
                                            <span className="text-sm">{guest.firstName} {guest.lastName}</span>
                                            <button
                                                onClick={() => removeGuest(guest.id)}
                                                className="text-gray-500 hover:text-red-500 transition-colors p-1"
                                            >
                                                <X size={14} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/5 bg-white/5">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSave}
                            disabled={loading}
                            className="w-full py-3 bg-neon-purple hover:bg-neon-purple/80 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                            <Save size={18} />
                            {loading ? 'SAVING...' : 'SAVE CHANGES'}
                        </motion.button>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default EditBookingModal;
