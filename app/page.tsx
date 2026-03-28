"use client";

import { motion } from "framer-motion";
import { 
  ArrowRight, 
  BrainCircuit, 
  GraduationCap, 
  User, 
  Code2,
  TerminalSquare,
  BookOpen
} from "lucide-react";
import Link from "next/link";

// Animation variants for the Bento Box grid
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } }
};

export default function Home() {
  return (
    <main className="flex flex-col justify-start min-h-[85vh] w-full relative max-w-7xl mx-auto overflow-hidden pt-10 pb-20">
      
      {/* THE BACKGROUND PORTRAIT */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0 pointer-events-none flex justify-end h-[85vh]"
      >
        <div 
          className="relative w-full md:w-[50%] h-full"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 35%)',
            maskImage: 'linear-gradient(to right, transparent 0%, black 35%)'
          }}
        >
          {/* 1. Solid background block behind the image */}
          <div className="absolute inset-0 bg-[#0a0f1a]"></div>
          
          {/* 2. The Image */}
          <img 
            src="/hero-profile.jpeg" 
            alt="Shubham Tade" 
            className="relative w-full h-full object-cover grayscale contrast-[1.2] opacity-80 transition-all duration-300
              /* --- MOBILE POSITION --- */
              object-[10%_30%]
              /* --- DESKTOP POSITION --- */
              md:object-[center_30%]"
          />
          
          {/* 3. Bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/60 to-transparent"></div>
          
          {/* 4. Subtle Electric Blue tint */}
          <div className="absolute inset-0 bg-electricBlue/20 mix-blend-overlay"></div>
        </div>
      </motion.div>

      {/* HERO SECTION: Text Content */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 w-full relative z-20 min-h-[75vh]">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 space-y-8 mt-10 md:mt-0"
        >
          <div className="flex items-center gap-4 text-latentGray font-mono text-xs md:text-sm uppercase tracking-widest">
            <div className="h-2 w-2 bg-electricBlue rounded-full shadow-[0_0_8px_rgba(0,240,255,0.8)] animate-pulse"></div>
            <p>[SYSTEM STATUS: ACTIVE]</p>
          </div>

          <div className="space-y-3">
            <h1 className="text-6xl md:text-[5.5rem] font-black text-white tracking-tighter leading-[1.1] drop-shadow-2xl">
              Hi, I'm <br /> Shubham Tade<span className="text-electricBlue">.</span>
            </h1>
            <h3 className="text-2xl md:text-3xl text-electricBlue font-bold drop-shadow-lg">
              AI/ML Engineer <span className="text-latentGray font-light">@ PandoAI</span>
            </h3>
          </div>
          
          <p className="text-latentGray leading-relaxed max-w-xl text-base md:text-lg border-l-2 border-electricBlue/30 pl-5 drop-shadow-md">
            I am driven by a deep curiosity for how data shapes our digital world. Combining my foundation in Computer Science with advanced Data Science training, I focus on exploring machine learning architectures and developing applied AI projects that bridge the gap between raw data and intelligent user experiences.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-6">
            <Link href="/projects" className="flex items-center gap-2 bg-electricBlue text-neuralBase px-8 py-3 rounded-md font-bold tracking-wide hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all text-sm">
              View Lab
            </Link>
          </div>
        </motion.div>
        <div className="flex-1 hidden lg:block"></div>
      </div>

      {/* --- ABOUT ME SECTION (PROFESSIONAL AGENCY STYLE) --- */}
      <div className="w-full relative z-20 mt-12 pt-16 border-t border-latentGray/20 px-4 md:px-0">
        
        {/* The "Manifesto" Statement */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <TerminalSquare className="text-electricBlue" size={24} />
            <h2 className="text-xl font-mono tracking-widest text-latentGray uppercase">System initialization</h2>
          </div>
          <h3 className="text-3xl md:text-5xl font-black text-white leading-[1.2] tracking-tight">
            I don't just process data. I build <span className="text-electricBlue">functional systems</span> that connect complex algorithms to practical reality.
          </h3>
        </motion.div>

        {/* The "Bento Box" Grid Information Display */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          
          {/* Card 1: Current Role */}
          <motion.div variants={cardVariants} className="md:col-span-8 bg-[#0a0f1a]/80 border border-latentGray/20 rounded-2xl p-8 backdrop-blur-md group hover:border-electricBlue/30 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(0,240,255,0.05)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-electricBlue/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>
            <BrainCircuit className="text-electricBlue mb-6" size={36} />
            <h4 className="text-2xl font-bold text-white mb-4">Applied Healthcare AI</h4>
            <p className="text-latentGray leading-relaxed text-base md:text-lg">
              Currently engineering digital health solutions at <strong className="text-white font-semibold">PandoAI Solutions (caresila.com)</strong>. 
              Since August 2025, my core mission has involved cleaning, organizing, and structuring massive datasets—encompassing over 100,000 hospitals—to fuel the development of the Caresila Hospital Portal. I focus on architecting secure logic engines, building highly responsive UI components, and processing complex healthcare information efficiently and accurately.
            </p>
          </motion.div>

          {/* Card 2: Education */}
          <motion.div variants={cardVariants} className="md:col-span-4 bg-[#0a0f1a]/80 border border-latentGray/20 rounded-2xl p-8 backdrop-blur-md group hover:border-emerald-400/30 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(52,211,153,0.05)] relative overflow-hidden flex flex-col justify-between">
            <div>
              <GraduationCap className="text-emerald-400 mb-6" size={36} />
              <h4 className="text-2xl font-bold text-white mb-4">The Foundation</h4>
              <p className="text-latentGray leading-relaxed text-sm md:text-base mb-6">
                My technical roots began with a <strong className="text-white font-semibold">B.Tech in Computer Science</strong> (Class of 2024), establishing a bedrock in algorithms and scalable software design.
              </p>
            </div>
            <div className="border-l-2 border-emerald-400/30 pl-4">
               <p className="text-emerald-400 font-mono text-xs uppercase tracking-widest mb-1">Jul 2024 - Feb 2025</p>
               <p className="text-white font-bold text-sm">Mastering in Data Science</p>
               <p className="text-latentGray text-xs">3RI Technologies, Pune</p>
            </div>
          </motion.div>

          {/* Card 3: SIH IoT Smart Car to Publication */}
          <motion.div variants={cardVariants} className="md:col-span-4 bg-[#0a0f1a]/80 border border-latentGray/20 rounded-2xl p-8 backdrop-blur-md group hover:border-violet-400/30 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(167,139,250,0.05)] relative overflow-hidden flex flex-col justify-between">
            <div>
              <BookOpen className="text-violet-400 mb-6" size={36} />
              <h4 className="text-2xl font-bold text-white mb-4">IJRPR Paper Publication</h4>
              <p className="text-latentGray leading-relaxed text-sm md:text-base mb-4">
                What began as a targeted prototype for the Smart India Hackathon (SIH) evolved into a fully published paper in the IJRPR. I engineered a physical <strong className="text-white font-semibold">IoT-based smart car</strong> from the ground up, designed entirely around a safety-first architecture.
              </p>
              
              {/* Detailed Breakdown */}
              <ul className="text-latentGray text-xs md:text-sm space-y-3 mb-6 border-l-2 border-violet-400/30 pl-4">
                <li><strong className="text-violet-300">Safety POV:</strong> Programmed an Arduino UNO in C++ to process live data from ultrasonic and MQ3 (alcohol) sensors, physically overriding the L293D motor drivers to execute automated braking on the chassis.</li>
                <li><strong className="text-violet-300">Telemetry:</strong> Integrated GPS NEO 6 & GSM modules to broadcast real-time tracking and trigger automated SOS dispatches during simulated collision events detected via ADXL335.</li>
              </ul>
            </div>
            <Link href="https://ijrpr.com/uploads/V4ISSUE12/IJRPR20326.pdf" className="text-violet-400 font-mono text-xs uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 mt-4 md:mt-0">
               Access Documentation <ArrowRight size={14} />
            </Link>
          </motion.div>

          {/* Card 4: Technical Summary */}
          <motion.div variants={cardVariants} className="md:col-span-8 bg-[#0a0f1a]/80 border border-latentGray/20 rounded-2xl p-8 backdrop-blur-md group hover:border-latentGray/50 transition-all shadow-lg flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="flex-1">
              <Code2 className="text-latentGray mb-4" size={36} />
              <h4 className="text-2xl font-bold text-white mb-2">Technical Toolkit</h4>
              <p className="text-latentGray leading-relaxed text-sm md:text-base">
                Grounded in Python, SQL, and core Machine Learning principles. My toolkit includes data manipulation libraries (Pandas, NumPy) and applied ML/DL models. I am actively expanding my stack into the Generative AI space, utilizing LangChain, Streamlit, and vector databases to bring context-aware applications to life.
              </p>
            </div>
            <div className="md:w-1/3 flex flex-col gap-3 w-full">
              <Link href="/skills" className="w-full text-center py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-mono text-sm transition-colors">
                 Access Full Tech Stack
              </Link>
              <Link href="/resume" className="w-full text-center py-3 bg-electricBlue/10 hover:bg-electricBlue/20 border border-electricBlue/30 rounded-lg text-electricBlue font-mono text-sm transition-colors">
                 Download Resume weights
              </Link>
            </div>
          </motion.div>

        </motion.div>

      </div>

    </main>
  );
}