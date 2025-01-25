import React from 'react';
import { ClipboardCheck, BookOpen, BarChart2, Upload, CheckCircle2, FileSpreadsheet } from 'lucide-react';

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Fonctionnalités Principales
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez comment notre plateforme peut transformer votre approche de l'enseignement
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Correction de Copies */}
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <ClipboardCheck className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Correction Automatisée</h3>
                <p className="text-gray-600">
                  Uploadez vos copies et obtenez une correction détaillée en quelques minutes.
                  Notre IA s'adapte à votre barème ou en suggère un.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Upload className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Import Flexible</h3>
                <p className="text-gray-600">
                  Accepte plusieurs formats : PDF, images, texte. Traitez plusieurs copies simultanément.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Annotations Intelligentes</h3>
                <p className="text-gray-600">
                  Commentaires pertinents et suggestions d'amélioration générés automatiquement.
                </p>
              </div>
            </div>
          </div>

          {/* Conception de Cours */}
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Création de Cours</h3>
                <p className="text-gray-600">
                  Générez des plans de cours complets adaptés au niveau de vos élèves.
                  Incluant objectifs, activités et ressources.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <BarChart2 className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Analyses et Statistiques</h3>
                <p className="text-gray-600">
                  Suivez la progression de vos élèves avec des graphiques détaillés
                  et des recommandations personnalisées.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <FileSpreadsheet className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Export des Données</h3>
                <p className="text-gray-600">
                  Exportez les résultats et analyses au format Excel ou PDF
                  pour un suivi optimal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}