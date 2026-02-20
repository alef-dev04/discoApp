import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ReportCharts = ({ reportData }) => {
    if (!reportData) return null;

    const totalGuests = reportData.totalGuests || 0;
    const totalArrived = reportData.totalArrived || 0;
    const totalMissing = totalGuests - totalArrived;

    // Data for Pie Chart (Arrivals vs Missing)
    const pieData = [
        { name: 'Arrivati', value: totalArrived, color: '#10b981' },
        { name: 'Mancanti', value: totalMissing, color: '#ef4444' }
    ];

    // Data for Bar Chart (per table)
    const barData = reportData.tables.map(table => ({
        name: table.name,
        prenotati: table.guestsTotal,
        arrivati: table.guestsArrived
    }));

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-card p-3 rounded-lg border border-white/20">
                    <p className="text-sm font-bold text-white">{payload[0].name}</p>
                    <p className="text-xs text-neon-purple">{payload[0].value} ospiti</p>
                </div>
            );
        }
        return null;
    };

    const CustomBarTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-card p-3 rounded-lg border border-white/20">
                    <p className="text-sm font-bold text-white mb-2">{payload[0].payload.name}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-xs" style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            <div className="bg-dark-bg border border-white/5 rounded-xl p-6">
                <h3 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wide">
                    📊 Panoramica Arrivi
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Pie Chart */}
                    <div>
                        <h4 className="text-xs text-gray-400 mb-3 text-center">Distribuzione Ospiti</h4>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-4 mt-3">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-xs text-gray-400">Arrivati: {totalArrived}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span className="text-xs text-gray-400">Mancanti: {totalMissing}</span>
                            </div>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div>
                        <h4 className="text-xs text-gray-400 mb-3 text-center">Dettaglio per Tavolo</h4>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#9ca3af"
                                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                                />
                                <YAxis
                                    stroke="#9ca3af"
                                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                                />
                                <Tooltip content={<CustomBarTooltip />} />
                                <Legend
                                    wrapperStyle={{ fontSize: '12px' }}
                                    iconType="circle"
                                />
                                <Bar
                                    dataKey="prenotati"
                                    fill="#3b82f6"
                                    name="Prenotati"
                                    radius={[8, 8, 0, 0]}
                                />
                                <Bar
                                    dataKey="arrivati"
                                    fill="#10b981"
                                    name="Arrivati"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportCharts;
