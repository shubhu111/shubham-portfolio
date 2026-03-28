"use client";

import { motion } from "framer-motion";
import { 
  Network, 
  Cpu, 
  Terminal, 
  BrainCircuit, 
  MessageSquareText, 
  BarChart3, 
  Wrench 
} from "lucide-react";

// Mapped EXACTLY from your uploaded resume
const skillModules = [
  {
    title: "GenAI",
    icon: <BrainCircuit className="text-electricBlue group-hover:animate-pulse" size={28} />,
    color: "group-hover:border-electricBlue/50",
    glow: "from-electricBlue/10",
    description: "Architecting context-aware reasoning engines & LLM integrations.",
    skills: ["RAG", "LLM", "Vector Database", "FAISS", "Embeddings"]
  },
  {
    title: "Deep Learning",
    icon: <Network className="text-purple-400 group-hover:animate-pulse" size={28} />,
    color: "group-hover:border-purple-400/50",
    glow: "from-purple-400/10",
    description: "Building complex neural networks for pattern recognition.",
    skills: ["ANN", "CNN", "RNN", "LSTM", "GRU", "Encoder - Decoder", "Transformers"]
  },
  {
    title: "Machine Learning",
    icon: <Cpu className="text-blue-400 group-hover:animate-pulse" size={28} />,
    color: "group-hover:border-blue-400/50",
    glow: "from-blue-400/10",
    description: "Developing and optimizing predictive algorithms.",
    skills: ["Supervised Learning", "Unsupervised Learning", "Data Preprocessing", "Model Evaluation"]
  },
  {
    title: "NLP",
    icon: <MessageSquareText className="text-emerald-400 group-hover:animate-pulse" size={28} />,
    color: "group-hover:border-emerald-400/50",
    glow: "from-emerald-400/10",
    description: "Extracting insights and structure from natural language.",
    skills: ["Text Classification", "Tokenization", "Named Entity Recognition (NER)"]
  },
  {
    title: "Data Analytics",
    icon: <BarChart3 className="text-amber-400 group-hover:animate-pulse" size={28} />,
    color: "group-hover:border-amber-400/50",
    glow: "from-amber-400/10",
    description: "Analyzing distributions and correlating complex datasets.",
    skills: ["Advanced Excel", "Power BI", "EDA", "Data Cleaning", "Correlation", "Distribution"]
  },
  {
    title: "Languages & Tools",
    icon: <Wrench className="text-pink-400 group-hover:animate-pulse" size={28} />,
    color: "group-hover:border-pink-400/50",
    glow: "from-pink-400/10",
    description: "The core stack powering data pipelines and model serving.",
    skills: ["Python", "SQL", "LangChain", "NumPy", "Pandas", "Seaborn", "Sci-kit-learn", "TensorFlow", "NLTK", "Git", "Streamlit"]
  }
];

// Entrance animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
};

export default function Skills() {
  return (
    <div className="flex flex-col items-center justify-start min-h-[85vh] max-w-6xl mx-auto w-full pb-12 h-full relative z-10">
      
      {/* PURE CSS INFINITE FLOAT ANIMATION (INCREASED MOTION) */}
      <style>{`
        @keyframes customFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); } /* Increased travel distance */
        }
        .animate-custom-float {
          animation: customFloat 3s ease-in-out infinite; /* Sped up from 4s to 3s */
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
              System <span className="text-electricBlue">Architecture</span>
            </h1>
          </div>
          <p className="text-latentGray font-mono text-sm uppercase tracking-widest mt-4">
            [Loaded Modules: Exact Match via Resume Data Checkpoint]
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
        {skillModules.map((module, index) => (
          <motion.div 
            key={index}
            variants={itemVariants} 
            className="h-full"
          >
            <div 
              className="animate-custom-float h-full" 
              style={{ animationDelay: `${index * 0.25}s` }} /* Slightly adjusted stagger to match new speed */
            >
              <div className={`bg-[#0a0f1a]/80 border border-latentGray/20 rounded-xl p-6 backdrop-blur-md group transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-[1.02] flex flex-col h-full relative overflow-hidden ${module.color}`}>
                
                {/* Thematic glowing background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${module.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon & Title */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10 group-hover:border-white/20 transition-colors shadow-inner">
                      {module.icon}
                    </div>
                    <h3 className="text-white font-bold tracking-wider text-xl drop-shadow-md">{module.title}</h3>
                  </div>
                  
                  {/* Description */}
                  <p className="text-latentGray font-mono text-xs mb-6 h-10 leading-relaxed">
                    {module.description}
                  </p>

                  {/* Interactive Skill Tags */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {module.skills.map((skill, skillIdx) => (
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
        ))}
      </motion.div>

    </div>
  );
}