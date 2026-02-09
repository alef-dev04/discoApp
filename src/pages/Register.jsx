import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Register = ({ onLogin }) => {
    const { signUp } = useAppContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRegister = async () => {
        if (!email || !password) {
            setError('Please provide credentials');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await signUp(email, password);
            setError('Registration successful! Please check your email or login with your new account.');
            // Optionally auto-redirect to login or stay here with success message
            setTimeout(() => {
                onLogin();
            }, 2000);
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
                <div className="mb-8 relative">
                    <div className="w-20 h-20 rounded-full border-2 border-neon-magenta/50 flex items-center justify-center box-glow-purple">
                        <UserPlus size={32} className="text-neon-magenta" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold mb-2 tracking-wider">JOIN THE <span className="text-neon-blue">CLUB</span></h1>
                <p className="text-gray-400 mb-10 text-sm tracking-widest uppercase">Create your VIP Account</p>

                {/* Auth Form */}
                <div className="w-full space-y-4 mb-8">
                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className={`text-xs text-center p-2 rounded-lg ${error.includes('successful') ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-dark-deep border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple transition-colors text-center tracking-wide"
                        />
                        <input
                            type="password"
                            placeholder="Create Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-dark-deep border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple transition-colors text-center tracking-wide"
                        />
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/20 text-white py-4 rounded-xl font-bold tracking-widest flex items-center justify-center gap-3 transition-all group hover:border-neon-magenta hover:text-neon-magenta box-glow-purple disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'CREATING ACCOUNT...' : 'REGISTER VIP'}
                    {!loading && <ArrowRight className="group-hover:translate-x-1 transition-transform" />}
                </motion.button>

                <div className="mt-6 text-center">
                    <button
                        onClick={onLogin}
                        className="text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
                    >
                        Already have an account? Login
                    </button>
                </div>

            </motion.div>
        </div>
    );
};

export default Register;
