import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import Lenis from 'lenis';
import Particles from '../components/ui/Particles';

const LandingPage = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const frameCount = 40; // We have 40 frames: 001 to 040

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

  // Preload images
  useEffect(() => {
    const loadImages = async () => {
      const loadedImages = [];
      const promises = [];
      let loadedCount = 0;

      for (let i = 1; i <= frameCount; i++) {
        const promise = new Promise((resolve, reject) => {
          const img = new Image();
          const paddedIndex = i.toString().padStart(3, '0');
          // Add cache busting query param
          img.src = `/animation/ezgif-frame-${paddedIndex}.jpg?v=${Date.now()}`;
          img.onload = () => {
              loadedCount++;
              setProgress(Math.round((loadedCount / frameCount) * 100));
              resolve(img);
          };
          img.onerror = (e) => {
            console.error(`Failed to load image ${i}`, e);
            resolve(null); // Resolve with null to not break Promise.all
          };
          loadedImages[i] = img; // Store by index
        });
        promises.push(promise);
      }

      await Promise.all(promises);
      setImages(loadedImages);
      setIsLoaded(true);
    };

    loadImages();
  }, []);

  // Render canvas
  const render = (index) => {
    const canvas = canvasRef.current;
    if (!canvas || !isLoaded) return;

    const ctx = canvas.getContext('2d');
    
    // Use Math.round to pick the nearest frame, clamped between 1 and frameCount
    const frameIndex = Math.min(
        frameCount,
        Math.max(1, Math.round(index))
    );
    
    const img = images[frameIndex];
    if (!img) return;

    // Canvas sizing (cover)
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
    ctx.filter = 'brightness(0.6)'; // Darken slightly for text readability
    ctx.drawImage(img, 0, 0, iw, ih, ox, oy, nw, nh);
  };

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        // Re-render current frame
        render(currentIndex.get());
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Init size

    return () => window.removeEventListener('resize', handleResize);
  }, [isLoaded]); // Re-run when loaded to ensure first frame draws

  // Subscribe to scroll changes
  useMotionValueEvent(currentIndex, "change", (latest) => {
    requestAnimationFrame(() => render(latest));
  });

  return (
    <div ref={containerRef} className="relative bg-black min-h-screen">
      {/* Fixed Background Canvas */}
      <div className="fixed inset-0 h-screen w-full overflow-hidden z-0">
        <Particles className="absolute inset-0 z-0 opacity-50" />
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Loading State */}
        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white z-50">
            <div className="text-2xl font-bold mb-4">Loading Experience... {progress}%</div>
            <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                    className="h-full bg-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear" }}
                />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60 z-10" />
        
        {/* Dynamic Overlay Content */}
        <div className="absolute inset-0 z-20 pointer-events-none">
            <HeroOverlay progress={currentIndex} />
        </div>
      </div>

      {/* Scrolling Content Overlay */}
      <div className="relative z-50">
        
        {/* Section 1: Hero */}
        {/* Section 1: Spacer for Animation Intro - Increased height to let animation play longer */}
        <section className="h-[250vh] snap-start pointer-events-none">
          {/* This section is intentionally empty to allow the fixed HeroOverlay to be visible */}
        </section>



        {/* Section 2: Features Intro (Styled as requested) */}
        <section className="min-h-screen flex flex-col justify-center relative snap-start bg-black z-50 py-20">
            {/* Marquee Header */}
             <div className="w-full overflow-hidden mb-12 border-y border-white/20 py-4">
                <motion.div 
                    className="flex whitespace-nowrap"
                    animate={{ x: [0, -1000] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
                >
                    {[...Array(4)].map((_, i) => (
                        <span key={i} className="text-8xl md:text-9xl font-black text-transparent px-8" style={{ WebkitTextStroke: "2px rgba(255,255,255,0.8)" }}>
                            HOW IT WORKS  —  
                        </span>
                    ))}
                </motion.div>
             </div>

             <div className="container mx-auto px-4 max-w-7xl">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                     {/* Left Image */}
                     <div className="relative h-[600px] bg-neutral-900 rounded-lg overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-700">
                        <img 
                            src="/animation/ezgif-frame-020.jpg?v=1" 
                            alt="Feature Visualization" 
                            className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                     </div>

                     {/* Right Content */}
                     <div className="flex flex-col justify-center text-white">
                        <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight">
                            Effortless <br/> Planning
                        </h2>
                        <p className="text-xl text-gray-400 leading-relaxed font-light mb-8 max-w-lg">
                            Ditch the spreadsheets and scattered notes. Build your perfect itinerary with our intuitive drag-and-drop builder that automatically organizes your days for maximum enjoyment and minimal travel time.
                        </p>
                        <div className="w-full h-px bg-white/20 my-8"></div>
                        <ul className="space-y-4 text-gray-300 font-light">
                            <li className="flex items-center gap-4">
                                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                                Real-time collaboration with your travel squad
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                                Smart route optimization to save time
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                                Integrated budget tracking and splitting
                            </li>
                        </ul>
                     </div>
                 </div>
             </div>
        </section>



        {/* Section 3: Curated Lists (Styled as requested) */}
        <section className="min-h-screen flex flex-col justify-center relative snap-start bg-[#241a4a] py-24">
            <div className="container mx-auto px-4 max-w-7xl">
                 <div className="text-center mb-16">
                     <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                         Explore Our Award<br/>Winning Destinations
                     </h2>
                     <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                         Hand-picked itineraries from our top travelers, available directly for you to copy and customize.
                     </p>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                     {/* Card 1 */}
                     <div className="flex flex-col items-center text-center group cursor-pointer">
                        <div className="w-full aspect-square bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl mb-6 overflow-hidden relative shadow-lg group-hover:-translate-y-2 transition-transform duration-300">
                             <img src="/animation/ezgif-frame-005.jpg?v=1" alt="Beach" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 leading-tight">Relaxing Beach<br/>Getaways</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                            Discover the most pristine coastlines and hidden coves for the ultimate relaxation experience.
                        </p>
                        <span className="text-purple-400 font-bold text-xs bg-purple-900/30 px-3 py-1 rounded-full border border-purple-500/30">
                            482 Itineraries Available
                        </span>
                     </div>

                     {/* Card 2 */}
                     <div className="flex flex-col items-center text-center group cursor-pointer">
                        <div className="w-full aspect-square bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl mb-6 overflow-hidden relative shadow-lg group-hover:-translate-y-2 transition-transform duration-300">
                             <img src="/animation/ezgif-frame-012.jpg?v=1" alt="Mountain" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 leading-tight">Mountain Trekking<br/>Adventures</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                            Challenge yourself with high-altitude trails, breathtaking views, and cozy cabin stays.
                        </p>
                        <span className="text-purple-400 font-bold text-xs bg-purple-900/30 px-3 py-1 rounded-full border border-purple-500/30">
                            399 Itineraries Available
                        </span>
                     </div>

                     {/* Card 3 */}
                     <div className="flex flex-col items-center text-center group cursor-pointer">
                        <div className="w-full aspect-square bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl mb-6 overflow-hidden relative shadow-lg group-hover:-translate-y-2 transition-transform duration-300">
                             <img src="/animation/ezgif-frame-025.jpg?v=1" alt="City" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 leading-tight">Urban Culture<br/>Explorations</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                            Dive deep into the history, art, and culinary delights of the world's most vibrant cities.
                        </p>
                        <span className="text-purple-400 font-bold text-xs bg-purple-900/30 px-3 py-1 rounded-full border border-purple-500/30">
                            564 Itineraries Available
                        </span>
                     </div>

                     {/* Card 4 */}
                     <div className="flex flex-col items-center text-center group cursor-pointer">
                        <div className="w-full aspect-square bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl mb-6 overflow-hidden relative shadow-lg group-hover:-translate-y-2 transition-transform duration-300">
                             <img src="/animation/ezgif-frame-035.jpg?v=1" alt="Nature" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 leading-tight">Hidden Nature<br/>Retreats</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                            Escape the crowds and reconnect with nature in these secluded eco-friendly spots.
                        </p>
                        <span className="text-purple-400 font-bold text-xs bg-purple-900/30 px-3 py-1 rounded-full border border-purple-500/30">
                            286 Itineraries Available
                        </span>
                     </div>
                 </div>
            </div>
        </section>



        {/* Section 4: Reviews (Styled as requested) */}
        <section className="min-h-screen flex flex-col justify-between relative snap-start bg-[#1a103c]">
          <div className="container mx-auto px-4 max-w-7xl flex-grow flex flex-col justify-center py-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Latest Reviews From <span className="text-purple-500">Real People</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Simply our latest reviews, good and bad, pulled directly from the app store.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Review 1 */}
              <div className="bg-[#130b2e] p-8 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors">
                <div className="flex gap-1 mb-4 text-yellow-400 text-xl">
                  {'★'.repeat(5)}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Love this app!</h3>
                <p className="text-gray-400 text-sm mb-6 italic">
                  "This is an awesome app and totally recommended from me! I used to non-stop think about scary stuff like hazards, and now all I think about is what is happening in the trip planning."
                </p>
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  United States - February 14, 2026
                </div>
              </div>

              {/* Review 2 */}
              <div className="bg-[#130b2e] p-8 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors">
                <div className="flex gap-1 mb-4 text-yellow-400 text-xl">
                  {'★'.repeat(5)}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Great app</h3>
                <p className="text-gray-400 text-sm mb-6 italic">
                  "Sends me off to explore the world with confidence. The itineraries are spot on."
                </p>
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  United Kingdom - February 14, 2026
                </div>
              </div>

              {/* Review 3 */}
              <div className="bg-[#130b2e] p-8 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors">
                <div className="flex gap-1 mb-4 text-yellow-400 text-xl">
                  {'★'.repeat(5)}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Relax</h3>
                <p className="text-gray-400 text-sm mb-6 italic">
                  "Love to plan away from the world. It makes organizing generic trips into adventures so easy."
                </p>
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  United States - February 13, 2026
                </div>
              </div>

              {/* Review 4 */}
              <div className="bg-[#130b2e] p-8 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors">
                <div className="flex gap-1 mb-4 text-yellow-400 text-xl">
                  {'★'.repeat(5)}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">The best</h3>
                <p className="text-gray-400 text-sm mb-6 italic">
                  "The budget tracking features make me save money quick. Best travel companion ever."
                </p>
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  United States - February 12, 2026
                </div>
              </div>

              {/* Review 5 */}
              <div className="bg-[#130b2e] p-8 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors">
                <div className="flex gap-1 mb-4 text-yellow-400 text-xl">
                  {'★'.repeat(5)}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Planning Help</h3>
                <p className="text-gray-400 text-sm mb-6 italic">
                  "Helps me finalize plans and actually book things. I'm usually so indecisive."
                </p>
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  United States - February 10, 2026
                </div>
              </div>

              {/* Review 6 */}
              <div className="bg-[#130b2e] p-8 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors">
                 <div className="flex gap-1 mb-4 text-yellow-500 text-xl">
                    {'★'.repeat(4)}<span className="text-gray-600">★</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Good</h3>
                <p className="text-gray-400 text-sm mb-6 italic">
                  "So relaxing, so peaceful I enjoy a lot. Just waiting for offline mode support."
                </p>
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  United States - February 13, 2026
                </div>
              </div>
            </div>
            
             <div className="flex justify-center mt-16">
                 <Link to="/register" className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-lg transition-all shadow-xl hover:scale-105">
                    See All Reviews
                 </Link>
             </div>
          </div>

          <footer className="w-full bg-[#1a103c] pt-20 pb-10 border-t border-white/5 z-50">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                            <span className="text-white text-2xl font-bold tracking-tight">TripVault</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            We help you find the best spots, plan the perfect routes, and make memories that last a lifetime.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Discover</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#" className="hover:text-purple-400 transition-colors">Destinations</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition-colors">Trip Guides</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition-colors">Nearby Gems</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition-colors">Staff Picks</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Company</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#" className="hover:text-purple-400 transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition-colors">Legal</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Connect</h4>
                         <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-purple-600 transition-colors">
                                🐦
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-purple-600 transition-colors">
                                📸
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-purple-600 transition-colors">
                                💼
                            </a>
                         </div>
                    </div>
                </div>
                
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                     <p>&copy; {new Date().getFullYear()} TripVault Inc. All rights reserved.</p>
                     <div className="flex gap-8">
                         <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                         <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                     </div>
                </div>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }) => (
  <div className="text-left">
    <div className="text-5xl mb-6">{icon}</div>
    <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
    <p className="text-gray-300 leading-relaxed text-lg">{description}</p>
  </div>
);

