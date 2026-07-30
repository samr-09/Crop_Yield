import React from "react";
import { motion } from "framer-motion";
import { BarChart3, Brain, Sprout, LogOut, ChevronRight, Menu, X, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/background.jpg";

const Home = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="relative min-h-screen font-sans text-gray-50 overflow-hidden bg-background flex flex-col">
      {/* Dynamic Background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-black/80 via-primary/60 to-black/90 backdrop-blur-sm" />

      {/* Decorative Orbs */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none z-[0] will-change-transform" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none z-[0] will-change-transform" />

      {/* Modern SaaS Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-50 mt-4 mx-4 md:mx-8 px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-white tracking-tight hidden sm:block">
            CropYield
          </h1>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-1">
          <button onClick={() => navigate('/home')} className="px-4 py-2 text-sm font-medium text-white bg-white/10 rounded-lg transition-colors">
            Dashboard
          </button>
          <button onClick={() => navigate('/geo')} className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            Predict Yield
          </button>
          
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full border-2 border-transparent"></span>
          </button>

          <div className="hidden sm:block h-8 w-px bg-white/20"></div>

          <button
            onClick={() => navigate("/")}
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-white/10 hover:bg-rose-500/20 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="sm:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow flex flex-col items-center pt-20 pb-24 px-4 sm:px-6 lg:px-8">

        {/* Hero Header */}
        <div className="text-center max-w-3xl mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-secondary/20 border border-secondary/30 text-secondary-100 text-sm font-medium backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            Dashboard Active & Syncing
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-white mb-6 leading-tight tracking-tight"
          >
            Welcome to your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text  text-white bg-gradient-to-r from-secondary to-accent">
              AgroGuide
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 font-light"
          >
            Select a module below to start analyzing crop data, generating yield predictions,
            or receiving personalized advisory insights.
          </motion.p>
        </div>

        {/* Feature Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Card 1 */}
          <motion.div variants={itemVariants} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            <div className="relative h-full bg-white/10 backdrop-blur-xl border border-white/10 hover:border-secondary/40 rounded-3xl p-8 flex flex-col shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-green-700 rounded-2xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/20">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-heading font-semibold text-white mb-3">Yield Prediction</h3>
              <p className="text-gray-400 mb-8 flex-grow leading-relaxed">
                Estimate crop yield using historical agricultural data, climatic factors, and machine learning forecasting.
              </p>
              <button
                onClick={() => navigate('/geo')}
                className="w-full py-3.5 px-4 bg-white/5 hover:bg-secondary/20 text-white font-medium rounded-xl border border-white/10 hover:border-secondary/50 transition-all flex items-center justify-between group-hover:pl-6"
              >
                Start Analysis
                <ChevronRight className="w-5 h-5 text-secondary group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={itemVariants} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            <div className="relative h-full bg-white/10 backdrop-blur-xl border border-white/10 hover:border-blue-400/40 rounded-3xl p-8 flex flex-col shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/20">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-heading font-semibold text-white mb-3">Smart Advisory</h3>
              <p className="text-gray-400 mb-8 flex-grow leading-relaxed">
                Receive intelligent advisory suggestions based on analyzed trends, model outputs, and contextual patterns.
              </p>
              <button
                onClick={() => navigate('#')}
                className="w-full py-3.5 px-4 bg-white/5 hover:bg-blue-500/20 text-white font-medium rounded-xl border border-white/10 hover:border-blue-500/50 transition-all flex items-center justify-between group-hover:pl-6"
              >
                Get Insights
                <ChevronRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={itemVariants} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            <div className="relative h-full bg-white/10 backdrop-blur-xl border border-white/10 hover:border-amber-400/40 rounded-3xl p-8 flex flex-col shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-700 rounded-2xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/20">
                <Sprout className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-heading font-semibold text-white mb-3">Crop Recommendation</h3>
              <p className="text-gray-400 mb-8 flex-grow leading-relaxed">
                Identify suitable crops for your region by analyzing soil conditions, seasonal factors, and performance data.
              </p>
              <button
                onClick={() => navigate('/recommendation')}
                className="w-full py-3.5 px-4 bg-white/5 hover:bg-amber-500/20 text-white font-medium rounded-xl border border-white/10 hover:border-amber-500/50 transition-all flex items-center justify-between group-hover:pl-6"
              >
                Find Crops
                <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

        </motion.div>
      </main>

      {/* Footer minimal */}
      <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} <span className="text-primary font-medium">CropYield AI</span>. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
