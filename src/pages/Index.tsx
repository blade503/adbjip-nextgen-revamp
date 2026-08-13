import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import AvisGoogle from '@/components/AvisGoogle';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main role="main">
        <Hero />
        <Services />
        <About />
        <AvisGoogle />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
