"use client";

import { motion } from "framer-motion";
import { 
  FolderGit2, 
  GitBranch, 
  ExternalLink, 
  TerminalSquare,
  icons,
  Cpu
} from "lucide-react";
import Link from "next/link";

// Entrance animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 90 } }
};

// Helper function to resolve dynamic Lucide icons from Sanity kebab-case strings (e.g. "brain-circuit" -> BrainCircuit)
const getIconComponent = (iconName: string) => {
  if (!iconName) return Cpu;
  const pascalName = iconName
    .split(/[-_ ]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  return (icons as Record<string, any>)[pascalName] || (icons as Record<string, any>)[iconName] || Cpu;
};

// Helper function to map Sanity colorTheme to exact Tailwind text & glow styles
const getColorThemeStyling = (theme: string) => {
  switch (theme?.toLowerCase()) {
    case 'emerald':
      return { color: "text-emerald-400", glow: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" };
    case 'purple':
      return { color: "text-purple-400", glow: "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]" };
    case 'amber':
      return { color: "text-amber-400", glow: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" };
    case 'cyan':
      return { color: "text-cyan-400", glow: "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" };
    case 'rose':
      return { color: "text-rose-400", glow: "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]" };
    case 'violet':
      return { color: "text-violet-400", glow: "bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]" };
    case 'blue':
    default:
      return { color: "text-electricBlue", glow: "bg-electricBlue shadow-[0_0_8px_rgba(0,240,255,0.8)]" };
  }
};

// Notice we now accept "initialProjects" as a prop, removing the need for useEffect!
export default function ProjectsClient({ initialProjects }: { initialProjects: any[] }) {
  return (
    <div className="flex flex-col items-center justify-start min-h-[85vh] max-w-7xl mx-auto w-full pb-12 h-full relative z-10 px-4 md:px-0">
      
      {/* PURE CSS INFINITE FLOAT ANIMATION */}
      <style>{`
        @keyframes customFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-custom-float {
          animation: customFloat 3s ease-in-out infinite;
        }
      `}</style>

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col md:flex-row items-end justify-between mb-12 border-b border-latentGray/20 pb-8"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <FolderGit2 className="text-electricBlue animate-pulse" size={28} />
            <h1 className="text-4xl font-bold tracking-widest text-white uppercase drop-shadow-lg">
              FEATURED <span className="text-electricBlue">WORK</span>
            </h1>
          </div>
          <p className="text-latentGray font-mono text-sm uppercase tracking-widest mt-4">
            [Applied AI Models & Architectures]
          </p>
        </div>
      </motion.div>

      {/* Grid of Projects */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full"
      >
        {initialProjects.map((project, index) => {
          const IconComponent = getIconComponent(project.iconName);
          const styles = getColorThemeStyling(project.colorTheme);
          
          return (
            <motion.div 
              key={project.id || index}
              variants={cardVariants}
              className="h-full"
            >
              <div 
                className="animate-custom-float h-full" 
                style={{ animationDelay: `${index * 0.25}s` }}
              >
                <div className="group relative bg-[#0a0f1a]/80 border border-latentGray/20 rounded-xl overflow-hidden backdrop-blur-md transition-all duration-500 hover:border-latentGray/40 hover:shadow-2xl flex flex-col h-full">
                  
                  {/* Cinematic Image Header */}
                  <div className="relative w-full h-48 md:h-56 overflow-hidden bg-[#05080f]">
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 bg-gradient-to-br from-electricBlue via-transparent to-transparent"></div>
                    
                    {project.image && (
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity group-hover:mix-blend-normal"
                      />
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/50 to-transparent"></div>

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-[#0a0f1a]/80 backdrop-blur-sm border border-latentGray/30 px-3 py-1.5 rounded-full z-10">
                      <div className={`h-2 w-2 rounded-full animate-pulse ${styles.glow}`}></div>
                      <span className={`text-[10px] font-mono tracking-widest uppercase ${styles.color}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 pt-4 relative z-10 flex flex-col h-full">
                    
                    <div className="flex items-center gap-3 mb-3">
                      <IconComponent className={styles.color} size={20} />
                      <h2 className="text-2xl font-black text-white tracking-wide group-hover:text-electricBlue transition-colors duration-300">
                        /{project.title}
                      </h2>
                    </div>
                    
                    <p className="text-latentGray/90 leading-relaxed mb-6 text-sm">
                      {project.description}
                    </p>

                    {/* Technical Features List */}
                    <div className="mb-8 space-y-2">
                      {project.features?.map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-latentGray text-xs md:text-sm font-mono">
                          <TerminalSquare size={12} className="text-electricBlue/70 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Section: Tech Stack & Links */}
                    <div className="mt-auto pt-6 border-t border-latentGray/20 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                      
                      {/* Tech Stack Tags */}
                      <div className="flex flex-wrap gap-2">
                        {project.tech?.map((tech: string, idx: number) => (
                          <span 
                            key={idx}
                            className="text-[10px] font-mono border border-latentGray/30 px-2 py-1 text-latentGray rounded bg-[#0a0f1a]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Links */}
                      <div className="flex gap-4 w-full xl:w-auto justify-end">
                        {project.links?.github && (
                          <Link 
                            href={project.links.github} 
                            target="_blank"
                            className="text-latentGray hover:text-white transition-colors flex items-center gap-2 text-sm font-mono hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                          >
                            <GitBranch size={16} /> Source
                          </Link>
                        )}
                        {project.links?.live && project.links.live !== "#" && (
                          <Link 
                            href={project.links.live} 
                            target="_blank"
                            className="text-electricBlue hover:text-white transition-colors flex items-center gap-2 text-sm font-mono drop-shadow-[0_0_8px_rgba(0,240,255,0.4)] hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                          >
                            <ExternalLink size={16} /> Launch
                          </Link>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}