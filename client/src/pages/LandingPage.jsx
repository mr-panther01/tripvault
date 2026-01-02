
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroImage from '../assets/hero_image.png';
import Particles from '../components/ui/Particles';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-indigo-500 selection:text-white overflow-hidden">
       <Particles className="absolute inset-0 z-0" />
      
      {/* Hero Section */}
      <section className="relative z-10 flex min-h-screen items-center pt-16 pb-12 lg:pt-20 lg:pb-20">
        <div className="container mx-auto px-4 w-full max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Text Content */}
            <motion.div 
              className="w-full lg:w-1/2 text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 filter drop-shadow-lg">
                Plan Your Next <br />
                <span className="text-white">Great Adventure</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Seamlessly organize trips, collaborate with friends, and discover hidden gems. Your personalized travel companion tailored for the modern explorer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-indigo-500/50 flex items-center justify-center">
                  Start Planning Free
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link to="/login" className="px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-md text-white rounded-full font-bold text-lg transition-all border border-slate-600 hover:border-slate-500 flex items-center justify-center">
                  Log In
                </Link>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div 
              className="w-full lg:w-[45%] lg:-mt-12"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 glow-effect group">
                <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
                <img 
                  src={heroImage} 
                  alt="Travel Dashboard Preview" 
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 bg-transparent">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Why Choose Us?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to turn your dream vacation into reality, all in one place.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              icon="🗺️" 
              title="Smart Itineraries" 
              description="Build detailed day-by-day plans with drag-and-drop ease. Auto-optimize routes to save time."
              delay={0.1}
            />
            <FeatureCard 
              icon="👥" 
              title="Real-time Collaboration" 
              description="Invite friends to plan together. Vote on activities, split bills, and keep everyone in sync."
              delay={0.2}
            />
            <FeatureCard 
              icon="💡" 
              title="Hidden Gems" 
              description="Get personalized recommendations for restaurants, spots, and events based on your interests."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
            <div className="bg-gradient-to-br from-indigo-900/80 via-purple-900/80 to-slate-900/80 p-12 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">Ready for take off?</h2>
              <p className="text-xl text-indigo-200 mb-10 max-w-3xl mx-auto">Join thousands of travelers who are planning their next adventure with ease.</p>
              <Link to="/register" className="inline-block px-10 py-5 bg-white text-indigo-900 rounded-full font-bold text-xl hover:bg-indigo-50 transition-colors shadow-2xl transform hover:-translate-y-1">
                Start Your Journey Now
              </Link>
            </div>
        </div>
      </section>

      <footer className="relative z-10 bg-black py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Trip Plan App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div 
    className="bg-slate-900/50 backdrop-blur-lg p-8 rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 transition-all hover:bg-slate-800/50 hover:shadow-xl group"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
  >
    <div className="w-14 h-14 bg-slate-800/50 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner border border-slate-700/30">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-indigo-400 transition-colors">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </motion.div>
);

export default LandingPage;
