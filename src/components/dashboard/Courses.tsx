import React, { useState, useEffect } from 'react';
import { Plus, Search, BookOpen, Loader, Trash2, Edit2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserCourses, deleteCourse } from '../../lib/firebase/courses';
import type { Course } from '../../types/course';
import toast from 'react-hot-toast';
import { Dialog } from '@headlessui/react';
import CourseModal from './course-options/CourseModal';

export default function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCourses();
  }, [user]);

  const loadCourses = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const userCourses = await getUserCourses(user.uid);
      setCourses(userCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Erreur lors du chargement des cours');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      await deleteCourse(courseToDelete);
      toast.success('Cours supprimé avec succès');
      loadCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Erreur lors de la suppression du cours');
    } finally {
      setCourseToDelete(null);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Create Button */}
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Rechercher des cours..."
            />
          </div>
        </div>
        <div className="ml-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouveau cours
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun cours</h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par créer un nouveau cours.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="h-6 w-6 text-indigo-600" />
                    <div className="ml-5">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {course.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {course.classe} • {course.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {/* TODO: Implement edit */}}
                      className="text-gray-400 hover:text-indigo-600"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setCourseToDelete(course.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                  {course.description}
                </p>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-indigo-600 hover:text-indigo-500">
                    Voir les détails
                  </span>
                  <span className="text-gray-500">
                    {new Date(course.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={loadCourses}
      />

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!courseToDelete}
        onClose={() => setCourseToDelete(null)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />

          <div className="relative bg-white rounded-lg p-6 max-w-sm mx-auto">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              Confirmer la suppression
            </Dialog.Title>

            <p className="text-sm text-gray-500 mb-6">
              Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setCourseToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteCourse}
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