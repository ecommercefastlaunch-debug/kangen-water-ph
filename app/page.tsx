import { BookingSection } from "@/components/BookingSection";
import { K8Experience } from "@/components/experience/K8Experience";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductDetails } from "@/components/ProductDetails";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <K8Experience />
        <BookingSection />
        <FAQ />
        <ProductDetails />
      </main>
      <Footer />
    </>
  );
}
