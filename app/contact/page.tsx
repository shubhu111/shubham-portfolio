"use client";

import { motion } from "framer-motion";
import { Send, Mail, Radio, MessageSquareText, CheckCircle2, AlertCircle } from "lucide-react"; 
import { useState } from "react";

// --- Your Web3Forms Access Key ---
const WEB3FORMS_ACCESS_KEY = "033bd5c5-007f-485d-81bf-b0d6085d0d9c"; 

// --- Custom Brand Icons ---
const GithubIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.15-.38 6.5-1.4 6.5-7.17a5.5 5.5 0 0 0-1.5-3.8c.16-.38.23-1.2-.15-2.8-1.1-.3-3.1 1.06-3.1 1.06a10.6 10.6 0 0 0-5.8 0s-2-1.36-3.1-1.06c-.38 1.6-.31 2.42-.15 2.8a5.5 5.5 0 0 0-1.5 3.8c0 5.76 3.35 6.78 6.5 7.17a4.8 4.8 0 0 0-1 3.03V22" />
    <path d="M9 20c-5 1.5-5-2.5-7-3" />
  </svg>
);

const LinkedinIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90 } }
};

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    // Fix: Save the form reference immediately before React cleans up the event
    const form = e.currentTarget; 
    
    const formData = new FormData(form);
    formData.append("access_key", WEB3FORMS_ACCESS_KEY);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        form.reset(); // Now correctly uses the saved form reference to clear boxes safely
        setTimeout(() => setStatus("idle"), 5000); 
      } else {
        console.error("Transmission Error:", data);
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch (error) {
      console.error("Network Error:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[85vh] max-w-6xl mx-auto w-full pb-12 h-full relative z-10 px-4 md:px-0 pt-10">
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col md:flex-row items-end justify-between mb-12 border-b border-latentGray/20 pb-8"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Radio className="text-electricBlue animate-pulse" size={28} />
            <h1 className="text-4xl font-bold tracking-widest text-white uppercase drop-shadow-lg">
              Establish <span className="text-electricBlue">Connection</span>
            </h1>
          </div>
          <p className="text-latentGray font-mono text-sm uppercase tracking-widest mt-4">
            [Status: Awaiting input transmission...]
          </p>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full"
      >
        
        {/* The Transmit Form */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-7 bg-[#0a0f1a]/80 border border-latentGray/20 p-8 md:p-10 rounded-2xl backdrop-blur-md relative overflow-hidden group shadow-lg"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-electricBlue/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50"></div>
          
          <div className="flex items-center gap-3 mb-8 relative z-10">
            <MessageSquareText className="text-latentGray" size={24} />
            <h2 className="text-2xl font-bold text-white tracking-wide">Direct Transmission</h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-electricBlue font-mono text-[10px] tracking-widest uppercase">Name (Sender_ID)</label>
                <input 
                  type="text" 
                  name="name" 
                  required
                  className="bg-[#05080f] border border-latentGray/30 rounded-lg p-3 text-white focus:outline-none focus:border-electricBlue focus:ring-1 focus:ring-electricBlue transition-all font-mono text-sm shadow-inner"
                  placeholder="Enter your name"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-electricBlue font-mono text-[10px] tracking-widest uppercase">Email (Return_Address)</label>
                <input 
                  type="email" 
                  name="email" 
                  required
                  className="bg-[#05080f] border border-latentGray/30 rounded-lg p-3 text-white focus:outline-none focus:border-electricBlue focus:ring-1 focus:ring-electricBlue transition-all font-mono text-sm shadow-inner"
                  placeholder="name@domain.com"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-electricBlue font-mono text-[10px] tracking-widest uppercase">Message (Data_Payload)</label>
              <textarea 
                name="message" 
                required
                rows={5}
                className="bg-[#05080f] border border-latentGray/30 rounded-lg p-3 text-white focus:outline-none focus:border-electricBlue focus:ring-1 focus:ring-electricBlue transition-all font-mono text-sm resize-none shadow-inner"
                placeholder="Write your message here..."
              ></textarea>
            </div>

            {/* Dynamic Submit Button */}
            <button 
              type="submit"
              disabled={status === "submitting" || status === "success"}
              className={`mt-2 flex items-center justify-center gap-3 border py-4 rounded-lg transition-all duration-300 font-mono tracking-widest uppercase text-sm font-bold group shadow-[0_0_15px_rgba(0,240,255,0.1)] 
                ${status === "idle" ? "bg-transparent border-electricBlue text-electricBlue hover:bg-electricBlue hover:text-neuralBase hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]" : ""}
                ${status === "submitting" ? "bg-electricBlue/20 border-electricBlue/50 text-electricBlue cursor-wait" : ""}
                ${status === "success" ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 cursor-not-allowed" : ""}
                ${status === "error" ? "bg-red-500/20 border-red-500 text-red-400" : ""}
              `}
            >
              {status === "idle" && <><Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Broadcast Signal</>}
              {status === "submitting" && <><Radio size={18} className="animate-spin" /> Transmitting...</>}
              {status === "success" && <><CheckCircle2 size={18} /> Signal Delivered</>}
              {status === "error" && <><AlertCircle size={18} /> Transmission Failed</>}
            </button>
          </form>
        </motion.div>

        {/* The Node Connections (Socials) */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-5 flex flex-col gap-4"
        >
          <a href="https://github.com/shubhu111" target="_blank" rel="noopener noreferrer" className="bg-[#0a0f1a]/80 border border-latentGray/20 p-6 rounded-2xl backdrop-blur-md group hover:border-white/40 transition-all shadow-lg hover:shadow-xl flex items-center gap-6 cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="p-4 bg-[#05080f] rounded-xl border border-latentGray/30 group-hover:border-white/50 group-hover:text-white text-latentGray transition-all shadow-inner relative z-10">
              <GithubIcon size={28} />
            </div>
            <div className="relative z-10">
              <p className="font-bold text-lg text-white tracking-wide group-hover:text-electricBlue transition-colors">GitHub Protocol</p>
              <p className="text-xs font-mono text-latentGray/80 mt-1">Review source architecture</p>
            </div>
          </a>

          <a href="https://www.linkedin.com/in/shubham-tade123/" target="_blank" rel="noopener noreferrer" className="bg-[#0a0f1a]/80 border border-latentGray/20 p-6 rounded-2xl backdrop-blur-md group hover:border-[#0A66C2]/50 transition-all shadow-lg hover:shadow-xl flex items-center gap-6 cursor-pointer relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-[#0A66C2]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="p-4 bg-[#05080f] rounded-xl border border-latentGray/30 group-hover:border-[#0A66C2]/50 group-hover:text-[#0A66C2] text-latentGray transition-all shadow-inner relative z-10">
              <LinkedinIcon size={28} />
            </div>
            <div className="relative z-10">
              <p className="font-bold text-lg text-white tracking-wide group-hover:text-electricBlue transition-colors">LinkedIn Network</p>
              <p className="text-xs font-mono text-latentGray/80 mt-1">Professional node connection</p>
            </div>
          </a>

          <a href="mailto:shubhamgtade123@gmail.com" className="bg-[#0a0f1a]/80 border border-latentGray/20 p-6 rounded-2xl backdrop-blur-md group hover:border-emerald-400/50 transition-all shadow-lg hover:shadow-xl flex items-center gap-6 cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="p-4 bg-[#05080f] rounded-xl border border-latentGray/30 group-hover:border-emerald-400/50 group-hover:text-emerald-400 text-latentGray transition-all shadow-inner relative z-10">
              <Mail size={28} />
            </div>
            <div className="relative z-10">
              <p className="font-bold text-lg text-white tracking-wide group-hover:text-electricBlue transition-colors">Direct SMTP</p>
              <p className="text-xs font-mono text-latentGray/80 mt-1">shubhamgtade123@gmail.com</p>
            </div>
          </a>
        </motion.div>

      </motion.div>

    </div>
  );
}