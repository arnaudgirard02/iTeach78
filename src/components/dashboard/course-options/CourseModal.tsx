import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Plus, Trash2, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';
import { saveCourse } from '../../../lib/firebase/courses';
import ClassSelector from '../correction-options/ClassSelector';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const DURATIONS = [
  '30 minutes',
  '45 minutes',
  '1 heure',
  '1 heure 30',
  '2 heures',
  '3 heures'
];

export default function CourseModal({ isOpen, onClose, onSave }: Props) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classe, setClasse] = useState('');
  const [duration, setDuration] = useState(DURATIONS[2]);
  const [objectives, setObjectives] = useState<string[]>(['']);
  const [content, setContent] = useState('');
  const [resources, setResources] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddObjective = () => {
    setObjectives([...objectives, '']);
  };

  const handleRemoveObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const handleObjectiveChange = (index: number, value: string) => {
    setObjectives(objectives.map((obj, i) => i === index ? value : obj));
  };

  const handleAddResource = () => {
    setResources([...resources, '']);
  };

  const handleRemoveResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const handleResourceChange = (index: number, value: string) => {
    setResources(resources.map((res, i) => i === index ? value : res));
  };

  const handleSubmit = async () => {
    if (!title || !description || !classe || !content || objectives.some(obj => !obj) || resources.some(res => !res)) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (!user) {
      toast.error('Vous devez être connecté');
      return;
    }

    setIsLoading(true);

    try {
      const courseData = {
        userId: user.uid,
        title,
        description,
        classe,
        duration,
        objectives: objectives.filter(Boolean),
        content,
        resources: resources.filter(Boolean),
        status: 'draft' as const
      };

      await saveCourse(courseData);
      toast.success('Cours créé avec succès');
      onSave();
      onClose();
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Erreur lors de la création du cours');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />

        <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full mx-auto p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>

          <Dialog.Title className="text-2xl font-bold text-gray-900 mb-6">
            Nouveau cours
          </Dialog.Title>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Titre du cours
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Ex: Les figures de style en poésie"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Décrivez brièvement le contenu du cours..."
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
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
                  Durée
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {DURATIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Objectifs pédagogiques
                </label>
                <button
                  type="button"
                  onClick={handleAddObjective}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter un objectif
                </button>
              </div>
              <div className="space-y-2">
                {objectives.map((objective, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => handleObjectiveChange(index, e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Ex: Comprendre la métaphore"
                    />
                    {objectives.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveObjective(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contenu du cours
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Détaillez le contenu du cours..."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Ressources pédagogiques
                </label>
                <button
                  type="button"
                  onClick={handleAddResource}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter une ressource
                </button>
              </div>
              <div className="space-y-2">
                {resources.map((resource, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={resource}
                      onChange={(e) => handleResourceChange(index, e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Ex: https://example.com/resource"
                    />
                    {resources.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveResource(index)}
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
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    Création...
                  </>
                ) : (
                  'Créer le cours'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}