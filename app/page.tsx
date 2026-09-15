import { BookingSection } from "@/components/BookingSection";
import { Control } from "@/components/Control";
import { Engineering } from "@/components/Engineering";
import { EverydayWater } from "@/components/EverydayWater";
import { Explorer } from "@/components/Explorer";
import { FAQ } from "@/components/FAQ";
import { FiveWaters } from "@/components/FiveWaters";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Lifestyle } from "@/components/Lifestyle";
import { RevealRoot } from "@/components/RevealRoot";
import { Specifications } from "@/components/Specifications";
import { Statement } from "@/components/Statement";
import { Technology } from "@/components/Technology";
import { TechStory } from "@/components/TechStory";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Statement />
        <FiveWaters />
        <Technology />
        <HowItWorks />
        <Control />
        <TechStory />
        <Engineering />
        <Specifications />
        <Explorer />
        <EverydayWater />
        <Lifestyle />
        <BookingSection />
        <FAQ />
      </main>
      <Footer />
      <RevealRoot />
    </>
  );
}
