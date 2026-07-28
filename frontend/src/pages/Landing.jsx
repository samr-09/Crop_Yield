import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  BarChart3,
  CloudSun,
  Users,
  ArrowRight,
  MapPin,
  Phone,
  Linkedin,
  Twitter,
  Instagram,
  Sprout,
  ChevronRight,
  Star,
  Brain,
  Database,
  Cpu,
  ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import bg from "../assets/background.jpg";
import heroImg from "../assets/hero.png";

const Landing = () => {
  const navigate = useNavigate();

  const { scrollY } = useScroll();

  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const techStack = [
    "Machine Learning",
    "Random Forest",
    "SHAP",
    "MongoDB",
    "React",
    "Node.js",
    "Flask",
    "Explainable AI",
  ];

  return (
    <div className="relative min-h-screen font-sans text-gray-50 flex flex-col bg-[#0a0f0d] overflow-hidden">

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url(${bg})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07110c] via-[#0a0f0d] to-[#07110c]" />
      </div>

      {/* Glow Effects */}
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 backdrop-blur-xl bg-black/20 border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
              <Sprout className="w-6 h-6 text-white" />
            </div>

            <h1 className="text-2xl font-bold">
              CropYield
            </h1>
          </div>

          <div className="hidden md:flex gap-8 text-gray-300">
            <a href="#home" className="hover:text-white">
              Home
            </a>

            <a href="#features" className="hover:text-white">
              Features
            </a>

            <a href="#about" className="hover:text-white">
              About
            </a>

            <a href="#contact" className="hover:text-white">
              Contact
            </a>
          </div>

          <div className="flex gap-3">

            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 rounded-xl hover:bg-white/5"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="hidden sm:block px-5 py-2 rounded-xl bg-green-600 hover:bg-green-500"
            >
              Sign Up
            </button>

          </div>
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <section
        id="home"
        className="relative z-10 min-h-screen flex items-center justify-center px-6 md:px-12 pt-24"
      >
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div
              variants={fadeUpVariant}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-sm mb-8"
            >
              <Star className="w-4 h-4 fill-current" />
              AI Powered Agricultural Intelligence
            </motion.div>

            <motion.h1
              variants={fadeUpVariant}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight"
            >
              AI-Powered
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                Crop Yield
              </span>
              Prediction System
            </motion.h1>

            <motion.p
              variants={fadeUpVariant}
              className="text-lg md:text-xl text-gray-400 mt-8 max-w-2xl"
            >
              An intelligent agricultural analytics platform that
              combines machine learning and explainable AI to
              support crop recommendation, yield prediction,
              environmental analysis and data-driven farming decisions.
            </motion.p>

            <motion.div
              variants={fadeUpVariant}
              className="flex flex-col sm:flex-row gap-4 mt-10"
            >
              <button
                onClick={() => navigate("/recommendation")}
                className="px-8 py-4 rounded-2xl bg-green-600 hover:bg-green-500 font-semibold flex items-center justify-center gap-2"
              >
                Try AI Recommendation
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
              >
                Explore Features
              </button>
            </motion.div>

            {/* TECH BADGES */}
            <motion.div
              variants={fadeUpVariant}
              className="flex flex-wrap gap-3 mt-10"
            >
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            style={{ y: y2 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative aspect-square flex items-center justify-center">

              <div className="absolute inset-0 rounded-full border border-green-500/20 animate-spin [animation-duration:40s]" />
              <div className="absolute inset-10 rounded-full border border-emerald-500/20 animate-spin [animation-duration:25s] [animation-direction:reverse]" />

              <img
                src={heroImg}
                alt="Crop Yield AI"
                className="w-[80%] relative z-10 drop-shadow-2xl"
              />

              {/* CARD 1 */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
                className="absolute left-0 bottom-12 bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
              >
                <div className="flex items-center gap-3">
                  <Brain className="text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">
                      Explainable AI
                    </p>
                    <p className="font-bold">
                      SHAP Analysis
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* CARD 2 */}
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
                className="absolute top-12 right-0 bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
              >
                <div className="flex items-center gap-3">
                  <Cpu className="text-emerald-400" />
                  <div>
                    <p className="text-sm text-gray-400">
                      ML Engine
                    </p>
                    <p className="font-bold">
                      Random Forest, Xgboost
                    </p>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </section>

            {/* STATS SECTION */}
      <section className="relative z-10 py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

            {[
              {
                title: "Machine Learning",
                value: "Random Forest",
                icon: <Cpu className="w-8 h-8 text-green-400" />,
              },
              {
                title: "Explainability",
                value: "SHAP Analysis",
                icon: <Brain className="w-8 h-8 text-emerald-400" />,
              },
              {
                title: "Database",
                value: "MongoDB",
                icon: <Database className="w-8 h-8 text-green-500" />,
              },
              {
                title: "Security",
                value: "User Auth",
                icon: <ShieldCheck className="w-8 h-8 text-emerald-300" />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 transition-all"
              >
                <div className="flex justify-center mb-5">
                  {item.icon}
                </div>

                <h3 className="text-lg text-gray-400">
                  {item.title}
                </h3>

                <p className="text-2xl font-bold text-white mt-2">
                  {item.value}
                </p>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="relative z-10 py-32 px-6 md:px-12 border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-20">
            <h2 className="text-green-400 uppercase tracking-widest font-bold mb-4">
              Core Features
            </h2>

            <h3 className="text-5xl font-bold mb-6">
              Built for Smart Agriculture
            </h3>

            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              Our platform combines artificial intelligence,
              environmental analytics and explainable machine learning
              to support modern agricultural decision making.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {[
              {
                icon: <Sprout className="w-10 h-10 text-green-400" />,
                title: "Crop Recommendation",
                desc:
                  "Recommend the most suitable crop based on environmental and cultivation parameters.",
              },
              {
                icon: <BarChart3 className="w-10 h-10 text-emerald-400" />,
                title: "Yield Prediction",
                desc:
                  "Predict expected agricultural productivity using machine learning models trained on crop datasets.",
              },
              {
                icon: <Brain className="w-10 h-10 text-green-300" />,
                title: "Explainable AI",
                desc:
                  "Understand why a recommendation was generated through SHAP-based feature impact analysis.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all"
              >
                <div className="mb-6">
                  {feature.icon}
                </div>

                <h4 className="text-2xl font-bold mb-4">
                  {feature.title}
                </h4>

                <p className="text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* WHY CROPYIELD */}
      <section className="relative z-10 py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-20">
            <h2 className="text-green-400 uppercase tracking-widest font-bold mb-4">
              Why CropYield
            </h2>

            <h3 className="text-5xl font-bold">
              Intelligence Meets Agriculture
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {[
              {
                title: "Rainfall Analysis",
                desc: "Evaluate rainfall impact on crop productivity.",
              },
              {
                title: "Temperature Insights",
                desc: "Understand climatic influence on crop growth.",
              },
              {
                title: "Fertilizer Impact",
                desc: "Analyze cultivation inputs and their effects.",
              },
              {
                title: "Data Transparency",
                desc: "Explain every prediction with interpretable AI.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-3xl p-8"
              >
                <h4 className="text-xl font-bold mb-4">
                  {item.title}
                </h4>

                <p className="text-gray-400">
                  {item.desc}
                </p>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* AI WORKFLOW */}
      <section className="relative z-10 py-32 px-6 md:px-12 border-t border-white/5 border-b border-white/5">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-20">
            <h2 className="text-green-400 uppercase tracking-widest font-bold mb-4">
              System Workflow
            </h2>

            <h3 className="text-5xl font-bold">
              How The System Works
            </h3>
          </div>

          <div className="grid md:grid-cols-5 gap-6">

            {[
              "Input Parameters",
              "ML Processing",
              "Yield Prediction",
              "SHAP Analysis",
              "Crop Recommendation",
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center h-full">

                  <div className="w-14 h-14 mx-auto rounded-full bg-green-500 flex items-center justify-center text-xl font-bold mb-5">
                    {i + 1}
                  </div>

                  <h4 className="font-semibold text-lg">
                    {step}
                  </h4>

                </div>

                {i !== 4 && (
                  <ChevronRight className="hidden md:block absolute -right-5 top-1/2 text-green-400" />
                )}
              </motion.div>
            ))}

          </div>
        </div>
      </section>
            {/* ABOUT SECTION */}
      <section
        id="about"
        className="relative z-10 py-32 px-6 md:px-12 bg-gradient-to-b from-[#0a0f0d] via-green-950/10 to-[#0a0f0d]"
      >
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-20">
            <h2 className="text-green-400 uppercase tracking-widest font-bold mb-4">
              About CropYield
            </h2>

            <h3 className="text-5xl md:text-6xl font-bold mb-8">
              Bridging Agriculture
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                and Artificial Intelligence
              </span>
            </h3>

            <p className="max-w-4xl mx-auto text-xl text-gray-400 leading-relaxed">
              CropYield is an AI-powered agricultural analytics platform
              developed to support intelligent farming decisions through
              crop recommendation, yield prediction and explainable machine learning.
              By combining environmental parameters with predictive analytics,
              the system helps users understand both outcomes and the factors
              influencing those outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h4 className="text-2xl font-bold mb-4 text-green-400">
                Mission
              </h4>

              <p className="text-gray-400 leading-relaxed">
                To support sustainable agriculture through
                intelligent data-driven decision making.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h4 className="text-2xl font-bold mb-4 text-emerald-400">
                Vision
              </h4>

              <p className="text-gray-400 leading-relaxed">
                To create accessible AI solutions that improve
                agricultural productivity and transparency.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h4 className="text-2xl font-bold mb-4 text-green-300">
                Technology
              </h4>

              <p className="text-gray-400 leading-relaxed">
                Built using React, Node.js, MongoDB,
                Flask, Machine Learning and Explainable AI.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative z-10 py-32 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">

          <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-green-900/20 via-black/30 to-emerald-900/20 p-12 md:p-20 text-center">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.15),transparent_40%)]" />

            <div className="relative z-10">

              <h2 className="text-5xl md:text-6xl font-bold mb-8">
                Ready to Explore
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                  Intelligent Farming?
                </span>
              </h2>

              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
                Experience AI-powered crop recommendation,
                yield prediction and explainable agricultural analytics.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-5">

                <button
                  onClick={() => navigate("/recommendation")}
                  className="px-8 py-4 rounded-2xl bg-green-600 hover:bg-green-500 font-semibold flex items-center justify-center gap-2"
                >
                  Start Recommendation
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => navigate("/predict")}
                  className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
                >
                  Predict Yield
                </button>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="relative z-10 py-28 px-6 md:px-12 border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">

          <div>
            <h2 className="text-5xl font-bold mb-6">
              Contact Us
            </h2>

            <p className="text-xl text-gray-400 mb-10">
              Have questions about the platform,
              research methodology or project implementation?
            </p>

            <div className="space-y-6">

              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
                  <MapPin className="text-green-400" />
                </div>

                <div>
                  <p className="text-gray-400">
                    Location
                  </p>
                  <p className="font-semibold">
                    West Bengal, India
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
                  <Phone className="text-green-400" />
                </div>

                <div>
                  <p className="text-gray-400">
                    Contact
                  </p>
                  <p className="font-semibold">
                    Project Development Team
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-10">

              <h3 className="text-2xl font-bold mb-8">
                Connect With Us
              </h3>

              <div className="grid grid-cols-3 gap-4">

                <button className="py-5 rounded-2xl bg-white/5 hover:bg-white/10 transition">
                  <Linkedin className="mx-auto" />
                </button>

                <button className="py-5 rounded-2xl bg-white/5 hover:bg-white/10 transition">
                  <Twitter className="mx-auto" />
                </button>

                <button className="py-5 rounded-2xl bg-white/5 hover:bg-white/10 transition">
                  <Instagram className="mx-auto" />
                </button>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5 bg-[#050706]">

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">

            <div className="flex items-center gap-3">
              <Sprout className="text-green-400" />
              <span className="text-xl font-bold">
                CropYield
              </span>
            </div>

            <p className="text-gray-500 text-center">
              © {new Date().getFullYear()} CropYield —
              AI-Based Crop Yield Prediction &
              Recommendation Platform.
            </p>

            <div className="flex gap-6 text-gray-500">

              <a
                href="#"
                className="hover:text-green-400 transition"
              >
                Privacy
              </a>

              <a
                href="#"
                className="hover:text-green-400 transition"
              >
                Terms
              </a>

              <a
                href="#"
                className="hover:text-green-400 transition"
              >
                Documentation
              </a>

            </div>

          </div>

        </div>

      </footer>
    </div>
  );
};

export default Landing;



// import React from "react";
// import { motion, useScroll, useTransform } from "framer-motion";
// import {
//   BarChart3,
//   CloudSun,
//   Users,
//   ArrowRight,
//   MapPin,
//   Phone,
//   Linkedin,
//   Twitter,
//   Instagram,
//   Sprout,
//   ChevronRight,
//   Star
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import bg from "../assets/background.jpg";
// import heroImg from "../assets/hero.png";

// const Landing = () => {
//   const navigate = useNavigate();
//   const { scrollY } = useScroll();
//   const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
//   const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

//   const fadeUpVariant = {
//     hidden: { opacity: 0, y: 30 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
//   };

//   const staggerContainer = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
//   };

//   return (
//     <div className="relative min-h-screen font-sans text-gray-50 flex flex-col bg-[#0a0f0d] overflow-hidden selection:bg-primary/30 selection:text-white">
//       {/* Dynamic Backgrounds */}
//       <div className="fixed inset-0 z-0 pointer-events-none">
//         <div
//           className="absolute inset-0 bg-cover bg-center opacity-30 saturate-50"
//           style={{ backgroundImage: `url(${bg})` }}
//         />
//         <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f0d]/90 via-primary/20 to-[#0a0f0d]/90" />
//       </div>

//       {/* Abstract Glowing Orbs */}
//       <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none z-[0] will-change-transform" />
//       <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl pointer-events-none z-[0] will-change-transform" />

//       {/* Navbar */}
//       <motion.nav
//         initial={{ y: -20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5, delay: 0.1 }}
//         className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-[#0a0f0d]/50 backdrop-blur-xl border-b border-white/5"
//       >
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg shadow-primary/20">
//             <Sprout className="w-6 h-6 text-white" />
//           </div>
//           <h1 className="text-2xl font-heading font-bold text-white tracking-tight">
//             CropYield
//           </h1>
//         </div>

//         <div className="hidden md:flex items-center space-x-8">
//           {['Home', 'Features', 'About', 'Contact'].map((item) => (
//             <a
//               key={item}
//               href={`#${item.toLowerCase()}`}
//               className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group"
//             >
//               {item}
//               <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full transition-all group-hover:w-full"></span>
//             </a>
//           ))}
//         </div>

//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate("/login")}
//             className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
//           >
//             Log in
//           </button>
//           <button
//             onClick={() => navigate("/signup")}
//             className="hidden sm:flex text-sm font-semibold text-white px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)]"
//           >
//             Sign up
//           </button>
//         </div>
//       </motion.nav>

//       {/* Hero Section */}
//       <section id="home" className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-24 px-6 md:px-12">
//         <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-16">

//           <motion.div
//             className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left pt-10 lg:pt-0"
//             variants={staggerContainer}
//             initial="hidden"
//             animate="visible"
//           >
//             <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full bg-primary/10 border border-primary/20 text-primary-300 text-sm font-medium">
//               <Star className="w-4 h-4 text-secondary fill-secondary" />
//               Revolutionizing Agriculture AI
//             </motion.div>

//             <motion.h1
//               variants={fadeUpVariant}
//               className="text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold leading-[1.1] tracking-tight mb-6"
//             >
//               Intelligent Insights <br />
//               for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Smarter Yields.</span>
//             </motion.h1>

//             <motion.p
//               variants={fadeUpVariant}
//               className="text-lg md:text-xl text-gray-400 font-light max-w-2xl mb-10 leading-relaxed"
//             >
//               CropYield is a data-driven platform that analyzes climatic patterns and soil metrics to give you highly accurate crop yield forecasting and advisory.
//             </motion.p>

//             <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
//               <button
//                 onClick={() => navigate("/signup")}
//                 className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(46,125,50,0.3)] hover:shadow-[0_0_60px_rgba(46,125,50,0.4)] transition-all group"
//               >
//                 Get Started
//                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//               </button>
//               <button
//                 onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
//                 className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-semibold text-lg transition-all"
//               >
//                 View Features
//               </button>
//             </motion.div>
//           </motion.div>

//           {/* Hero Image / Visualization container */}
//           <motion.div
//             className="lg:w-1/2 relative w-full max-w-lg lg:max-w-none"
//             initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
//             animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
//             transition={{ duration: 1, delay: 0.2 }}
//             style={{ y: y2 }}
//           >
//             <div className="relative aspect-square w-full rounded-full bg-gradient-to-tr from-primary/20 to-transparent border border-white/5 flex items-center justify-center">
//               {/* Optional glowing rings */}
//               <div className="absolute inset-4 rounded-full border border-primary/20 animate-[spin_60s_linear_infinite]" />
//               <div className="absolute inset-12 rounded-full border border-secondary/20 animate-[spin_40s_linear_infinite_reverse]" />

//               <img
//                 src={heroImg}
//                 alt="AI Crop Analysis"
//                 className="relative z-10 w-[80%] drop-shadow-2xl hover:scale-105 transition-transform duration-700"
//               />

//               {/* Floating Stat Card */}
//               <motion.div
//                 className="absolute bottom-10 -left-6 md:-left-12 bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl z-20"
//                 animate={{ y: [0, -10, 0] }}
//                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
//               >
//                 <div className="text-sm text-gray-400 mb-1">Prediction Accuracy</div>
//                 <div className="text-2xl font-bold text-secondary">94.8%</div>
//               </motion.div>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="relative z-10 py-32 px-6 md:px-12 border-t border-white/5 bg-[#0a0f0d]/50">
//         <div className="max-w-7xl mx-auto">
//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: "-100px" }}
//             variants={fadeUpVariant}
//             className="text-center max-w-3xl mx-auto mb-20"
//           >
//             <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-4">Platform Capabilities</h2>
//             <h3 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Built for precision farming.</h3>
//             <p className="text-gray-400 text-lg">Harness the power of machine learning to make data-driven decisions that maximize yield and minimize risk.</p>
//           </motion.div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
//             {[
//               {
//                 icon: <BarChart3 className="w-8 h-8 text-primary" />,
//                 title: "Yield Forecasting",
//                 desc: "Predict crop yield by analyzing historical agricultural data using intelligent learning and statistical modeling.",
//               },
//               {
//                 icon: <CloudSun className="w-8 h-8 text-blue-400" />,
//                 title: "Climate Analysis",
//                 desc: "Understand how rainfall, temperature, fertilizer usage, and localized factors influence long-term production.",
//               },
//               {
//                 icon: <Users className="w-8 h-8 text-amber-400" />,
//                 title: "Actionable Advisory",
//                 desc: "Receive tailored recommendations for specific crops and soil types based on comprehensive model evaluations.",
//               },
//             ].map((f, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.5, delay: i * 0.1 }}
//                 className="bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 rounded-3xl p-8 transition-colors group cursor-default"
//               >
//                 <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform">
//                   {f.icon}
//                 </div>
//                 <h4 className="text-2xl font-semibold text-white mb-4">{f.title}</h4>
//                 <p className="text-gray-400 leading-relaxed">{f.desc}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* About Section */}
//       <section id="about" className="relative z-10 py-32 px-6 md:px-12 bg-gradient-to-b from-[#0a0f0d] to-primary/5">
//         <div className="max-w-5xl mx-auto text-center">
//           <div className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-full bg-primary/20 text-primary">
//             <Sprout className="w-10 h-10" />
//           </div>
//           <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-8 leading-tight">
//             Driving the future of food security <br className="hidden md:block" /> through <span className="text-secondary opacity-90">intelligent computation.</span>
//           </h2>
//           <p className="text-xl text-gray-400 leading-relaxed font-light">
//             CropYield bridges the gap between traditional agricultural knowledge and advanced machine learning techniques. Our goal is to provide reliable yield predictions while maintaining transparency, interpretability, and scalability for regional advisory systems globally.
//           </p>
//         </div>
//       </section>

//       {/* Contact Section */}
//       <section id="contact" className="relative z-10 py-24 px-6 md:px-12 border-t border-white/5 bg-[#0a0f0d]">
//         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">

//           <div className="md:w-1/2">
//             <h2 className="text-4xl font-heading font-bold text-white mb-4">Ready to optimize?</h2>
//             <p className="text-gray-400 text-lg mb-8">Reach out to our team to discover how CropYield can be tailored for your specific agricultural needs.</p>

//             <div className="space-y-6">
//               <div className="flex items-center gap-4 text-gray-300">
//                 <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center"><Phone className="w-5 h-5 text-primary" /></div>
//                 <span className="text-lg">+91 98765 43210</span>
//               </div>
//               <div className="flex items-center gap-4 text-gray-300">
//                 <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center"><MapPin className="w-5 h-5 text-primary" /></div>
//                 <span className="text-lg">Kolkata, West Bengal, India</span>
//               </div>
//             </div>
//           </div>

//           <div className="md:w-1/2 w-full">
//             <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
//               <h3 className="text-xl font-semibold mb-6 text-white">Follow our journey</h3>
//               <div className="flex gap-4">
//                 {[
//                   { icon: <Linkedin className="w-6 h-6" />, label: 'LinkedIn' },
//                   { icon: <Twitter className="w-6 h-6" />, label: 'Twitter' },
//                   { icon: <Instagram className="w-6 h-6" />, label: 'Instagram' }
//                 ].map((social, i) => (
//                   <button key={i} className="flex-1 py-4 flex justify-center items-center rounded-xl bg-white/5 hover:bg-white/10 hover:text-primary transition-colors text-gray-400 border border-white/5">
//                     {social.icon}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Modern Footer */}
//       <footer className="relative z-10 border-t border-white/5 py-8 bg-[#040605]">
//         <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
//           <div className="flex items-center gap-2 text-xl font-heading font-bold text-white">
//             <Sprout className="w-5 h-5 text-primary" /> CropYield
//           </div>
//           <p className="text-sm text-gray-500">
//             © {new Date().getFullYear()} Intelligent Agricultural Analytics. All rights reserved.
//           </p>
//           <div className="flex gap-6 text-sm font-medium text-gray-500">
//             <a href="#" className="hover:text-primary transition-colors">Privacy</a>
//             <a href="#" className="hover:text-primary transition-colors">Terms</a>
//             <a href="#" className="hover:text-primary transition-colors">System Status</a>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Landing;
