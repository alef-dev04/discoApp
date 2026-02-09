import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Login = ({ onRegister }) => {
    const { login } = useAppContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAuth = async () => {
        if (!email || !password) {
            setError('Please provide credentials');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await login(email, password);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-neon-blue/20 rounded-full blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-12 rounded-3xl w-full max-w-md relative z-10 flex flex-col items-center border-t border-white/20"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="mb-8 relative"
                >
                    <div className="w-24 h-24 rounded-full border-2 border-neon-magenta/50 flex items-center justify-center box-glow-purple">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-neon-purple to-neon-magenta opacity-80" />
                    </div>
                </motion.div>

                <h1 className="text-4xl font-bold mb-2 tracking-wider">NIGHT<span className="text-neon-blue">LIFE</span></h1>
                <p className="text-gray-400 mb-10 text-sm tracking-widest uppercase">VIP Table Management</p>

                {/* Auth Form */}
                <div className="w-full space-y-4 mb-8">
                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-red-400 text-xs text-center bg-red-400/10 p-2 rounded-lg"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email Access Code"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-dark-deep border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple transition-colors text-center tracking-wide"
                        />
                        <input
                            type="password"
                            placeholder="Passkey"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-dark-deep border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple transition-colors text-center tracking-wide"
                        />
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAuth}
                    disabled={loading}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/20 text-white py-4 rounded-xl font-bold tracking-widest flex items-center justify-center gap-3 transition-all group hover:border-neon-blue hover:text-neon-blue box-glow-blue disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'AUTHENTICATING...' : 'ENTER CLUB'}
                    {!loading && <ArrowRight className="group-hover:translate-x-1 transition-transform" />}
                </motion.button>

                <div className="mt-6 text-center">
                    <button
                        onClick={onRegister}
                        className="text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
                    >
                        New here? Apply for Access
                    </button>
                    <p className="text-[10px] text-gray-700 mt-4">
                        Status: {import.meta.env.VITE_SUPABASE_URL ? 'Config Found' : 'Config Missing'} |
                        {import.meta.env.VITE_SUPABASE_URL ? import.meta.env.VITE_SUPABASE_URL.slice(0, 15) + '...' : 'N/A'}
                    </p>
                </div>

            </motion.div>
        </div>
    );
};

export default Login;
