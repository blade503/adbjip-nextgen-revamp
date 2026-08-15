import { ArrowRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import bureauImage from '@/assets/agence-bureau.webp';

const About = () => {
  return (
    <section id="about" className="relative overflow-hidden bg-gradient-subtle py-20">
      {/* Floating Elements for Visual Appeal */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-float hidden lg:block"></div>
      <div className="absolute bottom-32 left-32 w-24 h-24 bg-primary-glow/10 rounded-full blur-2xl animate-float hidden lg:block" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary/8 rounded-full blur-xl animate-float hidden lg:block" style={{animationDelay: '4s'}}></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div>
            <span className="glass mb-6 inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-primary">
              Qui sommes-nous ?
            </span>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Une équipe <span className="gradient-text">jeune et dynamique</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              JIP réunit une équipe de professionnels passionnés par l'immobilier parisien. 
              Notre approche moderne et notre expertise reconnue nous permettent de vous accompagner 
              efficacement dans tous vos projets.
            </p>

            <div className="glass-strong rounded-xl p-8 mb-8 border-l-4 border-primary shadow-elegant">
              <Quote className="w-10 h-10 text-primary mb-4" />
              <blockquote className="text-lg font-medium mb-4">
                "Notre mission est de transformer chaque projet immobilier en succès, 
                en alliant expertise technique et relation humaine de qualité."
              </blockquote>
              <cite className="text-sm text-muted-foreground">
                — L'équipe JIP
              </cite>
            </div>

            <Button size="lg" className="hover-glow" asChild>
              <Link to="/equipe">
                Découvrir notre équipe
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>

          <figure className="overflow-hidden rounded-2xl shadow-elegant">
            <img
              src={bureauImage}
              alt="Le bureau de l'agence : dossiers, plans et vue sur la rue"
              width={1200}
              height={900}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
      </div>
    </section>
  );
};

export default About;