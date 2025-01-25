import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, Users, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getAllUserAnalytics } from '../../lib/firebase/analytics';
import type { ClassAnalytics } from '../../types/analytics';
import toast from 'react-hot-toast';

export default function Analytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<ClassAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [user]);

  const loadAnalytics = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const data = await getAllUserAnalytics(user.uid);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Erreur lors du chargement des analyses');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Calculer les moyennes globales
  const globalStats = analytics.reduce((acc, curr) => ({
    averageGrade: acc.averageGrade + curr.averageGrade,
    successRate: acc.successRate + curr.successRate,
    monthlyProgress: acc.monthlyProgress + curr.monthlyProgress,
    count: acc.count + 1
  }), { averageGrade: 0, successRate: 0, monthlyProgress: 0, count: 0 });

  const averageGrade = globalStats.count > 0 ? globalStats.averageGrade / globalStats.count : 0;
  const successRate = globalStats.count > 0 ? globalStats.successRate / globalStats.count : 0;
  const monthlyProgress = globalStats.count > 0 ? globalStats.monthlyProgress / globalStats.count : 0;

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Vue d'ensemble des performances
          </h3>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-indigo-50 overflow-hidden rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Moyenne générale
                      </dt>
                      <dd className="text-lg font-medium text-indigo-900">
                        {averageGrade.toFixed(1)}/20
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 overflow-hidden rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Taux de réussite
                      </dt>
                      <dd className="text-lg font-medium text-green-900">
                        {successRate.toFixed(1)}%
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 overflow-hidden rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BarChart2 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Progression mensuelle
                      </dt>
                      <dd className="text-lg font-medium text-purple-900">
                        {monthlyProgress > 0 ? '+' : ''}{monthlyProgress.toFixed(1)}%
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Class Performance */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Performance par classe
          </h3>
          <div className="space-y-4">
            {analytics.map((classAnalytics) => (
              <div key={classAnalytics.classe} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">
                    {classAnalytics.classe}
                  </h4>
                  <span className="text-sm text-gray-500">
                    Moyenne: {classAnalytics.averageGrade.toFixed(1)}/20
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${(classAnalytics.averageGrade / 20) * 100}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-sm text-gray-500">
                  <span>Taux de réussite: {classAnalytics.successRate}%</span>
                  <span>
                    Progression: {classAnalytics.monthlyProgress > 0 ? '+' : ''}
                    {classAnalytics.monthlyProgress}%
                  </span>
                </div>
              </div>
            ))}

            {analytics.length === 0 && (
              <div className="text-center py-8">
                <BarChart2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Aucune donnée disponible
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Les analyses seront disponibles une fois que vous aurez commencé à corriger des copies.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}