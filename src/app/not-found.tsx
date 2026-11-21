import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import ContactFooterSection from "@/components/shared/ContactFooterSection";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="relative min-h-dvh w-full bg-[#E2E1DF] text-[#121212] flex flex-col justify-between">
      <Navbar />

      <section className="flex-1 flex items-center justify-center px-6 py-32 text-center">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-6">
          <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-[#FF5526]">
            ERROR 404 · SPACE NOT FOUND
          </span>

          <h1 className="text-[44px] sm:text-[64px] font-semibold tracking-[-0.035em] leading-[1.05] text-[#121212]">
            This page has moved or does not exist.
          </h1>

          <p className="text-[15px] sm:text-[16px] text-[#555555] max-w-md leading-relaxed">
            The architectural blueprint you are looking for is no longer here. Return to our homepage or explore our services portfolio.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#121212] px-7 text-[13px] font-medium tracking-[-0.01em] text-white transition-all duration-300 hover:bg-[#FF5526]"
            >
              Return Home
            </Link>

            <Link
              href="/services"
              className="inline-flex h-12 items-center justify-center rounded-full border border-black/15 bg-white px-7 text-[13px] font-medium tracking-[-0.01em] text-[#121212] transition-all duration-300 hover:border-black/30"
            >
              Explore Services
            </Link>

            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full border border-black/15 bg-white px-7 text-[13px] font-medium tracking-[-0.01em] text-[#121212] transition-all duration-300 hover:border-black/30"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <ContactFooterSection />
    </main>
  );
}
