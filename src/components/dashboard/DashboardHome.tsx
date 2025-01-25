import React, { useEffect, useState } from 'react';
import { BookOpen, Users, BarChart2, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserCorrections } from '../../lib/firebase/corrections';
import { getUserCourses } from '../../lib/firebase/courses';
import { getAllUserAnalytics } from '../../lib/firebase/analytics';

export default function DashboardHome() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    corrections: 0,
    courses: 0,
    successRate: 0,
    monthlyProgress: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;

      try {
        const [corrections, courses, analytics] = await Promise.all([
          getUserCorrections(user.uid),
          getUserCourses(user.uid),
          getAllUserAnalytics(user.uid)
        ]);

        // Calculer le nombre total de copies corrigées
        const totalCopies = corrections.reduce((sum, project) => 
          sum + project.copies.length, 0);

        // Calculer le taux de réussite moyen
        const avgSuccessRate = analytics.length > 0
          ? analytics.reduce((sum, a) => sum + a.successRate, 0) / analytics.length
          : 0;

        // Calculer la progression mensuelle moyenne
        const avgMonthlyProgress = analytics.length > 0
          ? analytics.reduce((sum, a) => sum + a.monthlyProgress, 0) / analytics.length
          : 0;

        setStats({
          corrections: totalCopies,
          courses: courses.length,
          successRate: Math.round(avgSuccessRate),
          monthlyProgress: Math.round(avgMonthlyProgress * 10) / 10
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const statItems = [
    {
      name: 'Copies corrigées',
      value: stats.corrections.toString(),
      icon: BookOpen,
      change: `${stats.monthlyProgress > 0 ? '+' : ''}${stats.monthlyProgress}%`,
      changeType: stats.monthlyProgress >= 0 ? 'increase' : 'decrease'
    },
    {
      name: 'Cours créés',
      value: stats.courses.toString(),
      icon: Users,
      change: 'N/A',
      changeType: 'neutral'
    },
    {
      name: 'Taux de réussite moyen',
      value: `${stats.successRate}%`,
      icon: BarChart2,
      change: `${stats.monthlyProgress > 0 ? '+' : ''}${stats.monthlyProgress}%`,
      changeType: stats.monthlyProgress >= 0 ? 'increase' : 'decrease'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statItems.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className={`font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 
                  stat.changeType === 'decrease' ? 'text-red-600' : 
                  'text-gray-500'
                }`}>
                  {stat.change}
                </span>
                {stat.change !== 'N/A' && (
                  <span className="text-gray-500"> depuis le mois dernier</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Activité récente</h3>
          <div className="mt-6 flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {/* Activité récente à implémenter */}
              <li className="py-5">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Aucune activité récente
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}