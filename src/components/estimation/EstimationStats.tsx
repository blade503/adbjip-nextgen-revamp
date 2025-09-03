import { useState, useEffect, useCallback } from 'react';
import { Award, Calculator, Users, Star } from 'lucide-react';

interface EstimationStatsProps {
  weeklyDemands: number;
  monthlyEstimations: number;
  weeklyPercentage: number;
}

const EstimationStats = ({ weeklyDemands, monthlyEstimations, weeklyPercentage }: EstimationStatsProps) => {
  const stats = [
    {
      icon: Award,
      value: "15+",
      label: "Années d'expérience"
    },
    {
      icon: Calculator,
      value: "2000+",
      label: "Biens estimés"
    },
    {
      icon: Users,
      value: "98%",
      label: "Clients satisfaits"
    },
    {
      icon: Star,
      value: "24h",
      label: "Délai de réponse"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Pourquoi nous faire <span className="gradient-text">confiance</span> ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nos résultats parlent d'eux-mêmes
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EstimationStats;
