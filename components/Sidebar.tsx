"use client";

import Link from "next/link";
import { Terminal, Database, Cpu, FileText, Radio } from "lucide-react";

const navItems = [
  { name: "/home", path: "/", icon: Terminal, desc: "System Root" },
  { name: "/projects", path: "/projects", icon: Database, desc: "Living Lab" },
  { name: "/skills", path: "/skills", icon: Cpu, desc: "Architecture" },
  { name: "/resume", path: "/resume", icon: FileText, desc: "Data Checkpoint" },
  { name: "/contact", path: "/contact", icon: Radio, desc: "Signal Hub" },
];

export default function Sidebar() {
  return (
    <nav className="fixed z-50 bg-[#0a0f1a]/95 backdrop-blur-md border-latentGray/20 transition-all duration-300
      /* --- MOBILE APP LAYOUT (Bottom Bar) --- */
      bottom-0 left-0 w-full h-[72px] border-t flex flex-row justify-center items-center px-2
      /* --- DESKTOP LAYOUT (Left Sidebar) --- */
      md:top-0 md:h-screen md:w-64 md:border-r md:border-t-0 md:flex-col md:justify-between md:p-8 md:bg-neuralBase">
      
      {/* Identity Header (Visible on Desktop Only) */}
      <div className="hidden md:block mb-12">
        <h2 className="text-3xl font-bold tracking-widest text-white">
          INTER<span className="text-electricBlue">.</span>
        </h2>
        <p className="text-xs text-latentGray mt-2 font-mono uppercase">
          [SYS_OP: SHUBHAM_TADE]
        </p>
      </div>

      {/* Navigation Links */}
      {/* Mobile: Row with space between. Desktop: Column with vertical spacing */}
      <ul className="flex flex-row justify-around w-full max-w-md md:w-auto md:flex-col md:space-y-8 md:justify-start">
        {navItems.map((item) => (
          <li key={item.name} className="flex-1 md:flex-none">
            <Link href={item.path} className="group flex flex-col items-center md:items-start w-full">
              
              {/* Icon & Name Wrapper */}
              <span className="text-electricBlue font-mono text-sm md:group-hover:glow-text transition-all duration-300 flex flex-col md:flex-row items-center gap-1 md:gap-3">
                
                {/* Mobile: Padded Icon for easier thumb tapping. Desktop: Standard Icon */}
                <div className="p-2 md:p-0 rounded-xl group-hover:bg-electricBlue/10 md:group-hover:bg-transparent transition-colors">
                  <item.icon className="w-5 h-5 md:w-[18px] md:h-[18px]" />
                </div>
                
                {/* Desktop Text (/projects) */}
                <span className="hidden md:inline">{item.name}</span>
                
                {/* Mobile Text (Tiny label under icon) */}
                <span className="md:hidden text-[9px] tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                  {item.name.replace('/', '')}
                </span>
              </span>

              {/* Desktop Subtext Description (Living Lab) */}
              <span className="hidden md:block text-latentGray text-xs ml-8 mt-1">
                {item.desc}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Footer Status (Visible on Desktop Only) */}
      <div className="hidden md:block text-xs text-latentGray font-mono border-t border-latentGray/20 pt-4 w-full">
        NETWORK: <span className="text-green-400">SECURE</span>
      </div>
    </nav>
  );
}