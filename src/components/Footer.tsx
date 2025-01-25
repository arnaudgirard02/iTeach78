import React from 'react';
import { GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">EduAssist.AI</span>
            </div>
            <p className="text-gray-600">
              La plateforme intelligente au service des enseignants.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Produit</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Fonctionnalités</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Tarifs</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Témoignages</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Guide d'utilisation</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Centre d'aide</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Documentation</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Contact</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Légal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Conditions d'utilisation</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Politique de confidentialité</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Mentions légales</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">RGPD</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} EduAssist.AI. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}