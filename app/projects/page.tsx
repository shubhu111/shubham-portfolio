"use client";

import { motion } from "framer-motion";
import { 
  FolderGit2, 
  GitBranch, 
  ExternalLink, 
  Activity, 
  Cpu, 
  TerminalSquare,
  BarChart,
  BrainCircuit,
  PieChart,
  TrendingUp,
  BookOpen
} from "lucide-react";
import Link from "next/link";

// Project Data extracted STRICTLY from uploaded READMEs and code
const projects = [
  {
    id: "st-gpt",
    title: "ST-GPT",
    status: "Active Development",
    statusColor: "text-electricBlue",
    statusGlow: "bg-electricBlue shadow-[0_0_8px_rgba(0,240,255,0.8)]",
    icon: <Cpu className="text-electricBlue" size={20} />,
    image: "/st-gpt-cover.jpg",
    description: "An all-in-one Generative AI application serving as a conversational assistant, YouTube video analyst, and PDF document researcher.",
    features: [
      "Memory-Enabled Conversational AI",
      "YouTube Video RAG Pipeline",
      "PDF Document Analysis"
    ],
    tech: ["Streamlit", "Llama 3.3", "LangChain", "FAISS", "Python"],
    links: { github: "https://github.com/shubhu111/ST-GPT", live: "https://study-buddy-st-ai.streamlit.app/" }
  },
  {
    id: "bank-loan",
    title: "Bank Loan Approval",
    status: "Completed",
    statusColor: "text-emerald-400",
    statusGlow: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
    icon: <BarChart className="text-emerald-400" size={20} />,
    image: "/loan-cover.jpg",
    description: "A machine learning pipeline predicting bank loan approvals using demographic and financial data, achieving 98% overall accuracy.",
    features: [
      "Exploratory Data Analysis (EDA)",
      "Data Balancing & Scaling",
      "Optimized Stacking Algorithm"
    ],
    tech: ["Random Forest", "SVC", "Logistic Regression", "Scikit-learn"],
    links: { github: "https://github.com/shubhu111/Bank-Loan-Approval-Classification-Machine-Learning-Project", live: "#" }
  },
  {
    id: "pneumonia-cnn",
    title: "Detecting Pneumonia",
    status: "Completed",
    statusColor: "text-purple-400",
    statusGlow: "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]",
    icon: <Activity className="text-purple-400" size={20} />,
    image: "/pneumonia-cover.jpg",
    description: "A Convolutional Neural Network (CNN) developed to assist healthcare professionals by classifying chest X-ray images into Normal or Pneumonia categories.",
    features: [
      "Binary Image Classification",
      "Data Augmentation (ImageDataGenerator)",
      "Efficient Training Callbacks"
    ],
    tech: ["CNN", "TensorFlow", "Keras", "Python"],
    links: { github: "https://github.com/shubhu111/-Detecting-Pneumonia-in-Chest-X-Rays-Using-CNN-Ai-project", live: "#" }
  },
  {
    id: "sentiment-rnn",
    title: "Sentiment Analysis",
    status: "Completed",
    statusColor: "text-amber-400",
    statusGlow: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
    icon: <BrainCircuit className="text-amber-400" size={20} />,
    image: "/sentiment-cover.jpg",
    description: "An NLP model performing sentiment classification on text data, comparing SimpleRNN and GRU architectures for optimal validation stability.",
    features: [
      "Positive/Negative/Natural Classification",
      "Text Tokenization & Padding",
      "RNN vs GRU Architecture Comparison"
    ],
    tech: ["GRU", "RNN", "TensorFlow", "Keras"],
    links: { github: "https://github.com/shubhu111/Sentiment_Analysis_Using_RNN_and_GRU_AI_Project", live: "#" }
  },
  {
    id: "madhav-ecommerce",
    title: "E-Commerce Analytics",
    status: "Completed",
    statusColor: "text-cyan-400",
    statusGlow: "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]",
    icon: <PieChart className="text-cyan-400" size={20} />,
    image: "/ecommerce-cover.jpg",
    description: "An interactive Power BI dashboard engineered to analyze online sales datasets, identifying growth trends and optimizing payment mode profitability.",
    features: [
      "Revenue & Sales Growth Tracking",
      "Payment Mode Profitability Analysis",
      "Geographic Customer Segmentation"
    ],
    tech: ["Power BI", "DAX", "Data Modeling", "Business Intelligence"],
    links: { github: "https://github.com/shubhu111/Madhav-Ecommerce-Dashboard-Power-Bi-project", live: "#" }
  },
  {
    id: "hotel-booking",
    title: "Hotel Booking Analytics",
    status: "Completed",
    statusColor: "text-rose-400",
    statusGlow: "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]",
    icon: <TrendingUp className="text-rose-400" size={20} />,
    image: "/hotel-cover.jpg",
    description: "A comprehensive data visualization project analyzing over 119,000 hotel booking records to uncover hidden seasonal trends and cancellation patterns.",
    features: [
      "Cancellation Pattern Analysis",
      "Seasonal Trend Identification",
      "Room-Type Revenue Metrics"
    ],
    tech: ["Power BI", "Data Cleaning", "Time Series Analysis", "Data Visualization"],
    links: { github: "https://github.com/shubhu111/Hotel-Booking-Data-Analytics-and-Visualization-Project", live: "#" }
  },
  {
    id: "iot-vehicle-safety",
    title: "Intelligent Vehicle Safety",
    status: "Published Research",
    statusColor: "text-violet-400",
    statusGlow: "bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]",
    icon: <BookOpen className="text-violet-400" size={20} />,
    image: "/publication-cover.jpg",
    description: "An advanced IoT and Embedded Systems architecture developed for the Smart India Hackathon. Integrates a complex array of hardware sensors to execute real-time safety protocols, automated emergency SOS broadcasting, and collision prevention. Officially published in the IJRPR.",
    features: [
      "ADXL335 Collision & MQ3 Impairment Detection",
      "Ultrasonic Auto-Braking Logic Engine",
      "Real-Time GPS & GSM Communication"
    ],
    tech: ["IoT", "Arduino UNO", "Embedded C++", "Hardware Sensors", "GPS/GSM"],
    links: { github: "#", live: "https://ijrpr.com/uploads/V4ISSUE12/IJRPR20326.pdf" }
  }
];

