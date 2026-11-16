import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";
import AboutHeroSection from "@/components/about/AboutHeroSection";
import FoundersSection from "@/components/about/FoundersSection";
import AboutStorySection from "@/components/about/AboutStorySection";
import StatsSection from "@/components/home/StatsSection";
import WhyWorkWithUsSection from "@/components/about/WhyWorkWithUsSection";
import ContactFooterSection from "@/components/shared/ContactFooterSection";

export const metadata: Metadata = {
  title: "The Studio — Safvara Interior Architecture & Fit-Out",
  description:
    "We create timeless architectural and interior spaces focused on clarity, functionality, and modern living.",
};

export default function AboutPage() {
  return (
    <main className="relative min-h-dvh w-full bg-[#F8F8F6] text-[#121212]">
      <Navbar />
      <AboutHeroSection />
      <FoundersSection />
      <AboutStorySection />
      <StatsSection />
      <WhyWorkWithUsSection />
      <ContactFooterSection />
    </main>
  );
}

