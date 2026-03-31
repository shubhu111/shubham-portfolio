"use client";

import { useState } from "react";
import Link from "next/link";
import { Terminal, Database, Cpu, FileText, Radio, Menu, X } from "lucide-react";

const navItems = [
  { name: "Home", path: "/", icon: Terminal },
  { name: "Projects", path: "/projects", icon: Database },
  { name: "Skills", path: "/skills", icon: Cpu },
  { name: "Resume", path: "/resume", icon: FileText },
  { name: "Contact", path: "/contact", icon: Radio },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0a0f1a]/80 backdrop-blur-md border-b border-latentGray/20 transition-all duration-300">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        
        {/* Logo / Branding */}
        <Link href="/" className="flex flex-col justify-center group">
          <h2 className="text-2xl font-black tracking-widest text-white group-hover:text-electricBlue transition-colors">
            ST<span className="text-electricBlue group-hover:text-white transition-colors">.</span>
          </h2>
          <p className="text-[10px] text-latentGray font-mono uppercase tracking-widest hidden md:block">
            [PORTFOLIO v1.0]
          </p>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link 
                href={item.path} 
                className="flex items-center gap-2 text-sm font-mono text-latentGray hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all"
              >
                <item.icon size={16} className="text-electricBlue" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger Button */}
        <button 
          className="md:hidden text-latentGray hover:text-white transition-colors p-2" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div 
        className={`md:hidden absolute w-full bg-[#0a0f1a]/95 backdrop-blur-xl border-b border-latentGray/20 transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-96 py-6" : "max-h-0 py-0 border-transparent"
        }`}
      >
        <div className="flex flex-col gap-2 px-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 text-sm font-mono text-latentGray hover:text-white p-3 rounded-lg hover:bg-white/5 transition-all"
            >
              <item.icon size={18} className="text-electricBlue" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}