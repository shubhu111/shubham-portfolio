"use client";

import { motion } from "framer-motion";
import { Download, Terminal } from "lucide-react";

export default function Resume() {
  return (
    <div className="flex flex-col items-center justify-start min-h-[80vh] max-w-5xl mx-auto w-full pb-12 h-full">
      
      {/* Header & Download Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col md:flex-row items-center justify-between mb-8 border-b border-latentGray/20 pb-8"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Terminal className="text-electricBlue" size={28} />
            <h1 className="text-4xl font-bold tracking-widest text-white uppercase">
              Data <span className="text-electricBlue">Checkpoint</span>
            </h1>
          </div>
          <p className="text-latentGray font-mono text-sm">
            [Live feed of current experience matrices]
          </p>
        </div>

        {/* The Download Button */}
        <a 
          href="/Shubham_Tade_Resume.pdf" 
          download="Shubham_Tade_Resume.pdf"
          className="mt-6 md:mt-0 flex items-center gap-3 bg-electricBlue/10 border border-electricBlue text-electricBlue py-3 px-6 hover:bg-electricBlue hover:text-neuralBase hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300 font-mono tracking-widest uppercase group rounded-full backdrop-blur-md"
        >
          <Download size={18} className="group-hover:translate-y-1 transition-transform" />
          Download PDF
        </a>
      </motion.div>

      {/* Glassmorphism Window wrapped around the ACTUAL PDF */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }}
        className="w-full h-[800px] relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] flex flex-col"
      >
        {/* Top window bar (Mac OS style dots) to make it look sleek */}
        <div className="h-10 w-full bg-black/40 border-b border-white/10 flex items-center px-4 gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          <span className="ml-4 font-mono text-xs text-latentGray tracking-widest">Shubham_Tade_Resume.pdf</span>
        </div>

        {/* The actual PDF embedded here */}
        <object 
          data="/Shubham_Tade_Resume.pdf" 
          type="application/pdf" 
          className="w-full flex-1 bg-white"
        >
          <div className="flex flex-col items-center justify-center h-full text-center p-10">
             <p className="text-white font-mono mb-4">
               Your browser does not support embedded PDFs.
             </p>
             <a href="/resume.pdf" className="text-electricBlue underline font-mono">
               Click here to download it instead.
             </a>
          </div>
        </object>
      </motion.div>
    </div>
  );
}