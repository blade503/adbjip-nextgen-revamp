import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import AvisGoogle from '@/components/AvisGoogle';
import BiensApercu from '@/components/BiensApercu';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main role="main">
        <Hero />
        <Services />
        <BiensApercu />
        <About />
        <AvisGoogle />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
