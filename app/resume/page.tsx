"use client";

import { motion } from "framer-motion";
import { FileText, Download, Mail, Briefcase, GitBranch } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 90 } }
};

export default function Resume() {
  return (
    <div className="flex flex-col items-center justify-start min-h-[85vh] max-w-5xl mx-auto w-full pb-12 h-full relative z-10 px-4 md:px-0">
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col md:flex-row items-center md:items-end justify-between mb-8 border-b border-latentGray/20 pb-8 pt-10"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <FileText className="text-electricBlue animate-pulse" size={28} />
            <h1 className="text-4xl font-bold tracking-widest text-white uppercase drop-shadow-lg">
              Model <span className="text-electricBlue">Weights</span>
            </h1>
          </div>
          <p className="text-latentGray font-mono text-sm uppercase tracking-widest mt-4">
            [System Output: Downloadable Professional Profile]
          </p>
        </div>

        {/* Top Download Button */}
        <a 
          href="/Shubham_Tade_Resume.pdf" 
          download="Shubham_Tade_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 md:mt-0 flex items-center gap-2 bg-transparent border border-electricBlue text-electricBlue hover:bg-electricBlue hover:text-neuralBase px-6 py-3 rounded-md font-mono text-sm uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]"
        >
          <Download size={18} /> Download PDF
        </a>
      </motion.div>

      {/* Viewer Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full flex flex-col"
      >
        {/* QUICK LINKS BAR (Solves the unclickable image problem on mobile!) */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 mb-6 w-full">
          <a 
            href="https://www.linkedin.com/in/shubham-tade123" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-mono text-latentGray hover:text-[#0077b5] hover:border-[#0077b5]/50 transition-colors bg-[#0a0f1a]/80 backdrop-blur-md border border-latentGray/20 px-5 py-2.5 rounded-full"
          >
            <Briefcase size={16} /> LinkedIn
          </a>
          <a 
            href="https://github.com/shubhu111" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-mono text-latentGray hover:text-white hover:border-white/50 transition-colors bg-[#0a0f1a]/80 backdrop-blur-md border border-latentGray/20 px-5 py-2.5 rounded-full"
          >
            <GitBranch size={16} /> GitHub
          </a>
          <a 
            href="mailto:shubhamgtade123@gmail.com" 
            className="flex items-center gap-2 text-sm font-mono text-latentGray hover:text-rose-400 hover:border-rose-400/50 transition-colors bg-[#0a0f1a]/80 backdrop-blur-md border border-latentGray/20 px-5 py-2.5 rounded-full"
          >
            <Mail size={16} /> Email Me
          </a>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="w-full bg-[#0a0f1a]/80 border border-latentGray/20 rounded-xl overflow-hidden backdrop-blur-md relative group flex flex-col items-center justify-center min-h-[50vh]"
        >
          {/* Mac-style Window Header */}
          <div className="w-full bg-[#05080f] px-4 py-3 border-b border-latentGray/20 flex items-center gap-2 sticky top-0 z-20">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <p className="ml-4 font-mono text-xs text-latentGray">Shubham_Tade_Resume.pdf</p>
          </div>

          {/* IMAGE BASED VIEWER - Bulletproof for Mobile */}
          <div className="w-full p-4 md:p-8 flex justify-center bg-black/40">
            <img 
              src="/resume-image.png" 
              alt="Shubham_Tade_Resume" 
              className="w-full max-w-3xl h-auto rounded-md shadow-2xl border border-white/10"
            />
          </div>
          
        </motion.div>
      </motion.div>

    </div>
  );
}