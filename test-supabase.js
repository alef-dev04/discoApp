
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gmpraqihstxufvthmbvy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtcHJhcWloc3R4dWZ2dGhtYnZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMjQyMzYsImV4cCI6MjA4NTgwMDIzNn0.6WarjF8ELwtZVdgcC1iEeIRQDl9KJlAhTIMEufJEYi0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing connection to:', supabaseUrl);
    try {
        const { data, error } = await supabase.from('bookings').select('count', { count: 'exact', head: true });
        if (error) {
            console.error('Connection Error:', error.message);
        } else {
            console.log('Connection Successful! Data:', data);
        }
    } catch (err) {
        console.error('Unexpected Error:', err);
    }
}

testConnection();
