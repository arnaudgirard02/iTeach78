import React from 'react';
import { Check } from 'lucide-react';

const plans = [
  {
    name: "Gratuit",
    price: "0€",
    period: "/mois",
    description: "Parfait pour découvrir iTeach",
    features: [
      "10 copies corrigées par mois",
      "1 plan de cours par mois",
      "Fonctionnalités de base",
      "Support par email"
    ],
    cta: "Commencer gratuitement",
    highlighted: false
  },
  {
    name: "Basic",
    price: "9,99€",
    period: "/mois",
    description: "Pour les professeurs individuels",
    features: [
      "50 copies corrigées par mois",
      "5 plans de cours par mois",
      "Statistiques simples",
      "Support prioritaire"
    ],
    cta: "Essayer Basic",
    highlighted: false
  },
  {
    name: "Premium",
    price: "19,99€",
    period: "/mois",
    description: "Pour une utilisation intensive",
    features: [
      "Copies illimitées",
      "Plans de cours illimités",
      "Statistiques avancées",
      "Bibliothèque multimédia",
      "Support dédié"
    ],
    cta: "Essayer Premium",
    highlighted: true
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tarifs simples et transparents
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choisissez le plan qui correspond à vos besoins
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-xl p-8 ${
                plan.highlighted
                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-600 ring-opacity-50'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className={`mb-6 ${plan.highlighted ? 'text-indigo-100' : 'text-gray-600'}`}>
                {plan.description}
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className={plan.highlighted ? 'text-indigo-100' : 'text-gray-600'}>
                  {plan.period}
                </span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className={`h-5 w-5 ${
                      plan.highlighted ? 'text-indigo-200' : 'text-indigo-600'
                    }`} />
                    <span className={plan.highlighted ? 'text-indigo-100' : 'text-gray-600'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 px-6 rounded-full font-medium transition-colors ${
                  plan.highlighted
                    ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Forfait Établissement</h3>
          <p className="text-xl text-gray-600 mb-8">
            Une solution complète pour votre établissement
          </p>
          <div className="max-w-2xl mx-auto bg-gray-50 rounded-xl p-8">
            <ul className="space-y-4 mb-8 text-left">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-indigo-600" />
                <span className="text-gray-600">Accès pour tous les enseignants</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-indigo-600" />
                <span className="text-gray-600">Reporting consolidé pour l'administration</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-indigo-600" />
                <span className="text-gray-600">Formation initiale à l'outil</span>
              </li>
            </ul>
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 transition-colors">
              Demander un devis
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}