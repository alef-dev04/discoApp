import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Minus, Plus, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const BookingModal = ({ isOpen, onClose, table, onConfirm }) => {
    if (!isOpen || !table) return null;

    const { selectedDate } = useAppContext(); // Get date from context
    const [bookingName, setBookingName] = useState('');
    const [guestList, setGuestList] = useState([]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');

    // Format date for display
    const dateDisplay = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    useEffect(() => {
        if (table) {
            setBookingName('');
            setGuestList([]);
            setFirstName('');
            setLastName('');
            setError('');
        }
    }, [table]);

    const addGuest = () => {
        if (!firstName.trim() || !lastName.trim()) return;
        // Capacity check removed
        setGuestList([...guestList, { firstName, lastName, id: Date.now() }]);
        setFirstName('');
        setLastName('');
        setError('');
    };

    const removeGuest = (id) => {
        setGuestList(prev => prev.filter(g => g.id !== id));
        setError('');
    };

    const totalPrice = guestList.length * table.pricePerPerson;
    const finalPrice = Math.max(totalPrice, table.minSpend);
    const canConfirm = guestList.length > 0; // Just needs at least one person
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
                    <div className="p-6 border-b border-white/5 bg-white/5 relative flex-shrink-0">
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                        <h2 className="text-2xl font-bold">{table.name}</h2>
                        <div className="flex justify-between items-center mt-1">
                            <p className="text-neon-purple text-sm uppercase tracking-wider font-semibold">{table.section}</p>
                            <p className="text-gray-300 text-sm font-medium">{dateDisplay}</p>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                        <div className="flex justify-between items-center text-sm text-gray-400">
                            <span>Capacity: {table.capacity.min}-{table.capacity.max} guests</span>
                            <span>Min Spend: <span className="text-white">€{table.minSpend}</span></span>
                        </div>

                        {/* Booking Name Input */}
                        <div className="space-y-1">
                            <label className="text-xs uppercase text-gray-500 font-bold tracking-wider">Booking Name <span className="text-red-500">*</span></label>
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
                            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                        </div>

                        {/* Guest List Display */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs uppercase text-gray-500 font-bold tracking-wider">
                                <span>Guest List ({guestList.length})</span>
                            </div>

                            {guestList.length === 0 ? (
                                <div className="text-center py-4 text-gray-600 text-sm border border-white/5 border-dashed rounded-lg">
                                    No guests added yet
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {guestList.map(guest => (
                                        <motion.div
                                            key={guest.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, height: 0 }}
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

                        {/* Price Summary */}
                        <div className="space-y-2 pt-4 border-t border-white/10">
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>Price per person</span>
                                <span>€{table.pricePerPerson}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold">
                                <span>Total</span>
                                <span className="text-neon-blue">€{finalPrice}</span>
                            </div>
                        </div>

                        {/* Action Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onConfirm(table.id, bookingName, guestList, finalPrice)}
                            disabled={!canConfirm || !bookingName.trim()}
                            className="w-full py-4 bg-gradient-to-r from-neon-purple to-neon-magenta rounded-xl font-bold tracking-widest text-white shadow-lg shadow-neon-purple/20 flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50 disabled:filter disabled:grayscale"
                        >
                            <CreditCard size={18} />
                            RESERVE TABLE
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default BookingModal;
