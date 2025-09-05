// src/app/page.jsx

"use client";

import { motion } from "framer-motion";
import { QrCode, Smartphone, Clock, Users, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    {
      icon: <QrCode className="w-8 h-8" />,
      title: "Instant QR Generation",
      description: "Create beautiful QR codes for your menu in seconds"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile-First Design",
      description: "Optimized for all devices with seamless user experience"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Real-time Updates",
      description: "Update your menu instantly, changes appear immediately"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Customer Analytics",
      description: "Track orders and understand customer preferences"
    }
  ];

  // Floating particles animation
  const FloatingParticle = ({ delay, duration, x }: { delay: number; duration: number; x: number }) => (
    <motion.div
      className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-60"
      animate={{
        y: [0, -100, 0],
        x: [0, x, 0],
        opacity: [0.6, 0.2, 0.6],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingParticle delay={0} duration={8} x={20} />
        <FloatingParticle delay={2} duration={10} x={-30} />
        <FloatingParticle delay={4} duration={12} x={40} />
        <FloatingParticle delay={6} duration={9} x={-50} />
        <FloatingParticle delay={1} duration={11} x={60} />
        <FloatingParticle delay={3} duration={7} x={-70} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <motion.div 
                className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <QrCode className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                QuickBiteQR
              </span>
            </motion.div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/login" className="text-slate-600 hover:text-blue-600 transition-colors">
                Login
              </Link>
              <Link href="/signup" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                <Star className="w-4 h-4 fill-current" />
                <span>Trusted by 50+ restaurants worldwide</span>
              </div>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold text-slate-900 mb-6"
            >
              Transform Your
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient-shift">
                Restaurant Menu
              </span>
              Into Digital Magic
            </motion.h1>
            
            <motion.p
              variants={fadeInUp}
              className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto"
            >
              Create stunning QR codes for your menu, track orders in real-time, and delight your customers with a modern dining experience.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-2 animate-pulse-glow"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
                >
                  View Demo
                </motion.button>
              </Link>
            </motion.div>

            {/* Hero Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              {[
                { number: "5min", label: "Setup Time" },
                { number: "24/7", label: "Support" },
                { number: "Free", label: "Forever Plan" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stat.number}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-20 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl"
        />
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful features designed to streamline your restaurant operations and enhance customer experience
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl border border-slate-200 hover:shadow-xl transition-all duration-300 group"
              >
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: 5 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            {[
              { number: "50++", label: "Restaurants Served" },
              { number: "500+", label: "QR Codes Generated" },
              { number: "99.9%", label: "Uptime Guarantee" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-white"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Ready to Transform Your Restaurant?
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Join thousands of restaurants already using QuickBiteQR to modernize their operations
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/signup">
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl text-xl font-semibold hover:shadow-2xl transition-all duration-300">
                  Get Started Today
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <motion.div 
                className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <QrCode className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold">QuickBiteQR</span>
            </div>
            <div className="text-slate-400">
              © 2025 QuickBiteQR. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}