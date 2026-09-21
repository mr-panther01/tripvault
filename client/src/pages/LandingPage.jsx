import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import Lenis from 'lenis';
import Particles from '../components/ui/Particles';

// High quality curated destination imagery
const DESTINATIONS = [
  {
    id: 1,
    title: 'Amalfi Coast Dream',
    location: 'Campania, Italy',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    tag: 'Coastal Escape',
    duration: '5 Days',
    budget: '$1,450',
    rating: 4.96,
    reviews: 320,
    gradient: 'from-amber-500/20 via-rose-500/10 to-transparent'
  },
  {
    id: 2,
    title: 'Kyoto Zen & Gardens',
    location: 'Kyoto, Japan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    tag: 'Culture & Temples',
    duration: '7 Days',
    budget: '$1,820',
    rating: 4.98,
    reviews: 512,
    gradient: 'from-rose-500/20 via-purple-500/10 to-transparent'
  },
  {
    id: 3,
    title: 'Swiss Alpine Expedition',
    location: 'Zermatt, Switzerland',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    tag: 'High Altitude Hiking',
    duration: '6 Days',
    budget: '$2,100',
    rating: 4.94,
    reviews: 289,
    gradient: 'from-blue-500/20 via-cyan-500/10 to-transparent'
  },
  {
    id: 4,
    title: 'Bali Hidden Sanctuaries',
    location: 'Ubud, Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    tag: 'Tropical Wellness',
    duration: '8 Days',
    budget: '$980',
    rating: 4.92,
    reviews: 440,
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent'
  }
];

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Smart Route Optimizer',
    desc: 'Automatically sequences activities to minimize transit time and taxi fares.'
  },
  {
    icon: (
      <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: 'Collaborative Squad Canvas',
    desc: 'Plan with friends in real-time. Vote on spots, split bills, and sync flight details.'
  },
  {
    icon: (
      <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Live Budget & Splitter',
    desc: 'Set multi-currency limits. Get live warnings before you overshoot your budget.'
  }
];

const REVIEWS = [
  {
    quote: "TripVault turned what used to be a week of spreadsheet chaos into 20 minutes of sheer fun. We just got back from Tokyo and every recommendation was pristine!",
    name: "Elena Rostova",
    role: "Solo Adventurer & Photographer",
    location: "Stockholm, Sweden",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  },
  {
    quote: "Coordinating a 6-person getaway to Positano seemed impossible until we shared a TripVault link. The route sequencing alone saved us 4 hours in cab rides.",
    name: "Marcus Vance",
    role: "Product Lead & Explorer",
    location: "Austin, TX",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  },
  {
    quote: "The interactive day-by-day maps and offline budget tracking gave our Swiss hike peace of mind. Hands down the slickest travel companion in existence.",
    name: "Chloe Chen",
    role: "Travel Journalist",
    location: "Vancouver, Canada",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80"
  }
];

const LandingPage = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('day1');
  const frameCount = 40;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [progress, setProgress] = useState(0);

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const currentIndex = useTransform(scrollYProgress, [0, 1], [1, frameCount]);

  // Preload frames
  useEffect(() => {
    let isMounted = true;
    const loadImages = async () => {
      const loadedImages = [];
      const promises = [];
      let loadedCount = 0;

      for (let i = 1; i <= frameCount; i++) {
        const promise = new Promise((resolve) => {
          const img = new Image();
          const paddedIndex = i.toString().padStart(3, '0');
          img.src = `/animation/ezgif-frame-${paddedIndex}.jpg`;
          img.onload = () => {
            if (!isMounted) return resolve(null);
            loadedCount++;
            setProgress(Math.round((loadedCount / frameCount) * 100));
            resolve(img);
          };
          img.onerror = () => {
            resolve(null);
          };
          loadedImages[i] = img;
        });
        promises.push(promise);
      }

      await Promise.all(promises);
      if (isMounted) {
        setImages(loadedImages);
        setIsLoaded(true);
      }
    };

    loadImages();
    return () => { isMounted = false; };
  }, []);

  // Render canvas with smooth cover sizing & dark luxury filter
  const render = (index) => {
    const canvas = canvasRef.current;
    if (!canvas || !isLoaded) return;

    const ctx = canvas.getContext('2d');
    const frameIndex = Math.min(frameCount, Math.max(1, Math.round(index)));
    const img = images[frameIndex];
    if (!img) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.width;
    const ih = img.height;

    const ratio = Math.max(cw / iw, ch / ih);
    const nw = iw * ratio;
    const nh = ih * ratio;
    const ox = (cw - nw) / 2;
    const oy = (ch - nh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.filter = 'brightness(0.42) contrast(1.15) saturate(1.1)';
    ctx.drawImage(img, 0, 0, iw, ih, ox, oy, nw, nh);
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        render(currentIndex.get());
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [isLoaded]);

  useMotionValueEvent(currentIndex, "change", (latest) => {
    requestAnimationFrame(() => render(latest));
  });

  return (
    <div ref={containerRef} className="relative bg-[#07070c] text-white min-h-screen selection:bg-indigo-500 selection:text-white">
      
      {/* =========================================================================
          FIXED HERO CANVAS & AMBIENT ATMOSPHERE
      ========================================================================= */}
      {/* Canvas layer — pointer-events-none so it never blocks UI */}
      <div className="fixed inset-0 h-screen w-full overflow-hidden z-0 pointer-events-none">
        <Particles className="absolute inset-0 z-0 opacity-40" />
        
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dynamic Vignette & Lighting Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070c] via-transparent to-black/70 z-10" />
        <div className="absolute inset-0 bg-radial-at-c from-indigo-900/20 via-transparent to-[#07070c]/90 z-10" />
      </div>

      {/* Loading Progress — separate fixed layer so pointer events work */}
      {!isLoaded && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#07070c] text-white z-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-xl">🧳</span>
            </div>
            <span className="text-2xl font-bold tracking-tight font-heading">TripVault</span>
          </div>
          <div className="text-sm font-medium text-slate-400 mb-4 tracking-wide uppercase">
            Preparing your escape... {progress}%
          </div>
          <div className="w-64 h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </div>
      )}

      {/* Hero Overlay — own fixed layer at z-20, fully interactive */}
      <div className="fixed inset-0 z-20">
        <HeroOverlay progress={currentIndex} />
      </div>

      {/* =========================================================================
          SCROLLING NARRATIVE SECTIONS
      ========================================================================= */}
      {/* pointer-events-none on wrapper so the z-20 hero overlay can receive clicks.
          Each real section re-enables pointer events individually. */}
      <div className="relative z-30 pointer-events-none">
        
        {/* Spacer for Scrub Animation */}
        <section className="h-[150vh]" />

        {/* Section 2: Interactive Showcase & Features */}
        <section id="features" className="relative min-h-screen flex flex-col justify-center bg-gradient-to-b from-transparent via-[#07070c]/95 to-[#0b0b14] py-24 border-t border-white/5 pointer-events-auto">
          
          {/* Infinite Smooth Ribbon */}
          <div className="w-full overflow-hidden py-4 mb-20 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-indigo-950/40 border-y border-white/10 backdrop-blur-md">
            <motion.div 
              className="flex whitespace-nowrap gap-12 font-heading tracking-widest text-sm uppercase text-slate-400 font-semibold"
              animate={{ x: [0, -1000] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
            >
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-10">
                  <span className="text-indigo-400 flex items-center gap-2">✦ SMART AI SCHEDULING</span>
                  <span>COLLABORATIVE TRIP BOARDS</span>
                  <span className="text-purple-400 flex items-center gap-2">✦ REAL-TIME BUDGET ENGINE</span>
                  <span>CURATED LOCAL GEMS</span>
                  <span className="text-cyan-400 flex items-center gap-2">✦ OFFLINE READY ITINERARIES</span>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
                Effortless Execution
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 font-heading">
                Turn travel dreams into <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
                  frictionless reality
                </span>
              </h2>
              <p className="text-lg text-slate-300 font-light leading-relaxed">
                Ditch disorganized spreadsheets, frantic group chats, and lost bookmarks. TripVault orchestrates every flight, hotel, and sunset overlook into one breathtaking timeline.
              </p>
            </div>

            {/* Interactive Preview Canvas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column: Feature Highlights */}
              <div className="lg:col-span-5 space-y-6">
                {FEATURES.map((feat, idx) => (
                  <div 
                    key={idx}
                    className="p-6 rounded-2xl glass-panel glass-panel-hover flex gap-5 items-start group cursor-default"
                  >
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform shadow-inner">
                      {feat.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 font-heading group-hover:text-indigo-300 transition-colors">
                        {feat.title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Live Mock Itinerary Card */}
              <div className="lg:col-span-7">
                <div className="relative rounded-3xl p-1 bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-cyan-500/30 shadow-2xl shadow-indigo-950/50">
                  <div className="rounded-[22px] bg-[#0d0d17]/95 backdrop-blur-xl border border-white/10 p-6 md:p-8 overflow-hidden">
                    
                    {/* Window Controls & Trip Header */}
                    <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                        </div>
                        <span className="text-xs font-mono text-slate-400 ml-2">Trip ID #TV-7890</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          ● Confirmed
                        </span>
                      </div>
                    </div>

                    {/* Trip Summary Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <div className="text-xs text-indigo-400 font-semibold tracking-wider uppercase mb-1">
                          Itinerary Preview
                        </div>
                        <h4 className="text-2xl font-bold text-white font-heading">
                          7 Days in Amalfi & Capri 🍋
                        </h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          <img className="inline-block h-8 w-8 rounded-full ring-2 ring-neutral-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="avatar" />
                          <img className="inline-block h-8 w-8 rounded-full ring-2 ring-neutral-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="avatar" />
                          <div className="h-8 w-8 rounded-full ring-2 ring-neutral-900 bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">+3</div>
                        </div>
                      </div>
                    </div>

                    {/* Day Tabs */}
                    <div className="flex gap-2 border-b border-white/5 pb-4 mb-6 text-sm overflow-x-auto">
                      {['Day 1: Arrival & Sunset', 'Day 2: Capri Yacht Tour', 'Day 3: Ravello Cliff Walk'].map((tab, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveTab(`day${idx + 1}`)}
                          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                            activeTab === `day${idx + 1}`
                              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* Day Itinerary Timeline */}
                    <div className="space-y-4">
                      <div className="flex gap-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/30 transition-colors">
                        <span className="text-xs font-mono text-indigo-400 mt-1 whitespace-nowrap">09:30 AM</span>
                        <div>
                          <div className="text-sm font-semibold text-white">Private Water Taxi Transfer</div>
                          <div className="text-xs text-slate-400">Naples Port → Positano Pier • 45 mins</div>
                        </div>
                        <span className="ml-auto text-xs px-2.5 py-0.5 rounded bg-white/5 text-slate-300 self-center">Transit</span>
                      </div>

                      <div className="flex gap-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/30 transition-colors">
                        <span className="text-xs font-mono text-purple-400 mt-1 whitespace-nowrap">01:00 PM</span>
                        <div>
                          <div className="text-sm font-semibold text-white">Cliffside Lunch at La Sponda</div>
                          <div className="text-xs text-slate-400">Reserved cliffside table under lemon vines</div>
                        </div>
                        <span className="ml-auto text-xs px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-300 self-center">Dining</span>
                      </div>

                      <div className="flex gap-4 p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                        <span className="text-xs font-mono text-cyan-400 mt-1 whitespace-nowrap">06:00 PM</span>
                        <div>
                          <div className="text-sm font-semibold text-white">Golden Hour Aperitivo at Franco's Bar</div>
                          <div className="text-xs text-slate-300">Live DJ, Mediterranean sunset panoramic views</div>
                        </div>
                        <span className="ml-auto text-xs px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 self-center">Highlight</span>
                      </div>
                    </div>

                    {/* Bottom Live Metrics */}
                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>Estimated Daily Spend: <strong className="text-white">$210</strong> / $300 target</span>
                      </div>
                      <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
                        Open in App →
                      </Link>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section 3: Curated Destinations */}
        <section id="destinations" className="relative min-h-screen flex flex-col justify-center bg-[#090912] py-24 border-t border-white/5 pointer-events-auto">
          <div className="container mx-auto px-6 max-w-7xl">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4">
                  Handcrafted Collections
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-heading">
                  Curated Escapes Ready to Clone
                </h2>
                <p className="text-slate-400 text-base md:text-lg mt-3 max-w-xl">
                  Award-winning journeys planned by top travel authors. Tap any trip to duplicate it into your TripVault workspace.
                </p>
              </div>

              <Link 
                to="/register"
                className="self-start md:self-end px-5 py-2.5 rounded-xl glass-panel text-sm font-semibold text-indigo-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
              >
                Explore All 1,200+ Guides →
              </Link>
            </div>

            {/* Destination Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
              {DESTINATIONS.map((dest) => (
                <div 
                  key={dest.id}
                  className="group relative rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-indigo-500/40 transition-all duration-500 flex flex-col hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-900/20 cursor-pointer"
                >
                  {/* Card Image Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <img 
                      src={dest.image} 
                      alt={dest.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090912] via-black/30 to-transparent" />
                    
                    {/* Category Tag Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-white/10">
                        {dest.tag}
                      </span>
                    </div>

                    {/* Rating Pill */}
                    <div className="absolute top-4 right-4">
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-md text-amber-300 border border-white/10">
                        ★ {dest.rating}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-300">
                      <span className="flex items-center gap-1">
                        📍 {dest.location}
                      </span>
                      <span>{dest.duration}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors font-heading mb-2">
                        {dest.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        Featuring curated daily timelines, local culinary spots, and optimized transit bookings.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 block uppercase tracking-wider">Est. Budget</span>
                        <span className="text-base font-bold text-white font-heading">{dest.budget}</span>
                      </div>
                      <Link 
                        to="/register" 
                        className="px-3.5 py-1.5 rounded-lg bg-white/5 group-hover:bg-indigo-600 text-xs font-semibold text-slate-200 group-hover:text-white transition-colors"
                      >
                        Copy Itinerary
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Section 4: Testimonials & Social Proof */}
        <section id="reviews" className="relative min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#090912] to-[#040408] py-24 border-t border-white/5 pointer-events-auto">
          <div className="container mx-auto px-6 max-w-7xl flex-1 flex flex-col justify-center">
            
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4">
                Loved Worldwide
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-heading mb-4">
                Stories from Fellow Travelers
              </h2>
              <p className="text-slate-400 text-base md:text-lg font-light">
                Discover why over 12,000 voyagers plan their escapes with TripVault.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {REVIEWS.map((rev, idx) => (
                <div 
                  key={idx}
                  className="p-8 rounded-3xl glass-panel glass-panel-hover flex flex-col justify-between relative"
                >
                  <div>
                    {/* Star Rating */}
                    <div className="flex gap-1 text-amber-400 text-sm mb-6">
                      {[...Array(rev.rating)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>

                    <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8 italic">
                      "{rev.quote}"
                    </p>
                  </div>

                  <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                    <img 
                      src={rev.avatar} 
                      alt={rev.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/40"
                    />
                    <div>
                      <h4 className="text-white font-bold text-sm font-heading">{rev.name}</h4>
                      <p className="text-xs text-slate-400">{rev.role}</p>
                      <span className="text-[11px] text-indigo-400">{rev.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Call to Action Banner */}
            <div className="rounded-3xl p-8 md:p-14 bg-gradient-to-r from-indigo-900/50 via-purple-900/40 to-slate-900/80 border border-indigo-500/30 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 max-w-2xl mx-auto">
                <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading">
                  Ready for your next unforgettable escape?
                </h3>
                <p className="text-slate-300 text-base md:text-lg mb-8 font-light">
                  Sign up in seconds, pick your destination, and let TripVault craft an itinerary you'll talk about for years.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/register"
                    className="px-8 py-4 bg-white hover:bg-slate-100 text-neutral-950 rounded-xl font-bold text-base transition-all shadow-xl hover:scale-105 active:scale-95"
                  >
                    Start Planning Free →
                  </Link>
                  <Link 
                    to="/login"
                    className="px-8 py-4 rounded-xl glass-panel hover:bg-white/10 text-white font-semibold text-base transition-all"
                  >
                    Sign In to Existing Trips
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* =========================================================================
              CLEAN MODERN FOOTER
          ========================================================================= */}
          <footer className="w-full pt-20 pb-12 border-t border-white/10 bg-[#050509]">
            <div className="container mx-auto px-6 max-w-7xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                
                {/* Brand Info */}
                <div className="col-span-1 md:col-span-1">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                      <span className="text-base">🧳</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white font-heading">TripVault</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">
                    The modern intelligence layer for wanderers, digital nomads, and group travelers.
                  </p>
                  <div className="text-xs text-slate-500">
                    Designed for memorable journeys worldwide.
                  </div>
                </div>

                {/* Discover Links */}
                <div>
                  <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider font-heading">Product</h4>
                  <ul className="space-y-3 text-slate-400 text-sm">
                    <li><a href="#features" className="hover:text-indigo-300 transition-colors">Route Optimizer</a></li>
                    <li><a href="#features" className="hover:text-indigo-300 transition-colors">Squad Collaboration</a></li>
                    <li><a href="#destinations" className="hover:text-indigo-300 transition-colors">Cloneable Itineraries</a></li>
                    <li><a href="#features" className="hover:text-indigo-300 transition-colors">Expense Splitting</a></li>
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider font-heading">Resources</h4>
                  <ul className="space-y-3 text-slate-400 text-sm">
                    <li><a href="#" className="hover:text-indigo-300 transition-colors">Destination Guides</a></li>
                    <li><a href="#" className="hover:text-indigo-300 transition-colors">Community Forum</a></li>
                    <li><a href="#" className="hover:text-indigo-300 transition-colors">API Documentation</a></li>
                    <li><a href="#" className="hover:text-indigo-300 transition-colors">Help Center</a></li>
                  </ul>
                </div>

                {/* Social Connect with Modern SVGs */}
                <div>
                  <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider font-heading">Stay Connected</h4>
                  <div className="flex gap-3 mb-6">
                    {/* Twitter / X */}
                    <a href="#" aria-label="X (Twitter)" className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-slate-300 hover:text-white hover:border-indigo-500 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                    {/* Instagram */}
                    <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-slate-300 hover:text-white hover:border-indigo-500 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    {/* LinkedIn */}
                    <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-slate-300 hover:text-white hover:border-indigo-500 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  </div>
                  <span className="text-xs text-slate-500">
                    Trusted by travelers across 75+ countries.
                  </span>
                </div>

              </div>

              {/* Bottom Copyright */}
              <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                <p>&copy; {new Date().getFullYear()} TripVault Technologies Inc. All rights reserved.</p>
                <div className="flex gap-6">
                  <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
                  <a href="#" className="hover:text-slate-300 transition-colors">Security</a>
                </div>
              </div>
            </div>
          </footer>

        </section>

      </div>
    </div>
  );
};

// Fixed Hero Overlay Component with Floating Glass Navigation & Dynamic Hero Typography
const HeroOverlay = ({ progress }) => {
  const [opacity, setOpacity] = useState(1);
  const [showHero, setShowHero] = useState(true);

  useMotionValueEvent(progress, "change", (latest) => {
    if (latest < 6) {
      setOpacity(1 - (latest / 6));
      setShowHero(true);
    } else {
      setShowHero(false);
      setOpacity(0);
    }
  });

  return (
    <div className={`w-full h-full relative flex flex-col justify-between p-4 md:p-8 ${showHero ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      
      {/* Floating Glass Navigation */}
      <nav 
        className="w-full max-w-6xl mx-auto rounded-2xl glass-panel px-6 py-4 flex items-center justify-between border border-white/10 shadow-2xl transition-all duration-300 pointer-events-auto"
        style={{ opacity: showHero ? opacity : 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-lg">🧳</span>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white font-heading">
            TripVault
          </span>
        </div>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#destinations" className="hover:text-white transition-colors">Destinations</a>
          <a href="#reviews" className="hover:text-white transition-colors">Reviews</a>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Link 
            to="/login"
            className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-3 py-1.5"
          >
            Log In
          </Link>
          <Link 
            to="/register"
            className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Headline & CTA Box */}
      <div 
        className="flex-1 max-w-5xl mx-auto w-full flex flex-col justify-center transition-all duration-300 pointer-events-auto pb-16"
        style={{ opacity: showHero ? opacity : 0 }}
      >
        {/* Pill Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 text-xs md:text-sm font-medium self-start mb-6 shadow-inner"
        >
          <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
          <span>Next-Gen Travel Operating System</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-black text-white font-heading tracking-tight leading-[1.06] mb-8 drop-shadow-2xl"
        >
          Your next great escape, <br />
          <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
            curated in seconds.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-2xl text-slate-200 font-normal max-w-2xl leading-relaxed mb-10 drop-shadow-md"
        >
          AI-optimized routes, collaborative itineraries, and smart budget tracking. Spend less time organizing and more time exploring.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 self-start"
        >
          <Link 
            to="/register" 
            className="px-9 py-4 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white font-bold text-lg tracking-wide hover:shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all text-center"
          >
            Start Planning Free →
          </Link>
          <a 
            href="#destinations" 
            className="px-8 py-4 rounded-xl glass-panel hover:bg-white/10 text-white font-semibold text-base transition-all text-center border border-white/20"
          >
            Explore Itineraries
          </a>
        </motion.div>

        {/* Social Proof Metric Chip */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 flex items-center gap-4 text-xs sm:text-sm text-slate-300"
        >
          <div className="flex -space-x-2">
            <img className="inline-block h-8 w-8 rounded-full ring-2 ring-neutral-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="wanderer" />
            <img className="inline-block h-8 w-8 rounded-full ring-2 ring-neutral-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="wanderer" />
            <img className="inline-block h-8 w-8 rounded-full ring-2 ring-neutral-900 object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" alt="wanderer" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">★★★★★</span>
            <span>Loved by 12,000+ travelers worldwide</span>
          </div>
        </motion.div>

      </div>

      {/* Subtle Scroll Hint */}
      <div 
        className="w-full flex justify-center pb-2 text-slate-400 text-xs tracking-widest uppercase transition-opacity duration-300 font-mono"
        style={{ opacity: showHero ? opacity : 0 }}
      >
        <span className="animate-bounce">↓ Scroll down to explore</span>
      </div>

    </div>
  );
};

export default LandingPage;
