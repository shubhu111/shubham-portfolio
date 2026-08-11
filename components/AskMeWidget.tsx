'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Briefcase, Code2, ExternalLink, Sparkles } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';

const PRESET_QUESTIONS = [
  "Fetch live GitHub activity stats",
  "Check JD match for an AI/Data role",
  "Show me live project links",
  "Navigate me to the Resume section",
  "Show me the ST-GPT architecture",
  "What does Caresila look like?"
];

const GeminiIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C12 2 12.3 8.3 14.8 10.8C17.3 13.3 22 13.6 22 13.6C22 13.6 15.7 13.9 13.2 16.4C10.7 18.9 10.4 23.6 10.4 23.6C10.4 23.6 10.1 17.3 7.6 14.8C5.1 12.3 0.4 12 0.4 12C0.4 12 6.7 11.7 9.2 9.2C11.7 6.7 12 2 12 2Z" fill="url(#paint0_linear_81_16)"/>
    <defs>
      <linearGradient id="paint0_linear_81_16" x1="11.2" y1="2" x2="11.2" y2="23.6" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2CD4EF"/>
        <stop offset="1" stopColor="#08375A"/>
      </linearGradient>
    </defs>
  </svg>
);

// Map the keys from the backend to your actual image URLs
const IMAGE_MAP: Record<string, string> = {
  'st_gpt_architecture': 'https://placehold.co/600x400/1e293b/2CD4EF?text=ST-GPT+Architecture+Diagram',
  'caresila_ui': 'https://placehold.co/600x400/1e293b/2CD4EF?text=Caresila+Portal+UI',
  'iot_car': 'https://placehold.co/600x400/1e293b/2CD4EF?text=IoT+Smart+Car+Build'
};

// Animated thinking indicator component
const ThinkingIndicator = () => (
  <div className="flex items-center gap-2 text-[#2CD4EF] font-medium text-sm py-0.5">
    <Sparkles className="w-4 h-4 animate-spin text-[#2CD4EF]" />
    <span>ST-GPT is thinking</span>
    <span className="flex gap-1">
      <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
      <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
      <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
    </span>
  </div>
);

// Sub-component to parse standard markdown links
const MarkdownLinks = ({ text }: { text: string }) => {
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-[#2CD4EF] font-semibold underline hover:text-cyan-300 transition-colors mx-1"
      >
        {match[1]}
        <ExternalLink size={13} className="inline" />
      </a>
    );
    lastIndex = linkRegex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return <>{parts}</>;
};

// Main parser that handles both images and text
const FormattedMessage = ({ content }: { content: string }) => {
  if (content === '...') {
    return <ThinkingIndicator />;
  }

  // Regex to split the text by the [IMAGE:key] tags
  const imageRegex = /(\[IMAGE:[^\]]+\])/g;
  const parts = content.split(imageRegex);

  return (
    <div className="whitespace-pre-wrap flex flex-col gap-2">
      {parts.map((part, index) => {
        if (part.startsWith('[IMAGE:') && part.endsWith(']')) {
          const imageKey = part.slice(7, -1).trim();
          const imageUrl = IMAGE_MAP[imageKey] || 'https://placehold.co/600x400/1e293b/ef4444?text=Image+Not+Found';
          
          return (
            <div key={index} className="my-3 rounded-xl overflow-hidden border border-slate-700 shadow-xl bg-slate-900/50 p-1">
              <img src={imageUrl} alt={imageKey} className="w-full h-auto rounded-lg object-cover" />
            </div>
          );
        }
        // Wrapping this in a <span> prevents flex-col from breaking inline content
        return <span key={index}><MarkdownLinks text={part} /></span>;
      })}
    </div>
  );
};

