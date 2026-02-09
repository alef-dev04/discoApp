import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import FloorPlan from '../components/floorplan/FloorPlan';
import AdminTableModal from '../components/modals/AdminTableModal';
import EditTableModal from '../components/modals/EditTableModal';
import DateSelector from '../components/common/DateSelector';
import { LogOut, Users, DollarSign, Activity, Edit, Plus, Save } from 'lucide-react';

const AdminView = () => {
    const { tables, logout, addOrder, cancelBooking, updateBooking, updateTable, addTable, deleteTable, updateTablePosition } = useAppContext();
    const [selectedTableId, setSelectedTableId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const activeTable = useMemo(() => {
        return tables.find(t => t.id === selectedTableId) || null;
    }, [tables, selectedTableId]);

    const stats = useMemo(() => {
        let totalRevenue = 0;
        let totalGuests = 0;
        let occupiedTables = 0;

        tables.forEach(t => {
            if (t.status === 'occupied' || t.status === 'partial') {
                occupiedTables++;
                t.bookings.forEach(b => {
                    totalRevenue += (b.total || 0);
                    totalGuests += (b.guests || 0);
                });
            }
        });

        const totalCapacity = tables.reduce((acc, t) => acc + t.capacity.max, 0);
        const occupancyRate = totalCapacity > 0 ? Math.round((totalGuests / totalCapacity) * 100) : 0;

        return { totalRevenue, totalGuests, occupiedTables, occupancyRate };
    }, [tables]);

    const handleTableClick = (table) => {
        setSelectedTableId(table.id);
    };

    const handleAddTable = async () => {
        const newTableData = {
            name: `Table ${tables.length + 1}`,
            section: 'Main Floor',
            capacity_min: 4,
            capacity_max: 6,
            price_per_person: 50,
            min_spend: 200,
            position_x: 50,
            position_y: 50,
            status: 'available'
        };
        const newTable = await addTable(newTableData);
        if (newTable) {
            setSelectedTableId(newTable.id);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-dark-bg text-white overflow-hidden relative">
            {/* Admin Header */}
            <header className="h-auto glass z-20 px-3 md:px-8 py-2 md:py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-4">
                <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
                    <div>
                        <h1 className="text-base md:text-xl font-bold tracking-widest text-neon-blue">ADMIN<span className="text-white">DASHBOARD</span></h1>
                    </div>
                </div>

                <div className="flex items-center justify-between w-full md:w-auto gap-2 md:gap-4">
                    {!isEditing && (
                        <div className="z-30">
                            <DateSelector />
                        </div>
                    )}

                    {/* Controls & Stats */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Edit Mode Controls */}
                        <div className="flex items-center gap-1 md:gap-2">
                            {isEditing && (
                                <button
                                    onClick={handleAddTable}
                                    className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl bg-neon-blue/20 border border-neon-blue/50 text-neon-blue hover:bg-neon-blue/30 transition-all font-bold text-xs md:text-sm"
                                >
                                    <Plus size={14} className="md:hidden" />
                                    <Plus size={16} className="hidden md:block" />
                                    <span className="hidden sm:inline">Add Table</span>
                                </button>
                            )}
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl border transition-all text-xs md:text-sm ${isEditing ? 'bg-yellow-500 text-black border-yellow-500 font-bold' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'}`}
                            >
                                {isEditing ? <Save size={14} className="md:hidden" /> : <Edit size={14} className="md:hidden" />}
                                {isEditing ? <Save size={16} className="hidden md:block" /> : <Edit size={16} className="hidden md:block" />}
                                <span className="hidden sm:inline">{isEditing ? 'Done' : 'Edit Layout'}</span>
                            </button>
                        </div>

                        {/* Quick Stats (Hide on mobile and in Edit Mode) */}
                        {!isEditing && (
                            <div className="hidden lg:flex bg-dark-deep rounded-xl border border-white/5 p-2 gap-4 md:gap-8 overflow-x-auto">
                                <div className="px-2">
                                    <p className="text-[10px] text-gray-400 uppercase">Revenue</p>
                                    <div className="flex items-center gap-1 text-neon-blue font-bold">
                                        <DollarSign size={14} /> {stats.totalRevenue.toLocaleString()}
                                    </div>
                                </div>

                                <div className="w-px bg-white/10 h-8 self-center" />

                                <div className="px-2">
                                    <p className="text-[10px] text-gray-400 uppercase">Occupancy</p>
                                    <div className="flex items-center gap-1 text-neon-magenta font-bold">
                                        <Activity size={14} /> {stats.occupancyRate}%
                                    </div>
                                </div>

                                <div className="w-px bg-white/10 h-8 self-center" />

                                <div className="px-2">
                                    <p className="text-[10px] text-gray-400 uppercase">Tables</p>
                                    <div className="flex items-center gap-1 text-neon-purple font-bold">
                                        <Users size={14} /> {stats.occupiedTables}/{tables.length}
                                    </div>
                                </div>
                            </div>
                        )}

                        <button onClick={logout} className="p-1.5 md:p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                            <LogOut size={16} className="md:hidden" />
                            <LogOut size={18} className="hidden md:block" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 relative">
                <FloorPlan
                    tables={tables}
                    onTableClick={handleTableClick}
                    isUserView={false}
                    isEditing={isEditing}
                    onTableChange={(id, pos) => updateTablePosition(id, pos.x, pos.y)}
                />
            </main>

            {/* Admin Modals */}
            {isEditing ? (
                <EditTableModal
                    isOpen={!!activeTable}
                    onClose={() => setSelectedTableId(null)}
                    table={activeTable}
                    onUpdateTable={updateTable}
                    onDeleteTable={deleteTable}
                />
            ) : (
                <AdminTableModal
                    isOpen={!!activeTable}
                    onClose={() => setSelectedTableId(null)}
                    table={activeTable}
                    onAddOrder={(id, amt) => {
                        addOrder(id, amt);
                    }}
                    onCancelBooking={cancelBooking}
                    onUpdateBooking={updateBooking}
                />
            )}
        </div>
    );
};

export default AdminView;
