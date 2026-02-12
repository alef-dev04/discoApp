import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, TrendingUp, Download, CheckCircle, XCircle } from 'lucide-react';

const ReportModal = ({ isOpen, onClose, generateReport }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [reportData, setReportData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            handleGenerateReport();
        }
    }, [isOpen, selectedDate]);

    const handleGenerateReport = async () => {
        setIsLoading(true);
        const data = await generateReport(selectedDate);
        setReportData(data);
        setIsLoading(false);
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('it-IT', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateInput = (date) => {
        return date.toISOString().split('T')[0];
    };

    if (!isOpen) return null;

    const totalTables = reportData?.tables.length || 0;
    const totalGuests = reportData?.totalGuests || 0;
    const totalArrived = reportData?.totalArrived || 0;
    const totalMissing = totalGuests - totalArrived;
    const arrivalRate = totalGuests > 0 ? Math.round((totalArrived / totalGuests) * 100) : 0;

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
                    className="glass-card w-full max-w-4xl rounded-2xl overflow-hidden relative z-10 max-h-[90vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 bg-gradient-to-r from-neon-purple/10 to-neon-blue/10 relative flex justify-between items-center shrink-0">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <TrendingUp className="text-neon-purple" size={28} />
                                Report Serata
                            </h2>
                            <p className="text-sm text-gray-400 mt-1">{formatDate(selectedDate)}</p>
                        </div>
                        <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Date Selector */}
                    <div className="p-6 border-b border-white/5 bg-white/5">
                        <div className="flex items-center gap-4">
                            <Calendar className="text-neon-blue" size={20} />
                            <label className="text-sm font-bold text-gray-300">Seleziona Data:</label>
                            <input
                                type="date"
                                value={formatDateInput(selectedDate)}
                                onChange={(e) => setSelectedDate(new Date(e.target.value + 'T12:00:00'))}
                                className="px-4 py-2 bg-dark-bg border border-white/10 rounded-lg text-white focus:outline-none focus:border-neon-blue transition-colors"
                            />
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-purple"></div>
                            </div>
                        ) : (
                            <>
                                {/* Summary Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-gradient-to-br from-neon-purple/20 to-neon-purple/5 p-4 rounded-xl border border-neon-purple/30">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Tavoli Prenotati</p>
                                        <div className="text-neon-purple font-bold text-2xl">{totalTables}</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-neon-blue/20 to-neon-blue/5 p-4 rounded-xl border border-neon-blue/30">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Ospiti Totali</p>
                                        <div className="text-neon-blue font-bold text-2xl">{totalGuests}</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 p-4 rounded-xl border border-green-500/30">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Arrivati</p>
                                        <div className="text-green-400 font-bold text-2xl">{totalArrived}</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-red-500/20 to-red-500/5 p-4 rounded-xl border border-red-500/30">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Mancanti</p>
                                        <div className="text-red-400 font-bold text-2xl">{totalMissing}</div>
                                    </div>
                                </div>

                                {/* Arrival Rate Bar */}
                                <div className="bg-dark-bg p-4 rounded-xl border border-white/5">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold text-gray-300">Tasso di Arrivo</span>
                                        <span className="text-lg font-bold text-neon-purple">{arrivalRate}%</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${arrivalRate}%` }}
                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                            className="h-full bg-gradient-to-r from-neon-purple to-neon-blue rounded-full"
                                        />
                                    </div>
                                </div>

                                {/* Tables List */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide flex items-center gap-2">
                                        <Users size={16} />
                                        Dettaglio Tavoli ({totalTables})
                                    </h3>

                                    {reportData && reportData.tables.length > 0 ? (
                                        <div className="space-y-3">
                                            {reportData.tables.map((table) => {
                                                const arrivedCount = table.guestsArrived;
                                                const totalCount = table.guestsTotal;
                                                const missing = totalCount - arrivedCount;
                                                const tableRate = totalCount > 0 ? Math.round((arrivedCount / totalCount) * 100) : 0;

                                                return (
                                                    <div key={table.id} className="bg-dark-bg border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div>
                                                                <h4 className="font-bold text-white text-lg">{table.name}</h4>
                                                                <p className="text-xs text-gray-400">{table.bookingName || 'VIP Booking'}</p>
                                                            </div>
                                                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${tableRate === 100 ? 'bg-green-500/20 text-green-400' : tableRate > 50 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                                                                {tableRate}%
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-3 gap-3 mb-3">
                                                            <div className="text-center p-2 bg-white/5 rounded-lg">
                                                                <p className="text-[10px] text-gray-500 uppercase mb-1">Prenotati</p>
                                                                <p className="text-lg font-bold text-neon-blue">{totalCount}</p>
                                                            </div>
                                                            <div className="text-center p-2 bg-green-500/10 rounded-lg">
                                                                <p className="text-[10px] text-gray-500 uppercase mb-1">Arrivati</p>
                                                                <p className="text-lg font-bold text-green-400 flex items-center justify-center gap-1">
                                                                    <CheckCircle size={14} />
                                                                    {arrivedCount}
                                                                </p>
                                                            </div>
                                                            <div className="text-center p-2 bg-red-500/10 rounded-lg">
                                                                <p className="text-[10px] text-gray-500 uppercase mb-1">Mancanti</p>
                                                                <p className="text-lg font-bold text-red-400 flex items-center justify-center gap-1">
                                                                    <XCircle size={14} />
                                                                    {missing}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Progress bar */}
                                                        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                                                            <div
                                                                style={{ width: `${tableRate}%` }}
                                                                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="bg-dark-bg border border-white/5 rounded-xl p-8 text-center">
                                            <Users className="mx-auto mb-3 text-gray-600" size={40} />
                                            <p className="text-gray-400">Nessuna prenotazione per questa data</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-white/5 bg-white/5 shrink-0">
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-neon-purple/20 border border-neon-purple/50 text-neon-purple rounded-xl font-bold hover:bg-neon-purple/30 transition-colors"
                        >
                            Chiudi Report
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ReportModal;
