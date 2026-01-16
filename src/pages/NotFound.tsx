import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/layout/PageTransition";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: Void detected at:", location.pathname);
  }, [location.pathname]);

  return (
      <PageTransition>
        <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden selection:bg-orange-100 selection:text-orange-600">

          {/* --- LAYER 0: CALM-DEPTH BACKGROUND (The Veteran Touch) --- */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Drifting Orange/Yellow Plate */}
            <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  x: [0, 40, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-[#FF6B35]/5 to-[#FBBF24]/10 rounded-full blur-[120px]"
            />
            {/* Drifting Blue/Green Plate */}
            <motion.div
                animate={{
                  scale: [1.1, 1, 1.1],
                  x: [0, -30, 0],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-[#3B82F6]/5 to-[#10B981]/10 rounded-full blur-[100px]"
            />
          </div>

          <div className="container-wide px-4 relative z-10 text-center">

            {/* --- LAYER 1: THE GLITCH MATRIX --- */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mb-8 relative inline-block"
            >
              {/* The "Ghost" Layer for Depth */}
              <span className="absolute inset-0 text-[180px] md:text-[240px] font-black text-slate-100 blur-sm select-none" aria-hidden="true">
              404
            </span>

              {/* The Main Refractive Layer */}
              <h1 className="relative text-[180px] md:text-[240px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-400">
                404
              </h1>

              {/* The Floating Status Badge */}
              <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-5deg]"
              >
                <div className="px-6 py-2 bg-[#FF6B35] text-white text-sm font-black uppercase tracking-[0.2em] rounded-full shadow-xl">
                  System Void
                </div>
              </motion.div>
            </motion.div>

            {/* --- LAYER 2: TYPOGRAPHY --- */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="max-w-md mx-auto mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">
                Reality Not Found
              </h2>
              <p className="text-slate-500 font-bold leading-relaxed">
                The coordinates you are looking for have drifted into the <span className="text-blue-500">digital void</span>. Let's re-calibrate your session.
              </p>
            </motion.div>

            {/* --- LAYER 3: BENTO ACTION RAIL --- */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button asChild className="h-14 px-8 rounded-full bg-slate-900 text-white font-black uppercase tracking-widest hover:bg-[#10B981] transition-all duration-500 shadow-xl group">
                <Link to="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span>Return to Matrix</span>
                </Link>
              </Button>

              <Button
                  variant="outline"
                  className="h-14 px-8 rounded-full border-slate-200 text-slate-500 font-bold uppercase tracking-widest hover:text-slate-900 hover:border-slate-900 transition-all duration-300 group bg-white/50 backdrop-blur-md"
                  onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span>Go Back</span>
              </Button>
            </motion.div>

          </div>
        </div>
      </PageTransition>
  );
};

export default NotFound;