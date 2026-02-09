import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

const Table = ({ data, onClick, isUserView, isEditing, onDragEnd }) => {
    const { status, position, name, capacity, section } = data;

    // Status definitions
    const getStatusColor = () => {
        if (isEditing) return 'border-yellow-400 bg-yellow-400/20 border-dashed';
        switch (status) {
            case 'available': return 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)] bg-green-500/10';
            case 'partial': return 'border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)] bg-orange-500/10';
            case 'occupied': return 'border-red-500 bg-red-900/20'; // Darker overlay
            case 'yours': return 'border-neon-purple shadow-[0_0_20px_rgba(217,70,239,0.5)] bg-neon-purple/20';
            default: return 'border-gray-700 bg-gray-900/50';
        }
    };

    const isAvailable = status === 'available';

    return (
        <motion.div
            className={`absolute group ${isEditing ? 'cursor-grab active:cursor-grabbing z-50' : 'cursor-pointer'}`}
            style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
            }}
            // Use drag functionality only when editing
            drag={isEditing}
            dragMomentum={false}
            onDragEnd={(event, info) => isEditing && onDragEnd && onDragEnd(data.id, info)}
            onTap={() => onClick(data)}
            initial={{ scale: 0 }}
            animate={{ scale: 1, x: '-50%', y: '-50%' }} // Center the element using animate to avoid conflict
            whileHover={{ scale: 1.1, zIndex: 10 }}
        >
            {/* Table Circle */}
            <div
                className={`w-16 h-16 rounded-full border-2 flex items-center justify-center relative transition-all duration-300 ${getStatusColor()}`}
            >
                {/* Editing Badge */}
                {isEditing && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black text-[9px] font-bold px-1.5 rounded-full">
                        EDIT
                    </div>
                )}

                {isAvailable && !isEditing && (
                    <div className="absolute inset-0 rounded-full border border-green-400 animate-ping opacity-20" />
                )}

                <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-white/80">{name.split(' ')[1]}</span>
                    {(isUserView || isEditing) && (
                        <div className="flex items-center gap-0.5 mt-0.5">
                            <Users size={8} className="text-gray-400" />
                            <span className="text-[9px] text-gray-400">{capacity.max}</span>
                        </div>
                    )}
                </div>

                {/* Admin Overlay Info (Badge) - Hide when editing */}
                {!isUserView && !isEditing && status !== 'available' && (
                    <div className="absolute -top-2 -right-2 bg-dark-bg border border-white/20 text-[9px] px-1.5 py-0.5 rounded-full text-white shadow-lg">
                        {data.bookings?.[0]?.guests || 0}/{capacity.max}
                    </div>
                )}
            </div>


        </motion.div>
    );
};

export default Table;
