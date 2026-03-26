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
            {/* CSS Blueprint Map Base */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40 select-none overflow-hidden">
                <div className="w-full h-full relative">

                    {/* Top 3 Vertical Main Areas */}
                    <div className="absolute top-0 left-0 w-[30%] h-[85%] border-b border-r border-white/60"></div>

                    <div className="absolute top-0 left-[30%] w-[40%] h-[85%] border-b border-white/60 relative">
                        {/* Console inside middle area */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[15%] border-b border-l border-r border-white/60 flex flex-col items-center justify-center bg-dark-deep/50">
                            <span className="text-white/40 text-[8px] md:text-sm font-light tracking-[0.3em] pt-1">CONSOLE</span>
                            {/* Small protruding box */}
                            <div className="absolute -bottom-2 w-1/3 h-2 border-b border-l border-r border-white/40"></div>
                        </div>
                    </div>

                    <div className="absolute top-0 right-0 w-[30%] h-[85%] border-b border-l border-white/60"></div>

                    {/* Vertical Dividers for outer table columns */}
                    <div className="absolute top-0 left-[11%] w-0 h-[85%] border-l border-white/60"></div>
                    <div className="absolute top-0 right-[11%] w-0 h-[85%] border-r border-white/60"></div>

                    {/* Corridor Horizontal Area */}
                    <div className="absolute top-[85%] left-0 w-full h-[8%] border-b border-white/60">
                    </div>

                    {/* MO MA Area */}
                    <div className="absolute top-[90%] left-[20%] w-[60%] h-[8%] border-b border-l border-r border-white/40 flex items-center justify-center relative">
                        <span className="text-white/80 tracking-widest text-sm md:text-xl font-medium">MO</span>
                        <svg className="w-5 h-5 md:w-6 md:h-6 text-white/50 mx-2 md:mx-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                        <span className="text-white/80 tracking-widest text-sm md:text-xl font-medium">MA</span>

                        {/* Arrows pointing up */}
                        <span className="absolute -bottom-6 -left-4 md:-left-8 text-white/40 text-[12px] md:text-sm">↑</span>
                        <span className="absolute -bottom-6 -right-4 md:-right-8 text-white/40 text-[12px] md:text-sm">↑</span>
                    </div>

                    {/* Cambusa label */}
                    <div className="absolute bottom-2 md:bottom-3 left-[20%] w-[60%] text-center">
                        <span className="text-white/70 tracking-[0.4em] font-semibold italic text-[10px] md:text-base uppercase">CAMBUSA</span>
                    </div>

                    {/* Entrance (Bottom Right) */}
                    <div className="absolute top-[84%] right-[4%] flex flex-col items-end">
                        <div className="flex items-center gap-1">
                            <svg className="w-10 h-6 md:w-16 md:h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8" d="M4 12h16M4 12l4-4M4 12l4 4" />
                            </svg>
                        </div>
                        <span className="text-white/50 tracking-[0.2em] text-[8px] md:text-[10px] uppercase font-bold pr-1">INGRESSO</span>
                    </div>

                </div>
            </div>

            {/* Ambient Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-neon-purple/5 rounded-full blur-[100px]" />

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
