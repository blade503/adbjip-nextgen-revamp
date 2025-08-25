import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  MessageSquare,
  Calculator
} from 'lucide-react';

const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Téléphone",
      value: "01.42.25.78.24",
      description: "Lun-Ven 9h-19h",
      color: "bg-blue-500"
    },
    {
      icon: Mail,
      title: "Email",
      value: "j.immo.p@orange.fr",
      description: "Réponse sous 24h",
      color: "bg-green-500"
    },
    {
      icon: MapPin,
      title: "Adresse",
      value: "27, Rue de Lisbonne",
      description: "75008 Paris",
      color: "bg-primary"
    },
    {
      icon: Clock,
      title: "Horaires",
      value: "9h - 19h",
      description: "Lundi au Vendredi",
      color: "bg-purple-500"
    }
  ];

  return (
    <section id="contact" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 glass rounded-full px-6 py-3 mb-6">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Contactez-nous</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Parlons de votre <span className="gradient-text">projet</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Notre équipe d'experts est à votre disposition pour répondre à toutes vos questions 
            et vous accompagner dans vos projets immobiliers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Informations de contact</h3>
            
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card 
                  key={info.title}
                  className="glass p-6 hover-lift group border-0 shadow-card"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${info.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                        {info.title}
                      </h4>
                      <p className="text-lg font-medium mb-1">
                        {info.value}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {info.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}

            {/* Quick Actions */}
            <div className="glass rounded-xl p-6 mt-8">
              <h4 className="font-semibold mb-4">Actions rapides</h4>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  Demander un rappel
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calculator className="w-4 h-4 mr-2" />
                  Estimation gratuite
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="glass-strong p-8 border-0 shadow-card">
              <h3 className="text-2xl font-bold mb-6">Envoyez-nous un message</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Prénom *</label>
                    <Input 
                      placeholder="Votre prénom" 
                      className="glass border-border/50 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom *</label>
                    <Input 
                      placeholder="Votre nom" 
                      className="glass border-border/50 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input 
                      type="email" 
                      placeholder="votre.email@example.com" 
                      className="glass border-border/50 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Téléphone</label>
                    <Input 
                      type="tel" 
                      placeholder="01 23 45 67 89" 
                      className="glass border-border/50 focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Type de projet</label>
                  <select className="w-full p-3 glass border border-border/50 rounded-lg focus:border-primary focus:outline-none">
                    <option value="">Sélectionnez un type de projet</option>
                    <option value="achat">Achat d'un bien</option>
                    <option value="vente">Vente d'un bien</option>
                    <option value="location">Location</option>
                    <option value="gestion">Gestion locative</option>
                    <option value="copropriete">Gestion de copropriété</option>
                    <option value="estimation">Estimation</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <Textarea 
                    placeholder="Décrivez votre projet ou posez votre question..."
                    rows={6}
                    className="glass border-border/50 focus:border-primary resize-none"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="privacy" 
                    className="w-4 h-4 text-primary bg-transparent border-border/50 rounded focus:ring-primary"
                  />
                  <label htmlFor="privacy" className="text-sm text-muted-foreground">
                    J'accepte que mes données soient utilisées pour me recontacter *
                  </label>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full hover-glow"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Envoyer le message
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <Card className="glass overflow-hidden border-0 shadow-card">
            <div className="aspect-video bg-gradient-to-r from-muted/50 to-muted flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Notre Adresse</h4>
                <p className="text-muted-foreground">27, Rue de Lisbonne, 75008 Paris</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Métro : Europe (Ligne 3) - Saint-Lazare (Lignes 3, 12, 13, 14)
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;