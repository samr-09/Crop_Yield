import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    Sprout,
    ArrowRight,
    ArrowLeft
} from "lucide-react";
import bg from "../assets/background.jpg";

export default function Signup() {
    const navigate = useNavigate();

    // Form State
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const res = await fetch("https://crop-yield-backend-r0mu.onrender.com/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Signup failed");
                return;
            }

            alert("Signup successful! Please login.");
            navigate("/login");
        } catch (err) {
            alert("Server error. Please try again later.");
        }
    };

    const calculateStrength = (pass) => {
        if (pass.length === 0) return 0;
        if (pass.length < 5) return 33;
        if (pass.length < 8) return 66;
        return 100;
    };

    const strength = calculateStrength(password);

    return (
        <div className="min-h-screen w-full flex bg-background font-sans overflow-hidden">
            {/* Left Panel - Visual/Brand */}
            <motion.div
                className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {/* Background Graphic */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `url(${bg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        filter: "brightness(0.5)"
                    }}
                />
                <div className="absolute inset-0 z-10 bg-gradient-to-br from-primary/80 to-black/90 pointer-events-none" />

                {/* Content */}
                <div className="relative z-20">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-2 text-3xl font-heading font-bold text-white mb-16"
                    >
                        <Sprout className="w-8 h-8 text-secondary" />
                        CropYield
                    </motion.div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key="signup"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-md"
                        >
                            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6 leading-tight">
                                Join the Future of Smart Agriculture.
                            </h1>
                            <p className="text-lg text-green-50 mb-8">
                                Create an account to gain data-driven insights and advisory support for your farming decisions.
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Floating elements animation */}
                <div className="relative z-20 flex gap-4 mt-auto">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-16 h-1 bg-white/20 rounded-full"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Right Panel - Auth Forms */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white">

                {/* Back Button */}
                <button
                    onClick={() => navigate("/")}
                    className="absolute top-6 left-6 z-50 flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors px-3 py-2 rounded-xl hover:bg-gray-100"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Home</span>
                </button>

                {/* Elegant Abstract Blobs for modern SaaS look */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

                <div className="w-full max-w-md relative z-10">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <div className="flex items-center gap-2 text-3xl font-heading font-bold text-primary">
                            <Sprout className="w-8 h-8" />
                            CropYield
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key="signup"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                                        Create an account
                                    </h2>
                                    <p className="text-gray-500 text-sm">
                                        Enter your information to get started.
                                    </p>
                                </div>

                                <form onSubmit={handleSignup} className="space-y-5">
                                    {/* Name Input */}
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                        animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="relative group">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                                            <input
                                                type="text"
                                                placeholder="Full Name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50/50 border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Email Input */}
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50/50 border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                                        />
                                    </div>

                                    {/* Password Input */}
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full pl-10 pr-12 py-3 rounded-xl bg-gray-50/50 border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>

                                    {/* Password Strength Indicator */}
                                    {password.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mt-2"
                                        >
                                            <motion.div
                                                className={`h-full ${strength === 33 ? 'bg-red-400' :
                                                    strength === 66 ? 'bg-yellow-400' : 'bg-primary'
                                                    }`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${strength}%` }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </motion.div>
                                    )}

                                    {/* Confirm Password Input */}
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                        animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="relative group">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Confirm Password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                className={`w-full pl-10 pr-12 py-3 rounded-xl bg-gray-50/50 border transition-all outline-none text-gray-800 placeholder:text-gray-400 ${confirmPassword && confirmPassword !== password
                                                    ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                                                    : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
                                                    }`}
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Submit Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="w-full mt-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white py-3.5 rounded-xl font-semibold shadow-[0_4px_14px_0_rgba(46,125,50,0.39)] hover:shadow-[0_6px_20px_rgba(46,125,50,0.23)] transition-all flex justify-center items-center gap-2 group"
                                    >
                                        Create account
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                </form>

                                {/* Toggle View */}
                                <div className="mt-8 text-center">
                                    <p className="text-sm text-gray-600">
                                        Already have an account?
                                        <button
                                            onClick={() => navigate('/login')}
                                            className="ml-2 font-semibold text-primary hover:text-primary/80 hover:underline transition-all relative outline-none"
                                        >
                                            Log in
                                        </button>
                                    </p>
                                </div>

                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
