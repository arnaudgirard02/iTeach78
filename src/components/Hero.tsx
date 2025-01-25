import React from 'react';
import { BookOpen, PenTool, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Hero() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStart = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="pt-24 pb-16 bg-gradient-to-br from-indigo-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            L'IA au service de
            <span className="text-indigo-600"> l'éducation</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Optimisez votre temps d'enseignement grâce à notre plateforme de correction automatisée
            et de conception de cours assistée par l'IA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button 
              onClick={handleStart}
              className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 transition-colors text-lg"
            >
              Essayer gratuitement
            </button>
            <button className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-full hover:bg-indigo-50 transition-colors text-lg">
              Voir la démo
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <PenTool className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Correction Intelligente</h3>
              <p className="text-gray-600">Corrigez vos copies plus rapidement avec notre système d'IA avancé</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Création de Cours</h3>
              <p className="text-gray-600">Générez des plans de cours et des exercices personnalisés</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Analyses Détaillées</h3>
              <p className="text-gray-600">Suivez la progression de vos élèves avec des statistiques précises</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}