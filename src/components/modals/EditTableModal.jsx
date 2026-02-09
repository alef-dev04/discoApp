import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Trash2, Box, DollarSign, Users } from 'lucide-react';

const EditTableModal = ({ isOpen, onClose, table, onUpdateTable, onDeleteTable }) => {
    const [formData, setFormData] = useState({
        name: '',
        section: '',
        capacity_min: 0,
        capacity_max: 0,
        price_per_person: 0,
        min_spend: 0,
    });

    useEffect(() => {
        if (table) {
            setFormData({
                name: table.name || '',
                section: table.section || '',
                capacity_min: table.capacity?.min || table.capacity_min || 0,
                capacity_max: table.capacity?.max || table.capacity_max || 0,
                price_per_person: table.pricePerPerson || table.price_per_person || 0,
                min_spend: table.minSpend || table.min_spend || 0,
            });
        }
    }, [table]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Construct the update object matching DB schema
        const updates = {
            name: formData.name,
            section: formData.section,
            capacity_min: parseInt(formData.capacity_min),
            capacity_max: parseInt(formData.capacity_max),
            price_per_person: parseFloat(formData.price_per_person),
            min_spend: parseFloat(formData.min_spend),
        };
        await onUpdateTable(table.id, updates);
        onClose();
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this table? This action cannot be undone.')) {
            await onDeleteTable(table.id);
            onClose();
        }
    };

    if (!isOpen || !table) return null;

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
                    className="glass-card w-full max-w-md rounded-2xl overflow-hidden relative z-10 border border-yellow-500/30 shadow-yellow-900/20"
                >
                    <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-yellow-500">
                            <Box size={20} /> Edit Table
                        </h2>
                        <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-400 uppercase">Table Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-dark-bg border border-white/10 rounded-lg p-2 text-sm focus:border-yellow-500 outline-none transition-colors"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-400 uppercase">Section</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.section}
                                    onChange={e => setFormData({ ...formData, section: e.target.value })}
                                    className="w-full bg-dark-bg border border-white/10 rounded-lg p-2 text-sm focus:border-yellow-500 outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-400 uppercase flex items-center gap-1"><Users size={12} /> Min Capacity</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={formData.capacity_min}
                                    onChange={e => setFormData({ ...formData, capacity_min: e.target.value })}
                                    className="w-full bg-dark-bg border border-white/10 rounded-lg p-2 text-sm focus:border-yellow-500 outline-none transition-colors"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-400 uppercase flex items-center gap-1"><Users size={12} /> Max Capacity</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={formData.capacity_max}
                                    onChange={e => setFormData({ ...formData, capacity_max: e.target.value })}
                                    className="w-full bg-dark-bg border border-white/10 rounded-lg p-2 text-sm focus:border-yellow-500 outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-400 uppercase flex items-center gap-1"><DollarSign size={12} /> Price / Person</label>
                                <input
                                    type="number"
                                    min="0"
                                    required
                                    value={formData.price_per_person}
                                    onChange={e => setFormData({ ...formData, price_per_person: e.target.value })}
                                    className="w-full bg-dark-bg border border-white/10 rounded-lg p-2 text-sm focus:border-yellow-500 outline-none transition-colors"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-400 uppercase flex items-center gap-1"><DollarSign size={12} /> Min Spend</label>
                                <input
                                    type="number"
                                    min="0"
                                    required
                                    value={formData.min_spend}
                                    onChange={e => setFormData({ ...formData, min_spend: e.target.value })}
                                    className="w-full bg-dark-bg border border-white/10 rounded-lg p-2 text-sm focus:border-yellow-500 outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="flex-1 py-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl font-bold text-sm hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                            >
                                <Trash2 size={16} /> Delete Table
                            </button>
                            <button
                                type="submit"
                                className="flex-[2] py-3 bg-yellow-500 text-black rounded-xl font-bold text-sm hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
                            >
                                <Save size={16} /> Save Changes
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default EditTableModal;
