import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Award, Users } from 'lucide-react';
import heroBuilding from '@/assets/hero-building.jpg';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img 
          src={heroBuilding}
          alt="Immeuble parisien de prestige"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-secondary/80 via-secondary/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center space-x-3 glass rounded-full px-6 py-3 mb-8 animate-slide-up">
            <Star className="w-5 h-5 text-primary fill-primary flex-shrink-0" />
            <div className="text-sm font-medium text-left">
              <div className="block sm:inline">Agence immobilière de confiance</div>
              <div className="block sm:inline">depuis 15 ans</div>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up text-center md:text-left">
            Notre <span className="gradient-text bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">professionnalisme</span> est votre <span className="gradient-text bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">garantie</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl animate-slide-up text-center md:text-left mx-auto md:mx-0">
            JIP possède des collaborateurs jeunes et dynamiques avec une forte expérience dans le domaine de l'immobilier parisien.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-slide-up">
            <Button 
              size="lg" 
              className="group bg-primary hover:bg-primary-glow text-primary-foreground px-8 py-6 text-lg shadow-elegant hover-glow"
            >
              Estimer mon bien
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              className="glass border-primary/30 text-primary-foreground bg-primary/10 hover:bg-primary/20 px-8 py-6 text-lg"
            >
              Nos services
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 animate-slide-up">
            <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-xl p-6 text-center hover-lift shadow-elegant">
              <Award className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">15+</div>
              <div className="text-white font-medium text-sm">Années d'expérience</div>
            </div>
            <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-xl p-6 text-center hover-lift shadow-elegant">
              <Users className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-white font-medium text-sm">Clients satisfaits</div>
            </div>
            <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-xl p-6 text-center hover-lift shadow-elegant">
              <Star className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">4.9</div>
              <div className="text-white font-medium text-sm">Note moyenne</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float hidden lg:block"></div>
      <div className="absolute bottom-32 right-32 w-32 h-32 bg-primary-glow/10 rounded-full blur-2xl animate-float hidden lg:block" style={{animationDelay: '2s'}}></div>
    </section>
  );
};

export default Hero;