// Entrance animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 90 } }
};

export default function Projects() {
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
              Living <span className="text-electricBlue">Lab</span>
            </h1>
          </div>
          <p className="text-latentGray font-mono text-sm uppercase tracking-widest mt-4">
            [System Output: Applied AI Models & Architectures]
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
        {projects.map((project, index) => (
          <motion.div 
            key={project.id}
            variants={cardVariants}
            className="h-full"
          >
            {/* Infinite floating wrapper with staggered delay */}
            <div 
              className="animate-custom-float h-full" 
              style={{ animationDelay: `${index * 0.25}s` }}
            >
              <div className="group relative bg-[#0a0f1a]/80 border border-latentGray/20 rounded-xl overflow-hidden backdrop-blur-md transition-all duration-500 hover:border-latentGray/40 hover:shadow-2xl flex flex-col h-full">
                
                {/* Cinematic Image Header */}
                <div className="relative w-full h-48 md:h-56 overflow-hidden bg-[#05080f]">
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 bg-gradient-to-br from-electricBlue via-transparent to-transparent"></div>
                  
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity group-hover:mix-blend-normal"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/50 to-transparent"></div>

                  {/* Status Badge overlayed on image */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-[#0a0f1a]/80 backdrop-blur-sm border border-latentGray/30 px-3 py-1.5 rounded-full z-10">
                    <div className={`h-2 w-2 rounded-full animate-pulse ${project.statusGlow}`}></div>
                    <span className={`text-[10px] font-mono tracking-widest uppercase ${project.statusColor}`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                <div className="p-8 pt-4 relative z-10 flex flex-col h-full">
                  
                  <div className="flex items-center gap-3 mb-3">
                    {project.icon}
                    <h2 className="text-2xl font-black text-white tracking-wide group-hover:text-electricBlue transition-colors duration-300">
                      /{project.title}
                    </h2>
                  </div>
                  
                  <p className="text-latentGray/90 leading-relaxed mb-6 text-sm">
                    {project.description}
                  </p>

                  {/* Technical Features List */}
                  <div className="mb-8 space-y-2">
                    {project.features.map((feature, idx) => (
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
                      {project.tech.map((tech, idx) => (
                        <span 
                          key={idx}
                          className="text-[10px] font-mono border border-latentGray/30 px-2 py-1 text-latentGray rounded bg-[#0a0f1a]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Links / Buttons */}
                    <div className="flex gap-4 w-full xl:w-auto justify-end">
                      <Link 
                        href={project.links.github} 
                        target="_blank"
                        className="text-latentGray hover:text-white transition-colors flex items-center gap-2 text-sm font-mono hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                      >
                        <GitBranch size={16} /> Source
                      </Link>
                      {project.links.live !== "#" && (
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
        ))}
      </motion.div>

    </div>
  );
}