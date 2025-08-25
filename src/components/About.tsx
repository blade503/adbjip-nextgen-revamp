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
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-6">
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
              JIP Immobilier réunit une équipe de professionnels passionnés par l'immobilier parisien. 
              Notre approche moderne et notre expertise reconnue nous permettent de vous accompagner 
              efficacement dans tous vos projets.
            </p>

            <div className="glass rounded-xl p-6 mb-8">
              <Quote className="w-8 h-8 text-primary mb-4" />
              <blockquote className="text-lg font-medium mb-4">
                "Notre mission est de transformer chaque projet immobilier en succès, 
                en alliant expertise technique et relation humaine de qualité."
              </blockquote>
              <cite className="text-sm text-muted-foreground">
                — L'équipe JIP Immobilier
              </cite>
            </div>

            <Button size="lg" className="hover-glow">
              Découvrir notre équipe
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Right Content - Values */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-8">Nos valeurs fondamentales</h3>
            
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card 
                  key={value.title}
                  className="glass p-6 hover-lift group border-0 shadow-card"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-primary-foreground" />
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