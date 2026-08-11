"use client";

import { motion } from "framer-motion";
import { icons, Terminal } from "lucide-react"; 

// Entrance animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
};

// Helper function to resolve dynamic Lucide icons from Sanity kebab-case strings (e.g. "brain-circuit" -> BrainCircuit)
const getIconComponent = (iconName: string) => {
  if (!iconName) return Terminal;
  const pascalName = iconName
    .split(/[-_ ]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  return (icons as Record<string, any>)[pascalName] || (icons as Record<string, any>)[iconName] || Terminal;
};

// Helper: Maps the CMS color selection for the top Core Tech Stack cards
const getColorTheme = (theme: string) => {
  switch (theme?.toLowerCase()) {
    case 'emerald': return { border: "group-hover:border-emerald-400/50", glow: "from-emerald-400/10", text: "text-emerald-400" };
    case 'purple': return { border: "group-hover:border-purple-400/50", glow: "from-purple-400/10", text: "text-purple-400" };
    case 'amber': return { border: "group-hover:border-amber-400/50", glow: "from-amber-400/10", text: "text-amber-400" };
    case 'pink': return { border: "group-hover:border-pink-400/50", glow: "from-pink-400/10", text: "text-pink-400" };
    case 'gray': return { border: "group-hover:border-latentGray/50", glow: "from-latentGray/10", text: "text-latentGray" };
    case 'blue':
    default: return { border: "group-hover:border-electricBlue/50", glow: "from-electricBlue/10", text: "text-electricBlue" };
  }
};

// Helper: Maps the CMS color selection for the dashed Currently Learning cards
const getLearningStyling = (theme: string) => {
  switch (theme?.toLowerCase()) {
    case 'emerald': return { border: "border-emerald-400/40", hoverBorder: "hover:border-emerald-400/80", bg: "hover:bg-emerald-400/5" };
    case 'purple': return { border: "border-purple-400/40", hoverBorder: "hover:border-purple-400/80", bg: "hover:bg-purple-400/5" };
    case 'blue':
    default: return { border: "border-electricBlue/40", hoverBorder: "hover:border-electricBlue/80", bg: "hover:bg-electricBlue/5" };
  }
};

export default function SkillsClient({ 
  initialTechStack, 
  initialLearning 
}: { 
  initialTechStack: any[]; 
  initialLearning: any[]; 
}) {
  return (
    <div className="flex flex-col items-center justify-start min-h-[85vh] max-w-6xl mx-auto w-full pb-12 h-full relative z-10 px-4 md:px-0">
      
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
            <Terminal className="text-electricBlue animate-pulse" size={28} />
            <h1 className="text-4xl font-bold tracking-widest text-white uppercase drop-shadow-lg">
              CORE TECHNICAL <span className="text-electricBlue">STACK</span>
            </h1>
          </div>
          <p className="text-latentGray font-mono text-sm uppercase tracking-widest mt-4">
            [Frameworks, languages, and models deployed in production]
          </p>
        </div>
      </motion.div>

      {/* Grid of Skill Modules */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
      >
        {initialTechStack.map((module, index) => {
          const IconComponent = getIconComponent(module.iconName);
          const { border, glow, text } = getColorTheme(module.colorTheme);
          
          return (
            <motion.div 
              key={module._id || index}
              variants={itemVariants} 
              className="h-full"
            >
              <div 
                className="animate-custom-float h-full" 
                style={{ animationDelay: `${index * 0.25}s` }}
              >
                <div className={`bg-[#0a0f1a]/80 border border-latentGray/20 rounded-xl p-6 backdrop-blur-md group transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-[1.02] flex flex-col h-full relative overflow-hidden ${border}`}>
                  
                  <div className={`absolute inset-0 bg-gradient-to-br ${glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10 group-hover:border-white/20 transition-colors shadow-inner">
                        <IconComponent className={`${text} group-hover:animate-pulse`} size={28} />
                      </div>
                      <h3 className="text-white font-bold tracking-wider text-xl drop-shadow-md">{module.domainTitle}</h3>
                    </div>
                    
                    <p className="text-latentGray font-mono text-xs mb-6 h-10 leading-relaxed">
                      {module.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      {module.skillTags?.map((skill: string, skillIdx: number) => (
                        <span 
                          key={skillIdx}
                          className="text-[11px] font-mono border border-latentGray/30 px-3 py-1.5 text-latentGray/90 rounded-md bg-[#0a0f1a] transition-colors cursor-default shadow-sm group-hover:border-white/20 group-hover:text-white hover:bg-white/10"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* --- CURRENTLY LEARNING SECTION --- */}
      {initialLearning && initialLearning.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="w-full mt-24 pt-12 border-t border-latentGray/20"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">
              Currently <span className="text-electricBlue">Learning</span>
            </h2>
            <p className="text-latentGray font-mono text-xs uppercase tracking-widest mt-2">
              [STATUS: IN-PROGRESS ROADMAPS & ACTIVE UPSKILLING]
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80">
            {initialLearning.map((roadmap) => {
              const styles = getLearningStyling(roadmap.colorTheme);
              
              return (
                <div 
                  key={roadmap._id}
                  className={`bg-[#0a0f1a]/40 border border-dashed ${styles.border} rounded-2xl p-8 relative group ${styles.hoverBorder} ${styles.bg} transition-all duration-300`}
                >
                  <h4 className="text-2xl font-bold text-white mb-4">{roadmap.roadmapTitle}</h4>
                  <p className="text-latentGray text-sm mb-6 leading-relaxed">
                    {roadmap.description}
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {roadmap.topicTags?.map((tag: string, tagIdx: number) => (
                      <span 
                        key={tagIdx}
                        className="text-[11px] font-mono border border-latentGray/30 text-latentGray px-3 py-1.5 rounded-md hover:text-white transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}