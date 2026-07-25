import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import InteractiveBackground from "@/components/InteractiveBackground";

export const metadata: Metadata = {
  title: "Shubham Gajanan Tade | AI/ML Engineer & Data Analyst",
  description: "Official portfolio of Shubham Gajanan Tade (Shubham Tade). AI/ML Engineer and Data Analyst specializing in data cleaning, frontend deployment, and advanced Generative AI.",
  keywords: [
    "Shubham Tade", 
    "Shubham Gajanan Tade", 
    "shubhu111", 
    "AI/ML Engineer", 
    "Data Analyst", 
    "Generative AI", 
    "Pune"
  ],
  metadataBase: new URL('https://shubham-tade.vercel.app'),
  alternates: {
    canonical: '/',
  },
  verification: {
    google: "a0sr7KP1TQZA0hPpn65Q8r-W2swR17LNnTAm2fVDy0E",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // JSON-LD Schema for Google Search Console
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Shubham Gajanan Tade",
    "alternateName": ["Shubham Tade", "shubhu111"],
    "jobTitle": "AI/ML Engineer and Data Analyst",
    "url": "https://shubham-tade.vercel.app",
    "sameAs": [
      "https://www.linkedin.com/in/shubham-tade123/",
      "https://github.com/shubhu111",
      "https://www.instagram.com/shubhamtade2068/"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Pune",
      "addressRegion": "Maharashtra",
      "addressCountry": "India"
    },
    "description": "AI/ML Engineer and Data Analyst balancing machine learning architectures with comprehensive data analysis. Developed expertise in Generative AI, Retrieval-Augmented Generation (RAG), and LangChain through dedicated post-degree professional training.",
    "knowsAbout": [
      "Generative AI",
      "Retrieval-Augmented Generation (RAG)",
      "LangChain",
      "Python",
      "Data Analysis",
      "Web Scraping",
      "Automation"
    ],
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "Dr. Babasaheb Ambedkar Technological University"
    },
    "hasCredential": {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "Certification",
      "name": "Data Science Certification (Post-Degree)",
      "recognizedBy": {
        "@type": "Organization",
        "name": "3RI Technology"
      }
    },
    "worksFor": {
      "@type": "Organization",
      "name": "PandoAI Solutions Pvt. Ltd.",
      "roleName": "AI/ML Engineer and Data Analyst"
    },
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "SoftwareApplication",
          "name": "Caresila Hospital Portal",
          "description": "A web application built to aggregate and verify hospital data across India, with a core focus on data cleaning, data collection, and frontend deployment."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "SoftwareApplication",
          "name": "ST-GPT",
          "description": "A personalized conversational AI companion hosted on Streamlit featuring multi-modal capabilities."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "SoftwareApplication",
          "name": "Universal Job Engine",
          "description": "A tool designed to aggregate listings from multiple job portals into a single dashboard using APIs and scrapers."
        }
      }
    ]
  };

  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-KMBMLKQ5" />
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex flex-col antialiased relative bg-[#0a0f1a] text-white min-h-screen overflow-x-hidden">
        
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
        
        {/* Top Navigation */}
        <Navbar />
        
        {/* MAIN CONTENT */}
        <main className="w-full max-w-[1800px] mx-auto px-4 pt-28 pb-12 md:px-8 min-h-screen relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}