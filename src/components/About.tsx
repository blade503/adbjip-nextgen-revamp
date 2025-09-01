import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Heart, 
  Shield, 
  Zap,
  ArrowRight,
  Quote
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Excellence",
      description: "Nous visons l'excellence dans chaque mission pour garantir votre satisfaction."
    },
    {
      icon: Heart,
      title: "Confiance",
      description: "Relations basées sur la transparence et l'écoute de vos besoins spécifiques."
    },
    {
      icon: Shield,
      title: "Sécurité",
      description: "Transactions sécurisées avec un accompagnement juridique complet."
    },
    {
      icon: Zap,
      title: "Réactivité",
      description: "Réponses rapides et solutions efficaces pour tous vos projets immobiliers."
    }
  ];

  return (
    <section id="about" className="py-24 bg-gradient-subtle relative overflow-hidden">
      {/* Floating Elements for Visual Appeal */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-float hidden lg:block"></div>
      <div className="absolute bottom-32 left-32 w-24 h-24 bg-primary-glow/10 rounded-full blur-2xl animate-float hidden lg:block" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary/8 rounded-full blur-xl animate-float hidden lg:block" style={{animationDelay: '4s'}}></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center space-x-2 glass rounded-full px-6 py-3 mb-6">
              <span className="text-sm font-medium text-primary">Qui sommes-nous ?</span>
            </div>
            
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

            <Button size="lg" className="hover-glow">
              Découvrir notre équipe
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Right Content - Values */}
          <div className="space-y-6">
            <div className="text-center lg:text-left mb-8">
              <h3 className="text-2xl font-bold mb-2">Nos valeurs fondamentales</h3>
              <div className="w-20 h-1 bg-gradient-primary rounded-full mx-auto lg:mx-0"></div>
            </div>
            
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card 
                  key={value.title}
                  className="glass-strong p-6 hover-lift group border border-primary/10 shadow-elegant"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-elegant">
                      <Icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {value.title}
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24">
          <div className="glass rounded-2xl p-8 lg:p-12">
            <h3 className="text-3xl font-bold text-center mb-12">
              Nos chiffres parlent d'eux-mêmes
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: "15+", label: "Années d'expérience", color: "text-blue-500" },
                { number: "500+", label: "Biens gérés", color: "text-green-500" },
                { number: "98%", label: "Clients satisfaits", color: "text-primary" },
                { number: "24h", label: "Temps de réponse", color: "text-purple-500" }
              ].map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className={`text-4xl lg:text-5xl font-bold ${stat.color} mb-2`}>
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;