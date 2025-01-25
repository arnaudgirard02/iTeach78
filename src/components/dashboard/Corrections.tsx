import React, { useState, useEffect } from 'react';
import { BookOpen, Search, MoreVertical, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserCorrections, deleteCorrection } from '../../lib/firebase/corrections';
import type { CorrectionProject } from '../../types/correction';
import toast from 'react-hot-toast';
import CorrectionModal from './CorrectionModal';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@headlessui/react';

export default function Corrections() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<CorrectionProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const userProjects = await getUserCorrections(user.uid);
      setProjects(userProjects);
    } catch (error: any) {
      console.error('Error loading projects:', error);
      setError('Erreur lors du chargement des projets');
      toast.error('Erreur lors du chargement des projets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/dashboard/corrections/${projectId}`);
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      await deleteCorrection(projectToDelete);
      toast.success('Projet supprimé avec succès');
      loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Erreur lors de la suppression du projet');
    } finally {
      setProjectToDelete(null);
    }
  };

  const NewProjectButton = () => (
    <button
      onClick={() => setIsModalOpen(true)}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
    >
      Gérer un nouveau projet de correction
    </button>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm text-gray-500">
            Chargement des projets...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-sm text-red-500 mb-4">{error}</p>
          <button
            onClick={() => loadProjects()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Mes projets de correction</h2>
        <p className="text-sm text-gray-500 mb-4">Aucun projet de correction trouvé</p>
        <NewProjectButton />
        <CorrectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Mes projets de correction</h2>
        <NewProjectButton />
      </div>

      {/* Projects List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <ul className="divide-y divide-gray-200">
            {projects.map((project) => (
              <li key={project.id} className="hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => project.id && handleProjectClick(project.id)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-indigo-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-indigo-600">
                          {project.title || 'Sans titre'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {project.classe} • {project.copies.filter(c => !c.archived).length} copies actives
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      project.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : project.status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status === 'completed' 
                        ? 'Terminé'
                        : project.status === 'in_progress'
                        ? 'En cours'
                        : 'Brouillon'}
                    </span>
                    <button
                      onClick={() => setProjectToDelete(project.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <CorrectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />

          <div className="relative bg-white rounded-lg p-6 max-w-sm mx-auto">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              Confirmer la suppression
            </Dialog.Title>

            <p className="text-sm text-gray-500 mb-6">
              Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteProject}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}