export default function AskMeWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'RECRUITER' | 'TECH_LEAD'>('RECRUITER');
  
  const [messages, setMessages] = useState<string[]>([
    `Hello! I'm ST-GPT, the digital representative for Shubham Tade. \n\nI am an autonomous agent connected directly to his professional database. I can:\n• Fetch real-time GitHub commits\n• Cross-reference his skills with a Job Description\n• Guide you through his projects and system architectures\n• Navigate this portfolio for you\n\nHow can I assist you today? Try clicking one of the suggestions below!`
  ]);
  
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); 

  const handleDomActions = (text: string) => {
    let cleanText = text;
    
    // 1. Handle DOM Scrolling
    if (cleanText.includes("[ACTION:SCROLL_TO_PROJECTS]")) {
      cleanText = cleanText.replace("[ACTION:SCROLL_TO_PROJECTS]", "");
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    }
    if (cleanText.includes("[ACTION:SCROLL_TO_RESUME]")) {
      cleanText = cleanText.replace("[ACTION:SCROLL_TO_RESUME]", "");
      document.getElementById("resume")?.scrollIntoView({ behavior: "smooth" });
    }

    // 2. THE FIX: Aggressively target Markdown link brackets and parentheses
    cleanText = cleanText
      .replace(/-\s*[\r\n]+\s*\[/g, "- [")   // Pulls the opening bracket '[' up to the dash '-'
      .replace(/\)\s*[\r\n]+\s*:/g, "): ");  // Pulls the colon ':' up to the closing parenthesis ')'

    return cleanText;
  };

  const toggleWidget = () => setIsOpen(!isOpen);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    setMessages((prev) => [...prev, `You: ${message}`, `...`]);
    setInput('');

    try {
      const response = await fetch("https://shubham-portfolio-toww.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message, mode: mode }),
      });

      if (!response.body) return;
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let aiFullResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.replace("data: ", "").trim();
            if (dataStr === "[DONE]") break;
            
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                aiFullResponse += parsed.text;
                const displayResponse = handleDomActions(aiFullResponse);
                
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = displayResponse;
                  return newMessages;
                });
              }
            } catch (e) {}
          }
        }
      }
    } catch (error) {
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = "Error: Cannot connect to ST-GPT Engine.";
        return newMessages;
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault(); 
        handleSendMessage(input); 
      }
    }
  };

  return (
    <>
      <button 
        onClick={toggleWidget}
        className={`fixed bottom-6 right-6 flex items-center gap-3 px-6 py-3 rounded-full bg-slate-800/90 backdrop-blur-md transition-all duration-300 z-50 hover:bg-slate-700/90 border border-slate-700 hover:border-[#2CD4EF]/40 shadow-xl ${
          isOpen ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"
        }`}
      >
        <GeminiIcon />
        <span className="font-semibold text-lg text-white">Ask Me</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center z-[100] p-4 bg-slate-950/70 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={toggleWidget}
          >
            <motion.div 
              className="relative w-full max-w-lg bg-[#0a0f1a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
              initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <MessageSquare className="text-[#2CD4EF]" size={22} />
                  <h2 className="text-xl font-bold text-white tracking-tight">ST-GPT</h2>
                </div>
                
                <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                  <button 
                    onClick={() => setMode('RECRUITER')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'RECRUITER' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <Briefcase size={14} /> Recruiter
                  </button>
                  <button 
                    onClick={() => setMode('TECH_LEAD')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'TECH_LEAD' ? 'bg-[#2CD4EF]/20 text-[#2CD4EF]' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <Code2 size={14} /> Tech Lead
                  </button>
                </div>
                
                <button onClick={toggleWidget} className="text-slate-400 hover:text-white transition ml-2">
                  <X size={22} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`p-4 rounded-xl text-sm md:text-base max-w-[90%] ${
                    msg.startsWith('You:') ? "bg-[#2CD4EF]/20 border border-[#2CD4EF]/30 text-white ml-auto" : "bg-slate-800 border border-slate-700 text-slate-100"
                  }`}>
                    <FormattedMessage content={msg} />
                  </div>
                ))}

                {messages.length === 1 && (
                  <div className="flex flex-col gap-2 mt-4">
                    {PRESET_QUESTIONS.map((question) => (
                      <button 
                        key={question} 
                        onClick={() => handleSendMessage(question)}
                        className="flex items-center gap-3 text-left px-4 py-2.5 bg-slate-800/60 hover:bg-slate-700 border border-slate-700/80 rounded-xl transition-all duration-300"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#2CD4EF]"></div>
                        <span className="text-slate-300 text-sm">{question}</span>
                      </button>
                    ))}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 bg-[#0a0f1a] border-t border-slate-800">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} 
                  className="flex items-end gap-3 bg-slate-900/80 rounded-3xl border border-slate-700 focus-within:border-[#2CD4EF] focus-within:ring-4 focus-within:ring-[#2CD4EF]/20 focus-within:shadow-[0_0_20px_rgba(44,212,239,0.2)] transition-all duration-300 px-4 py-3"
                >
                  <TextareaAutosize 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={mode === 'RECRUITER' ? "Ask about business impact & experience..." : "Ask about architectures & vectors..."} 
                    minRows={1}
                    maxRows={6}
                    className="flex-grow bg-transparent text-white text-sm md:text-base placeholder:text-slate-500 outline-none resize-none overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                  />
                  <button type="submit" className="text-slate-400 hover:text-[#2CD4EF] transition mb-0.5">
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}