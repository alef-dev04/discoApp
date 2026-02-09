import { useRef } from 'react';
import Table from './Table';

const FloorPlan = ({ tables, onTableClick, isUserView = true, isEditing = false, onTableChange }) => {
    const containerRef = useRef(null);

    const handleDragEnd = (id, info) => {
        if (!containerRef.current || !onTableChange) return;

        const table = tables.find(t => t.id === id);
        if (!table) return;

        const { width, height } = containerRef.current.getBoundingClientRect();

        // Calculate new percentage based on delta
        // info.offset gives the total movement from start
        let newX = table.position.x + (info.offset.x / width) * 100;
        let newY = table.position.y + (info.offset.y / height) * 100;

        // Clamp to keep inside (accounting for table size roughly)
        newX = Math.max(2, Math.min(98, newX));
        newY = Math.max(2, Math.min(98, newY));

        onTableChange(id, { x: newX, y: newY });
    };

    return (
        <div
            ref={containerRef}
            className={`w-full h-full relative bg-dark-deep rounded-3xl overflow-hidden border border-white/5 shadow-2xl group transition-colors ${isEditing ? 'border-yellow-500/30' : ''}`}
        >
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
            </div>

            {/* Ambient Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-neon-purple/5 rounded-full blur-[100px]" />

            {/* Stage / DJ Area Indicator */}
            <div className="absolute top-2 md:top-5 left-1/2 -translate-x-1/2 w-28 h-8 md:w-48 md:h-12 bg-white/5 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-sm">
                <span className="text-[8px] md:text-xs tracking-[0.3em] md:tracking-[0.5em] text-neon-blue font-bold">DJ BOOTH</span>
            </div>

            {/* Tables Layer */}
            <div className="absolute inset-0">
                {tables.map(table => (
                    <Table
                        // Force remount on position change to reset drag transforms
                        key={`${table.id}-${table.position.x}-${table.position.y}`}
                        data={table}
                        onClick={onTableClick}
                        isUserView={isUserView}
                        isEditing={isEditing}
                        onDragEnd={handleDragEnd}
                    />
                ))}
            </div>

            {/* Legend (Bottom Left on mobile, Bottom Right on desktop) */}
            <div className="absolute bottom-2 left-2 md:bottom-5 md:left-auto md:right-5 glass px-2 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl flex flex-col gap-1.5 md:gap-2">
                <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500/20 border border-green-500 box-glow-green" />
                    <span className="text-[9px] md:text-[10px] uppercase text-gray-400">Available</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-900/40 border border-red-500" />
                    <span className="text-[9px] md:text-[10px] uppercase text-gray-400">Occupied</span>
                </div>
                {isUserView ? (
                    <div className="flex items-center gap-1.5 md:gap-2">
                        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-neon-purple/20 border border-neon-purple box-glow-purple" />
                        <span className="text-[9px] md:text-[10px] uppercase text-gray-400">Your Table</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 md:gap-2">
                        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-orange-500/20 border border-orange-500" />
                        <span className="text-[9px] md:text-[10px] uppercase text-gray-400">Partially Full</span>
                    </div>
                )}
            </div>

            {/* Edit Mode Indicator */}
            {isEditing && (
                <div className="absolute top-2 right-2 md:top-5 md:right-5 bg-yellow-500/10 border border-yellow-500 text-yellow-500 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold animate-pulse">
                    EDITING MODE
                </div>
            )}
        </div>
    );
};

export default FloorPlan;
