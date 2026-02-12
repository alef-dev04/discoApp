import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [userMode, setUserMode] = useState('guest'); // 'guest' | 'admin'
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [tables, setTables] = useState([]);
    const [currentUserBooking, setCurrentUserBooking] = useState(null); // ID of booked table
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Helper to format date as YYYY-MM-DD for DB
    const formatDateForDB = (date) => {
        return date.toISOString().split('T')[0];
    };

    // Initial Data Load & Subscription
    useEffect(() => {
        // Auth Listener
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setIsAuthenticated(!!session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setIsAuthenticated(!!session);
        });

        // Fetch Initial Data
        fetchTables();

        // Realtime Subscription
        const channel = supabase
            .channel('public:bookings')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
                fetchBookings(tables, selectedDate); // Refresh bookings when DB changes
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
            supabase.removeChannel(channel);
        };
    }, []);

    // Re-fetch bookings when date or tables change
    useEffect(() => {
        if (tables.length > 0) {
            fetchBookings(tables, selectedDate);
        }
    }, [selectedDate, tables.length]); // Depend on tables.length to ensure we have base tables

    // Fetch Profile & User's Booking
    useEffect(() => {
        if (user && tables.length > 0) {
            const fetchProfile = async () => {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setUserMode(data.is_admin ? 'admin' : 'guest');
                }
            };
            fetchProfile();

            // Check if user has a booking for selected date
            // Note: fetched bookings are already merged into 'tables' state, 
            // but checking 'currentUserBooking' specifically might need finding which table they have.
            // For simplicity, we can trust the 'bookings' array in the table objects.
            const dateStr = formatDateForDB(selectedDate);
            const bookedTable = tables.find(t =>
                t.bookings && t.bookings.some(b => b.user_id === user.id && b.booking_date === dateStr)
            );
            if (bookedTable) {
                setCurrentUserBooking(bookedTable.id);
            } else {
                setCurrentUserBooking(null);
            }
        }
    }, [user, tables, selectedDate]);

    const fetchTables = async () => {
        const { data, error } = await supabase
            .from('tables')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Error fetching tables:', error);
            return;
        }

        // Initialize tables with empty bookings
        const initializedTables = data.map(t => ({
            ...t,
            capacity: { min: t.capacity_min, max: t.capacity_max }, // Adapt to frontend structure
            pricePerPerson: t.price_per_person,
            minSpend: t.min_spend,
            position: { x: t.position_x, y: t.position_y },
            bookings: []
        }));

        setTables(initializedTables);
        // fetchBookings will be triggered by useEffect
    };

    const fetchBookings = async (currentTables, date) => {
        if (!currentTables.length) return;

        const dateStr = formatDateForDB(date);
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('booking_date', dateStr);

        if (error) {
            console.error('Error fetching bookings:', error);
            return;
        }

        setTables(prevTables => {
            return prevTables.map(t => {
                const tableBookings = data.filter(b => b.table_id === t.id);
                const isOccupied = tableBookings.length > 0;
                return {
                    ...t,
                    status: isOccupied ? 'occupied' : 'available',
                    bookings: tableBookings.map(b => ({
                        ...b,
                        guests: b.guest_count,
                        total: b.total_price,
                    }))
                };
            });
        });
    };

    const login = async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    };

    const signUp = async (email, password) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: email.split('@')[0], // Default name
                }
            }
        });
        if (error) throw error;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUserMode('guest');
        setCurrentUserBooking(null);
    };

    const bookTable = async (tableId, bookingName, guestList, total) => {
        if (!user) return;

        const dateStr = formatDateForDB(selectedDate);

        const { error } = await supabase.from('bookings').insert({
            table_id: tableId,
            user_id: user.id,
            booking_date: dateStr,
            booking_name: bookingName, // Custom name
            guest_name: user.email,
            guest_count: guestList.length,
            guest_list: guestList,
            total_price: total,
            status: 'confirmed'
        });

        if (error) {
            console.error('Booking failed:', error);
            throw error;
        }

        // Optimistic update or wait for realtime/refetch
        fetchBookings(tables, selectedDate);
        setCurrentUserBooking(tableId);
    };

    const fetchUserBookings = async () => {
        if (!user) return [];

        // Fetch bookings for this user, ordered by date
        // We might want to filter only future bookings? 
        // For now, all bookings for simplicity or >= today.
        const today = new Date().toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('user_id', user.id)
            .gte('booking_date', today)
            .order('booking_date', { ascending: true });

        if (error) {
            console.error('Error fetching user bookings:', error);
            return [];
        }
        return data;
    };

    const cancelBooking = async (bookingId) => {
        const { error } = await supabase
            .from('bookings')
            .delete()
            .eq('id', bookingId);

        if (error) {
            console.error('Error canceling booking:', error);
            throw error;
        }
        // Refresh main tables view if the cancelled booking was on selected date
        fetchBookings(tables, selectedDate);
    };

    const updateBooking = async (bookingId, updates) => {
        const { error } = await supabase
            .from('bookings')
            .update(updates)
            .eq('id', bookingId);

        if (error) {
            console.error('Error updating booking:', error);
            throw error;
        }
        // Refresh
        fetchBookings(tables, selectedDate);
    };

    const updateTableStatus = async (tableId, newStatus) => {
        // Admin function - for MVP maybe unused or implemented via bookings deletion
        // To really implement 'make available', we'd need to delete the booking for this date.
        if (newStatus === 'available') {
            const dateStr = formatDateForDB(selectedDate);
            const { error } = await supabase
                .from('bookings')
                .delete()
                .eq('table_id', tableId)
                .eq('booking_date', dateStr);

            if (error) console.error('Error removing booking:', error);
            else fetchBookings(tables, selectedDate);
        }
    };

    const updateTable = async (id, updates) => {
        // Optimistic update
        setTables(prev => prev.map(t =>
            t.id === id ? { ...t, ...updates } : t
        ));

        // DB Update
        // Map frontend keys to DB keys if necessary, but we are using DB keys in EditTableModal mostly
        // Wait, EditTableModal sends: name, section, capacity_min, capacity_max, price_per_person, min_spend
        // DB keys are: name, section, capacity_min, capacity_max, price_per_person, min_spend
        // So we can pass `updates` directly.

        const { error } = await supabase
            .from('tables')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Error updating table:', error);
            fetchTables(); // Revert
            throw error;
        }
    };

    const updateTablePosition = async (id, x, y) => {
        // Optimistic update
        setTables(prev => prev.map(t =>
            t.id === id ? { ...t, position: { x, y }, position_x: x, position_y: y } : t
        ));

        const { error } = await supabase
            .from('tables')
            .update({ position_x: x, position_y: y })
            .eq('id', id);

        if (error) {
            console.error('Error updating table position:', error);
            fetchTables(); // Revert on error
        }
    };

    const addTable = async (tableData) => {
        const { data, error } = await supabase
            .from('tables')
            .insert(tableData)
            .select()
            .single();

        if (error) {
            console.error('Error adding table:', error);
            throw error;
        }

        // Add to local state (with empty bookings initially)
        const newTable = {
            ...data,
            capacity: { min: data.capacity_min, max: data.capacity_max },
            pricePerPerson: data.price_per_person,
            minSpend: data.min_spend,
            position: { x: data.position_x, y: data.position_y },
            bookings: []
        };

        setTables(prev => [...prev, newTable]);
        return newTable;
    };

    const deleteTable = async (id) => {
        const { error } = await supabase
            .from('tables')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting table:', error);
            throw error;
        }

        setTables(prev => prev.filter(t => t.id !== id));
    };

    const generateReport = async (date) => {
        const dateStr = formatDateForDB(date);

        // Fetch all bookings for the selected date
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('*, tables(name, section)')
            .eq('booking_date', dateStr);

        if (error) {
            console.error('Error fetching report data:', error);
            return { tables: [], totalGuests: 0, totalArrived: 0 };
        }

        // Process bookings to calculate statistics
        const tableStats = bookings.map(booking => {
            const guestsTotal = booking.guest_count || 0;
            const guestsArrived = booking.guest_list
                ? booking.guest_list.filter(g => g.arrived).length
                : 0;

            return {
                id: booking.table_id,
                name: booking.tables?.name || `Table ${booking.table_id}`,
                section: booking.tables?.section || 'Unknown',
                bookingName: booking.booking_name,
                guestsTotal,
                guestsArrived
            };
        });

        const totalGuests = tableStats.reduce((sum, t) => sum + t.guestsTotal, 0);
        const totalArrived = tableStats.reduce((sum, t) => sum + t.guestsArrived, 0);

        return {
            tables: tableStats,
            totalGuests,
            totalArrived
        };
    };

    const addOrder = (tableId, amount) => {
        // ... (existing mock logic or update DB later)
        setTables(prev => prev.map(t => {
            if (t.id === tableId && t.bookings.length > 0) {
                const bookings = [...t.bookings];
                bookings[0].total = (bookings[0].total || 0) + amount; // Local update
                return { ...t, bookings };
            }
            return t;
        }));
    };

    return (
        <AppContext.Provider value={{
            userMode,
            isAuthenticated,
            user,
            login,
            signUp,
            logout,
            tables,
            currentUserBooking, // Kept for legacy/quick check if current user has booking on selected date
            bookTable,
            fetchUserBookings,
            fetchUserBookings,
            cancelBooking,
            updateBooking,
            updateTableStatus,
            updateTable,
            updateTablePosition,
            addTable,
            deleteTable,
            addOrder,
            generateReport,
            selectedDate,
            setSelectedDate
        }}>
            {children}
        </AppContext.Provider>
    );
};
