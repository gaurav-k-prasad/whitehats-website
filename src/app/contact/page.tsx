import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CyberGrid from "@/components/ui/CyberGrid";
import PageHero from "@/components/ui/PageHero";
import ContactHeroGraphic from "@/components/contact/ContactHeroGraphic";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfoPanel from "@/components/contact/ContactInfoPanel";
import ContactFAQ from "@/components/contact/ContactFAQ";
import { CONTACT_HERO_DATA } from "@/data/contactData";

export const metadata = {
  title: "Contact | WhiteHats",
  description:
    "Get in touch with WhiteHats — VIT Vellore's ethical hacking and cybersecurity club. Recruitment, collaborations, and sponsorships.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-bg-main text-slate-100 selection:bg-cyber-blue selection:text-black relative overflow-x-hidden font-sans">
      <CyberGrid />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-14 lg:gap-16 pt-6 pb-12">
        <Navbar />

        <PageHero
          label={CONTACT_HERO_DATA.label}
          headingPrefix={CONTACT_HERO_DATA.headingPrefix}
          headingSuffix={CONTACT_HERO_DATA.headingSuffix}
          description={CONTACT_HERO_DATA.description}
          rightSlot={<ContactHeroGraphic />}
        />

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <div className="lg:col-span-5">
            <ContactInfoPanel />
          </div>
        </section>

        <ContactFAQ />

        <Footer />
      </div>
    </div>
  );
}
