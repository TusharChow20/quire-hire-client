import Footer from "@/component/Footer";
import Hero from "@/component/Hero";
import Navbar from "@/component/Navbar";
import OurPartners from "@/component/Ourpartners ";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
      `}</style>
      <Navbar></Navbar>
      <main>
        <Hero></Hero>
        <OurPartners></OurPartners>
      </main>
      <Footer></Footer>
    </>
  );
}
