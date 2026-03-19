import { Nav } from "@/components/ui/Nav";
import { Hero } from "@/components/sections/Hero";
import { Areas } from "@/components/sections/Areas";
import { Sobre } from "@/components/sections/Sobre";
import { Diferenciais } from "@/components/sections/Diferenciais";
import { Noticias } from "@/components/sections/Noticias";
import { Contacto } from "@/components/sections/Contacto";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Areas />
      <Sobre />
      <Diferenciais />
      <Noticias />
      <Contacto />
      <Footer />
    </main>
  );
}
