import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ContactPageHero from "@/components/ContactPageHero";
import ContactFaqSection from "@/components/ContactFaqSection";
import ContactFooterSection from "@/components/ContactFooterSection";

export const metadata: Metadata = {
  title: "Contact Us — Safvra Concepts | Interior Fit-Out & General Maintenance",
  description:
    "Get in touch with Safvra Concepts in Abu Dhabi, UAE for bespoke interior fit-out, carpentry, kitchen installation, and general maintenance services.",
};

export default function ContactPage() {
  return (
    <main className="relative min-h-dvh w-full bg-white text-[#111111]">
      <Navbar />
      <ContactPageHero />
      <ContactFaqSection />
      <ContactFooterSection />
    </main>
  );
}

