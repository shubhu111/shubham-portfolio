import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import InteractiveBackground from "@/components/InteractiveBackground";

export const metadata: Metadata = {
  title: "Shubham Tade | AI Engineer",
  description: "Digital Twin & Neural Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex antialiased relative bg-[#0a0f1a] text-white min-h-screen overflow-x-hidden">
        
        {/* --- FIXED VIDEO BACKGROUND --- */}
        <div className="fixed inset-0 z-[-1] w-full h-full pointer-events-none overflow-hidden bg-[#0a0f1a]">
          <div className="absolute inset-0 bg-[#0a0f1a]/85 z-10"></div>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen grayscale-[0.2]"
            poster="/neural-poster.jpg"
          >
            <source src="/neural-background.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Interactive canvas layer */}
        <InteractiveBackground />
        
        {/* Navigation */}
        <Sidebar />
        
        {/* MAIN CONTENT: 
            md:ml-64 = Only add left margin on desktop. 
            px-4 = smaller padding on mobile.
            pb-24 = extra padding on bottom for mobile so content doesn't hide behind our new mobile nav!
        */}
        <main className="flex-1 w-full md:ml-64 px-4 py-8 md:p-8 min-h-screen relative z-10 pb-24 md:pb-8">
          {children}
        </main>
      </body>
    </html>
  );
}