import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import SEOOptimizedImage from '@/components/SEOOptimizedImage';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Euro, 
  Phone, 
  Mail, 
  Heart,
  Search,
  Filter,
  SortDesc,
  Eye,
  Calendar,
  Home,
  Building2,
  Star,
  TrendingUp,
  Camera,
  Calculator
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Biens = () => {
  const [selectedType, setSelectedType] = useState('tous');
  const [priceRange, setPriceRange] = useState('tous');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstate",
    "name": "Biens Immobiliers Paris 8ème - JIP",
    "description": "Découvrez notre sélection de biens immobiliers à Paris 8ème : appartements, studios, bureaux. Vente et location avec accompagnement personnalisé.",
    "provider": {
      "@type": "RealEstateAgent",
      "name": "JIP",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Paris",
        "addressRegion": "Île-de-France", 
        "postalCode": "75008",
        "addressCountry": "FR"
      }
    },
    "areaServed": "Paris"
  };

  const properties = [
    {
      id: 1,
      title: "Appartement 3 pièces - Champs-Élysées",
      type: "Appartement",
      price: 850000,
      rent: null,
      surface: 65,
      rooms: 3,
      bedrooms: 2,
      bathrooms: 1,
      floor: 4,
      address: "Avenue des Champs-Élysées, 75008",
      description: "Magnifique appartement rénové avec vue dégagée, proche des commerces et transports.",
      images: ["/api/placeholder/400/300"],
      features: ["Ascenseur", "Balcon", "Cave", "Gardien"],
      status: "Vente",
      isNew: true,
      energy: "C"
    },
    {
      id: 2,
      title: "Studio meublé - Monceau",
      type: "Studio",
      price: null,
      rent: 1200,
      surface: 25,
      rooms: 1,
      bedrooms: 0,
      bathrooms: 1,
      floor: 2,
      address: "Rue de Monceau, 75008",
      description: "Studio entièrement meublé et équipé, parfait pour un investissement locatif.",
      images: ["/api/placeholder/400/300"],
      features: ["Meublé", "Ascenseur", "Gardien"],
      status: "Location",
      isNew: false,
      energy: "D"
    },
    {
      id: 3,
      title: "Appartement familial - Parc Monceau",
      type: "Appartement",
      price: 1250000,
      rent: null,
      surface: 95,
      rooms: 4,
      bedrooms: 3,
      bathrooms: 2,
      floor: 3,
      address: "Boulevard de Courcelles, 75008",
      description: "Appartement familial proche du Parc Monceau, calme et lumineux avec caractère haussmannien.",
      images: ["/api/placeholder/400/300"],
      features: ["Cheminée", "Parquet", "Moulures", "Cave", "Ascenseur"],
      status: "Vente",
      isNew: true,
      energy: "B"
    },
    {
      id: 4,
      title: "Bureaux - Quartier Saint-Lazare",
      type: "Bureau",
      price: null,
      rent: 2800,
      surface: 120,
      rooms: 5,
      bedrooms: 0,
      bathrooms: 2,
      floor: 1,
      address: "Rue Saint-Lazare, 75008",
      description: "Bureaux modernes et fonctionnels, idéaux pour une entreprise en croissance.",
      images: ["/api/placeholder/400/300"],
      features: ["Climatisation", "Fibre optique", "Parking", "Sécurité"],
      status: "Location",
      isNew: false,
      energy: "A"
    }
  ];

  const filteredProperties = properties.filter(property => {
    if (selectedType !== 'tous' && property.type.toLowerCase() !== selectedType) return false;
    if (priceRange !== 'tous') {
      const price = property.price || property.rent || 0;
      if (priceRange === 'low' && price > 500000) return false;
      if (priceRange === 'mid' && (price < 500000 || price > 1000000)) return false;
      if (priceRange === 'high' && price < 1000000) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Biens Immobiliers Paris 8ème | JIP - Vente & Location"
        description="Découvrez notre sélection de biens immobiliers à Paris 8ème : appartements, studios, bureaux. Vente et location avec accompagnement personnalisé."
        keywords="appartement paris 8, vente appartement, location bureau paris, immobilier paris 8ème, biens immobiliers"
        canonicalUrl="https://jip-immobilier.fr/biens"
        structuredData={structuredData}
      />
      <Header />
      
      <main role="main">
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Nos <span className="gradient-text">Biens Immobiliers</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Découvrez notre sélection exclusive de biens immobiliers à Paris 8ème. 
                Appartements, bureaux et locaux commerciaux sélectionnés avec expertise.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <Card className="glass p-6 text-center">
                <Home className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold mb-1">{properties.length}</div>
                <div className="text-sm text-muted-foreground">Biens disponibles</div>
              </Card>
              <Card className="glass p-6 text-center">
                <Building2 className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold mb-1">75008</div>
                <div className="text-sm text-muted-foreground">Paris 8ème</div>
              </Card>
              <Card className="glass p-6 text-center">
                <Star className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold mb-1">15+</div>
                <div className="text-sm text-muted-foreground">Ans d'expertise</div>
              </Card>
              <Card className="glass p-6 text-center">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold mb-1">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction client</div>
              </Card>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 bg-background border-b">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select 
                    value={selectedType} 
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="bg-background border border-border rounded-lg px-3 py-2"
                  >
                    <option value="tous">Tous les types</option>
                    <option value="appartement">Appartements</option>
                    <option value="studio">Studios</option>
                    <option value="bureau">Bureaux</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Euro className="w-4 h-4 text-muted-foreground" />
                  <select 
                    value={priceRange} 
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="bg-background border border-border rounded-lg px-3 py-2"
                  >
                    <option value="tous">Tous les prix</option>
                    <option value="low">Jusqu'à 500k€</option>
                    <option value="mid">500k€ - 1M€</option>
                    <option value="high">Plus de 1M€</option>
                  </select>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredProperties.length} bien{filteredProperties.length > 1 ? 's' : ''} trouvé{filteredProperties.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </section>

        {/* Properties Grid */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <Card key={property.id} className="group glass-strong overflow-hidden hover-lift border-0 shadow-card">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <SEOOptimizedImage
                      src={property.images[0]}
                      alt={`${property.title} - Bien immobilier Paris 8ème`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      width={400}
                      height={300}
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge variant={property.status === 'Vente' ? 'default' : 'secondary'}>
                        {property.status}
                      </Badge>
                      {property.isNew && (
                        <Badge variant="destructive">Nouveau</Badge>
                      )}
                    </div>
                    <div className="absolute top-4 right-4">
                      <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <Badge variant="outline" className="bg-white/90">
                        <Camera className="w-3 h-3 mr-1" />
                        {property.images.length}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                        {property.title}
                      </h3>
                    </div>

                    <div className="flex items-center text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="text-sm truncate">{property.address}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                      <div className="flex items-center">
                        <Maximize className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>{property.surface}m²</span>
                      </div>
                      <div className="flex items-center">
                        <Home className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>{property.rooms} pièce{property.rooms > 1 ? 's' : ''}</span>
                      </div>
                      {property.bedrooms > 0 && (
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span>{property.bedrooms} ch.</span>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {property.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-primary">
                        {property.price ? 
                          `${property.price.toLocaleString()}€` : 
                          `${property.rent}€/mois`
                        }
                      </div>
                      <Badge variant="outline" className="text-xs">
                        DPE: {property.energy}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Voir le bien
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucun bien trouvé</h3>
                <p className="text-muted-foreground mb-6">
                  Essayez de modifier vos critères de recherche ou contactez-nous directement.
                </p>
                <Button asChild>
                  <Link to="/contact">Nous contacter</Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Vous ne trouvez pas le bien idéal ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Notre équipe d'experts vous accompagne dans la recherche du bien parfait 
              selon vos critères et votre budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/contact">
                  <Mail className="w-5 h-5 mr-2" />
                  Nous contacter
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/services/estimation-biens">
                  <Calculator className="w-5 h-5 mr-2" />
                  Estimer mon bien
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Biens;