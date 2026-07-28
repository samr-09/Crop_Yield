import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Sprout,
    ArrowRight,
    ArrowLeft
} from "lucide-react";
import bg from "../assets/background.jpg";

export default function Login() {
    const navigate = useNavigate();

    // Form State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Login failed");
                return;
            }

            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/home");
        } catch (err) {
            alert("Server error. Please try again later.");
        }
    };

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
                            key="login"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-md"
                        >
                            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6 leading-tight">
                                Predict, Plan, and Grow Smarter. 🌱
                            </h1>
                            <p className="text-lg text-green-50 mb-8">
                                Access intelligent agricultural tools designed to analyze crop, climate, and regional data.
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
                            key="login"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                                        Welcome back
                                    </h2>
                                    <p className="text-gray-500 text-sm">
                                        Enter your details to access your dashboard.
                                    </p>
                                </div>

                                <form onSubmit={handleLogin} className="space-y-5">
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

                                    {/* Login Extras */}
                                    <div className="flex items-center justify-between mt-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary border-gray-300" />
                                            <span className="text-sm text-gray-600">Remember me</span>
                                        </label>
                                        <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                                            Forgot password?
                                        </a>
                                    </div>

                                   {/* Submit Button */}
<motion.button
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    type="submit"
    className="w-full mt-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-black py-3.5 rounded-xl font-semibold shadow-[0_4px_14px_0_rgba(46,125,50,0.39)] hover:shadow-[0_6px_20px_rgba(46,125,50,0.23)] transition-all flex justify-center items-center gap-2 group"
>
    Log in
    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
</motion.button>
                                </form>

                                {/* Toggle View */}
                                <div className="mt-8 text-center">
                                    <p className="text-sm text-gray-600">
                                        Don't have an account?
                                        <button
                                            onClick={() => navigate('/signup')}
                                            className="ml-2 font-semibold text-primary hover:text-primary/80 hover:underline transition-all relative outline-none"
                                        >
                                            Sign up
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
