import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Marie Dubois",
    role: "Professeure de Français, Lycée Victor Hugo",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
    quote: "iTeach a révolutionné ma façon de corriger. Je gagne un temps précieux que je peux consacrer à l'accompagnement personnalisé de mes élèves."
  },
  {
    name: "Thomas Laurent",
    role: "Professeur de Français, Collège Jean Moulin",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
    quote: "La précision des corrections et la pertinence des commentaires générés par l'IA sont impressionnantes. Mes élèves progressent plus rapidement."
  },
  {
    name: "Sophie Martin",
    role: "Professeure de Français, Lycée Molière",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
    quote: "Les analyses statistiques m'ont permis d'identifier précisément les points à renforcer dans mon enseignement. Un outil indispensable !"
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ils nous font confiance
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez comment iTeach transforme le quotidien des enseignants
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <Quote className="h-8 w-8 text-indigo-600 mb-6" />
              <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}