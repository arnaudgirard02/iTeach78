import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { saveCorrection } from '../../../lib/firebase/corrections';
import { generateExerciseSuggestions, generateBaremeSuggestion } from '../../../lib/openai';
import type { CorrectionCriterion } from '../../../types/correction';
import ClassSelector from './ClassSelector';
import { Loader, Plus, Trash2 } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const EVALUATION_FORMATS = [
  { id: 'dissertation', label: 'Dissertation' },
  { id: 'commentaire', label: 'Commentaire de texte' },
  { id: 'oral', label: 'Exposé oral' },
  { id: 'creative', label: 'Production créative' },
  { id: 'analyse', label: 'Analyse de document' }
];

export default function CorrectionOption3({ onBack }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [classe, setClasse] = useState('');
  const [objectifs, setObjectifs] = useState('');
  const [duree, setDuree] = useState('1h');
  const [format, setFormat] = useState('');
  const [sujetsPrefs, setSujetsPrefs] = useState('');
  const [totalPoints, setTotalPoints] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [isGeneratingBareme, setIsGeneratingBareme] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>('');
  const [suggestedCriteria, setSuggestedCriteria] = useState<CorrectionCriterion[]>([]);
  const [editableCriteria, setEditableCriteria] = useState<CorrectionCriterion[]>([]);

  const handleGenerateSuggestions = async () => {
    if (!classe || !objectifs || !duree) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsGeneratingSuggestions(true);
    try {
      const result = await generateExerciseSuggestions(
        classe,
        objectifs,
        duree,
        format,
        sujetsPrefs
      );
      setSuggestions(result);
    } catch (error) {
      toast.error('Erreur lors de la génération des suggestions');
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const handleSelectSuggestion = async (suggestion: string) => {
    setSelectedSuggestion(suggestion);
    setIsGeneratingBareme(true);
    
    try {
      const criteria = await generateBaremeSuggestion(classe, suggestion, totalPoints);
      setSuggestedCriteria(criteria);
      setEditableCriteria(criteria);
    } catch (error: any) {
      toast.error('Erreur lors de la génération du barème');
    } finally {
      setIsGeneratingBareme(false);
    }
  };

  const handleAddCriterion = () => {
    setEditableCriteria([
      ...editableCriteria,
      {
        id: crypto.randomUUID(),
        description: '',
        points: 0
      }
    ]);
  };

  const handleRemoveCriterion = (id: string) => {
    setEditableCriteria(editableCriteria.filter(c => c.id !== id));
  };

  const handleCriterionChange = (id: string, field: 'description' | 'points', value: string | number) => {
    setEditableCriteria(editableCriteria.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const handleSubmit = async () => {
    if (!selectedSuggestion || !classe || !objectifs || editableCriteria.length === 0) {
      toast.error('Veuillez compléter toutes les étapes');
      return;
    }

    const totalCriteriaPoints = editableCriteria.reduce((sum, c) => sum + c.points, 0);
    if (totalCriteriaPoints !== totalPoints) {
      toast.error(`Le total des points (${totalCriteriaPoints}) ne correspond pas au barème total (${totalPoints})`);
      return;
    }

    if (!user) {
      toast.error('Vous devez être connecté');
      return;
    }

    setIsLoading(true);

    try {
      const projectData = {
        userId: user.uid,
        status: 'draft',
        title: selectedSuggestion.split('.')[0],
        classe,
        sujet: selectedSuggestion,
        totalPoints,
        criteria: editableCriteria,
        copies: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const projectId = await saveCorrection(projectData);
      toast.success('Projet créé avec succès');
      navigate(`/dashboard/corrections/${projectId}`);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Erreur lors de la création du projet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
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
          Objectifs pédagogiques
        </label>
        <textarea
          value={objectifs}
          onChange={(e) => setObjectifs(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Décrivez les objectifs pédagogiques..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Durée de l'évaluation
        </label>
        <select
          value={duree}
          onChange={(e) => setDuree(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="30min">30 minutes</option>
          <option value="1h">1 heure</option>
          <option value="2h">2 heures</option>
          <option value="3h">3 heures</option>
          <option value="4h">4 heures</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Format d'évaluation (optionnel)
        </label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Sélectionnez un format</option>
          {EVALUATION_FORMATS.map(f => (
            <option key={f.id} value={f.id}>{f.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Centres d'intérêt des élèves (optionnel)
        </label>
        <textarea
          value={sujetsPrefs}
          onChange={(e) => setSujetsPrefs(e.target.value)}
          rows={2}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Ex: littérature fantastique, actualités, sport..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Note totale
        </label>
        <input
          type="number"
          value={totalPoints}
          onChange={(e) => setTotalPoints(Number(e.target.value))}
          min="1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleGenerateSuggestions}
          disabled={isGeneratingSuggestions || !classe || !objectifs || !duree}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          {isGeneratingSuggestions ? (
            <>
              <Loader className="animate-spin h-4 w-4 mr-2" />
              Génération en cours...
            </>
          ) : (
            'Générer des suggestions'
          )}
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Suggestions d'exercices
          </h3>
          <div className="grid gap-4">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSelectSuggestion(suggestion)}
                className={`p-4 text-left rounded-lg border-2 transition-colors ${
                  selectedSuggestion === suggestion
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {isGeneratingBareme && (
        <div className="text-center py-8">
          <Loader className="animate-spin h-8 w-8 mx-auto text-indigo-600" />
          <p className="mt-2 text-sm text-gray-500">Génération du barème...</p>
        </div>
      )}

      {suggestedCriteria.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Barème suggéré
            </h3>
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
            {editableCriteria.map((criterion) => (
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
                <button
                  type="button"
                  onClick={() => handleRemoveCriterion(criterion.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span className={`${
                  editableCriteria.reduce((sum, c) => sum + c.points, 0) !== totalPoints
                    ? 'text-red-600'
                    : 'text-gray-900'
                }`}>
                  {editableCriteria.reduce((sum, c) => sum + c.points, 0)} / {totalPoints} points
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

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
          disabled={isLoading || !selectedSuggestion || editableCriteria.length === 0}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {isLoading ? 'Création...' : 'Créer le projet'}
        </button>
      </div>
    </div>
  );
}