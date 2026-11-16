import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/home/Hero";
import AboutSection from "@/components/home/AboutSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import ServicesSection from "@/components/home/ServicesSection";
import StatsSection from "@/components/home/StatsSection";
import StatementSection from "@/components/home/StatementSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ContactFooterSection from "@/components/shared/ContactFooterSection";

export default function Home() {
  return (
    <main className="relative min-h-dvh w-full bg-background text-foreground">
      <Navbar />
      <Hero />
      <AboutSection />
      <ServicesSection />
      <StatsSection />
      <ProjectsSection />
      <TestimonialsSection />
      <StatementSection />
      <ContactFooterSection />
    </main>
  );
}