const HeroOverlay = ({ progress }) => {
    const [opacity, setOpacity] = useState(1);
    const [showHero, setShowHero] = useState(true);

    useMotionValueEvent(progress, "change", (latest) => {
        // Hero Section Visibility (Frames 1-5)
        if (latest < 5) {
            setOpacity(1 - (latest / 5)); // Fade out as we scroll
            setShowHero(true);
        } else {
            setShowHero(false);
            setOpacity(0);
        }
    });

    return (
        <div className="w-full h-full relative">
            {/* HER0 SECTION (First 5 Frames) */}
            <div 
                className="absolute inset-0 flex flex-col transition-opacity duration-300 pointer-events-auto"
                style={{ opacity: showHero ? opacity : 0, pointerEvents: showHero ? 'auto' : 'none' }}
            >
                {/* Custom Navbar */}
                <nav className="w-full p-6 flex justify-between items-center z-50">
                    <div className="flex items-center gap-2">
                         {/* Circle Logo Icon */}
                        <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                        <span className="text-white text-2xl font-bold tracking-tight">TripVault</span>
                    </div>
                    <div className="flex items-center gap-6 text-white">
                        <button className="hover:opacity-75 transition-opacity">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </button>
                        <button className="hover:opacity-75 transition-opacity">
                             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                        </button>
                    </div>
                </nav>

                {/* Hero Content */}
                <div className="flex-1 container mx-auto px-6 flex flex-col justify-center pb-20">
                    <div className="max-w-4xl">
                        <h1 className="text-6xl md:text-8xl text-white font-normal leading-tight mb-8">
                            Your next big <br />
                            <span className="font-semibold">adventure starts here</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-xl font-light leading-relaxed">
                            The ideal framework to plan, manage, and enjoy every aspect of your trip.
                        </p>
                        <Link 
                            to="/register" 
                            className="inline-block bg-[#EBCCB2] text-[#1a1a1a] px-10 py-4 rounded-full text-lg font-bold tracking-wide hover:bg-[#ffe4d1] transition-colors shadow-lg"
                        >
                            START FOR FREE
                        </Link>
                    </div>

                    {/* Decorative Elements matching reference */}
                    <div className="absolute right-20 top-1/2 transform -translate-y-1/2 hidden lg:block opacity-20 pointer-events-none">
                         <svg width="300" height="300" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#FFF" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.9C87.4,-34.7,90.1,-20.4,85.8,-7.1C81.5,6.2,70.2,18.5,59.6,29.1C49,39.7,39.1,48.6,27.8,56.6C16.5,64.6,3.8,71.7,-7.8,69.5C-19.4,67.3,-29.9,55.8,-40,45.2C-50.1,34.6,-59.8,24.9,-65.4,12.7C-71,0.5,-72.5,-14.2,-66.6,-26.6C-60.7,-39,-47.4,-49.1,-33.9,-56.6C-20.4,-64.1,-6.7,-69,7.6,-70.7C21.9,-72.4,43.8,-70.8,44.7,-76.4Z" transform="translate(100 100)" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
