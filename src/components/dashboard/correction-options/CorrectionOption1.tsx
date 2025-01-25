import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { saveCorrection } from '../../../lib/firebase/corrections';
import type { CorrectionCriterion } from '../../../types/correction';
import ClassSelector from './ClassSelector';

interface Props {
  onBack: () => void;
}

export default function CorrectionOption1({ onBack }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [sujet, setSujet] = useState('');
  const [classe, setClasse] = useState('');
  const [totalPoints, setTotalPoints] = useState<number>(20);
  const [criteria, setCriteria] = useState<CorrectionCriterion[]>([
    { id: '1', description: '', points: 0 }
  ]);

  const handleAddCriterion = () => {
    setCriteria([
      ...criteria,
      { id: crypto.randomUUID(), description: '', points: 0 }
    ]);
  };

  const handleRemoveCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const handleCriterionChange = (id: string, field: 'description' | 'points', value: string | number) => {
    setCriteria(criteria.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const handleSubmit = async () => {
    if (!title || !sujet || !classe || criteria.some(c => !c.description)) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const totalCriteriaPoints = criteria.reduce((sum, c) => sum + c.points, 0);
    if (totalCriteriaPoints !== totalPoints) {
      toast.error(`Le total des points des critères (${totalCriteriaPoints}) ne correspond pas au barème total (${totalPoints})`);
      return;
    }

    if (user) {
      try {
        const projectData = {
          userId: user.uid,
          status: 'draft',
          title,
          classe,
          sujet,
          totalPoints,
          criteria,
          copies: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const projectId = await saveCorrection(projectData);
        toast.success('Projet créé avec succès');
        navigate(`/dashboard/corrections/${projectId}`);
      } catch (error) {
        console.error('Error saving project:', error);
        toast.error('Erreur lors de la création du projet');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Titre de l'exercice
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Dissertation sur Les Fleurs du Mal"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Classe
        </label>
        <ClassSelector
          value={classe}
          onChange={setClasse}
          className="mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Sujet du devoir
        </label>
        <textarea
          value={sujet}
          onChange={(e) => setSujet(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Décrivez le sujet du devoir..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Barème total
        </label>
        <input
          type="number"
          value={totalPoints}
          onChange={(e) => setTotalPoints(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Critères d'évaluation
          </label>
          <button
            type="button"
            onClick={handleAddCriterion}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter un critère
          </button>
        </div>

        <div className="space-y-4">
          {criteria.map((criterion, index) => (
            <div key={criterion.id} className="flex gap-4 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  value={criterion.description}
                  onChange={(e) => handleCriterionChange(criterion.id, 'description', e.target.value)}
                  placeholder="Description du critère"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="w-24">
                <input
                  type="number"
                  value={criterion.points}
                  onChange={(e) => handleCriterionChange(criterion.id, 'points', Number(e.target.value))}
                  placeholder="Points"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              {criteria.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveCriterion(criterion.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Retour
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
        >
          Créer le projet
        </button>
      </div>
    </div>
  );
}